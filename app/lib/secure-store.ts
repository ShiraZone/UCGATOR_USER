import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY: string = 'authToken';
const ID_KEY: string = '_id';
const SESSION_KEY: string = 'sessionID';

export async function saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveUserId(_id: string): Promise<void> {
    await SecureStore.setItemAsync(ID_KEY, _id);
}

export async function getUserId(): Promise<string | null> {
    return await SecureStore.getItemAsync(ID_KEY);
}

export async function deleteUserId(): Promise<void> {
    await SecureStore.deleteItemAsync(ID_KEY);
}

export async function saveUserSession(sessionID: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(sessionID));
}

export async function getUserSession(): Promise<string | null> {
    return await SecureStore.getItemAsync(SESSION_KEY);
}

export async function deleteUserSession(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
}

export async function clearSecureStore(): Promise<void> {
    await deleteToken();
    await deleteUserId();
    await deleteUserSession();
}