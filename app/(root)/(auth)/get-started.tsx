// DEPENDENCIES
import React from 'react';

// ELEMENTS
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity } from 'react-native';

// CONSTANTS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS

const GetStarted = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white.white1 }}>
            <ImageBackground source={IMAGES.background_image1} style={styles.backgroundImage} resizeMode="contain">
                <ScrollView style={{ flex: 1, padding: 10 }}>
                    <View style={styles.firstContainer}>
                        <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                        <Text style={styles.subtitle}>WELCOME TO UCGATOR</Text>
                        <Text style={styles.title}>Explore The University {"\n"} With Confidence</Text>
                    </View>
                    <TouchableOpacity style={styles.button} onPress={() => router.push('/log-in')}>
                        <Text style={styles.buttonText}>GET STARTED</Text>
                    </TouchableOpacity>
                        <Text style={styles.privacy}>By continuing, you agree to UCGator's</Text>
                        <Text style={styles.privacy}>Terms of Service & Privacy Policy</Text>
                </ScrollView>
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
        height: '200%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0)',
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