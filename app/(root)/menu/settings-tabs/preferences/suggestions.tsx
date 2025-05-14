import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faArrowLeft, 
    faLightbulb, 
    faLocationDot, 
    faCompass, 
    faMap, 
    faStreetView,
    faCalendar,
    faBuilding,
    faBell,
    faUserFriends
} from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

interface SuggestionCategory {
    id: string;
    title: string;
    description: string;
    icon: any;
    enabled: boolean;
}

const suggestions = () => {
    const router = useRouter();
    
    // Master toggle for all suggestions
    const [suggestionsEnabled, setSuggestionsEnabled] = useState<boolean>(true);
    
    // Individual suggestion categories
    const [suggestionCategories, setSuggestionCategories] = useState<SuggestionCategory[]>([
        {
            id: 'navigation',
            title: 'Navigation Suggestions',
            description: 'Route recommendations based on your history',
            icon: faCompass,
            enabled: true
        },
        {
            id: 'poi',
            title: 'Points of Interest',
            description: 'Nearby locations you might be interested in',
            icon: faLocationDot,
            enabled: true
        },
        {
            id: 'ar',
            title: 'AR Features',
            description: 'Augmented reality navigation tips',
            icon: faStreetView,
            enabled: true
        },
        {
            id: 'maps',
            title: 'Map Features',
            description: 'Tips for using maps and floor plans',
            icon: faMap,
            enabled: false
        },
        {
            id: 'events',
            title: 'Event Recommendations',
            description: 'Campus events you might be interested in',
            icon: faCalendar,
            enabled: true
        },
        {
            id: 'buildings',
            title: 'Building Information',
            description: 'Details about campus buildings and facilities',
            icon: faBuilding,
            enabled: true
        },
        {
            id: 'alerts',
            title: 'Campus Alerts',
            description: 'Important announcements about campus',
            icon: faBell,
            enabled: true
        },
        {
            id: 'social',
            title: 'Social Suggestions',
            description: 'People you might know or want to follow',
            icon: faUserFriends,
            enabled: false
        }
    ]);
    
    // Toggle master suggestions switch
    const toggleAllSuggestions = (value: boolean) => {
        setSuggestionsEnabled(value);
        
        // Update all category toggles
        const updatedCategories = suggestionCategories.map(category => ({
            ...category,
            enabled: value
        }));
        
        setSuggestionCategories(updatedCategories);
    };
    
    // Toggle individual category
    const toggleCategory = (categoryId: string, value: boolean) => {
        const updatedCategories = suggestionCategories.map(category => 
            category.id === categoryId ? { ...category, enabled: value } : category
        );
        
        setSuggestionCategories(updatedCategories);
        
        // Check if all categories are disabled, if so, disable master toggle
        const allDisabled = updatedCategories.every(category => !category.enabled);
        if (allDisabled) {
            setSuggestionsEnabled(false);
        } else if (!suggestionsEnabled) {
            // If at least one category is enabled but master toggle is off, turn it on
            setSuggestionsEnabled(true);
        }
    };
    
    // Save preferences
    const savePreferences = () => {
        // In a real app, this would save to backend or AsyncStorage
        // Example: AsyncStorage.setItem('suggestionPreferences', JSON.stringify({
        //    masterEnabled: suggestionsEnabled,
        //    categories: suggestionCategories
        // }));
        
        // Show a confirmation message
        alert('Suggestion preferences saved successfully');
    };

    // Render each category
    const renderCategory = ({ item }: { item: SuggestionCategory }) => (
        <View style={styles.categoryItem}>
            <View style={styles.categoryTextContainer}>
                <View style={styles.categoryIconContainer}>
                    <FontAwesomeIcon icon={item.icon} size={18} color={COLORS.pmy.blue1} />
                </View>
                <View style={styles.categoryInfo}>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                    <Text style={styles.categoryDescription}>{item.description}</Text>
                </View>
            </View>
            <Switch
                value={item.enabled && suggestionsEnabled}
                onValueChange={(value) => toggleCategory(item.id, value)}
                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                thumbColor={COLORS.pmy.white}
                disabled={!suggestionsEnabled && item.enabled}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Suggestions</Text>
                </View>

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Info Box */}
                    <View style={styles.infoContainer}>
                        <FontAwesomeIcon icon={faLightbulb} size={22} color={COLORS.pmy.blue1} style={styles.infoIcon} />
                        <Text style={styles.infoText}>
                            Customize which suggestions appear throughout the app. Enabling relevant suggestions can help you discover new features and get the most out of UCGator.
                        </Text>
                    </View>
                    
                    {/* Master Toggle */}
                    <View style={styles.masterToggleContainer}>
                        <View style={styles.masterToggleContent}>
                            <Text style={styles.masterToggleTitle}>Enable All Suggestions</Text>
                            <Text style={styles.masterToggleDescription}>
                                Turn on/off all suggestion types at once
                            </Text>
                        </View>
                        <Switch
                            value={suggestionsEnabled}
                            onValueChange={toggleAllSuggestions}
                            trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                            thumbColor={COLORS.pmy.white}
                        />
                    </View>
                    
                    {/* Section Title */}
                    <Text style={styles.sectionTitle}>Suggestion Categories</Text>
                    
                    {/* Categories List */}
                    <View style={styles.categoriesContainer}>
                        {suggestionCategories.map(category => renderCategory({ item: category }))}
                    </View>
                    
                    {/* Learn More Section */}
                    <View style={styles.learnMoreContainer}>
                        <Text style={styles.learnMoreTitle}>How We Use Your Data</Text>
                        <Text style={styles.learnMoreText}>
                            Suggestions are personalized based on your navigation history, preferences, and usage patterns. 
                            We do not share this data with third parties. You can clear your history at any time from the Privacy section.
                        </Text>
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

export default suggestions;

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
    masterToggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
    },
    masterToggleContent: {
        flex: 1,
        marginRight: 10,
    },
    masterToggleTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.white,
        marginBottom: 4,
    },
    masterToggleDescription: {
        fontSize: 13,
        fontFamily: 'Montserrat-Regular',
        color: 'rgba(255, 255, 255, 0.8)',
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 12,
    },
    categoriesContainer: {
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 20,
    },
    categoryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.05)',
    },
    categoryTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    categoryIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(43, 79, 110, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    categoryInfo: {
        flex: 1,
    },
    categoryTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Medium',
        color: COLORS.pmy.black,
        marginBottom: 4,
    },
    categoryDescription: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
    },
    learnMoreContainer: {
        backgroundColor: 'rgba(25, 118, 210, 0.05)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        borderLeftWidth: 3,
        borderLeftColor: COLORS.pmy.blue1,
    },
    learnMoreTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 8,
    },
    learnMoreText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.black,
        lineHeight: 20,
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