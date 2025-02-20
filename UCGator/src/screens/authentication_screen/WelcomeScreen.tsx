import React from "react";

import { RootStackAuthList } from '../AuthenticationScreen';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ImageBackground } from 'react-native';


type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'GetStarted'>;

const WelcomeScreen: React.FC<AuthScreenProps> = ({ navigation }) => {

    const funcMoveLogin = () => {
        navigation.navigate('Login')
    };

    const funcMoveRegister = () => {
        navigation.navigate('Register')
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={styles.logoWrapper}>
                    <Image source={require('../../assets/def_assets/adaptive-logo.png')} style={styles.logo} resizeMode="contain" />
                    <Text style={styles.textLogo}> Explore With Confidence </Text>
                </View>
                <View style={styles.actionContainer}>
                    <View>
                        <TouchableOpacity style={styles.buttonAction} onPress={funcMoveLogin}>
                            <Text style={styles.buttonActionText}> SIGN IN </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonAction} onPress={funcMoveRegister}>
                            <Text style={styles.buttonActionText}> SIGN UP </Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'center', paddingHorizontal: 15, fontWeight: 300, lineHeight: 19, letterSpacing: 1.5 }}>
                            By continuing, you agree to UCGator’s Terms of Service & Privacy Policy.
                        </Text>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider >
    )
}

export default WelcomeScreen;

const styles = StyleSheet.create({
    // Base container
    container: {
        flex: 1,
        margin: 0,
        paddingHorizontal: 30,
    },
    // Logo container with logo image and logo text
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
    textLogo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#183C5E'
    },
    // Button placeholder and container
    actionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center'
    },
    buttonAction: {
        backgroundColor: '#5FBFF9',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginBottom: 15
    },
    buttonActionText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 3,
    }
})