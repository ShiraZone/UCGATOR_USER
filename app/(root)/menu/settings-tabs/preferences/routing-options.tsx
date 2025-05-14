import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faArrowLeft, 
    faRoute, 
    faClock, 
    faWalking, 
    faWheelchair, 
    faStairs, 
    faElevator, 
    faTree
} from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const routing_options = () => {
    const router = useRouter();
    
    // Preferences state
    const [routePreference, setRoutePreference] = useState<'fastest' | 'shortest'>('fastest');
    const [avoidStairs, setAvoidStairs] = useState<boolean>(false);
    const [avoidElevators, setAvoidElevators] = useState<boolean>(false);
    const [preferIndoors, setPreferIndoors] = useState<boolean>(true);
    const [accessibleRoutes, setAccessibleRoutes] = useState<boolean>(false);
    const [preferShade, setPreferShade] = useState<boolean>(false);
    
    // Handle route preference selection
    const handleRoutePreferenceChange = (preference: 'fastest' | 'shortest') => {
        setRoutePreference(preference);
        // In a real app, save to AsyncStorage or another persistence method
    };
    
    // Save preferences
    const savePreferences = () => {
        // In a real app, this would save to backend or AsyncStorage
        // Example: AsyncStorage.setItem('routingPreferences', JSON.stringify({
        //    routePreference, avoidStairs, avoidElevators, preferIndoors, accessibleRoutes, preferShade
        // }));
        
        // Show a confirmation message or navigate back
        alert('Preferences saved successfully');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Routing Options</Text>
                </View>

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoContainer}>
                        <FontAwesomeIcon icon={faRoute} size={20} color={COLORS.pmy.blue1} style={styles.infoIcon} />
                        <Text style={styles.infoText}>
                            Customize how routes are calculated based on your preferences.
                            These settings will be applied to all navigation within the app.
                        </Text>
                    </View>

                    {/* Route Type Section */}
                    <Text style={styles.sectionTitle}>Route Type</Text>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity 
                            style={[
                                styles.routeOption, 
                                routePreference === 'fastest' && styles.selectedRouteOption
                            ]}
                            onPress={() => handleRoutePreferenceChange('fastest')}
                        >
                            <FontAwesomeIcon 
                                icon={faClock} 
                                size={24} 
                                color={routePreference === 'fastest' ? COLORS.pmy.white : COLORS.pmy.blue1} 
                            />
                            <Text style={[
                                styles.routeOptionText,
                                routePreference === 'fastest' && styles.selectedRouteOptionText
                            ]}>
                                Fastest
                            </Text>
                            <Text style={[
                                styles.routeOptionDescription,
                                routePreference === 'fastest' && styles.selectedRouteDescription
                            ]}>
                                Prioritize time over distance
                            </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            style={[
                                styles.routeOption, 
                                routePreference === 'shortest' && styles.selectedRouteOption
                            ]}
                            onPress={() => handleRoutePreferenceChange('shortest')}
                        >
                            <FontAwesomeIcon 
                                icon={faWalking} 
                                size={24} 
                                color={routePreference === 'shortest' ? COLORS.pmy.white : COLORS.pmy.blue1} 
                            />
                            <Text style={[
                                styles.routeOptionText,
                                routePreference === 'shortest' && styles.selectedRouteOptionText
                            ]}>
                                Shortest
                            </Text>
                            <Text style={[
                                styles.routeOptionDescription,
                                routePreference === 'shortest' && styles.selectedRouteDescription
                            ]}>
                                Prioritize distance over time
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Accessibility Section */}
                    <Text style={styles.sectionTitle}>Accessibility</Text>
                    <View style={styles.preferencesContainer}>
                        <View style={styles.preferenceItem}>
                            <View style={styles.preferenceTextContainer}>
                                <FontAwesomeIcon icon={faWheelchair} size={18} color={COLORS.pmy.blue1} style={styles.preferenceIcon} />
                                <View>
                                    <Text style={styles.preferenceText}>Wheelchair accessible routes</Text>
                                    <Text style={styles.preferenceDescription}>Avoid stairs, steep slopes, and narrow passages</Text>
                                </View>
                            </View>
                            <Switch
                                value={accessibleRoutes}
                                onValueChange={setAccessibleRoutes}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                        
                        <View style={styles.preferenceItem}>
                            <View style={styles.preferenceTextContainer}>
                                <FontAwesomeIcon icon={faStairs} size={18} color={COLORS.pmy.blue1} style={styles.preferenceIcon} />
                                <View>
                                    <Text style={styles.preferenceText}>Avoid stairs</Text>
                                    <Text style={styles.preferenceDescription}>Prefer routes without stairs when possible</Text>
                                </View>
                            </View>
                            <Switch
                                value={avoidStairs}
                                onValueChange={setAvoidStairs}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                        
                        <View style={styles.preferenceItem}>
                            <View style={styles.preferenceTextContainer}>
                                <FontAwesomeIcon icon={faElevator} size={18} color={COLORS.pmy.blue1} style={styles.preferenceIcon} />
                                <View>
                                    <Text style={styles.preferenceText}>Avoid elevators</Text>
                                    <Text style={styles.preferenceDescription}>Prefer stairs or ramps when possible</Text>
                                </View>
                            </View>
                            <Switch
                                value={avoidElevators}
                                onValueChange={setAvoidElevators}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                    </View>

                    {/* Additional Preferences */}
                    <Text style={styles.sectionTitle}>Additional Preferences</Text>
                    <View style={styles.preferencesContainer}>
                        <View style={styles.preferenceItem}>
                            <View style={styles.preferenceTextContainer}>
                                <FontAwesomeIcon icon={faRoute} size={18} color={COLORS.pmy.blue1} style={styles.preferenceIcon} />
                                <View>
                                    <Text style={styles.preferenceText}>Prefer indoor routes</Text>
                                    <Text style={styles.preferenceDescription}>Prioritize paths through buildings when available</Text>
                                </View>
                            </View>
                            <Switch
                                value={preferIndoors}
                                onValueChange={setPreferIndoors}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                        
                        <View style={styles.preferenceItem}>
                            <View style={styles.preferenceTextContainer}>
                                <FontAwesomeIcon icon={faTree} size={18} color={COLORS.pmy.blue1} style={styles.preferenceIcon} />
                                <View>
                                    <Text style={styles.preferenceText}>Prefer shaded routes</Text>
                                    <Text style={styles.preferenceDescription}>Prioritize paths with tree coverage or shade</Text>
                                </View>
                            </View>
                            <Switch
                                value={preferShade}
                                onValueChange={setPreferShade}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                    </View>
                    
                    {/* Save Button */}
                    <TouchableOpacity style={styles.saveButton} onPress={savePreferences}>
                        <Text style={styles.saveButtonText}>SAVE PREFERENCES</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

