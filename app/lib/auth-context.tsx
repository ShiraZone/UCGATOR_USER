import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getToken } from "./secure-store";
import { getCurrentUser, login } from "./config";
import { useRouter } from "expo-router";

interface User {
    _id: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    fetchUser: (token: string) => Promise<void>;
    isLoggedIn: boolean;
}

interface AuthContextProps {
    children: ReactNode
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthContextProps) => {

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Checks for existing token within the application
    useEffect(() => {
        const initializeAuth = async () => {
            const token = await getToken();
            if (!token) {
                router.replace('/get-started');
                setLoading(false);
                return;
            }

            const userData = await getCurrentUser(token);
            if (userData) {
                setUser(userData);
            }

            setLoading(false);
        }

        initializeAuth();
    }, []);

    const fetchUser = async () => {
        setLoading(true);
        const token = await getToken();

        if (!token) {
            setUser(null);
            setLoading(false);
            router.replace('/get-started');
            return;
        }

        const userData = await getCurrentUser(token);
        setUser(userData || null);
        setLoading(false);
    }

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isLoggedIn,
            fetchUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be within an AuthProvider');
    }

    return context
}