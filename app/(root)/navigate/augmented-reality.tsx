import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView, Dimensions, Modal } from 'react-native';
import { useRouter } from "expo-router";
import { useFonts } from 'expo-font';
import { Camera } from 'expo-camera';

const { width } = Dimensions.get('window');

/**
 * @component AugmentedReality
 * @description A safety instruction screen that appears before starting the AR navigation.
 * Shows important safety guidelines, permission requests, and a start navigation button.
 * 
 * @features
 * - Safety instructions display
 * - Camera permission request modal
 * - Start navigation button
 * - Camera permission handling
 * 
 * @returns {React.ReactElement} The AugmentedReality component
 */
const AugmentedReality = () => {
    const router = useRouter();
    const [showPermissionModal, setShowPermissionModal] = useState(false);

    // Load Montserrat fonts for the component
    const [fontsLoaded] = useFonts({
        'Montserrat-Regular': require('../../../assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('../../../assets/fonts/Montserrat-Bold.ttf'),
    });

    /**
     * Handles the permission response from the user
     * @param {boolean} granted - Whether the permission was granted
     */
    const handlePermissionResponse = async (granted: boolean) => {
        setShowPermissionModal(false);
        if (granted) {
            try {
                const { status } = await Camera.requestCameraPermissionsAsync();
                if (status === 'granted') {
                    router.push('/(root)/navigate/camera-view');
                } else {
                    alert('Camera permission is required to use AR navigation');
                }
            } catch (error) {
                console.error('Error requesting camera permission:', error);
                alert('Failed to access camera. Please try again.');
            }
        }
    };

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.topSection}>
                    <Image 
                        source={require('../../../assets/images/AR-icon.png')}
                        style={styles.icon}
                    />
                    
                    <Text style={styles.title}>Before Proceeding</Text>
                    
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instruction}>• Stay alert</Text>
                        <Text style={styles.instruction}>• Keep your head up</Text>
                        <Text style={styles.instruction}>• Limit the use when crossing streets</Text>
                    </View>

                    <Text style={styles.safetyText}>
                        Stay safe while using UCGator—your safety{'\n'}comes first!
                    </Text>
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setShowPermissionModal(true)}
                >
                    <Text style={styles.buttonText}>START NAVIGATION</Text>
                </TouchableOpacity>
            </View>

            {/* Permission Modal */}
            <Modal
                transparent
                visible={showPermissionModal}
                animationType="fade"
                onRequestClose={() => setShowPermissionModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Permission Required</Text>
                        <Text style={styles.modalText}>
                            Do you want UCGator to use your Camera?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalButtonNo]}
                                onPress={() => handlePermissionResponse(false)}
                            >
                                <Text style={styles.modalButtonText}>No</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.modalButtonYes]}
                                onPress={() => handlePermissionResponse(true)}
                            >
                                <Text style={styles.modalButtonText}>Yes</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

/**
 * @constant styles
 * @description Styles for the AugmentedReality component
 * 
 * @property {Object} container - Main container styles
 * @property {Object} content - Content wrapper styles
 * @property {Object} topSection - Top section containing icon and instructions
 * @property {Object} icon - AR icon image styles
 * @property {Object} title - Title text styles
 * @property {Object} instructionsContainer - Container for safety instructions
 * @property {Object} instruction - Individual instruction text styles
 * @property {Object} safetyText - Safety message text styles
 * @property {Object} button - Start navigation button styles
 * @property {Object} buttonText - Button text styles
 * @property {Object} modalOverlay - Semi-transparent overlay for modal
 * @property {Object} modalContent - Modal container styles
 * @property {Object} modalTitle - Modal title text styles
 * @property {Object} modalText - Modal message text styles
 * @property {Object} modalButtons - Container for modal buttons
 * @property {Object} modalButton - Base modal button styles
 * @property {Object} modalButtonYes - Yes button specific styles
 * @property {Object} modalButtonNo - No button specific styles
 * @property {Object} modalButtonText - Modal button text styles
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B4F6E',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        paddingTop: '15%',
        paddingBottom: 32,
    },
    topSection: {
        alignItems: 'center',
    },
    icon: {
        width: width * 0.35,
        height: width * 0.35,
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 22,
        fontFamily: 'Montserrat-Bold',
        color: '#FFFFFF',
        marginBottom: 32,
        textAlign: 'center',
    },
    instructionsContainer: {
        alignSelf: 'stretch',
        paddingLeft: 16,
        marginBottom: 32,
    },
    instruction: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#FFFFFF',
        marginBottom: 16,
        lineHeight: 22,
    },
    safetyText: {
        fontSize: 15,
        fontFamily: 'Montserrat-Regular',
        color: '#FFFFFF',
        textAlign: 'center',
        lineHeight: 22,
    },
    button: {
        backgroundColor: '#4A90E2',
        paddingVertical: 16,
        borderRadius: 25,
        width: '100%',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
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
        borderRadius: 15,
        padding: 20,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: '#2B4F6E',
        marginBottom: 15,
    },
    modalText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: '#2B4F6E',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 20,
        minWidth: 100,
    },
    modalButtonYes: {
        backgroundColor: '#4A90E2',
    },
    modalButtonNo: {
        backgroundColor: '#E74C3C',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
});

export default AugmentedReality;
