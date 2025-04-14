// DEPENDENCIES
import React from 'react'

// COMPONENTS
import { StyleSheet, View, Text, KeyboardAvoidingView, ImageBackground, TextInput, TouchableOpacity, Platform } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Checkbox } from 'expo-checkbox';

// HOOKS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
import { Link, useRouter } from 'expo-router';
import Toast, { ToastConfig } from 'react-native-toast-message';

// UTILS
import { useState} from 'react';

import { useEffect } from 'react';

const ChangePassword = () => {
    const [email, setEmail] = useState('');                         // Store email
    const [new_password, setPassword] = useState('');               // Store password
    const [confirm_password, setConfirmPassword] = useState('');    // Store confirm password
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Password visibility state

    const router = useRouter();

    const isValidPassword = (new_password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(new_password) // Validation for password checking.

    const handleInputChange = (field: 'new_password' | 'confirm_password' , value: string) => {
        if (field === 'new_password') {
            setPassword(value);
        } else {
            setConfirmPassword(value);
        }
    }

    const handleSaveForm = () => {
        if (new_password.trim() === '' || confirm_password.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Empty Password',
                text2: 'Please provide a password.',
                visibilityTime: 1500,
            });
            console.log('Empty Password');
            return;
        }
    
        if (!isValidPassword(new_password) || !isValidPassword(confirm_password)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Password',
                text2: 'Please provide a STRONG password.',
                visibilityTime: 1500,

            });
            console.log('Invalid Password Formats');
            return;
        }

        if (new_password !== confirm_password) {
            Toast.show({
                type: 'error',
                text1: 'Password Mismatch',
                text2: 'The passwords do NOT match.',
                visibilityTime: 1500,
            });
            console.log('Passwords do not match');
            return;
        }
        console.log('Password Changed');
    }

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ImageBackground source={require('../../../assets/images/background_image1.png')} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Change Your{"\n"}Password</Text>
                            <View style={styles.inputRow}>
                                <TextInput style={styles.input} 
                                    placeholder="New Password" 
                                    keyboardType='default' 
                                    value={new_password}
                                    secureTextEntry={!isPasswordVisible}
                                    onChangeText={(text) => handleInputChange('new_password', text)}
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <TextInput style={styles.input} 
                                    placeholder="Confirm New Password" 
                                    keyboardType='default' 
                                    value={confirm_password} 
                                    secureTextEntry={!isPasswordVisible}
                                    onChangeText={(text) => handleInputChange('confirm_password', text)}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: 3 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Checkbox value={isPasswordVisible} onValueChange={setIsPasswordVisible} />
                                    <Text style={[styles.toggleText, { marginLeft: 8 }]}>See Password</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.Savebutton} onPress={handleSaveForm}>
                                <Text style={styles.SavebuttonText}>SAVE</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },

    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        color: COLORS.accent.accent1,
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: "#333333",
        marginBottom: 5,
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#CCCCCC",
        marginBottom: 15,
    },
    input: {
        flex: 1,
        paddingVertical: 8,
    },
    Savebutton: {
        backgroundColor: COLORS.primary.primaryColor1,
        borderColor: COLORS.accent.accent2,
        borderWidth: 1,
        padding: 12,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 10,
    },
    SavebuttonText: {
        color: "white",
        fontWeight: "bold",
    },
    toggleText: {
        fontFamily: 'Montserrat-semibold',
        color: COLORS.accent.accent1,
        marginLeft: 10
    }
});

export default ChangePassword;