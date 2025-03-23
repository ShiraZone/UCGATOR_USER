// REACT
import React, { useEffect, useState, useCallback } from 'react';

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
import { getToken } from '@/app/lib/secure-store';

const OneTimePassword = () => {
    // HOOKS
    const searchParams = useSearchParams();
    const { setLoading } = useLoading();

    // VARIABLES
    const email = searchParams.get('email');

    // STATES
    const [timer, setTimer] = useState(300);
    const [otpCode, setOtp] = useState<string[]>(Array(6).fill(''));

    // REFS
    const otpInputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());

    const sendMail = async () => {
        const token = await getToken();
        try {
            const response = await axios.post(`${config.endpoint}/otp/send-otp`, { email }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                startCountdown(300);
            }
            
        } catch (error) {
            console.error(error);
            // Optionally, you can rethrow the error if you want the middleware to handle it
            throw error;
        }
    }

    const validateOTP = async () => {
        const otp = otpCode.join('');
        const token = await getToken();
        if (!otp || otp.length < 6) {
            // TODO: Add a toast message to notify that the user needs to input the otp.
            //       Properly ends this function.
            throw new Error('Please provide the OTP code below.');
        }

        setLoading(true);
        try {
            const response = await axios.post(`${config.endpoint}/otp/verify-otp`, { email, otp }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                router.push('/(root)/onboarding/name-input');
            }
        } catch (error: any) {
            // TODO: Add a toast message to notify the user about any OTP validation errors.
            console.error(error.response.data.error);
        } finally {
            setLoading(false);
        }
    }

    const handleOtpChange = (text: string, index: number) => {
        const updatedOtp = [...otpCode];
        updatedOtp[index] = text;
        setOtp(updatedOtp);

        if (text && index < 5) {
            otpInputRefs[index + 1]?.current?.focus();
        }
    };

    const startCountdown = useCallback((duration: number) => {
        setTimer(duration);
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
        if (email) {
            sendMail();
        }
    }, [email]);

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
                                {/* FORM */}
                                <Text style={{ color: COLORS.pmy.white, textAlign: 'center', lineHeight: 25, fontSize: 16 }}> A <Text style={{ fontWeight: 'bold' }}>6-digit OTP</Text> code was sent to your registered email. The code is only valid within 15 minutes. You may request for a new code after <Text style={{ fontWeight: 'bold' }}>{timer}</Text> seconds</Text>
                                {/* INPUT STYLE */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TextInput key={index} style={styles.textInput} keyboardType="number-pad" maxLength={1} onChangeText={(text) => handleOtpChange(text, index)} ref={otpInputRefs[index]} />
                                    ))}
                                </View>
                                {/* SUBMIT FUNCTIONS */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        if (timer === 0) {
                                            sendMail();
                                        }
                                    }}
                                    disabled={timer !== 0}
                                >
                                    <Text style={styles.buttonText}>RESEND</Text>
                                </TouchableOpacity>
                                {/* SUBMIT FUNCTIONS */}
                                <TouchableOpacity style={styles.button} onPress={validateOTP}>
                                    <Text style={styles.buttonText}>CONTINUE</Text>
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
        width: 40,
        height: 50,
        borderWidth: 1,
        borderColor: COLORS.white.white1,
        borderRadius: 5,
        textAlign: 'center',
        fontSize: 18,
        backgroundColor: COLORS.white.white1,
    }
})