// DEPENDENCIES
import React from 'react';

// ELEMENTS
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, ImageBackground, StatusBar } from 'react-native';

// CONSTANTS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS

const GetStarted = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white.white1 }}>
            <StatusBar barStyle="dark-content" />
            <ImageBackground source={IMAGES.uc_building} resizeMode='cover' style={{ flex: 1}}>
                <View style={styles.firstContainer}>
                    <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                </View>
                <View style={styles.secondContainer}>
                    <Text style={styles.subtitle}>WELCOME TO UCGATOR</Text>
                    <Text style={styles.title}>Explore The University {"\n"} With Confidence</Text>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/(root)/(auth)/log-in')}>
                        <Text style={styles.buttonText}>Get Started</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

export default GetStarted;

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '150%',
    },
    firstContainer: {
        position: "fixed",
        width: '100%',
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: COLORS.background.bg_color1,
        paddingTop: 75
    },
    secondContainer: {
        height: '35%',
        backgroundColor: COLORS.white.white1,
        paddingVertical: 25,
        justifyContent: 'center',
        borderTopRightRadius: 25,
        borderTopLeftRadius: 25,
        position: 'absolute',
        width: '100%',
        bottom: 0
    },
    logo: {
        width: '100%',
        height: 130,
        padding: 10
    },
    title: {
        marginTop: 3,
        textAlign: 'center',
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        letterSpacing: 1,
        lineHeight: 35
    },
    subtitle: {
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        letterSpacing: 2
    },
    button: {
        position: 'fixed',
        height: 50,
        width: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: '#5FBFF9',
        borderRadius: 25,
        marginTop: 20,
        marginBottom: 15
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.white.white1
    },
    privacy: {
        color:COLORS.white.white1,
        textAlign: 'center',
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    }
});