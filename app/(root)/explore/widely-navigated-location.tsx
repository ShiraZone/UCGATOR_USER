import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from 'expo-font';

/**
 * WidelyNavigatedLocation Component
 * 
 * @component
 * @description A screen component that displays widely navigated locations.
 * Shows a list of popular locations frequently visited by users.
 * 
 * @features
 * - Displays popular navigation locations
 * - Back navigation to explore screen
 * - Consistent UI with app theme
 * - Font loading with Montserrat
 * 
 * @navigation
 * - Back button returns to explore screen
 * - Accessed from explore screen's "Widely Navigated Location" tab
 * 
 * @styling
 * - Uses app's primary color scheme
 * - Montserrat font family integration
 * - Responsive layout with flex design
 * - Custom header with back navigation
 * 
 * @returns {React.ReactElement} The rendered WidelyNavigatedLocation component
 */
const WidelyNavigatedLocation = () => {
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

    const handleBack = () => {
        router.back();
    };

    // Sample popular locations data - replace with actual data from your app
    const popularLocations = [
        { id: 1, name: 'CCS Library', description: 'A place to read and study.' },
        { id: 2, name: 'Canteen', description: 'Enjoy a variety of meals and snacks.' },
        { id: 3, name: 'UCLM Covered Court', description: 'Facilities for sports and physical education.' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Widely Navigated Locations</Text>
            </View>
            
            <ScrollView style={styles.content}>
                {popularLocations.map((location) => (
                    <View key={location.id} style={styles.locationCard}>
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faMapMarkerAlt} size={24} color="#3D73A6" />
                        </View>
                        <View style={styles.locationDetails}>
                            <Text style={styles.locationName}>{location.name}</Text>
                            <Text style={styles.locationDescription}>{location.description}</Text>
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

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
    locationCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F6F6F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    locationDetails: {
        flex: 1,
    },
    locationName: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        marginBottom: 4,
    },
    locationDescription: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
    },
});

export default WidelyNavigatedLocation;
