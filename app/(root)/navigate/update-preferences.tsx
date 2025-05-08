import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Animated, Easing } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from 'expo-font';
import { useState, useRef, useEffect } from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * AnimatedCheckmark Component
 * 
 * @component
 * @description A checkmark that animates by drawing itself in a continuous loop
 */
const AnimatedCheckmark = () => {
    const animation = useRef(new Animated.Value(0)).current;
    const pathLength = useRef(80);
    const AnimatedPath = Animated.createAnimatedComponent(Path);

    useEffect(() => {
        const startAnimation = () => {
            // Reset the animation value
            animation.setValue(0);
            
            // Create the animation sequence
            Animated.sequence([
                // Draw the checkmark
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 800,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                // Short pause at full visibility
                Animated.delay(500),
                // Fade out
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 600,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                // Short pause before restarting
                Animated.delay(300),
            ]).start(() => {
                // Restart the animation when complete
                startAnimation();
            });
        };

        startAnimation();

        // Cleanup function
        return () => {
            animation.stopAnimation();
        };
    }, []);

    const animatedStrokeDashoffset = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
    });

    const animatedOpacity = animation.interpolate({
        inputRange: [0, 0.4, 1],
        outputRange: [0, 1, 1],
    });

    return (
        <Svg width="50" height="50" viewBox="0 0 50 50">
            <AnimatedPath
                d="M10 25 L20 35 L40 15"
                stroke="#3D73A6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                strokeDasharray={80}
                strokeDashoffset={animatedStrokeDashoffset}
                opacity={animatedOpacity}
            />
        </Svg>
    );
};

/**
 * UpdatePreferences Component
 * 
 * @component
 * @description A screen component for managing navigation preferences and settings.
 * Allows users to customize their navigation experience with various options and parameters.
 * 
 * @features
 * - Custom navigation preferences management
 * - Back navigation with header
 * - Consistent UI with app theme
 * - Font loading with Montserrat
 * 
 * @navigation
 * - Back button returns to previous screen
 * - Accessed from start-navigation screen
 * 
 * @styling
 * - Uses app's primary color scheme
 * - Montserrat font family integration
 * - Responsive layout with flex design
 * - Custom header with back navigation
 * 
 * @returns {React.ReactElement} The rendered UpdatePreferences component
 */
const UpdatePreferences = () => {
    const router = useRouter();
    const [avoidStairs, setAvoidStairs] = useState(false);
    const [avoidRamps, setAvoidRamps] = useState(false);
    const [avoidElevators, setAvoidElevators] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Load Montserrat fonts
    const [fontsLoaded] = useFonts({
        'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    // Don't render until fonts are loaded
    if (!fontsLoaded) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    /**
     * Handles back navigation
     * Returns to the previous screen in the navigation stack
     */
    const handleBack = () => {
        router.back();
    };

    const handleSave = () => {
        // Here you would typically save the preferences
        setShowModal(true);
    };

    const handleOk = () => {
        setShowModal(false);
        router.push('/(root)/navigate/start-navigation');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Update Preferences</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.subtitle}>Accessibility Settings</Text>
                
                <View style={styles.preferencesContainer}>
                    {/* Avoid Stairs Toggle */}
                    <View style={styles.preferenceRow}>
                        <Text style={styles.preferenceText}>Avoid Stairs</Text>
                        <Switch
                            value={avoidStairs}
                            onValueChange={setAvoidStairs}
                            trackColor={{ false: '#9BC9F5', true: '#3D73A6' }}
                            thumbColor={avoidStairs ? '#FFFFFF' : '#F6F6F6'}
                            ios_backgroundColor="#9BC9F5"
                        />
                    </View>

                    {/* Avoid Ramps Toggle */}
                    <View style={styles.preferenceRow}>
                        <Text style={styles.preferenceText}>Avoid Ramps</Text>
                        <Switch
                            value={avoidRamps}
                            onValueChange={setAvoidRamps}
                            trackColor={{ false: '#9BC9F5', true: '#3D73A6' }}
                            thumbColor={avoidRamps ? '#FFFFFF' : '#F6F6F6'}
                            ios_backgroundColor="#9BC9F5"
                        />
                    </View>

                    {/* Avoid Elevators Toggle */}
                    <View style={styles.preferenceRow}>
                        <Text style={styles.preferenceText}>Avoid Elevators</Text>
                        <Switch
                            value={avoidElevators}
                            onValueChange={setAvoidElevators}
                            trackColor={{ false: '#9BC9F5', true: '#3D73A6' }}
                            thumbColor={avoidElevators ? '#FFFFFF' : '#F6F6F6'}
                            ios_backgroundColor="#9BC9F5"
                        />
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>SAVE PREFERENCES</Text>
                </TouchableOpacity>
            </View>

            {/* Success Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showModal}
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.iconContainer}>
                            <AnimatedCheckmark />
                        </View>
                        <Text style={styles.modalTitle}>Success!</Text>
                        <Text style={styles.modalText}>Your preferences have been saved successfully.</Text>
                        <TouchableOpacity style={styles.okButton} onPress={handleOk}>
                            <Text style={styles.okButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

/**
 * @constant styles
 * @description StyleSheet for the UpdatePreferences component
 * 
 * @property {Object} container - Main container with primary background color
 * @property {Object} header - Header container with back button and title
 * @property {Object} backButton - Back button styling and positioning
 * @property {Object} title - Header title text styling with Montserrat Bold
 * @property {Object} content - Main content container with padding
 * @property {Object} subtitle - Section subtitle styling with Montserrat Regular
 * @property {Object} preferencesContainer - Container for accessibility preferences
 * @property {Object} preferenceRow - Row styling for each preference
 * @property {Object} preferenceText - Text styling for preference labels
 * @property {Object} saveButton - Styling for the save button
 * @property {Object} saveButtonText - Text styling for the save button
 * @property {Object} modalOverlay - Styling for the modal overlay
 * @property {Object} modalContent - Styling for the modal content
 * @property {Object} iconContainer - Styling for the icon container
 * @property {Object} modalTitle - Styling for the modal title
 * @property {Object} modalText - Styling for the modal text
 * @property {Object} okButton - Styling for the OK button
 * @property {Object} okButtonText - Text styling for the OK button
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B4F6E',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingTop: 40,
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 20,
    },
    preferencesContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 20,
        marginBottom: 20,
    },
    preferenceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 3,
        borderBottomColor: 'rgba(255, 255, 255, 0.25)',
    },
    preferenceText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
    },
    saveButton: {
        backgroundColor: '#3D73A6',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        alignItems: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#9BC9F5',
        shadowColor: '#9BC9F5',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        letterSpacing: 0.5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 25,
        alignItems: 'center',
        width: '80%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F6F6F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat-Bold',
        color: '#2B4F6E',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#2B4F6E',
        textAlign: 'center',
        marginBottom: 20,
    },
    okButton: {
        backgroundColor: '#3D73A6',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    okButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
});

export default UpdatePreferences;