// 
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteToken, deleteUserSession, getToken, saveToken, saveUserSession } from "./secure-store";
import { config } from "./config";
import axios from "axios";

// router
import { useRouter } from "expo-router";
import { useLoading } from "./load-context";

// storage
import { showErrorToast, showSuccessToast }  from "../components/toast-config";
import { ApiService } from "./ApiClient";

// (root)/lib/auth-context.tsx
export interface User {
    _id: string;
    email: string;
    status: string;
    verified: boolean;
    // Profile
    avatar: string;
    firstName: string | null;
    middleName: string | null;
    lastName: string | null;
    profileType: string | null;
    gender: string | null;
    bio: string | null;
    emergencyContact: emergencyContact[] | null;
}

interface emergencyContact {
    name: string;
    relationship: string;
    phonenum: string;
}

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, linkUri: any) => Promise<void>;
    logout: () => Promise<boolean>;
    getUserInfo: () => Promise<any>;
    user: User | null | undefined;
    isLoggedIn: boolean;
    setUser: (arg0: User | null | undefined) => void;
}

interface AuthContextProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthContextProps) => {
    // Global loading state
    const { setLoading } = useLoading();
    const [user, setUser] = useState<User | null | undefined>();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const activeEndpoint = config.endpoint;

    const initializaAuthProvider = async () => {
        setLoading(true);
        const userToken = await getToken();
        
        if (!userToken) {
            router.replace('/(root)/(auth)/get-started');
            setLoading(false);
            setIsLoggedIn(false);
            return;
        }

        try {
            const userData = await getUserInfo();

            // Use the fresh data from getUserInfo instead of the state
            if (!userData.verified) {
                console.log(`User ${userData._id} is currently not verified. Redirecting to OTP page.`);
                router.replace('/(root)/(auth)/one-time-password');
                return;
            }

            if (!userData.profile?.firstName || !userData.profile?.lastName) {
                console.log(`User ${userData._id} is currently not finished settings its profile. Redirecting to profile page.`);
                router.replace('/(root)/onboarding/name-input');
                return;
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
            // If there's an error getting user info, redirect to get started
            router.replace('/(root)/(auth)/get-started');
        } finally {
            setLoading(false);
        }
    }

    const login = async (email: string, password: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${activeEndpoint}/auth/user/sign-in`, {
                email,
                password
            });

            const { _id, status, verified, token, sessionId, profile} = response.data.data;

            await saveToken(token);
            await saveUserSession(sessionId);
            
            const updatedUser = {
                // User
                _id: _id,
                email: email,
                status: status,
                verified: verified,
                // Profile
                avatar: profile.avatar,
                firstName: profile.firstName || null,
                middleName: profile.middleName || null,
                lastName: profile.lastName || null,
                profileType: profile.profileType || null,
                gender: profile.gender || null,
                bio: profile.bio || null,
                emergencyContact: profile.emergencyContact || null,
            };
            
            setUser(updatedUser);
            setIsLoggedIn(true);

            // Wait for the next render cycle to ensure state is updated
            await new Promise(resolve => setTimeout(resolve, 0));

            if (!verified) {
                console.log(`User ${_id} is currently not verified. Redirecting to OTP page.`);
                router.replace('/(root)/(auth)/one-time-password');
                return;
            }

            if (!profile.firstName || !profile.lastName) {
                console.log(`User ${_id} is currently not finished settings its profile. Redirecting to profile page.`);
                router.replace('/(root)/onboarding/name-input');
                return;
            }

            router.replace('/');  
        } catch (error: any) {
            showErrorToast(error.response?.data?.error, 'Error');
            console.log(error.response);
        } finally {
            setLoading(false);
        }
    }

    const signUp = async (userEmail: string, password: string) => {
        setLoading(true);
        try {
            const response = await axios.post(`${config.endpoint}/auth/user/sign-up`, {
                email: userEmail,
                password
            });

            if (!response.data.success) throw new Error('Register failed. Please try again later.');

            const { _id, email, status, verified, token, sessionId, profile } = response.data.data;

            const updatedUser = {
                // User
                _id: _id,
                email: email,
                status: status,
                verified: verified,

                // Profile
                avatar: profile.avatar,
                firstName: profile.firstName || null,
                middleName: profile.middleName || null,
                lastName: profile.lastName || null,
                profileType: profile.profileType || null,
                gender: profile.gender || null,
                bio: profile.bio || null,
                emergencyContact: profile.emergencyContact || null,
            };

            setUser(updatedUser);

            await saveToken(token);
            await saveUserSession(sessionId);
            
            setIsLoggedIn(true);

            router.replace('/(root)/(auth)/one-time-password');
        } catch (error: any) {
            showErrorToast(error.response?.data?.error, 'Error');
        } finally {
            setLoading(false);
        }
    }

    // function for logout system for the application
    // requires null paramters
    // set loadings to true when this function is called
    // await deleteion from secure storage
    // replace screen back to get started
    const logout = async () => {
        setLoading(true) // set loading to ture
        try {
            // delete user token and sessionID from secure storage
            await deleteToken();
            await deleteUserSession();
            setIsLoggedIn(false);

            showSuccessToast('Logout successful', 'Success');
            setUser(null);

            router.replace('/(root)/(auth)/get-started');
            return true;
        } catch (error) {
            return false;
        } finally {
            setLoading(false)
        }
    }

    // function for getting user info globally for the application
    // requires user.token and requires user logged in
    // await APi response
    // if there is response and response is success `assumingly`
    // pass user data to global request
    const getUserInfo = async () => {
        try {
            const response = await axios.get(`${activeEndpoint}/profile/user/read/user-information`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            
            const { _id, email, status, verified, profile } = response.data.data;
            
            const updatedUser = {
                // User
                _id: _id,
                email: email,
                status: status,
                verified: verified,

                // Profile
                avatar: profile.avatar,
                firstName: profile.firstName || null,
                middleName: profile.middleName || null,
                lastName: profile.lastName || null,
                profileType: profile.profileType || null,
                gender: profile.gender || null,
                bio: profile.bio || null,
                emergencyContact: profile.emergencyContact || null,
            };

            setUser(updatedUser);

            // Wait for the next render cycle to ensure state is updated
            await new Promise(resolve => setTimeout(resolve, 0));

            return response.data.data;
        } catch (error: any) {
            showErrorToast('Error getting user information', 'Error');
            throw error;
        }
    }

    // execute commands when application is loaded
    useEffect(() => {
        // execture function initilize auth provider
        initializaAuthProvider();
    }, []);

    return (
        <AuthContext.Provider value={{ login, signUp, logout, getUserInfo, isLoggedIn, user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// Custom hook to use the AuthContext
export const useAuth = () => {
    // Get the context value
    const context = useContext(AuthContext);

    // If context is undefined, throw an error
    if (!context) {
        throw new Error('useAuth must be within an AuthProvider');
    }

    // Return the context value
    return context;
}