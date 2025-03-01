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
    const [cooldown, setCooldown] = useState(0);

    const navigateLogin = () => navigation.navigate('Login');

    const navigateChangePasswordScreen = () => navigation.navigate('ChangePassword');

    const handleSendOTP = () => {
        // Handle sending OTP logic here
        // 60 sec cooldown to prevent spam
        if (cooldown === 0) {
            console.log('Sending OTP to:', email);
            setCooldown(60);
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
        console.log('OTP:', otp);

        // Add API functionalities in here.
        navigateChangePasswordScreen();
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
                                        onChangeText={setEmail}
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

                                <TextInput
                                    style={styles.inputOTP}
                                    placeholder='Enter OTP'
                                    value={otp}
                                    onChangeText={setOtp}
                                    keyboardType='numeric'
                                />
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
        marginBottom: 30,
    },
    Submitbutton: {
        width: '80%',
        backgroundColor: '#002F5F',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
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