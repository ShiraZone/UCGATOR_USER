import React, { useState, useEffect } from 'react';

// COMPONENTS
import { Image, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Keyboard, Alert, } from 'react-native';
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

const EditProfile = () => {

    const { user, setUser, getUserInfo } = useAuth();
    const [token, setToken] = useState<string | null>(null);
    const { setLoading } = useLoading();
    const activeEndpoint = config.endpoint;
    const router = useRouter();

    const [bio, setBio] = useState(user?.bio || '');

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [middleName, setMiddleName] = useState(user?.middleName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');

    const [selectedProfileType, setSelectedProfileType] = useState(user?.profileType?.toLowerCase() || '');
    const [isProfileTypeChanged, setIsProfileTypeChanged] = useState(false);

    const [isBioChanged, setIsBioChanged] = useState(false);
    const [isProfileTypeButtonDisabled, setProfileTypeButtonDisabled] = useState(false);

    // Add this state to track name changes
    const [isNameChanged, setIsNameChanged] = useState(false);

    useEffect(() => {
        const loadToken = async () => {
            const userToken = await getToken();
            if (!userToken) { Alert.alert('You are not logged in!', 'Please log-in again.'); router.back(); return; }
            setToken(userToken);
        };
        loadToken();
    }, []);

    useEffect(() => {
        setIsBioChanged(bio !== user?.bio);
    }, [bio, user?.bio, isBioChanged]);

    // Add this useEffect after the existing useEffect blocks
    useEffect(() => {
        const firstNameChanged = firstName !== user?.firstName;
        const middleNameChanged = middleName !== user?.middleName;
        const lastNameChanged = lastName !== user?.lastName;

        setIsNameChanged(firstNameChanged || middleNameChanged || lastNameChanged);
    }, [firstName, middleName, lastName, user?.firstName, user?.middleName, user?.lastName]);

    useEffect(() => {
        setIsProfileTypeChanged(selectedProfileType !== user?.profileType?.toLowerCase());
    }, [selectedProfileType, user?.profileType]);

    const handleBioChange = (text: string) => {
        setBio(text);
        setIsBioChanged(text !== user?.bio);
    };

    // Update the name field handlers
    const handleFirstNameChange = (text: string) => {
        setFirstName(text);
    };

    const handleMiddleNameChange = (text: string) => {
        setMiddleName(text);
    };

    const handleLastNameChange = (text: string) => {
        setLastName(text);
    };

    const saveBio = async (): Promise<void> => {
        setLoading(true);
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
                await getUserInfo();
                showSuccessToast(response.data.message, 'Profile Updated!');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error;
            showErrorToast(errorMessage, 'Error saving display name');
        } finally {
            setLoading(false);
            setIsBioChanged(false);
        }
    };

    // Update the saveDisplayName function to reset the change tracker
    const saveDisplayName = async (): Promise<void> => {
        setLoading(true);
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
                await getUserInfo();
                showSuccessToast(response.data.message, 'Profile Updated!');
                setIsNameChanged(false); // Reset the change tracking after successful save
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error;
            showErrorToast(errorMessage, 'Error saving display name');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileTypeChange = (type: string) => {
        if (type !== user?.profileType?.toLowerCase()) {
            setSelectedProfileType(type);
        }
    };

    const saveProfileType = async (): Promise<void> => {
        setLoading(true);
        setProfileTypeButtonDisabled(true);
        try {
            const token = await getToken();
            const response = await axios.patch(`${activeEndpoint}/management/account/${user?._id}/profile`, {
                profileType: selectedProfileType
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success && user) {
                await getUserInfo();
                showSuccessToast(response.data.message, 'Profile Updated!');
                setIsProfileTypeChanged(false); // Reset the change tracking after successful save
            }
        } catch (error: any) {
            Alert.alert('Error saving profile type', 'Try again later')
            console.log(error.response?.data)
        } finally {
            setLoading(false);
            setProfileTypeButtonDisabled(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header Content */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginHorizontal: 5 }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1 }}>Profile</Text>
            </View>

            {/* Main Content */}
            <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                {/* Profile Info */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ padding: 15 }} showsVerticalScrollIndicator={false}>
                        <View style={{ borderRadius: 10, padding: 15 }}>
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
                        {/* About Me Section */}
                        <View style={{ marginBottom: 20, backgroundColor: '#BCD4E6', borderRadius: 10, padding: 15 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white, marginBottom: 10 }}>About Me</Text>
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 8, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, height: 100, textAlignVertical: 'top', }}
                                multiline
                                value={bio}
                                onChangeText={handleBioChange}
                            />
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    backgroundColor: isBioChanged ? COLORS.pmy.blue1 : '#A0A0A0',
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={saveBio}
                                disabled={!isBioChanged}
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
                                onChangeText={handleFirstNameChange}
                            />
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 20, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10, }}
                                placeholder="Middle Name"
                                value={middleName}
                                onChangeText={handleMiddleNameChange}
                            />
                            <TextInput
                                style={{ backgroundColor: COLORS.pmy.white, borderRadius: 20, padding: 10, fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10 }}
                                placeholder="Last Name"
                                value={lastName}
                                onChangeText={handleLastNameChange}
                            />
                            <TouchableOpacity
                                style={{ marginTop: 10, backgroundColor: isNameChanged ? COLORS.pmy.blue1 : '#A0A0A0', padding: 10, borderRadius: 8, alignItems: 'center', }}
                                onPress={saveDisplayName}
                                disabled={!isNameChanged}
                            >
                                <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white }}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Account Type Section */}
                        <View style={{ marginBottom: 20, backgroundColor: '#BCD4E6', borderRadius: 10, padding: 15 }}>
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.white, marginBottom: 10 }}>Account Type</Text>
                            {['student', 'faculty', 'visitor'].map((type) => {
                                const isCurrentType = type === user?.profileType?.toLowerCase();
                                const isSelected = type === selectedProfileType && type !== user?.profileType?.toLowerCase();

                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={{
                                            backgroundColor: isCurrentType ? COLORS.pmy.white : isSelected ? '#4CAF50' : '#BCD4E6',
                                            borderRadius: 8,
                                            borderWidth: 1,
                                            borderColor: '#FFFFFF',
                                            padding: 10,
                                            marginBottom: 10,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => handleProfileTypeChange(type)}
                                        disabled={isProfileTypeButtonDisabled || isCurrentType} // Disable current type
                                    >
                                        <Text
                                            style={{
                                                fontSize: 14,
                                                fontFamily: 'Montserrat-Bold',
                                                color: isCurrentType ? COLORS.pmy.blue2 : isSelected ? COLORS.pmy.white : '#A3A3A3',
                                            }}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                            {isCurrentType ? ' (Current)' : ''}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    backgroundColor: isProfileTypeChanged ? COLORS.pmy.blue1 : '#A0A0A0',
                                    padding: 10,
                                    borderRadius: 8,
                                    alignItems: 'center',
                                }}
                                onPress={saveProfileType}
                                disabled={!isProfileTypeChanged || isProfileTypeButtonDisabled}
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