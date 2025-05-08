import React, { createContext, useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = createContext({
    isWifiConnected: true,
});

export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
    const [isWifiConnected, setIsWifiConnected] = useState(true);

    useEffect(() => {
        const checkConnection = async () => {
            const netInfo = await NetInfo.fetch();
            setIsWifiConnected(netInfo.type === 'wifi');
        };

        // Check connection every 5 seconds
        const interval = setInterval(checkConnection, 5000);

        // Cleanup interval on unmount
        return () => clearInterval(interval);
    }, []);

    return (
        <NetworkContext.Provider value={{ isWifiConnected }}>
            {children}
        </NetworkContext.Provider>
    );
};