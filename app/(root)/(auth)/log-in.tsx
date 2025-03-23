// DEPENDENCIES
import React from 'react';


// COMPONENTS
import { Alert, Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Link, Redirect, useRouter, withLayoutContext } from 'expo-router';
import { Checkbox } from 'expo-checkbox';
import Toast from 'react-native-toast-message';

// ICONS
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLock } from '@fortawesome/free-solid-svg-icons';

// HOOKS
import { useState } from 'react';
import { useAuth } from '@/app/lib/auth-context';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
import { KeyboardState } from 'react-native-reanimated';

const SignIn = () => {
    const { login } = useAuth();
    const [isPasswordVisible, setPasswordVisibility] = useState(false); // Password visibility state.
    const [loginInfo, setLoginInfo] = useState<{ email?: string; password?: string; }>({}); // Store login variables.
    const validEmailFormat = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Check if email is valid.


    const handleInputChange = (field: keyof typeof loginInfo, value: string) => { setLoginInfo((prev) => ({ ...prev, [field]: value })) }; // Handle input change for the form.
    const router = useRouter();

    const handleLogin = async () => {
        if (!loginInfo.email || !loginInfo.password) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Please fill in all fields.',
                visibilityTime: 1500,
                autoHide: true
            })
            return;
        }

        await login(loginInfo.email, loginInfo.password);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white.white1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <View style={styles.topWrapper}>
                            <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                            <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Bold' }}>Login</Text>
                        </View>
                        <View>
                            <View style={styles.formWrapper}>
                                {/* FORM */}
                                {/* EMAIL */}
                                <View>
                                    <View style={styles.textInputWrapper}>
                                        <FontAwesomeIcon icon={faEnvelope} color={COLORS.accent.accent1} size={24} style={styles.textInputIcon} />
                                        <TextInput style={styles.textInputField} placeholder='Enter your email' keyboardType='email-address' onChangeText={(text) => handleInputChange('email', text)} />
                                    </View>
                                </View>
                                {/* PASSWORD */}
                                <View style={styles.textInputWrapper}>
                                    <FontAwesomeIcon icon={faLock} color={COLORS.accent.accent1} size={24} style={styles.textInputIcon} />
                                    <TextInput style={styles.textInputField} placeholder='Enter your password' secureTextEntry={!isPasswordVisible} onChangeText={(text) => handleInputChange('password', text)} />
                                </View>
                                {/* OTHER FUNCTIONS */}
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: 3 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Checkbox value={isPasswordVisible} onValueChange={setPasswordVisibility} />
                                        <Text style={[styles.sublimeText, { marginLeft: 8 }]}>See Password</Text>
                                    </View>
                                    <TouchableOpacity onPress={() => router.push('./forgot-password')}>
                                        <Text style={{ color: "#FFFFFF", textDecorationLine: 'underline' }}>
                                            Forgot Password?
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {/* SUBMIT FUNCTIONS */}
                                <TouchableOpacity style={styles.button} onPress={() => handleLogin()}>
                                    <Text style={styles.buttonText}>Log In</Text>
                                </TouchableOpacity>
                            </View>
                            {/* REDIRECT TO REGISTER */}
                            <View style={{ paddingHorizontal: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Do not have an account?</Text>
                                <Link href='/sign-up'>
                                    <Text style={{ color: "#183C5E", textDecorationLine: "underline", fontWeight: "bold" }}>
                                        Register Here!
                                    </Text>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
            <Toast />
        </SafeAreaView>
    )
}

export default SignIn

const styles = StyleSheet.create({
    topWrapper: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 40
    },
    logo: {
        width: 'auto',
        minWidth: '50%',
        maxHeight: 100,
        minHeight: 60,
        marginRight: 10
    },
    title: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.white.white1,
        position: 'absolute',
        top: 20,
        alignSelf: 'center',
        fontSize: 18
    },
    subtitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: COLORS.white.white2,
        top: -10,
    },

    // FORM WRAPPER
    formWrapper: {
        borderRadius: 15,
        marginBottom: 20,
        marginTop: 10,
        paddingVertical: 45,
        marginHorizontal: 20,
        paddingHorizontal: 25,
        backgroundColor: COLORS.accent.accent1,
        justifyContent: "center",
    },

    // TEXTINPUT WRAPPER
    textInputWrapper: {
        padding: 5,
        backgroundColor: COLORS.white.white1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 25,
    },
    textInputIcon: {
        margin: 5,
    },
    textInputField: {
        width: '100%'
    },

    // EXTRA
    sublimeText: {
        fontFamily: "MontSerrat-SemiBold",
        color: COLORS.white.white1
    },

    // BUTTOM
    button: {
        height: 50,
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary.primaryColor1,
        borderRadius: 25,
        marginTop: 35,
        borderWidth: 1,
        borderColor: COLORS.accent.accent2
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.white.white1
    }
})
