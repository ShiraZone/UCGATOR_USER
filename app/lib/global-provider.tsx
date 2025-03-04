import { useBackend } from './useBackend';
import { getCurrentUser } from './config';
import { createContext, ReactNode, useContext } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
}

interface GlobalContextType {
    isLoggedIn: boolean;
    user: User | null;
    loading: boolean;
    refetch: (newParams: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalContextProps {
    children: ReactNode
}

export const GlobalProvider = ({ children }: GlobalContextProps) => {
    const {
        data: userData,
        loading,
        refetch
    } = useBackend({
        fn: getCurrentUser,
    })

    const isLoggedIn = !!userData?.data;
    // !null = true => !true => false
    // !{ name: 'Adrian'} => false => true

    console.log(JSON.stringify(userData?.data, null, 2));

    return (
        <GlobalContext.Provider value={{ isLoggedIn, user: userData?.data || null, loading, refetch }}>
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }

    return context;
};

export default GlobalProvider;