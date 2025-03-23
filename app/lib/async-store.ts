import AsyncStorage from '@react-native-async-storage/async-storage';

const REGISTRATION_STATUS_KEY = 'registration_status';

/**
 * Save registration status to AsyncStorage.
 * @param status - The registration status to save.
 */
export const saveRegistrationStatus = async (status: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(REGISTRATION_STATUS_KEY, status);
        console.log('Registration status saved:', status);
    } catch (error) {
        console.error('Error saving registration status:', error);
    }
};

/**
 * Get registration status from AsyncStorage.
 * @returns The saved registration status or null if not found.
 */
export const getRegistrationStatus = async (): Promise<string | null> => {
    try {
        const status = await AsyncStorage.getItem(REGISTRATION_STATUS_KEY);
        console.log('Registration status retrieved:', status);
        return status;
    } catch (error) {
        console.error('Error retrieving registration status:', error);
        return null;
    }
};