import axios from 'axios';

export const config = {
    // endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.ucgator.com',
    endpoint: process.env.EXPO_PUBLIC_API_URL,
};

export const testConnection = async () => {
    try {
        const response = await axios.get(`${config.endpoint}/`);
        console.log('Connection successful:', response.data);
    } catch (error) {
        console.error('Connection failed:', error);
    }
};