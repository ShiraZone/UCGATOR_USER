// REACT
import React, { useEffect, useState, useCallback, useRef } from 'react';

// REACT NATIVE
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// HOOKS
import { useLoading } from '@/app/lib/load-context';
import { useSearchParams } from 'expo-router/build/hooks';

// CONSTANTS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// UTILS
import axios from 'axios';
import { config } from '@/app/lib/config';
import { router } from 'expo-router';
import { useAuth } from '@/app/lib/auth-context';
import { User } from '@/app/lib/auth-context';
import { showErrorToast, showSuccessToast } from '@/app/components/toast-config';
import { getToken } from '@/app/lib/secure-store';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const OneTimePassword = () => {
    // HOOKS
    const { setLoading } = useLoading();
    const { user, setUser } = useAuth();
    const email = user?.email || useSearchParams().get('email') as string;
    const mode = useSearchParams().get('mode') as string;
    // STATES
    const [timer, setTimer] = useState(60);
    const [otpCode, setOtp] = useState<string[]>(Array(6).fill(''));
    const [isResending, setIsResending] = useState(false);

    // Effect to track changes to user verified status
    useEffect(() => {
        if (user?.verified) {
            console.log('User verified status updated:', user.verified);
        }
    }, [user?.verified]);

    // REFS
    const otpInputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());

    const sendMail = async () => {
        if (isResending) return;

        setIsResending(true);
        setLoading(true);

        try {
            const response = await axios.post(`${config.endpoint}/otp/mail`, {
                email
            });

            if (response.data.success) {
                showSuccessToast('OTP sent successfully!', 'Success');
                startCountdown();
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Failed to send OTP. Please try again.';
            showErrorToast(errorMessage, 'Error');
        } finally {
            setLoading(false);
            setIsResending(false);
        }
    }

    const handleOtpChange = (text: string, index: number) => {
        // Only allow numbers
        if (!/^\d*$/.test(text)) return;

        const updatedOtp = [...otpCode];
        updatedOtp[index] = text;
        setOtp(updatedOtp);

        // Auto-focus next input
        if (text && index < 5) {
            otpInputRefs[index + 1]?.current?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace') {
            const updatedOtp = [...otpCode];

            // If current input is empty and not the first input, move to previous
            if (!updatedOtp[index] && index > 0) {
                updatedOtp[index - 1] = ''; // Clear previous input
                setOtp(updatedOtp);
                otpInputRefs[index - 1]?.current?.focus();
            } else {
                // Clear current input
                updatedOtp[index] = '';
                setOtp(updatedOtp);
            }
        }
    };

    const validateOTP = async () => {
        const otp = otpCode.join('');
        const isComplete = otpCode.every(digit => digit.length === 1);

        if (!isComplete) {
            showErrorToast('Please enter the complete 6-digit OTP code.', 'Error');
            return;
        }

        try {
            const response = await axios.patch(`${config.endpoint}/otp/mail`, {
                email,
                otp
            });

            showSuccessToast('OTP sent successfully!', 'Success');

            switch (mode) {
                case 'registration':
                    const result = await verifyUser();

                    if (!result) {
                        return;
                    }

                    router.replace('/(root)/onboarding/name-input');
                    break;
                case 'forgot-password':
                    router.push(`/(root)/(auth)/change-password?email=${email}`);
                    break;
            }

        } catch (error: any) {
            console.log(error);
            const errorMessage = error.response?.data?.message;
            showErrorToast(errorMessage, 'Error');
            setOtp(Array(6).fill(''));
            otpInputRefs[0]?.current?.focus();
        } finally {
            setLoading(false);
        }
    }
    
    const verifyUser = async (): Promise<boolean> => {
        setLoading(true);
        
        try {
            // Use the correct endpoint based on your server's API structure
            // This should match a route you've defined in your server
            await axios.patch(`${config.endpoint}/management/account`, {}, {
                headers: { Authorization: `Bearer ${await getToken()}` }
            });
            
            if (user) {
                // Update the local user state to reflect verified status
                setUser({
                    ...user,
                    verified: true
                });
            }

            return true;
        } catch (error: any) {
            console.error('Verification error:', error.response?.data?.error || error.message);
            const errorMessage = error.response?.data?.error || 'Account verification failed. Please try again.';
            showErrorToast(errorMessage, 'Error');
            setOtp(Array(6).fill(''));
            otpInputRefs[0]?.current?.focus();
            return false;
        } finally {
            setLoading(false);
        }
    }

    const startCountdown = useCallback(() => {
        setTimer(60);
        const countdown = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, []);

    useEffect(() => {
        startCountdown();
    }, []);

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
                                <Text style={styles.description}>
                                    A <Text style={styles.boldText}>6-digit OTP</Text> code was sent to your registered email.
                                    The code is only valid within 5 minutes. You may request for a new code after{' '}
                                    <Text style={styles.boldText}>{timer}</Text> seconds
                                </Text>

                                <View style={styles.otpContainer}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TextInput
                                            key={index}
                                            style={[
                                                styles.textInput,
                                                otpCode[index] && styles.filledInput
                                            ]}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            ref={otpInputRefs[index]}
                                            value={otpCode[index]}
                                        />
                                    ))}
                                </View>

                                <TouchableOpacity
                                    style={[styles.button, timer !== 0 && styles.disabledButton]}
                                    onPress={sendMail}
                                    disabled={timer !== 0 || isResending}
                                >
                                    <Text style={styles.buttonText}>
                                        {isResending ? 'SENDING...' : timer === 0 ? 'RESEND' : `RESEND IN ${timer}s`}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.button, styles.verifyButton]}
                                    onPress={validateOTP}
                                >
                                    <Text style={styles.buttonText}>VERIFY OTP</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default OneTimePassword

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
    },

    // OTP BOX
    textInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: COLORS.white.white1,
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 20,
        backgroundColor: COLORS.white.white1,
        color: COLORS.pmy.blue2
    },
    errorInput: {
        borderColor: COLORS.alert.error
    },
    filledInput: {
        borderColor: COLORS.alert.success
    },
    disabledButton: {
        opacity: 0.5
    },
    verifyButton: {
        backgroundColor: COLORS.alert.success,
        marginTop: 15
    },
    description: {
        color: COLORS.pmy.white,
        textAlign: 'center',
        lineHeight: 25,
        fontSize: 16,
        marginBottom: 20
    },
    boldText: {
        fontWeight: 'bold'
    },
    errorText: {
        color: COLORS.alert.error,
        textAlign: 'center',
        marginBottom: 10,
        fontSize: 14
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 30
    }
})