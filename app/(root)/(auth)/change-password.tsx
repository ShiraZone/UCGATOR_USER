// DEPENDENCIES
import React from 'react';

// COMPONENTS
import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Link, useRouter } from 'expo-router';
import { useSearchParams } from 'expo-router/build/hooks';
import { Checkbox } from 'expo-checkbox';

// ICONS
import { faLock } from '@fortawesome/free-solid-svg-icons';
// HOOKS
import { useState } from 'react';
import { showErrorToast, showSuccessToast } from '@/app/components/toast-config';
import { useLoading } from '@/app/lib/load-context';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
import axios from 'axios';
import { config } from '@/app/lib/config';

const ChangePassword = () => {
    const router = useRouter();
    const { setLoading } = useLoading();
    const [isPasswordVisible, setPasswordVisibility] = useState(false);
    const email = useSearchParams().get('email') as string;
    const [password, setPassword] = useState<{ password?: string, confirmPassword?: string}>({});

    const isValidPassword = (new_password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(new_password) // Validation for password checking.

    const handleInputChange = (field: keyof typeof password, value: string) => { setPassword((prev) => ({ ...prev, [field]: value })) }; // Handle input change for the form.

    const handleSaveForm = () => {
        if ((password.password ?? '').trim() === '' || (password.confirmPassword ?? '').trim() === '') {
            showErrorToast('Empty Password', 'Please provide a password.');
            console.log('Empty Password');
            return;
        }
    
        if (!isValidPassword(password.password ?? '') || !isValidPassword(password.confirmPassword ?? '')) {
            showErrorToast('Invalid Password', 'Please provide a STRONG password.');
            console.log('Invalid Password Formats');
            return;
        }

        if (password.password !== password.confirmPassword) {
            showErrorToast('Password Mismatch', 'The passwords do NOT match.');
            console.log('Passwords do not match');
            return;
        }

        updatePassword();
    }

    const updatePassword = async () => {
        setLoading(true);
        try {
            const response = await axios.patch(`${config.endpoint}/auth/password`, { email, password: password.password });

            if (response.data.success) {
                showSuccessToast(response.data.message, 'Password Changed');
                router.replace('/log-in');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error;
            showErrorToast(errorMessage, 'Error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white.white1}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <View style={styles.topWrapper}>
                            <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                        </View>
                        <View>
                            <View style={styles.formWrapper}>
                                {/* PASSWORD */}
                                <View style={styles.textInputWrapper}>
                                    <FontAwesomeIcon icon={faLock} color={COLORS.accent.accent1} size={24} style={styles.textInputIcon} />
                                    <TextInput style={styles.textInputField} placeholder='Enter your password' secureTextEntry={!isPasswordVisible} onChangeText={(text) => handleInputChange('password', text)} />
                                </View>
                                {/* CONFIRM PASSWORD */}
                                <View style={styles.textInputWrapper}>
                                    <FontAwesomeIcon icon={faLock} color={COLORS.accent.accent1} size={24} style={styles.textInputIcon} />
                                    <TextInput style={styles.textInputField} placeholder='Confirm your password' secureTextEntry={!isPasswordVisible} onChangeText={(text) => handleInputChange('confirmPassword', text)} />
                                </View>
                                {/* OTHER FUNCTIONS */}
                                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: 3 }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Checkbox value={isPasswordVisible} onValueChange={setPasswordVisibility} />
                                        <Text style={[styles.sublimeText, { marginLeft: 8 }]}>See Password</Text>
                                    </View>
                                </View>
                                {/* SUBMIT FUNCTIONS */}
                                <TouchableOpacity style={styles.button} onPress={() => handleSaveForm()}>
                                    <Text style={styles.buttonText}>SIGN UP</Text>
                                </TouchableOpacity>
                            </View>
                            {/* REDIRECT TO REGISTER */}
                            <View style={{ paddingHorizontal: 25, justifyContent: 'center', alignItems: 'center' }}>
                                <Text>Already have an account?</Text>
                                <Link href='/log-in' onPress={(e) => { e.preventDefault(); router.push('/log-in'); }}>
                                    <Text style={{ color: "#183C5E", textDecorationLine: "underline", fontWeight: "bold" }}>
                                        Log in Here!
                                    </Text>
                                </Link>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangePassword;

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
        top: 10,
        alignSelf: 'center',
        fontSize: 18
    },
    subtitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: COLORS.white.white2,
        top: -10
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