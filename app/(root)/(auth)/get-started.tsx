// DEPENDENCIES
import React from 'react';

// ELEMENTS
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

// CONSTANTS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS


const GetStarted = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white.white1 }}>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                <View style={styles.firstContainer}>
                    <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
                    <Text style={styles.subtitle}>WELCOME TO UCGATOR</Text>
                    <Text style={styles.title}>Explore The University {"\n"} With Confidence</Text>
                </View>
                <TouchableOpacity style={styles.button} onPress={() => router.push('/sign-in')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default GetStarted

const styles = StyleSheet.create({
    firstContainer: {
        width: '100%',
        height: '200%',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.accent.accent4,
    },
    logo: {
        width: '100%',
        height: 150,
        padding: 10
    },
    title: {
        marginTop: 10,
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
        height: 50,
        width: '80%',
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary.primaryColor1,
        borderRadius: 25,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.white.white1
    }
})