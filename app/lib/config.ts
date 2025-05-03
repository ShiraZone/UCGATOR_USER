import axios from 'axios';
import { useRouter } from 'expo-router';
import NetInfo from '@react-native-community/netinfo';

export const config = {
    // endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.ucgator.com',
    endpoint: process.env.EXPO_PUBLIC_API_URL,
};

export const checkNetworkConnection = async () => {
    const router = useRouter();
    const netinfo = await NetInfo.fetch();

    if (!netinfo.isConnected || netinfo.isInternetReachable === false) {
        router.replace('/(root)/onboarding/error-connection');
        return false;
    }
    
    return true;
};

export const testConnection = async () => {
    const router = useRouter();

    try {
        const isConnected = await checkNetworkConnection();
        
        if (!isConnected) {
            return;
        }

        const response = await axios.get(`${config.endpoint}/`);
        console.log('Connection successful:', response.data);
    } catch (error: any) {
        console.error('Connection failed:', error);
        router.replace('/(root)/onboarding/error-connection');
    }
};