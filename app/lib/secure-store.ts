import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY: string = 'authToken';
const SESSION_KEY: string = 'sessionID';

export async function saveToken(token: string): Promise<void> { 
    try {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
        console.log('Token saved successfully.');
    } catch (error) {
        console.error('Failed to save token.');
    }
}

export async function getToken(): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
        console.error('Failed to get token.');
        return null;
    }
}

export async function deleteToken(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        console.log('Token deleted successfully');
    } catch (error) {
        console.error('Failed to delete the token.');
    }
}

export async function saveUserSession(sessionID: string): Promise<void> {
    try {
        await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionID));
        console.log('Session saved successfully.');
    } catch (error) {
        console.error('Failed to delete the session.');
    }
}

export async function getUserSession(): Promise<string | null> {
    try {
        return await SecureStore.getItemAsync(SESSION_KEY);
    } catch (error) {
        console.error('Session to get token.');
        return null;
    }
}

export async function deleteUserSession(): Promise<void> {
    try {
        await SecureStore.deleteItemAsync(SESSION_KEY);
        console.log('Token deleted successfully');
    } catch (error) {
        console.error('Failed to delete the token.');
    }
}

export async function clearSecureStore(): Promise<void> {
    await deleteToken();
    await deleteUserSession();
}