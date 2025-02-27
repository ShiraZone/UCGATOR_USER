import React, { useState } from 'react'
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

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const navigateRegister = () => navigation.navigate('Register');

    const [loginInfo, setLoginInfo] = useState<{
        email?: string,
        password?: string,
    }>({});

    const handleSubmitForm = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }]
        })
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
                                    <Text style={styles.inputText}>Email</Text>
                                    <TextInput style={styles.input} placeholder='user@example.com' />
                                </View>
                                {/** Password Input */}
                                <View style={styles.inputArea}>
                                    <Text style={styles.inputText}>Password</Text>
                                    <TextInput style={styles.input} placeholder='password1234' secureTextEntry={!isPasswordVisible} />
                                </View>
                                {/** Show Password checkbox and Forgot Password Button*/}
                                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }} >
                                    {/** Show Password */}
                                    <View style={styles.checkBox}>
                                        <BouncyCheckbox fillColor="#183C5E" iconStyle={{ marginRight: -10 }} onPress={() => setIsPasswordVisible(!isPasswordVisible)} />
                                        <Text style={styles.checkboxText}>Show Password</Text>
                                    </View>
                                    {/** Forgot Password */}
                                    <TouchableOpacity>
                                        <Text style={{ fontSize: 16, fontStyle: 'italic', color: '#183C5E', fontWeight: 500 }}>Forgot Password?</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            {/** Submit Form and Changeable Elements */}
                            <View style={{ marginVertical: 10 }}>
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10 }}>
                                    {/** Submit Button Sign In */}
                                    <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
                                        <Text style={styles.submitButtonText}>SIGN IN</Text>
                                    </TouchableOpacity>
                                    {/** Changeable Screen to Register */}
                                    {/** Register Button */}
                                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginVertical: 30 }}>
                                        <Text style={{ fontSize: 14, fontWeight: 300 }}>Don't have an account?</Text>
                                        <TouchableOpacity onPress={navigateRegister}>
                                            <Text style={{ fontSize: 18, fontWeight: 600, textDecorationLine: 'underline', color: '#183C5E' }}>Register here!</Text>
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
})