export default routing_options;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 5,
        borderRadius: 8,
        width: 'auto'
    },
    headerTitle: {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Montserrat-ExtraBold',
        color: COLORS.pmy.blue1,
        paddingLeft: 5
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    infoContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(43, 79, 110, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 10,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.blue1,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 12,
        marginTop: 15,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    routeOption: {
        width: '48%',
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
    },
    selectedRouteOption: {
        backgroundColor: COLORS.pmy.blue1,
    },
    routeOptionText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginTop: 10,
        marginBottom: 5,
    },
    selectedRouteOptionText: {
        color: COLORS.pmy.white,
    },
    routeOptionDescription: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        textAlign: 'center',
    },
    selectedRouteDescription: {
        color: 'rgba(255, 255, 255, 0.8)',
    },
    preferencesContainer: {
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        marginBottom: 20,
    },
    preferenceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    preferenceTextContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
        marginRight: 10,
    },
    preferenceIcon: {
        marginRight: 15,
        marginTop: 3,
    },
    preferenceText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: COLORS.pmy.black,
        marginBottom: 4,
    },
    preferenceDescription: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
    },
    saveButton: {
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 30,
        paddingVertical: 15,
        alignItems: 'center',
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    saveButtonText: {
        color: COLORS.pmy.white,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
});