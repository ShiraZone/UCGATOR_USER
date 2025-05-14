import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck, faRulerHorizontal } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

// Define the measurement unit types
type DistanceUnit = 'metric' | 'imperial' | 'automatic';

interface UnitOption {
    id: DistanceUnit;
    name: string;
    description: string;
    examples: string[];
}

const measurement_units = () => {
    const router = useRouter();
    const [selectedUnit, setSelectedUnit] = useState<DistanceUnit>('metric');

    // Unit options to display
    const unitOptions: UnitOption[] = [
        {
            id: 'metric',
            name: 'Metric',
            description: 'Using meters and kilometers',
            examples: ['3 meters', '1.2 kilometers', '500 meters']
        },
        {
            id: 'imperial',
            name: 'Imperial',
            description: 'Using feet and miles',
            examples: ['10 feet', '0.7 miles', '1,650 feet']
        },
        {
            id: 'automatic',
            name: 'Automatic',
            description: 'Based on your device settings',
            examples: ['Adapts to your system settings']
        }
    ];

    // Save the selected unit to storage
    const saveUnitPreference = (unit: DistanceUnit) => {
        setSelectedUnit(unit);
        // In a real app, you would save this to AsyncStorage or another persistence method
        // Example: AsyncStorage.setItem('distanceUnit', unit);
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Measurement Units</Text>
                </View>

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    <View style={styles.infoContainer}>
                        <FontAwesomeIcon icon={faRulerHorizontal} size={20} color={COLORS.pmy.blue1} style={styles.infoIcon} />
                        <Text style={styles.infoText}>
                            Choose how distances are displayed throughout the app. This affects navigation, location details, and search results.
                        </Text>
                    </View>

                    <Text style={styles.sectionTitle}>Distance Units</Text>

                    {/* Unit Selection Options */}
                    {unitOptions.map((option) => (
                        <TouchableOpacity
                            key={option.id}
                            style={[
                                styles.optionContainer,
                                selectedUnit === option.id && styles.selectedOptionContainer
                            ]}
                            onPress={() => saveUnitPreference(option.id)}
                        >
                            <View style={styles.optionContent}>
                                <View style={styles.optionHeader}>
                                    <Text style={styles.optionTitle}>{option.name}</Text>
                                    {selectedUnit === option.id && (
                                        <View style={styles.checkmarkContainer}>
                                            <FontAwesomeIcon icon={faCheck} size={14} color={COLORS.pmy.white} />
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.optionDescription}>{option.description}</Text>
                                
                                <View style={styles.examplesContainer}>
                                    <Text style={styles.examplesTitle}>Examples:</Text>
                                    {option.examples.map((example, index) => (
                                        <View key={index} style={styles.exampleItem}>
                                            <Text style={styles.exampleText}>{example}</Text>
                                        </View>
                                    ))}
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <View style={styles.noteContainer}>
                        <Text style={styles.noteText}>
                            Note: This setting will only change how distances are displayed. It will not affect the accuracy of navigation or location services.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

export default measurement_units;

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
        marginBottom: 12
    },
    optionContainer: {
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedOptionContainer: {
        borderColor: COLORS.pmy.blue1,
    },
    optionContent: {
        flex: 1,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    optionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
    },
    checkmarkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: COLORS.pmy.blue1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        marginBottom: 10,
    },
    examplesContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 8,
        padding: 10,
    },
    examplesTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Medium',
        color: COLORS.pmy.blue1,
        marginBottom: 5,
    },
    exampleItem: {
        marginBottom: 4,
    },
    exampleText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.black,
    },
    noteContainer: {
        backgroundColor: 'rgba(255, 193, 7, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginTop: 15,
        marginBottom: 30,
    },
    noteText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: '#856404',
        lineHeight: 20,
    },
});