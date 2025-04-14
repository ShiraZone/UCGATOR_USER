import React, { createContext, useState, useContext } from 'react';

interface LoadingContextType {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
}

interface LoadingContextProps {
    children: React.ReactNode;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children}: LoadingContextProps) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setLoading: setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = () => {
    const context = useContext(LoadingContext);

    if(!context) {
        throw new Error('useLoading must be used within a LoadingProvider');
    }
    
    return context;
}