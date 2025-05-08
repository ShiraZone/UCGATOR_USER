import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from 'expo-font';

/**
 * StopPoints Component
 * 
 * @component
 * @description A screen component for managing navigation stop points.
 * Allows users to add, edit, and remove intermediate stops in their navigation route.
 * 
 * @features
 * - Stop points management interface
 * - Back navigation with header
 * - Consistent UI with app theme
 * - Font loading with Montserrat
 * 
 * @navigation
 * - Back button returns to start-navigation screen
 * - Accessed from start-navigation's "Add Stop Points" button
 * 
 * @styling
 * - Uses app's primary color scheme (#2B4F6E)
 * - Montserrat font family integration
 * - Responsive layout with flex design
 * - Custom header with back navigation
 * 
 * @usage
 * This component is used to enhance the navigation experience by allowing users
 * to create multi-stop routes. Users can specify intermediate destinations
 * between their starting point and final destination.
 * 
 * @returns {React.ReactElement} The rendered StopPoints component
 */
const StopPoints = () => {
    const router = useRouter();

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
     * Returns to the start-navigation screen
     */
    const handleBack = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Stop Points</Text>
            </View>
            
            <View style={styles.content}>
                <Text style={styles.subtitle}>Add Stop Points</Text>
                {/* Add your stop points content here */}
            </View>
        </View>
    );
};

/**
 * @constant styles
 * @description StyleSheet for the StopPoints component
 * 
 * @property {Object} container - Main container with primary background color
 * @property {Object} header - Header container with back button and title
 * @property {Object} backButton - Back button styling and positioning
 * @property {Object} title - Header title text styling with Montserrat Bold
 * @property {Object} content - Main content container with padding
 * @property {Object} subtitle - Section subtitle styling with Montserrat Regular
 * 
 * @styling
 * The styles maintain consistency with the app's design language:
 * - Uses the primary blue color (#2B4F6E) for background
 * - Implements consistent spacing and padding
 * - Uses Montserrat font family for typography
 * - Follows the app's header design pattern
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
});

export default StopPoints;