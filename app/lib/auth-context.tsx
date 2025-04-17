// 
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteToken, deleteUserSession, getToken, saveToken, saveUserSession } from "./secure-store";
import { config } from "./config";
import axios from "axios";

// router
import { useRouter } from "expo-router";
import { useLoading } from "./load-context";

// async storage
import { getRegistrationStatus, saveRegistrationStatus } from "./async-store";
import { showErrorToast, showSuccessToast, showInfoToast }  from "../components/toast-config";

// (root)/lib/auth-context.tsx
interface User {
    id: string;
    avatar: string;
    firstName: string;
    middleName: string;
    lastName: string;
    profileType: string;
    gender: string;
    email: string;
    emergencyContact: emergencyContact[];
    bio: string;
    verified: boolean;
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
    user: User | null;
    isLoggedIn: boolean;
}

interface AuthContextProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthContextProps) => {
    // Global loading state
    const { setLoading } = useLoading();
    const [user, setUser] = useState<User | null>(null);
    // State to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Router instance for navigation
    const router = useRouter();
    // API endpoint from config
    const activeEndpoint = config.endpoint;
    // State to store error messages


    // function for initializing route sequence for the application
    // if token is not null
    // redirect screen to homepage screen
    // use function for in effect
    const initializaAuthProvider = async () => {
        // set loading to true
        setLoading(true);
        // get token from secureStorage
        const userToken = await getToken();
        console.log('userToken: ',userToken);
        // If token is null
        // replace screen with rout get started or the onboarding screen.
        if (!userToken) {
            router.replace('/(root)/(auth)/get-started');
            setLoading(false);
            setIsLoggedIn(false);
            return;
        }

        const registrationStep = await getRegistrationStatus();

        if (registrationStep === 'profile_pending' || registrationStep === 'pending') {
            router.replace('/(root)/onboarding/name-input' )
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(true);
            await getUserInfo();
        }

        setLoading(false); // set loading to false
    }

    // function for login system for the application
    // requires parameters email and password of type stirng
    // set loadings to true when this function is called
    // await api response
    // if success initiate saving login information
    // replace login screen with index screen
    const login = async (email: string, password: string) => {
        setLoading(true); // sets loading to truee
        try {
            // await response from end API
            const response = await axios.post(`${activeEndpoint}/auth/sign-in`, {
                email,
                password
            });

            const token = response.data.value.token; // pass the token
            const sessionID = response.data.value.sessionID; // pass the sessionID

            await saveToken(token); // save the token to secure store
            await saveUserSession(sessionID); // save the user session to secure stores
            
            setIsLoggedIn(true); // set user logged in to true
            await getUserInfo(); // get user information

            // replace screen with index screen
            router.replace('/');  
        } catch (error: any) {
            console.log("error: ",error.response?.data?.status);
            console.log("error response: ",error.response?.data?.error);

            // show proper error message in a toast message
            showErrorToast(error.response?.data?.error, 'Error');
        } finally {
            setLoading(false); // set loading to false
        }
    }

    // function for sign up system for the application
    // requires paramters email and password of type string
    // set loadings to true when this function is called
    // await api response
    // is success save login information
    // replace signup screen with personal information screen input
    const signUp = async (email: string, password: string, linkUri: any) => {
        setLoading(true);
        try {
            const response = await axios.post(`${config.endpoint}/auth/sign-up`, {
                email,
                password
            });

            if (!response.data.success) throw new Error('Register failed. Please try again later.');

            const token = response.data.value.token;
            const sessionID = response.data.value.sessionID;
            const regestrationStep = response.data.value.registrationStep;

            await saveToken(token);
            await saveUserSession(sessionID);
            await saveRegistrationStatus(regestrationStep);

            setIsLoggedIn(true);

            router.replace({
                pathname: linkUri,
                params: { email }
            });
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

            router.replace('/(root)/(auth)/get-started');
            return true; // reutnr success | true for validation purposes
        } catch (error) {
            console.error(error); // log error
            return false; // return false if error
        } finally {
            setLoading(false) // set loading to false
        }
    }

    // function for getting user info globally for the application
    // requires user.token and requires user logged in
    // await APi response
    // if there is response and response is success `assumingly`
    // pass user data to global request
    const getUserInfo = async () => {
        try {
            // await API response with header authorization bearer
            const response = await axios.get(`${activeEndpoint}/user/user-information`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`
                }
            });
            
            // assuming that the response remain success and is success
            // return data
            const data = response.data.user;
            
            setUser({
                id: data.userID,
                avatar: data.personalInformation.avatar,
                firstName: data.personalInformation.firstName,
                middleName: data.personalInformation.middleName,
                lastName: data.personalInformation.lastName,
                profileType: data.profileType,
                gender: data.personalInformation.gender,
                emergencyContact: data.personalInformation.emergencyContact,
                email: data.email,
                bio: data.personalInformation.bio,
                verified: data.verified,
            })

            
        } catch (error: any) {
            showErrorToast('Error getting user information', 'Error');
        }
    }

    // execute commands when application is loaded
    useEffect(() => {
        // execture function initilize auth provider
        initializaAuthProvider();
    }, []);

    return (
        <AuthContext.Provider value={{ login, signUp, logout, getUserInfo, isLoggedIn, user }}>
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