// DEPENDENCIES
import React, { useEffect } from 'react';

// COMPONENTS
import { Image, ScrollView, StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, TouchableOpacity, KeyboardAvoidingView, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Link, useRouter } from 'expo-router';
import { Checkbox } from 'expo-checkbox';

// ICONS
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';

// HOOKS
import { useState, useCallback } from 'react';
import { useAuth } from '@/app/lib/auth-context';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
import { useSearchParams } from 'expo-router/build/hooks';
import axios from 'axios';
import { config } from '@/app/lib/config';

const OneTimePassword = () => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { user } = useAuth();

    const [timer, setTimer] = useState(300);
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const otpInputRefs = Array.from({ length: 6 }, () => React.createRef<TextInput>());

    const sendMail = async () => {

        if(!email) {
            console.log('WHERES YA EMAIL BITCH.');
            throw new Error('WHERES YA EMAIL BITCH.');
        }

        try {
            const response = await axios.post(`${config.endpoint}/otp/send-otp`, { email }, {
                headers: {
                    Authorization: `Bearer ${user}`
                }
            });

            if (!response.data.success) throw new Error('Failed to send OTP.');

            startCountdown(300);
        } catch (error) {
            console.error(error);
        }
    }

    const validateOTP = async () => {
        const otpCode = otp.join('');

        if(!otpCode) {
            throw new Error('Please provide the OTP code below.');
        }

        try {    
            const response = await axios.post(`${config.endpoint}/otp/verify-otp`, { email, otpCode }, {
                headers: {
                    Authorization: `Bearer ${user}`
                }
            });
            
            console.log(response);

            if (!response.data.success || response.status === 400) {
                throw new Error(response.data.message);
            }

            alert(response.data.message);
        } catch (error) {
            console.error(error);
        }
    }

    const handleOtpChange = (text: string, index: number) => {
        const updatedOtp = [...otp];
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
                                <Text style={{ color: COLORS.pmy.white, textAlign: 'center', lineHeight: 25, fontSize: 16 }}> A <Text style={{ fontWeight: 'bold' }}>6-digit OTP</Text> code was sent to your registered email. The code is only valid within 15 minutes. You may request for a new code after <Text style={{ fontWeight: 'bold'}}>{timer}</Text> seconds</Text>
                                {/* INPUT STYLE */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                                    {Array.from({ length: 6 }).map((_, index) => (
                                        <TextInput
                                            key={index}
                                            style={{
                                                width: 40,
                                                height: 50,
                                                borderWidth: 1,
                                                borderColor: COLORS.white.white1,
                                                borderRadius: 5,
                                                textAlign: 'center',
                                                fontSize: 18,
                                                backgroundColor: COLORS.white.white1,
                                            }}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            ref={otpInputRefs[index]}
                                        />
                                    ))}
                                </View>
                                {/* SUBMIT FUNCTIONS */}
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        if (timer === 0) {
                                            startCountdown(300); // Restart the timer after resending
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
    }
})