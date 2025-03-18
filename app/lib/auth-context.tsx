import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { deleteToken, deleteUserSession, getToken, saveToken, saveUserSession } from "./secure-store";
import { config } from "./config";
import { useRouter } from "expo-router";
import axios from "axios";
import Toast from "react-native-toast-message";

interface User {
    token: string;
}

interface AuthContextType {
    login: (email: string, password: string) => Promise<void>;
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
    // State to store user information
    const [user, setUser] = useState<User | null>(null);
    // State to track if the user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // State to track loading status
    const [loading, setLoading] = useState(true);
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
        // get token from secureStorage
        const userToken = await getToken();
        // If token is null
        // replace screen with rout get started or the onboarding screen.
        if (!userToken) {
            router.replace('/(root)/(auth)/get-started');
            setLoading(false);
            setIsLoggedIn(false);
            return;
        }

        console.log(userToken); // log token
        setLoading(false); // set loading to false
    }

    // function for login system for the application
    // requires parameters email and password of type stirng
    // set loadings to true when this function is called
    // await api response
    // if success initiate saving login infor
    // replace login screen with index screen
    const login = async (email: string, password: string) => {
        setLoading(true); // sets loading to true
        try {
            // await response from end API
            const response = await axios.post(`${activeEndpoint}/auth/sign-in`, {
                email,
                password
            });

            // validate if the response is not success
            // throw error
            if (!response.data.success) throw new Error('Login failed. Please try again.');
            
            // otherwise continue
            const token = response.data.value.token;
            const sessionID = response.data.value.sessionID;

            // save user token and user sessionID
            await saveToken(token);
            await saveUserSession(sessionID);
            setUser(token);
            setIsLoggedIn(true);

            router.replace('/'); // replace screen with index screen
        } catch (error: any) {
            // if error is axios error and response status is 404
            // show toast message with error message in incorrect login data
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: 'Incorrect email or password.',
                    visibilityTime: 3000,
                    autoHide: true,
                })
            }
        } finally {
            setLoading(false); // set loading to false
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
            setUser(null);
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
            // check if a user is loggedin
            if(user === null && !isLoggedIn) {
                return null;
            }

            // await API response with header authorization bearer
            const response = await axios.get(`${activeEndpoint}/user/get-user`, {
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            // assuming that the response remain success and is success
            // return data
            return response.data;
        } catch (error) {
            console.error(error); // log errors
            return null; // return no user data
        }
    }

    // execute commands when application is loaded
    useEffect(() => {
        // execture function initilize auth provider
        initializaAuthProvider();
    }, []);

    return (
        <AuthContext.Provider value={{login, logout, getUserInfo, user, isLoggedIn}}>
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