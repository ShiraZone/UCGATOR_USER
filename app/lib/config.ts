import axios from 'axios';

export const config = {
    // endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.ucgator.com',
    endpoint: process.env.EXPO_PUBLIC_API_URL,
    // Use the base URL for WebSockets (without API paths like /api/v1)
    socketUrl: process.env.EXPO_PUBLIC_SOCKET_URL || process.env.EXPO_PUBLIC_API_BASE
};

export const testConnection = async () => {
    try {
        const response = await axios.get(`${config.endpoint}/`);
        console.log('Connection successful:', response.data);
        return response.data;
    } catch (error: any) {
        console.error('Connection failed:', error);
        throw error;
    }
};