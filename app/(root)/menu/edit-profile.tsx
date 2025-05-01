import React, { useState, useEffect } from 'react';

// COMPONENTS
import { Image, ScrollView,StyleSheet, Text, View, TouchableWithoutFeedback,TouchableOpacity,ImageBackground, KeyboardAvoidingView, Keyboard, Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';
import { config } from "@/app/lib/config";
import { getToken } from '@/app/lib/secure-store';
import { showSuccessToast, showErrorToast } from '@/app/components/toast-config';
import { useLoading } from '@/app/lib/load-context';

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { TextInput } from 'react-native';
 
/**
 * The `EditProfile` component allows users to view and edit their profile information, 
 * including their bio, display name (first name, middle name, last name), and account type.
 * 
 * This component provides a user-friendly interface for updating profile details and 
 * communicates with the server to persist changes. It includes input fields for text-based 
 * information and radio buttons for selecting the account type.
 * 
 * Features:
 * - Displays the user's current profile information, including avatar, name, and email.
 * - Allows users to update their bio with a multiline text input.
 * - Provides input fields for editing the user's first name, middle name, and last name.
 * - Enables users to select their account type from predefined options (visitor, student, teacher).
 * - Includes save buttons for each section to persist changes to the server.
 * - Displays loading indicators during server communication and handles errors gracefully.
 * 
 * Dependencies:
 * - `useAuth`: Custom hook for accessing and updating the authenticated user's information.
 * - `useLoading`: Custom hook for managing loading state during asynchronous operations.
 * - `axios`: HTTP client for making API requests.
 * - `Alert`: Displays error messages in case of failed operations.
 * - `SafeAreaView`, `KeyboardAvoidingView`, `TouchableWithoutFeedback`, `ScrollView`, `TextInput`, `TouchableOpacity`: React Native components for layout and interaction.
 * - `FontAwesomeIcon`: Icon library for displaying user avatars.
 * 
 * @component
 * @returns {JSX.Element} The rendered `EditProfile` component.
 * 
 * @requires react
 * @requires react-native
 * @requires react-native-safe-area-context
 * @requires axios
 * @requires @fortawesome/react-native-fontawesome
 * @requires @fortawesome/free-solid-svg-icons
 * 
 * @requires COLORS - A constant file for color definitions.
 * @requires IMAGES - A constant file for image assets.
 * @requires useAuth - A custom hook for authentication context.
 * @requires config - A configuration file for API endpoints.
 * @requires getToken - A utility function for retrieving the user's token.
 * @requires showSuccessToast - A utility function for displaying success toasts.
 * @requires showErrorToast - A utility function for displaying error toasts.
 * @requires useLoading - A custom hook for managing loading state.
 */
const EditProfile = () => {

    const { user, setUser } = useAuth();
    const [ token, setToken] = useState<string | null>(null);
    const { setLoading } = useLoading();
    const activeEndpoint = config.endpoint;
    const router = useRouter();

    const [bio, setBio] = useState(user?.bio || ''); 

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [middleName, setMiddleName] = useState(user?.middleName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

    const [profileType, setProfileType] = useState(user?.profileType?.toLowerCase() || '');

    const [isBioButtonDisabled, setBioButtonDisabled] = useState(false);
    const [isNameButtonDisabled, setNameButtonDisabled] = useState(false);
    const [isProfileTypeButtonDisabled, setProfileTypeButtonDisabled] = useState(false);

    useEffect(() => {
            const loadToken = async () => {
                const userToken = await getToken();
                if (!userToken) { Alert.alert('You are not logged in!','Please log-in again.'); router.back(); return; }
                setToken(userToken);
            };
            loadToken();
    }, []);

    /**
     * Saves the user's bio to the server.
     * 
     * This function sends a PATCH request to the server to update the user's bio. 
     * It uses the user's authentication token for authorization and updates the local user state upon success.
     * 
     * @async
     * @function saveBio
     * @returns {Promise<void>} Resolves when the bio is successfully saved or rejects with an error.
     * @throws Will show an alert if there is an error saving the bio.
     */
    const saveBio = async () => {
        setLoading(true);
        setBioButtonDisabled(true);
        try {
            const token = await getToken();
            const response = await axios.patch(`${activeEndpoint}/management/account/${user?._id}/profile`, {
                bio
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && user) {
                const updatedUser = {
                    ...user,
                    bio
                };
                setUser(updatedUser);
            }
        } catch (error: any) {
            Alert.alert('Error saving bio','Try again later')
        } finally {
            setLoading(false);setTimeout(() => setBioButtonDisabled(true), 5000);
            
        }
    };

    /**
     * Saves the user's display name (first name, middle name, and last name) to the server.
     * 
     * This function sends a PATCH request to the server to update the user's display name. 
     * It uses the user's authentication token for authorization and updates the local user state upon success.
     * 
     * @async
     * @function saveDisplayName
     * @returns {Promise<void>} Resolves when the display name is successfully saved or rejects with an error.
     * @throws Will show an alert if there is an error saving the display name.
     */
    const saveDisplayName = async () => {
        setLoading(true);
        setNameButtonDisabled(true);
        try {
            const token = await getToken();
            const response = await axios.patch(`${activeEndpoint}/management/account/${user?._id}/profile`, {
                firstName,
                middleName,
                lastName
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && user) {
                const updatedUser = {
                    ...user,
                    firstName,
                    middleName,
                    lastName
                };
                setUser(updatedUser);
            }
        } catch (error: any) {
            Alert.alert('Error saving Name','Try again later')
        } finally {
            setLoading(false);
            setTimeout(() => setNameButtonDisabled(false), 5000);
        }
    };

    /**
     * Saves the user's profile type to the server.
     * 
     * This function sends a PATCH request to the server to update the user's profile type. 
     * It uses the user's authentication token for authorization and updates the local user state upon success.
     * 
     * @async
     * @function saveProfileType
     * @returns {Promise<void>} Resolves when the profile type is successfully saved or rejects with an error.
     * @throws Will show an alert if there is an error saving the profile type.
     */
    const saveProfileType = async () => {
        setLoading(true);
        setProfileTypeButtonDisabled(true); 
        try {
            const token = await getToken();
            const response = await axios.patch(`${activeEndpoint}/management/account/${user?._id}/profile`, {
                profileType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && user) {
                const updatedUser = {
                    ...user,
                    profileType
                };
                setUser(updatedUser);
            }
        } catch (error: any) {
            Alert.alert('Error saving profile type','Try again later')
            console.log(error.response?.data)
        } finally {
            setLoading(false);
            setTimeout(() => setProfileTypeButtonDisabled(false), 5000); 
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Content */}
             <View style={styles.headerContainer}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginHorizontal: 5}} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1}}>Profile</Text>
            </View>

            {/* Profile Info */}
            <View style={{borderRadius: 10, padding: 15 }}>
                <View style={styles.profileHeader}>
                    {user?.avatar ? (
                        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                    )}
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue2 }}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2 }}>{user?.email}</Text>
                    </View>
                </View>
            </View>
    
            {/* Main Content */}
            <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ padding: 15 }} showsVerticalScrollIndicator={false}>
                        {/* About Me Section */}
                        <View style={{ marginBottom: 20, backgroundColor: '#BCD4E6', borderRadius: 10, padding: 15 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white, marginBottom: 10 }}>About Me</Text>
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 8, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, height: 100, textAlignVertical: 'top', }}
                                multiline
                                value={bio}
                                onChangeText={setBio}
                                editable={!isBioButtonDisabled}
                            />
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    backgroundColor: COLORS.pmy.blue1,
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={saveBio}
                                disabled={isBioButtonDisabled}
                            >
                                <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Display Name Section */}
                        <View style={{ marginBottom: 20, backgroundColor: '#BCD4E6', borderRadius: 10, padding: 15 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white, marginBottom: 10 }}>Display Name</Text>
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 20, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10, }}
                                placeholder="First Name"
                                value={firstName}
                                onChangeText={setFirstName}
                                editable={!isNameButtonDisabled}
                            />
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 20, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10, }}
                                placeholder="Middle Name"
                                value={middleName}
                                onChangeText={setMiddleName}
                                editable={!isNameButtonDisabled}
                            />
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 20, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10 }}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={setLastName}
                                editable={!isNameButtonDisabled}
                            />
                            <TouchableOpacity
                                style={{ marginTop: 10, backgroundColor: COLORS.pmy.blue1, padding: 10, borderRadius: 8, alignItems: 'center', }}
                                onPress={saveDisplayName}
                                disabled={isNameButtonDisabled}
                            >
                                <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Account Type Section */}
                        <View style={{ marginBottom: 20, backgroundColor: '#BCD4E6', borderRadius: 10, padding: 15 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white, marginBottom: 10 }}>Account Type</Text>
                            {['student', 'faculty', 'visitor'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={{
                                        backgroundColor: profileType === type ? COLORS.pmy.white : '#BCD4E6',
                                        borderRadius: 8,
                                        borderWidth: 1,
                                        borderColor: '#FFFFFF',
                                        padding: 10,
                                        marginBottom: 10,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => setProfileType(type)} // Update the selected type
                                    disabled={isProfileTypeButtonDisabled}
                                >
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontFamily: 'Montserrat-Bold',
                                            color: profileType === type ? COLORS.pmy.blue2 : '#A3A3A3',
                                        }}
                                    >
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    backgroundColor: COLORS.pmy.blue1,
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={saveProfileType} // Save the selected type
                                disabled={isProfileTypeButtonDisabled}
                            >
                                <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white }}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 15,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        marginRight: 10,
    },
});