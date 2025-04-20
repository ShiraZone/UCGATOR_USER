import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faHistory } from '@fortawesome/free-solid-svg-icons';
import { useFonts } from 'expo-font';

/**
 * YourHistory Component
 * 
 * @component
 * @description A screen component that displays the user's navigation history.
 * Shows a list of previously visited locations and navigation routes.
 * 
 * @features
 * - Displays recent navigation history
 * - Back navigation to explore screen
 * - Consistent UI with app theme
 * - Font loading with Montserrat
 * 
 * @navigation
 * - Back button returns to explore screen
 * - Accessed from explore screen's "Your History" tab
 * 
 * @styling
 * - Uses app's primary color scheme
 * - Montserrat font family integration
 * - Responsive layout with flex design
 * - Custom header with back navigation
 * 
 * @returns {React.ReactElement} The rendered YourHistory component
 */
const YourHistory = () => {
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

    // Sample history data - replace with actual data from database
    const historyItems = [
        { id: 1, from: 'Main Gate', to: 'Cashier', date: '2024-03-15' },
        { id: 2, from: 'Library', to: 'Records Section', date: '2024-03-14' },
        { id: 3, from: 'Canteen', to: 'UCLM Covered Court', date: '2024-03-13' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Your History</Text>
            </View>
            
            <ScrollView style={styles.content}>
                {historyItems.map((item) => (
                    <View key={item.id} style={styles.historyCard}>
                        <View style={styles.iconContainer}>
                            <FontAwesomeIcon icon={faHistory} size={24} color="#3D73A6" />
                        </View>
                        <View style={styles.historyDetails}>
                            <Text style={styles.routeText}>
                                From: <Text style={styles.locationText}>{item.from}</Text>
                            </Text>
                            <Text style={styles.routeText}>
                                To: <Text style={styles.locationText}>{item.to}</Text>
                            </Text>
                            <Text style={styles.dateText}>{item.date}</Text>
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
    historyCard: {
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
    historyDetails: {
        flex: 1,
    },
    routeText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        marginBottom: 4,
    },
    locationText: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
    },
    dateText: {
        color: '#9BC9F5',
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        marginTop: 4,
    },
});

export default YourHistory; 