import React, { useState } from 'react'
import { 
    StyleSheet,
    View, 
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { RootStackAuthList } from '../AuthenticationScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'ForgotPassword'>

const ForgetPasswordScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [generatedOTP, setGeneratedOTP] = useState<string | null>(null);
    const [cooldown, setCooldown] = useState(0);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [otpError, setOtpError] = useState('');

    const navigateLogin = () => navigation.replace('Login');

    const navigateChangePasswordScreen = () => navigation.replace('ChangePassword');

    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleInputChange = (field: 'email' | 'otp', value: string) => {
        if (field === 'email') {
            setEmail(value);
            if (!isValidEmail(value)) {
                setEmailError('Invalid email format');
                setTimeout(() => {
                    setEmailError('');
                }, 5000);
            } else {
                setEmailError('');
            }
        }
    }

    // Function to generate random 6-digit OTP for debug, replace with proper OTP handler
    const generateRandomOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    const handleSendOTP = () => {
        // Simple Input validation logic
        if (!isValidEmail(email)) {
            setEmailError('Invalid email format');
            setTimeout(() => {
                setEmailError('');
            }, 5000);
            return;
        }

        // 60 sec cooldown to prevent spam
        if (cooldown === 0) {

            console.log('Sending OTP to:', email);
            setGeneratedOTP(generateRandomOTP());
            console.log('Generated OTP:', generatedOTP);

            setCooldown(60);
            setIsOTPSent(true);
            const interval = setInterval(() => {
                setCooldown(prev => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
    };

    const handleSubmit = () => {
        console.log('Email:', email);
        console.log('Generated OTP:', generatedOTP);
        console.log('Entered OTP:', otp);

        if (otp !== generatedOTP) {
            setOtpError('Incorrect OTP');
            setTimeout(() => {
                setOtpError('');
            }, 5000);
            return;
        }
        // Add API functionalities in here.
        navigateChangePasswordScreen();
        setGeneratedOTP(null); // Revert OTP to null after successful submission
        setOtpError(''); // Clear OTP error after successful submission
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.container}>
                    <ImageBackground source={require('../../assets/auth_assets/gphc_img_2.png')} 
                        style={[styles.container, styles.graphicsImage]} resizeMode='contain'>

                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/def_assets/adaptive-logo.png')} 
                                style={styles.logo} />
                        </View>

                        <Text style={styles.title}>Forgot Password</Text>

                        <View style={styles.ContentWrapper}>
                            <View style={styles.inputContainer}>
                                <View style={styles.emailContainer}>
                                    <TextInput
                                        style={styles.inputEmail}
                                        placeholder='Enter your email'
                                        value={email}
                                        onChangeText={(text) => handleInputChange('email', text)}
                                        keyboardType='email-address'
                                        autoCapitalize='none'
                                    />
                                    <TouchableOpacity 
                                        style={[styles.sendButton, cooldown > 0 
                                            && styles.sendbuttonCooldown]} 
                                        onPress={handleSendOTP}
                                        disabled={cooldown > 0}>
                                        <Text style={[styles.sendButtonText, cooldown > 0 
                                            && styles.sendbuttonCooldown]}>
                                            {cooldown > 0 ? `${cooldown}` : 'Send OTP'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                                <TextInput
                                    style={styles.inputOTP}
                                    placeholder='Enter 6-digit OTP'
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType='numeric'
                                    editable={isOTPSent}
                                />
                                {otpError ? <Text style={styles.errorText}>{otpError}</Text> : null}
                            </View>

                            <TouchableOpacity style={styles.Submitbutton} onPress={handleSubmit}>
                                <Text style={styles.SubmitbuttonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.ReturnLogin} onPress={navigateLogin}>
                                <Text style={styles.ReturnLoginText}>Return to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ForgetPasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    graphicsImage: {
        flex: 1,
        width: '100%'
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        height: 125,
        width: '100%',
        resizeMode: 'contain',
        margin: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#002F5F',
        textAlign: 'center',
    },
    ContentWrapper: {
        margin: 10,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    emailContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 15,
        alignItems: 'center'
    },
    inputEmail: {
        flex: 1,
        height: 50,
        borderBottomWidth: 2,
        borderColor: '#183C5E',
        paddingHorizontal: 10,
    },
    sendButton: {
        width: 100,
        height: 50,
        backgroundColor: '#002F5F',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    sendbuttonCooldown: {
        backgroundColor: '#A0A0A0',
    },
    sendButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputOTP: {
        width: '100%',
        height: 50,
        borderBottomWidth: 2,
        borderColor: '#183C5E',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    errorText: {
        position: 'absolute',
        top: 120,
        color: '#ff0000',
    },
    Submitbutton: {
        width: '80%',
        backgroundColor: '#002F5F',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    SubmitbuttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ReturnLogin: {
        margin: 10,
    },
    ReturnLoginText: {
        color: '#002F5E',
        fontSize: 16,
        textDecorationLine: 'underline',
    }
});