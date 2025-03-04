import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text, View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ImageBackground,
    Image
} from 'react-native';

import BouncyCheckbox from "react-native-bouncy-checkbox";

import { RootStackAuthList } from '../AuthenticationScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'Login'>;

const LoginScreen: React.FC<AuthScreenProps> = ({ navigation }) => {

    /**
     * Generates a random email string **DEBUG**
     * @returns A random string of length between 15 and 20, in the format of "randomString@ucgator.com"
     */
    const generateRandomEmail = (): string => {
        const randomString = Math.random().toString(36).substring(2, 15) + (Math.random() * 100000).toFixed(0);
        return `${randomString}@ucgator.com`;
    }
    /**
     * Generates a random password string **DEBUG**
     * @returns A random string of length 8, in the format of "00000000"
     */
    const generateRandomPassword = (): string => {
        const randomString = (Math.random() * 10000000).toFixed(0).substring(0, 8);
        return randomString;
    }

    const forgotPasswordChangeScene = () => navigation.navigate('ForgotPassword');

    const navigateRegister = () => navigation.navigate('Register');

    const [randomEmail, setRandomEmail] = useState('');
    const [randomPassword, setRandomPassword] = useState('');

    useEffect(() => {
        const email = generateRandomEmail();
        const password = generateRandomPassword();
        setRandomEmail(email);
        setRandomPassword(password);
        console.log('Random Email:', email);
        console.log('Random Password:', password);
    }, []);

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); 
    const isValidPassword = (password: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

    const [loginInfo, setLoginInfo] = useState<{
        email?: string,
        password?: string,
    }>({});

    const [errors, setErrors] = useState<{ email?: string, password?: string }>({});

    const handleInputChange = (field: keyof typeof loginInfo, value: string) => {
        setLoginInfo((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmitForm = () => {
        const errorHandler: { email?: string, password?: string } = {};

        if (!isValidEmail(loginInfo.email || '')) errorHandler.email = 'Invalid email format.';
        if (!isValidPassword(loginInfo.password || '')) errorHandler.password = 'Incorrect password.';

        if (Object.keys(errorHandler).length > 0) {
            setErrors(errorHandler);
            setTimeout(() => {
                setErrors({});
            }, 5000);
            return;
        };

        if (loginInfo.email === randomEmail && loginInfo.password === randomPassword) {
            navigation.navigate('Home');
        } else {
            setErrors({ email: 'Email or password is incorrect.' });
            setTimeout(() => {
                setErrors({});
            }, 5000);
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
                            <Text style={styles.titleBig}>Hello! Welcome Back</Text>
                            <Text style={styles.titleSmall}>Enter your username and password.</Text>
                        </View>
                        {/** INPUT CONTAINER */}
                        <View style={styles.inputWrapper}>
                            <View style={{ marginVertical: 10 }}>
                                {/** Email Input */}
                                <View style={[styles.inputArea, { marginBottom: 20 }]}>
                                    <Text style={styles.inputText}>Email {errors.email && <Text style={[styles.errorText]}>{errors.email}</Text>}
                                    </Text>
                                    <TextInput style={styles.input} 
                                    placeholder='user@example.com' 
                                    onChangeText={(value) => handleInputChange('email', value)}
                                    />
                                    
                                </View>
                                {/** Password Input */}
                                <View style={styles.inputArea}>
                                    <Text style={styles.inputText}>Password {errors.password && <Text style={[styles.errorText]}>{errors.password}</Text>}
                                    </Text>
                                    <TextInput style={styles.input} 
                                    placeholder='password1234' 
                                    secureTextEntry={!isPasswordVisible}
                                    onChangeText={(value) => handleInputChange('password', value)}
                                    />
                                    
                                </View>
                                {/** Show Password checkbox and Forgot Password Button*/}
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                                    {/** Show Password */}
                                    <View style={styles.checkBox}>
                                        <BouncyCheckbox fillColor="#183C5E" 
                                            iconStyle={{ marginRight: -10 }} 
                                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}/>
                                        <Text style={styles.checkboxText}>Show Password</Text>
                                    </View>
                                    {/** Forgot Password */}
                                    <TouchableOpacity onPress={forgotPasswordChangeScene}>
                                        <Text style={{ 
                                            fontSize: 16, 
                                            fontStyle: 'italic', 
                                            color: '#183C5E', 
                                            fontWeight: 500 
                                            }}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/** Submit Form and Changeable Elements */}
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    paddingVertical: 10 
                                    }}>
                                    {/** Submit Button Sign In */}
                                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
                                        <Text style={styles.submitButtonText}>SIGN IN</Text>
                                    </TouchableOpacity>
                                    {/** Changeable Screen to Register */}
                                    {/** Register Button */}
                                    <View style={{ 
                                        justifyContent: 'center', 
                                        alignItems: 'center', 
                                        paddingVertical: 10, 
                                        marginVertical: 30 
                                        }}>
                                        <Text style={{ fontSize: 14, fontWeight: 300 }}>Don't have an account?</Text>
                                        <TouchableOpacity onPress={navigateRegister}>
                                            <Text style={{ 
                                                fontSize: 18, 
                                                fontWeight: 600, 
                                                textDecorationLine: 
                                                'underline', 
                                                color: '#183C5E'
                                                }}>Register here!</Text>
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

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        fontWeight: 300,
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
        fontWeight: 500
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
        fontWeight: 300,
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
        fontSize: 12,
        fontWeight: 300,
        marginTop: 5,
        fontStyle: "italic",
    }
});