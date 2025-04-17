import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from 'react-native';
import { useRouter } from "expo-router";

/**
 * ArrowClicked Component
 * 
 * @component
 * @description Navigation confirmation screen showing route details between two locations.
 * Displays the source and destination locations, estimated arrival time, distance,
 * and provides options to begin navigation or cancel.
 *
 * @features
 * - Header with Begin/Cancel navigation options
 * - Location display with visual connection (double arrow)
 * - Route details (arrival time and distance)
 * - Directions preview section
 *
 * @navigation
 * - BEGIN: Proceeds to loading screen
 * - CANCEL: Returns to explore screen
 *
 * @returns {React.ReactElement} The rendered ArrowClicked component
 */

const ArrowClicked = () => {
    const router = useRouter();

    /**
     * Handles the cancel action, returning to the explore screen
     */
    const handleCancel = () => {
        router.push("/explore");
    };

    /**
     * Handles the begin action, proceeding to the loading screen
     */
    const handleBegin = () => {
        router.push("/navigate/loading-screen");
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../../../assets/images/menu_image_cover.png')}
                style={styles.headerBackground}
                resizeMode="cover"
            >
                <Text style={styles.title}>Navigate</Text>
                <View style={styles.headerButtons}>
                    <TouchableOpacity 
                        style={styles.headerButton}
                        onPress={handleBegin}
                    >
                        <Text style={styles.headerButtonText}>BEGIN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.headerButton}
                        onPress={handleCancel}
                    >
                        <Text style={styles.headerButtonText}>CANCEL</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

            <View style={styles.content}>
                {/* Location Header */}
                <View style={styles.locationHeader}>
                    <Text style={styles.locationText}>Cashier</Text>
                    <Image 
                        source={require('../../../assets/images/doubleArrow.png')}
                        style={styles.arrowImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.locationText}>Records</Text>
                </View>

                {/* Details */}
                <View style={styles.detailsContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Arrival Time:</Text>
                        <Text style={styles.detailValue}>--:--</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Distance:</Text>
                        <Text style={styles.detailValue}>-- m</Text>
                    </View>
                </View>

                {/* Directions Section */}
                <View style={styles.directionsSection}>
                    <Text style={styles.sectionTitle}>Directions</Text>
                    <View style={styles.directionsList}>
                        <View style={styles.directionItem} />
                        <View style={styles.directionItem} />
                        <View style={styles.directionItem} />
                    </View>
                </View>
            </View>
        </View>
    );
};

/**
 * @constant styles
 * @description StyleSheet for the ArrowClicked component
 * 
 * @property {Object} container - Main container for the entire screen
 * @property {Object} headerBackground - Styles for the header image background
 * @property {Object} title - Navigation title styling
 * @property {Object} headerButtons - Container for BEGIN/CANCEL buttons
 * @property {Object} headerButton - Individual button styling
 * @property {Object} headerButtonText - Button text styling
 * @property {Object} content - Main content container
 * @property {Object} locationHeader - Container for source/destination display
 * @property {Object} locationText - Location text styling
 * @property {Object} arrowImage - Double arrow image styling
 * @property {Object} detailsContainer - Container for route details
 * @property {Object} detailRow - Individual detail row styling
 * @property {Object} detailLabel - Detail label text styling
 * @property {Object} detailValue - Detail value text styling
 * @property {Object} directionsSection - Container for directions preview
 * @property {Object} directionsList - List of direction items
 * @property {Object} directionItem - Individual direction item styling
 */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    headerBackground: {
        width: '100%',
        paddingTop: 15,
        paddingBottom: 70,
    },
    title: {
        fontSize: 24,
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        marginBottom: 15,
        paddingHorizontal: 20,
    },
    headerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    headerButton: {
        backgroundColor: '#3D73A6',
        paddingVertical: 8,
        paddingHorizontal: 30,
        borderRadius: 20,
        minWidth: 120,
        alignItems: 'center',
    },
    headerButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        flex: 1,
        padding: 30,
        paddingTop: 30,
        backgroundColor: '#ffffff',
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 15,
        marginBottom: 15,
    },
    arrowImage: {
        width: 20,
        height: 20,
    },
    locationText: {
        fontSize: 30,
        fontFamily: 'Montserrat-Bold',
        color: '#000000',
    },
    detailsContainer: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        alignItems: 'center',
    },
    detailLabel: {
        fontSize: 14,
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    detailValue: {
        fontSize: 14,
        color: '#666666',
        fontFamily: 'Montserrat-Medium',
    },
    directionsSection: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        color: '#000000',
        marginBottom: 10,
    },
    directionsList: {
        gap: 8,
    },
    directionItem: {
        height: 100,
        backgroundColor: '#D9D9D9',
        borderRadius: 8,
        marginBottom: 8,
    },
});

export default ArrowClicked;