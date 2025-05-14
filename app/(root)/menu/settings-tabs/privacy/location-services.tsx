import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faInfoCircle, faMapMarkerAlt, faGlobe, faBuilding, faCompass } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const location_services = () => {
    const router = useRouter();

    // State for location permissions
    const [locationEnabled, setLocationEnabled] = useState(false);
    const [preciseLocation, setPreciseLocation] = useState(false);
    const [backgroundLocation, setBackgroundLocation] = useState(false);
    const [campusLocation, setCampusLocation] = useState(false);
    const [locationsHistory, setLocationsHistory] = useState(false);
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null);    // Constants for AsyncStorage keys
    const LOCATION_PREFS_KEY = '@ucgator_location_preferences';

    // Check location permission status on component mount
    useEffect(() => {
        loadSavedPreferences();
    }, []);

    // Load saved preferences from AsyncStorage
    const loadSavedPreferences = async () => {
        try {
            const savedPrefsJson = await AsyncStorage.getItem(LOCATION_PREFS_KEY);
            
            if (savedPrefsJson) {
                const savedPrefs = JSON.parse(savedPrefsJson);
                console.log('Loaded saved preferences:', savedPrefs);
                
                // Apply saved preferences if they exist
                if (savedPrefs.campusLocation !== undefined) {
                    setCampusLocation(savedPrefs.campusLocation);
                }
                
                if (savedPrefs.locationsHistory !== undefined) {
                    setLocationsHistory(savedPrefs.locationsHistory);
                }
                
                // For permission-dependent settings, we need to check actual permissions first
                await checkActualPermissions();
                
                // If permissions are granted, apply precise setting from saved prefs
                if (savedPrefs.preciseLocation !== undefined && locationEnabled) {
                    setPreciseLocation(savedPrefs.preciseLocation);
                }
            } else {
                // No saved preferences, just check permissions
                await checkActualPermissions();
            }
        } catch (error) {
            console.error('Error loading saved preferences:', error);
            // Fall back to checking actual permissions
            await checkActualPermissions();
        }
    };

    // Save current preferences to AsyncStorage
    const savePreferences = async () => {
        try {
            const prefsToSave = {
                locationEnabled,
                preciseLocation,
                backgroundLocation,
                campusLocation,
                locationsHistory,
                lastUpdated: new Date().toISOString()
            };
            
            await AsyncStorage.setItem(LOCATION_PREFS_KEY, JSON.stringify(prefsToSave));
            console.log('Preferences saved:', prefsToSave);
            return true;
        } catch (error) {
            console.error('Error saving preferences:', error);
            return false;
        }
    };

    // Function to check current location permission status
    const checkActualPermissions = async () => {
        try {
            // Check if permissions were previously granted
            const { status } = await Location.getForegroundPermissionsAsync();
            setPermissionStatus(status);
            const isEnabled = status === 'granted';
            setLocationEnabled(isEnabled);

            // If location is enabled, check other permissions
            if (isEnabled) {
                // Check background location permission
                const backgroundStatus = await Location.getBackgroundPermissionsAsync();
                setBackgroundLocation(backgroundStatus.status === 'granted');
                
                // For preciseLocation, on iOS accuracy is a separate permission
                // On Android, it's a setting within the location permission
                // Here we're simulating this check
                try {
                    const lastKnownPosition = await Location.getLastKnownPositionAsync({
                        maxAge: 60000
                    });
                    // If we get high accuracy, precise location is enabled
                    setPreciseLocation(lastKnownPosition?.coords?.accuracy 
                        ? lastKnownPosition.coords.accuracy < 20 
                        : false);
                } catch (posError) {
                    // Default to false if we can't determine
                    setPreciseLocation(false);
                }
            } else {
                // If location is disabled, ensure all dependent settings are also disabled
                setBackgroundLocation(false);
                setPreciseLocation(false);
                setCampusLocation(false);
                setLocationsHistory(false);
            }
        } catch (error) {
            console.error("Error checking location permissions:", error);
            Alert.alert("Error", "Failed to check location permissions");
            setPermissionStatus('denied');
        }
    };

    // Request foreground location permission
    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setPermissionStatus(status);
            setLocationEnabled(status === 'granted');
              if (status !== 'granted') {
                Alert.alert(
                    "Permission Required", 
                    "Please enable location services in your device settings to use this feature",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error requesting location permissions:", error);
        }
    };

    // Request background location permission
    const requestBackgroundPermission = async () => {
        if (!locationEnabled) {
            Alert.alert(
                "Permission Required", 
                "Please enable location services first",
                [{ text: "OK" }]
            );
            return;
        }
        
        try {
            const { status } = await Location.requestBackgroundPermissionsAsync();
            setBackgroundLocation(status === 'granted');
            
            if (status !== 'granted') {
                Alert.alert(
                    "Background Location", 
                    "Background location is needed for navigation while app is minimized",
                    [{ text: "OK" }]
                );
            }
        } catch (error) {
            console.error("Error requesting background permissions:", error);
        }
    };    // Toggle location services master switch
    const toggleLocationService = async (value: boolean) => {
        if (value) {
            // Request permission and update status based on actual result
            await requestLocationPermission();
            // Re-check all permissions to update UI accurately
            await checkActualPermissions();
        } else {
            // Disable all location options when main switch is turned off
            setLocationEnabled(false);
            setPreciseLocation(false);
            setBackgroundLocation(false);
            setCampusLocation(false);
            setLocationsHistory(false);
            // Update permission status to reflect the user's choice
            setPermissionStatus('denied');
            
            Alert.alert(
                "Location Disabled",
                "Some app features may not work properly without location access",
                [{ text: "OK" }]
            );
        }
    };

    // Toggle precise location
    const togglePreciseLocation = (value: boolean) => {
        if (!locationEnabled) {
            Alert.alert("Enable Location", "Please enable location services first");
            return;
        }
        setPreciseLocation(value);
    };

    // Toggle background location
    const toggleBackgroundLocation = async (value: boolean) => {
        if (!locationEnabled) {
            Alert.alert("Enable Location", "Please enable location services first");
            return;
        }
        
        if (value) {
            await requestBackgroundPermission();
        } else {
            setBackgroundLocation(false);
        }
    };

    return (
         <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Location Services</Text>
                </View>

                <ScrollView style={styles.container}>
                    <View style={styles.infoBox}>
                        <Text style={styles.infoHeader}>Location Services</Text>
                        <Text style={styles.infoText}>
                            Control how UCGATOR uses your location data to provide navigation, 
                            campus information, and enhanced services throughout the app.
                        </Text>
                    </View>
                    
                    {/* Main Location Toggle */}
                    <View style={styles.locationMainContainer}>
                        <View style={styles.locationMainHeader}>
                            <View style={styles.iconContainer}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color={COLORS.pmy.blue1} />
                            </View>
                            <View style={styles.locationTextContainer}>
                                <Text style={styles.locationTitle}>Enable Location Services</Text>
                                <Text style={styles.locationDescription}>
                                    Allow UCGATOR to access your device location
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={locationEnabled ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={toggleLocationService}
                                value={locationEnabled}
                            />
                        </View>                        <Text style={styles.permissionStatus}>
                            System Permission Status: <Text style={permissionStatus === 'granted' ? styles.granted : styles.denied}>
                                {permissionStatus === 'granted' ? 'Enabled' : permissionStatus === 'denied' ? 'Denied' : 'Not Determined'}
                            </Text>
                        </Text>
                        <Text style={styles.permissionNote}>
                            {permissionStatus === 'granted' 
                                ? 'Location permission is granted by your device settings'
                                : permissionStatus === 'denied'
                                    ? 'You need to enable location in your device settings'
                                    : 'Location permission status is not determined'}
                        </Text>
                    </View>
                    
                    <View style={styles.separator} />
                    
                    {/* Precise Location */}
                    <View style={[styles.optionContainer, !locationEnabled && styles.disabledOption]}>
                        <View style={styles.optionHeader}>
                            <View style={styles.iconSmallContainer}>
                                <FontAwesomeIcon icon={faCompass} size={18} color={locationEnabled ? COLORS.pmy.blue1 : COLORS.text.textsubB} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, !locationEnabled && styles.disabledText]}>Precise Location</Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={preciseLocation ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={togglePreciseLocation}
                                value={preciseLocation}
                                disabled={!locationEnabled}
                            />
                        </View>
                        <Text style={[styles.optionDescription, !locationEnabled && styles.disabledText]}>
                            Allows more accurate navigation and indoor mapping features. When disabled, 
                            only approximate location will be used.
                        </Text>
                    </View>
                    
                    {/* Background Location */}
                    <View style={[styles.optionContainer, !locationEnabled && styles.disabledOption]}>
                        <View style={styles.optionHeader}>
                            <View style={styles.iconSmallContainer}>
                                <FontAwesomeIcon icon={faGlobe} size={18} color={locationEnabled ? COLORS.pmy.blue1 : COLORS.text.textsubB} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, !locationEnabled && styles.disabledText]}>Background Location</Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={backgroundLocation ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={toggleBackgroundLocation}
                                value={backgroundLocation}
                                disabled={!locationEnabled}
                            />
                        </View>
                        <Text style={[styles.optionDescription, !locationEnabled && styles.disabledText]}>
                            Allows location access even when the app is not in use. This provides 
                            continuous navigation and can send notifications about nearby points of interest.
                        </Text>
                    </View>
                    
                    {/* Campus Location Features */}
                    <View style={[styles.optionContainer, !locationEnabled && styles.disabledOption]}>
                        <View style={styles.optionHeader}>
                            <View style={styles.iconSmallContainer}>
                                <FontAwesomeIcon icon={faBuilding} size={18} color={locationEnabled ? COLORS.pmy.blue1 : COLORS.text.textsubB} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, !locationEnabled && styles.disabledText]}>Campus Navigation</Text>
                            </View>
                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={campusLocation ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}                                onValueChange={(value) => { 
                                    if (locationEnabled) { 
                                        setCampusLocation(value); 
                                    }
                                }}
                                value={campusLocation}
                                disabled={!locationEnabled}
                            />
                        </View>
                        <Text style={[styles.optionDescription, !locationEnabled && styles.disabledText]}>
                            Enables enhanced navigation within campus buildings, showing indoor routes, 
                            classrooms, offices, and other campus facilities.
                        </Text>
                    </View>
                    
                    {/* Location History */}
                    <View style={[styles.optionContainer, !locationEnabled && styles.disabledOption]}>
                        <View style={styles.optionHeader}>
                            <View style={styles.iconSmallContainer}>
                                <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color={locationEnabled ? COLORS.pmy.blue1 : COLORS.text.textsubB} />
                            </View>
                            <View style={styles.optionTextContainer}>
                                <Text style={[styles.optionTitle, !locationEnabled && styles.disabledText]}>Save Location History</Text>
                            </View>                            <Switch
                                trackColor={{ false: COLORS.sdy.gray1, true: COLORS.pmy.blue1 }}
                                thumbColor={locationsHistory ? COLORS.pmy.white : COLORS.pmy.white}
                                ios_backgroundColor={COLORS.sdy.gray1}
                                onValueChange={(value) => {
                                    if (locationEnabled) {
                                        setLocationsHistory(value);
                                    }
                                }}
                                value={locationsHistory}
                                disabled={!locationEnabled}
                            />
                        </View>
                        <Text style={[styles.optionDescription, !locationEnabled && styles.disabledText]}>
                            Stores your location history to provide personalized suggestions and 
                            improve navigation to frequently visited places on campus.
                        </Text>
                    </View>
                    
                    {/* Privacy Information */}
                    <View style={styles.disclaimerContainer}>
                        <View style={styles.disclaimerHeader}>
                            <FontAwesomeIcon icon={faInfoCircle} size={20} color={COLORS.pmy.blue1} />
                            <Text style={styles.disclaimerTitle}>Location Privacy</Text>
                        </View>
                        <Text style={styles.disclaimerText}>
                            Your location data is only used for the purposes specified above and 
                            is handled in accordance with our Privacy Policy. We do not share your 
                            precise location with third parties without your explicit consent.
                        </Text>
                        <Text style={styles.disclaimerText}>
                            You can revoke location permissions at any time through this screen 
                            or through your device settings.
                        </Text>
                        <TouchableOpacity style={styles.privacyLink} onPress={() => router.push('/menu/settings-tabs/privacy/data-sharing')}>
                            <Text style={styles.linkText}>Manage Data Sharing Settings</Text>
                        </TouchableOpacity>
                    </View>
                      <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={styles.saveButton}                            onPress={async () => {
                                try {
                                    // Logic to save preferences
                                    if (locationEnabled) {
                                        // Request foreground permission if needed
                                        const { status } = await Location.getForegroundPermissionsAsync();
                                        if (status !== 'granted') {
                                            await requestLocationPermission();
                                        }
                                        
                                        // Request background permission if enabled
                                        if (backgroundLocation) {
                                            const bgStatus = await Location.getBackgroundPermissionsAsync();
                                            if (bgStatus.status !== 'granted') {
                                                await requestBackgroundPermission();
                                            }
                                        }
                                    } else {
                                        // If location is disabled, update permission status
                                        setPermissionStatus('denied');
                                    }
                                    
                                    // Re-check actual permissions to update the display
                                    await checkActualPermissions();
                                    
                                    // Save preferences to AsyncStorage for persistence
                                    const saveSuccessful = await savePreferences();
                                    
                                    if (saveSuccessful) {
                                        Alert.alert(
                                            "Location Settings", 
                                            `Your location preferences have been saved. Location services are ${locationEnabled ? 'enabled' : 'disabled'}.`,
                                            [{ text: "OK", onPress: () => router.back() }]
                                        );
                                    } else {
                                        Alert.alert(
                                            "Warning", 
                                            "Your preferences were applied but could not be saved permanently.",
                                            [{ text: "OK" }]
                                        );
                                    }
                                } catch (error) {
                                    console.error('Error saving location preferences:', error);
                                    Alert.alert(
                                        "Error", 
                                        "There was a problem saving your preferences. Please try again.",
                                        [{ text: "OK" }]
                                    );
                                }
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

export default location_services;

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
    locationMainContainer: {
        backgroundColor: COLORS.sdy.gray1,
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
    },
    locationMainHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.pmy.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    iconSmallContainer: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: COLORS.pmy.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10,
    },
    locationTextContainer: {
        flex: 1,
    },
    locationTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue2,
    },
    locationDescription: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: COLORS.text.textsubB,
    },    permissionStatus: {
        marginTop: 10,
        fontFamily: 'Montserrat-Medium',
        fontSize: 14,
        color: COLORS.text.textsubB,
    },
    permissionNote: {
        marginTop: 5,
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: COLORS.text.textsubB,
        fontStyle: 'italic',
    },
    granted: {
        color: COLORS.alert.success,
        fontFamily: 'Montserrat-SemiBold',
    },
    denied: {
        color: COLORS.alert.error,
        fontFamily: 'Montserrat-SemiBold',
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
    optionTextContainer: {
        flex: 1,
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
        paddingLeft: 40, // To align with the title after the icon
    },
    disabledOption: {
        opacity: 0.7,
    },
    disabledText: {
        color: COLORS.text.textsubB,
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