import React, { createContext, useState, useEffect, useRef, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { Alert, Platform } from 'react-native';
import Toast from 'react-native-toast-message';

/**
* NetworkContext provides a way to check the network status and show alerts
* when the network status changes. It uses NetInfo to monitor the network state.
* 
* @returns {NetworkContextType} - The context value containing network status and alert function.
*/
interface NetworkContextType {
    isWifiConnected: boolean;
    isInternetReachable: boolean | null;
    showConnectivityAlert: (message: string, type: 'success' | 'error') => void;
}

/**
 * NetworkContext is a React context that provides network status information
 * and a function to show connectivity alerts.
 * 
 * @type {React.Context<NetworkContextType>}
 */
export const NetworkContext = createContext<NetworkContextType>({
    isWifiConnected: true,
    isInternetReachable: true,
    showConnectivityAlert: () => {},
});


/**
 * NetworkProvider is a React component that provides network status information
 * and a function to show connectivity alerts to its children.
 * It uses NetInfo to monitor the network state and shows alerts using Toast or Alert.
 * 
 * @param {React.ReactNode} children - The child components that will have access to the network context.
 * @returns {JSX.Element} - The NetworkProvider component.
 * 
 * @example
 * <NetworkProvider>
 *   -- Your app components here ---
 * </NetworkProvider>
 */
export const NetworkProvider = ({ children }: { children: React.ReactNode }) => {
    const [isWifiConnected, setIsWifiConnected] = useState(true);
    const [isInternetReachable, setIsInternetReachable] = useState<boolean | null>(true);
    const [wasConnected, setWasConnected] = useState(true);
    
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const lastAlertTimestampRef = useRef<number>(0);
    
    const showConnectivityAlert = useCallback((message: string, type: 'success' | 'error') => {
        const now = Date.now();
        const DEBOUNCE_TIME = 5000;
        
        if (now - lastAlertTimestampRef.current < DEBOUNCE_TIME) {
            return;
        }
        
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }
        
        debounceTimerRef.current = setTimeout(() => {
            lastAlertTimestampRef.current = Date.now();
            
            if (Platform.OS === 'web') {
                Alert.alert('Connection Status', message);
            } else {
                Toast.show({
                    type: type,
                    text1: 'Connection Status',
                    text2: message,
                    position: 'top',
                    visibilityTime: 3000,
                });
            }
        }, 500);
    }, []);

    useEffect(() => {
        const checkConnection = async () => {
            const netInfo = await NetInfo.fetch();
            const isWifi = netInfo.type === 'wifi';
            const isConnected = netInfo.isConnected && netInfo.isInternetReachable;
            
            setIsWifiConnected(isWifi);
            setIsInternetReachable(netInfo.isInternetReachable);
            
            if (isConnected && !wasConnected) {
                showConnectivityAlert('You are back online!', 'success');
                setWasConnected(true);
            } else if (!isConnected && wasConnected) {
                showConnectivityAlert('You are offline. Some features may be unavailable.', 'error');
                setWasConnected(false);
            }
        };

        checkConnection();
        
        const unsubscribe = NetInfo.addEventListener((state) => {
            const isWifi = state.type === 'wifi';
            const isConnected = state.isConnected && state.isInternetReachable;
            
            setIsWifiConnected(isWifi);
            setIsInternetReachable(state.isInternetReachable);
            
            if (isConnected && !wasConnected) {
                showConnectivityAlert('You are back online!', 'success');
                setWasConnected(true);
            } else if (!isConnected && wasConnected) {
                showConnectivityAlert('You are offline. Some features may be unavailable.', 'error');
                setWasConnected(false);
            }
        });

        const interval = setInterval(checkConnection, 10000);

        return () => {
            unsubscribe();
            clearInterval(interval);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [wasConnected, showConnectivityAlert]);

    return (
        <NetworkContext.Provider value={{ 
            isWifiConnected, 
            isInternetReachable, 
            showConnectivityAlert 
        }}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = () => {
    const context = React.useContext(NetworkContext);
    if (!context) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
};