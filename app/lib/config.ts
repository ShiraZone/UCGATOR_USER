import axios from 'axios';
import * as Linking from 'expo-linking';
import { saveToken, saveUserId, saveUserSession } from './secure-store';

export const config = {
    // endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://api.ucgator.com',
    endpoint: process.env.EXPO_PUBLIC_API_URL,
};

// OKAY NA SIGURI NI
export async function login(email: string, password: string) {
    try {
        const redirectUrl = Linking.createURL('/');
        const response = await axios.post(`${config.endpoint}/auth/sign-in`, {
            email,
            password
        })

        if (response.data && response.data.success) {

            const token = response.data.data.token;
            const _id = response.data.data.user._id;
            const sessionID = response.data.data.sessionID;

            await saveToken(token);
            await saveUserId(_id);
            await saveUserSession(sessionID);

            Linking.openURL(redirectUrl);
            return response.data;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

// THIS FUNCTION IS STILL INCOMPLETE. IT IS A PLACEHOLDER FOR NOW.
export async function logout() {
    try {

    } catch (error) {
        console.error(error);
        return false;
    }
}

// OKAY
export async function getCurrentUser(token: string) {
    try {
        const response = await axios.post(`${config.endpoint}/user/get-user`, {
            token
        });

        if (!response) throw new Error('Failed to get user data.');

        if (response.data && response.data.user) {
            // Return user data
            return {
                ...response.data,
            }
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}