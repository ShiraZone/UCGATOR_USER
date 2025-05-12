import React, { useState } from 'react';

// COMPONENTS
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';
import QRCode from 'react-native-qrcode-svg';
import { Linking } from 'react-native';

// ICONS
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// CONSTANTS
import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';



const FirstAid = () => {
    const router = useRouter();

    const appDownloadUrl = 'https://tinyurl.com/totallyrealurltodownloadtheapp'; // Replace with actual app download URL

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={styles.topHeader} source={IMAGES.placement_image_cover} resizeMode="stretch">
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15, top: 15 }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white }}>Share App</Text>
                </ImageBackground>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 100 }} showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15, marginBottom: 20}} >
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginVertical: 15, color: COLORS.pmy.blue1, textAlign: 'center', }}>Scan the QR Code to Download the App</Text>
                    <View style={{ alignItems: 'center', marginVertical: 20, margin: 10}}>
                        <QRCode 
                            value={appDownloadUrl} // The URL to encode in the QR code
                            size={200}
                            color={COLORS.pmy.blue1}
                            backgroundColor={COLORS.pmy.white}
                        />
                    </View>
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity 
                            onPress={() => { 
                                const url = 'https://tinyurl.com/totallyrealurltodownloadtheapp';
                                Linking.openURL(url).catch(err => console.error("Failed to open URL: ", err));
                            }} 
                            style={{ backgroundColor: '#FFFFFF', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.pmy.blue1 }}>
                            <Text style={{ color: COLORS.pmy.blue2, fontSize: 12, fontFamily: 'Montserrat-Bold' }}>https://tinyurl.com/totallyrealurltodownloadtheapp</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default FirstAid;

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        height: 100,
        padding: 15,
        justifyContent: 'center',
        position: 'absolute', 
        top: 0, 
        left: 0,
        right: 0, 
        zIndex: 1
    },
    dropdown: {
        backgroundColor: COLORS.pmy.blue1,
        padding: 10,
        borderRadius: 8,
    },
    dropdownText: {
        color: COLORS.pmy.white,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
    dropdownContent: {
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: 0,
        borderWidth: 1,
        borderColor: COLORS.pmy.blue2,
        marginHorizontal: 5,
    },
    dropdownContentText: {
        color: COLORS.pmy.black,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    },
});