// DEPENDENCIES
import React, { useState, useEffect } from 'react'

// COMPONENTS
import { Alert, StyleSheet, View, Text, KeyboardAvoidingView, ImageBackground, Image, TextInput, TouchableOpacity, Platform } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

// HOOKS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

const ForgotPassword = () => {
    const [email, setEmail] = useState(''); // Store email

    const [generatedOTP, setGeneratedOTP] = useState('');               // Store generated OTP ***DEBUG ONLY***
    const [otp, setOtp] = useState('');                                 // Store OTP
    const [timer, setTimer] = useState(0);                              // Timer state
    const cooldown_timer = 60;                                          // Cooldown timer
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);    // Button state

    const router = useRouter();

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); // Check if the email is valid.

    /**
     * Function to generate random 6-digit OTP for debug, replace with proper OTP handler
     */
    const generateRandomOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const handleEmailInputChange = (field: 'email', value: string) => {
        setEmail(value);
    }
    const handleSendOTP = () => {
        // Send OTP to the email.
        if (!isValidEmail(email) || email.trim() === '') {
            Toast.show({
                type: 'error',
                text1: 'Invalid Email',
                text2: `The email '${email}' is not valid.`,
                visibilityTime: 1500,
            });
            return;
        }
        // Avoid spam
        setIsButtonDisabled(true);
        setTimer(cooldown_timer);
        const generatedOTP = generateRandomOTP();
        setGeneratedOTP(generatedOTP);
        console.log(`Generated OTP: ${generatedOTP}`);
        Toast.show({
            type: 'success',
            text1: 'OTP Sent',
            text2: 'Please check your email for the OTP.',
            visibilityTime: 1500,
        });
    }
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTimer => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setIsButtonDisabled(false);
        }
    }, [timer]);

    const handleContinueForm = () => {
        // Continue to the next form.
        if (otp.length !== 6) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: `The OTP ${otp} is not valid.`,
                visibilityTime: 1500,
            });
            return;
        }
        if (otp !== generatedOTP) {
            Toast.show({
                type: 'error',
                text1: 'Invalid OTP',
                text2: `The OTP ${otp} is not valid.`,
                visibilityTime: 1500,
            });
            return;
        }
        setGeneratedOTP('');
        console.log('OTP cleared');
        router.push('/change-password');
        return;
    }

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                <ImageBackground source={require('../../../assets/images/background_image1.png')} style={{ flex: 1 }}>
                    <View style={styles.container}>
                        <View style={styles.card}>
                            <Text style={styles.title}>Forgot Your{"\n"}Password?</Text>
                            <View style={styles.inputRow}>
                                <TextInput style={styles.input} 
                                    placeholder="Enter your email" 
                                    keyboardType='email-address' 
                                    value={email} 
                                    onChangeText={(text) => handleEmailInputChange('email', text)}
                                />
                                <TouchableOpacity disabled={isButtonDisabled} onPress={handleSendOTP}>
                                    <Text style={{color: isButtonDisabled ? '#CCCCCC' : COLORS.accent.accent1}}>
                                        {isButtonDisabled ? `SEND (${timer}s)` : 'SEND'}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputRow}>
                                <TextInput style={styles.input} 
                                    placeholder="Enter OTP" 
                                    keyboardType='numeric' 
                                    value={otp} 
                                    onChangeText={setOtp}
                                />
                            </View>

                            <TouchableOpacity style={styles.Continuebutton} onPress={handleContinueForm}>
                                <Link href='/change-password' style={styles.ContinebuttonText}>CONTINUE</Link>
                            </TouchableOpacity>

                            <TouchableOpacity  onPress={() => {}}>
                                <Text style={styles.cancelText}>CANCEL</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground>
            </KeyboardAvoidingView>
            <Toast/>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "center",
    },
    title: {
        color: COLORS.accent.accent1,
        fontSize: 26,
        fontWeight: "bold",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
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
    Continuebutton: {
        backgroundColor: COLORS.primary.primaryColor1,
        borderColor: COLORS.accent.accent2,
        borderWidth: 1,
        padding: 12,
        borderRadius: 25,
        alignItems: "center",
        marginTop: 10,
    },
    ContinebuttonText: {
        color: "white",
        fontWeight: "bold",
    },
    cancelText: {
        textAlign: "center",
        color: COLORS.accent.accent1,
        marginTop: 10,
        fontWeight: "bold",
    },
    signUpText: {
        fontWeight: "bold",
        textDecorationLine: "underline",
    },
});

export default ForgotPassword;