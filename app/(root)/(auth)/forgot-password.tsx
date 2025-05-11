// DEPENDENCIES
import React, { useState } from 'react'

// COMPONENTS
import { ScrollView, StyleSheet, View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Image, TextInput, TouchableOpacity, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

// HOOKS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
import { showErrorToast } from '@/app/components/toast-config';

// ICONS
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useLoading } from '@/app/lib/load-context';
import axios from 'axios';
import { config } from '@/app/lib/config';

const ForgotPassword = () => {
    const { setLoading } = useLoading();
    const [email, setEmail] = useState('');
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    
    const router = useRouter();

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleEmailInputChange = (value: string) => {
        setEmail(value);
    }

    const handleSendOTP = () => {
        if (!isValidEmail(email) || email.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: `The email '${email}' is not valid.`,
                visibilityTime: 1500,
            });
            return;
        }

        setIsButtonDisabled(true);
        
        // TODO: Implement actual OTP sending logic here
        sendMail();
    }

    const sendMail = async () => {
        setLoading(true);

        console.log('Sending OTP to email:', email);

        try {
            const response = await axios.post(`${config.endpoint}/otp/mail`, { email });

            if (response.data.success) {
                router.push(`/(root)/(auth)/one-time-password?mode=forgot-password&email=${email}`);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error;
            console.error('Error sending OTP:', errorMessage);
            showErrorToast(errorMessage, 'Error');
        } finally {
            setLoading(false);
            setIsButtonDisabled(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white.white1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <View style={styles.topWrapper}>
                            <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                        </View>
                        <View>
                            <View style={styles.formWrapper}>
                                {/* EMAIL INPUT */}
                                <View>
                                    <View style={styles.textInputWrapper}>
                                        <FontAwesomeIcon icon={faEnvelope} color={COLORS.accent.accent1} size={24} style={styles.textInputIcon} />
                                        <TextInput 
                                            style={styles.textInputField} 
                                            placeholder='Enter your email' 
                                            keyboardType='email-address' 
                                            value={email}
                                            onChangeText={handleEmailInputChange} 
                                        />
                                    </View>
                                    <TouchableOpacity 
                                        disabled={isButtonDisabled} 
                                        onPress={handleSendOTP}
                                        style={[styles.sendButton, isButtonDisabled && styles.disabledButton]}
                                    >
                                        <Text style={styles.sendButtonText}>
                                            {isButtonDisabled ? 'SENDING...' : 'SEND OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                {/* CANCEL BUTTON */}
                                <TouchableOpacity 
                                    style={styles.cancelButton}
                                    onPress={() => router.back()}
                                >
                                    <Text style={styles.cancelText}>CANCEL</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

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
        fontFamily: 'Montserrat-Bold',
        fontSize: 24,
        color: COLORS.accent.accent1
    },
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
        flex: 1,
        padding: 10,
    },
    sendButton: {
        backgroundColor: COLORS.primary.primaryColor1,
        padding: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 20,
    },
    disabledButton: {
        backgroundColor: '#CCCCCC',
    },
    sendButtonText: {
        color: COLORS.white.white1,
        fontWeight: 'bold',
    },
    cancelButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    cancelText: {
        color: COLORS.white.white1,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    }
});

export default ForgotPassword;