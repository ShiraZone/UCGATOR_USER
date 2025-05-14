import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const data_sharing = () => {
    const router = useRouter();
    
    // State for various data sharing consents
    const [locationSharing, setLocationSharing] = useState(false);
    const [usageStatistics, setUsageStatistics] = useState(false);
    const [personalizedContent, setPersonalizedContent] = useState(false);
    const [thirdPartySharing, setThirdPartySharing] = useState(false);
    const [allConsent, setAllConsent] = useState(false);
    
    // Check if all options are selected to update the "Allow All" switch
    useEffect(() => {
        if (locationSharing && usageStatistics && personalizedContent && thirdPartySharing) {
            setAllConsent(true);
        } else {
            setAllConsent(false);
        }
    }, [locationSharing, usageStatistics, personalizedContent, thirdPartySharing]);
      // Function to toggle all consent options at once
    const handleAllConsent = (value: boolean) => {
        setAllConsent(value);
        setLocationSharing(value);
        setUsageStatistics(value);
        setPersonalizedContent(value);
        setThirdPartySharing(value);
    };

    return (
         <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Data Sharing</Text>
                </View>
                
                <ScrollView style={styles.container}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoHeader}>Data Sharing & Privacy</Text>
                        <Text style={styles.infoText}>
                            Control how your data is shared within the UCGATOR app and with our partners.
                            You can modify these settings at any time.
                        </Text>
                    </View>
                    
                    {/* All Consent Toggle */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>Allow All</Text>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={allConsent ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={handleAllConsent}
                                value={allConsent}
                            />
                        </View>
                        <Text style={styles.optionDescription}>
                            Allow all data sharing options below. You can turn individual options off at any time.
                        </Text>
                    </View>
                    
                    <View style={styles.separator} />
                    
                    {/* Location Data Sharing */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>Location Data</Text>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={locationSharing ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={setLocationSharing}
                                value={locationSharing}
                            />
                        </View>
                        <Text style={styles.optionDescription}>
                            Allow us to collect your location data to improve navigation and maps functionality.
                            This helps us show you relevant places and optimize routes.
                        </Text>
                    </View>
                    
                    {/* Usage Statistics */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>Usage Statistics</Text>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={usageStatistics ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={setUsageStatistics}
                                value={usageStatistics}
                            />
                        </View>
                        <Text style={styles.optionDescription}>
                            Share anonymous usage statistics to help us improve the app experience. 
                            This includes how you interact with features and which parts of the app you use most.
                        </Text>
                    </View>
                    
                    {/* Personalized Content */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>Personalized Content</Text>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={personalizedContent ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={setPersonalizedContent}
                                value={personalizedContent}
                            />
                        </View>
                        <Text style={styles.optionDescription}>
                            Allow us to use your data to personalize your app experience with 
                            relevant content, recommendations, and features.
                        </Text>
                    </View>
                    
                    {/* Third-Party Sharing */}
                    <View style={styles.optionContainer}>
                        <View style={styles.optionHeader}>
                            <Text style={styles.optionTitle}>Third-Party Data Sharing</Text>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={thirdPartySharing ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={setThirdPartySharing}
                                value={thirdPartySharing}
                            />
                        </View>
                        <Text style={styles.optionDescription}>
                            Allow sharing of anonymized data with trusted third parties for research 
                            and service improvement purposes.
                        </Text>
                    </View>
                    
                    <View style={styles.disclaimerContainer}>
                        <View style={styles.disclaimerHeader}>
                            <FontAwesomeIcon icon={faInfoCircle} size={20} color={COLORS.pmy.blue1} />
                            <Text style={styles.disclaimerTitle}>Data Privacy Disclaimer</Text>
                        </View>
                        <Text style={styles.disclaimerText}>
                            Your privacy is important to us. The data we collect is used in accordance with our Privacy Policy. 
                            You can withdraw your consent at any time by adjusting these settings.
                        </Text>
                        <Text style={styles.disclaimerText}>
                            By enabling these options, you consent to the collection, processing, and sharing of your 
                            data as described. We implement security measures to protect your data, but no method 
                            of transmission over the internet is 100% secure.
                        </Text>
                        <TouchableOpacity style={styles.privacyLink}>
                            <Text style={styles.linkText}>View Full Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.saveButton}
                            onPress={() => {
                                // Add logic to save preferences
                                router.back();
                            }}
                        >
                            <Text style={styles.saveButtonText}>Save Preferences</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

export default data_sharing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    infoBox: {
        backgroundColor: COLORS.pmy.blue1,
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
    },
    infoHeader: {
        color: COLORS.pmy.white,
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 10,
    },
    infoText: {
        color: COLORS.pmy.white,
        fontFamily: 'Montserrat-Regular',
        lineHeight: 22,
    },
    separator: {
        height: 1,
        backgroundColor: COLORS.sdy.gray1,
        marginVertical: 15,
    },
    optionContainer: {
        marginBottom: 20,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
        color: COLORS.pmy.blue2,
    },
    optionDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: COLORS.text.textsubB,
        lineHeight: 20,
    },
    disclaimerContainer: {
        backgroundColor: COLORS.sdy.gray1,
        padding: 15,
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    disclaimerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    disclaimerTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
        color: COLORS.pmy.blue1,
        marginLeft: 10,
    },
    disclaimerText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: COLORS.text.textsubB,
        marginBottom: 10,
        lineHeight: 20,
    },
    privacyLink: {
        marginTop: 5,
    },
    linkText: {
        color: COLORS.pmy.blue1,
        fontFamily: 'Montserrat-SemiBold',
        textDecorationLine: 'underline',
    },
    buttonContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButton: {
        backgroundColor: COLORS.pmy.blue2,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
        alignItems: 'center',
    },
    saveButtonText: {
        color: COLORS.pmy.white,
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    }
});