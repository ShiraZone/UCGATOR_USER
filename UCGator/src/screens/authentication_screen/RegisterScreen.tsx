import React, { useState } from 'react'
import {
    SafeAreaProvider,
    SafeAreaView,
} from 'react-native-safe-area-context'
import {
    KeyboardAvoidingView,
    StyleSheet,
    Text,
    View,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'

import BouncyCheckbox from "react-native-bouncy-checkbox";
import { RootStackAuthList } from '../AuthenticationScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'Register'>;

const RegisterScreen: React.FC<AuthScreenProps> = ({ navigation }) => {

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const registerScreenChange = () => {
        navigation.navigate('Login');
    };

    // para email format validate
    const isValidEmail = (email: string) => {
        const emailRegexFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegexFormat.test(email);
    };

    // para sa password validate
    const isValidPassword = (password: string) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    // email checker
    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (!isValidEmail(text)) {
            setEmailError('- Invalid email format.');
        } else {
            setEmailError('');
        }
    };

    // password checker
    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (text.includes(' ')) {
            setPasswordError('- Password must not contain spaces.');
        } else if (!isValidPassword(text)) {
            setPasswordError('- Password must be at least 8 characters long and include an uppercase letter, lowercase letter, number, and special character.');
        } else {
            setPasswordError('');
        }
        if (confirmPassword && text !== confirmPassword) {
            setConfirmPasswordError('- Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    // password match
    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== password) {
            setConfirmPasswordError('- Passwords do not match.');
        } else {
            setConfirmPasswordError('');
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.container}>
                    <ImageBackground source={require('../../assets/auth_assets/gphc_img_2.png')} style={[styles.container, styles.graphicsImage]} resizeMode='contain'>
                        {/** UCGATOR LOGO */}
                        <View style={styles.logoWrapper}>
                            <Image source={require('../../assets/def_assets/adaptive-logo.png')} style={styles.logo} />
                        </View>
                        <View style={styles.titleWrapper}>
                            <Text style={styles.titleBig}>Create Account</Text>
                            <Text style={styles.titleSmall}>Please provide your information below.</Text>
                        </View>
                        <View style={styles.inputWrapper}>
                            <View style={{ marginVertical: 10 }}>
                                {/** Email Input */}
                                <View style={[styles.inputArea, { marginBottom: 5 }]}>
                                    <Text style={styles.inputText}>Email {/* Show email error message */}{emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder='user@example.com'
                                        value={email}
                                        onChangeText={handleEmailChange}
                                    />
                                </View>
                                {/** Password Input */}
                                <View style={[styles.inputArea, { marginBottom: 5 }]}>
                                    <Text style={styles.inputText}>Password {/* Show password error message */}{passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder='password1234' 
                                        secureTextEntry={!isPasswordVisible} 
                                        value={password}
                                        onChangeText={handlePasswordChange}
                                    />
                                </View>
                                {/** Confirm Password Input */}
                                <View style={styles.inputArea}>
                                    <Text style={styles.inputText}>Confirm Password {/* Show confirm password error message */}{confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}</Text>
                                    <TextInput 
                                        style={styles.input} 
                                        placeholder='password1234' 
                                        secureTextEntry={!isPasswordVisible} 
                                        value={confirmPassword}
                                        onChangeText={handleConfirmPasswordChange}
                                    />
                                </View>
                                {/** Show Password */}
                                <View style={styles.checkBox}>
                                    <BouncyCheckbox fillColor="#183C5E" iconStyle={{ marginRight: -10 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                                    <Text style={styles.checkboxText}>Show Password</Text>
                                </View>
                            </View>
                            {/** Submit Form and Changeable Elements */}
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                                    {/** Submit Button Sign Up */}
                                    <TouchableOpacity style={styles.submitButton}>
                                        <Text style={styles.submitButtonText}>SUBMIT</Text>
                                    </TouchableOpacity>
                                    {/** Changeable Screen to Login */}
                                    {/** Register Button */}
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginVertical: 30 }}>
                                        <Text style={{ fontSize: 14, fontWeight: '300' }}>Already have an account?</Text>
                                        <TouchableOpacity onPress={registerScreenChange}>
                                            <Text style={{ fontSize: 18, fontWeight: '600', textDecorationLine: 'underline', color: '#183C5E' }}>Login here!</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}
export default RegisterScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    graphicsImage: {
        width: '100%',
    },
    logoWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '15%',
    },
    logo: {
        height: 125,
        width: '100%',
        resizeMode: 'contain',
        margin: 5,
    },
    titleWrapper: {
        minHeight: '5%',
        paddingHorizontal: 15,
        paddingVertical: 20,
    },
    titleBig: {
        fontSize: 36,
        color: '#183C5E',
        fontWeight: 'bold'
    },
    titleSmall: {
        fontSize: 18,
        fontWeight: '300',
        paddingVertical: 5
    },
    inputWrapper: {
        paddingHorizontal: 15,
        paddingVertical: 15,
        minHeight: '55%',
    },
    inputArea: {
        marginBottom: 15,
        width: '100%',
        height: 'auto',
    },
    inputText: {
        fontSize: 18,
        fontWeight: '500'
    },
    input: {
        height: 50,
        width: '100%',
        borderBottomWidth: 2,
        borderBottomColor: '#183C5E',
        paddingHorizontal: 15,
        fontSize: 16,
    },
    checkBox: {
        textAlign: 'center',
        flexDirection: 'row',
        alignContent: 'center',
    },
    checkboxText: {
        fontSize: 14,
        fontWeight: '300',
        paddingVertical: 5,
    },
    submitButton: {
        backgroundColor: '#183C5E',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        width: '100%'
    },
    submitButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    errorText: {
        color: 'red',
        fontSize: 14,
        marginTop: 5,
        fontStyle: "italic",
    }
})
