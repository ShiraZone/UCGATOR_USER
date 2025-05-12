import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faDirections, faHeart } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useFonts } from 'expo-font';
import axios from 'axios';
import { getToken } from '@/app/lib/secure-store';
import { config } from '@/app/lib/config';
import { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'react-native';

// Get screen dimensions for image gallery
const { width: screenWidth } = Dimensions.get('window');

// CONSTANTS
const COLORS = {
    pmy: {
        white: '#F6F6F6',
        blue1: '#2B4F6E',
    },
};

/**
 * LocationDetails Component
 * 
 * @component
 * @description Displays detailed information about a specific location or point of interest.
 * Shows information such as room name, description, floor information, and navigation options.
 * 
 * @returns {React.ReactElement} The rendered LocationDetails component
 */
const LocationDetails = () => {
    const router = useRouter();
    const params = useLocalSearchParams<{ id: string }>();
    const [locationDetails, setLocationDetails] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [activeSlide, setActiveSlide] = useState<number>(0);
    const carouselRef = useRef<any>(null);
    const [isFavorite, setIsFavorite] = useState<boolean>(false);

    // State for images from contributions
    const [images, setImages] = useState<Array<string>>([]);

    // Load Montserrat fonts
    const [fontsLoaded] = useFonts({
        'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    useEffect(() => {
        const fetchLocationDetails = async () => {
            if (params.id) {
                try {
                    const token = await getToken();
                    if (!token) {
                        return;
                    }

                    // Using getSpecificPin endpoint to get pin details including images
                    const response = await axios.get(`${config.endpoint}/map/user/pins/${params.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });

                    if (response.data.success) {
                        const pinData = response.data.data;
                        setLocationDetails(pinData);

                        // Extract all image URLs from contributions
                        const contributionImages: string[] = [];
                        if (pinData.contributions && pinData.contributions.length > 0) {
                            pinData.contributions.forEach((contribution: any) => {
                                if (contribution.imageUrls && contribution.imageUrls.length > 0) {
                                    contributionImages.push(...contribution.imageUrls);
                                }
                            });
                        }

                        // Set images array - if empty, we'll handle it in the render logic
                        setImages(contributionImages);
                    } else {
                        console.error('Failed to load location details.');
                    }
                } catch (error: any) {
                    console.error(error.response?.data?.message || error.message);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLocationDetails();
    }, [params.id]);

    // Don't render until fonts are loaded
    if (!fontsLoaded) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    const handleBack = () => {
        router.back();
    };

    const handleStartNavigation = () => {
        if (locationDetails) {
            // Navigate to the navigation start screen with this location as the destination
            router.push({
                pathname: '/(root)/navigate/start-navigation',
                params: { destination: locationDetails.pinName }
            });
        }
    };

    const renderImageItem = ({ item }: { item: string }) => {
        return (
            <View style={{ position: 'relative' }}>
                <Image source={{ uri: item }} style={styles.carouselImage} />
                <TouchableOpacity
                    style={styles.heartIconButton}
                    onPress={toggleFavorite}
                >
                    <FontAwesomeIcon
                        icon={faHeart}
                        size={24}
                        color={isFavorite ? '#FF4757' : 'white'}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    // Add a function to toggle favorite status
    const toggleFavorite = () => {
        setIsFavorite(prev => !prev);
        // In a real app, you would also make an API call to update the favorite status
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar backgroundColor='white' barStyle={'dark-content'} />
            <View style={{ paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row' }}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={COLORS.pmy.blue1} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 20, color: COLORS.pmy.blue1 }}>UCGATOR</Text>
            </View>


            <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Loading details...</Text>
                    </View>
                ) : locationDetails ? (
                    <>
                        {/* Image Gallery */}
                        <View style={styles.carouselContainer}>
                            {images.length > 0 ? (
                                <>
                                    <FlatList
                                        data={images}
                                        renderItem={renderImageItem}
                                        keyExtractor={(item, index) => index.toString()}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                        onScroll={(e) => {
                                            const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                                            setActiveSlide(index);
                                        }}
                                        scrollEventThrottle={16}
                                    />

                                    {/* Pagination Dots */}
                                    <View style={styles.paginationContainer}>
                                        {images.map((_, index) => (
                                            <View
                                                key={index}
                                                style={[
                                                    styles.paginationDot,
                                                    index === activeSlide ? {} : styles.paginationInactiveDot
                                                ]}
                                            />
                                        ))}
                                    </View>
                                </>
                            ) : (
                                <View style={styles.noContributionsContainer}>
                                    <Text style={styles.noContributionsText}>
                                        This location does not have any contributions yet, posts now!
                                    </Text>
                                    <TouchableOpacity style={styles.postNowButton} onPress={() => router.push('/(root)/latest/new-post')}>
                                        <Text style={styles.postNowButtonText}>Post Now</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.locationHeader}>
                            <Text style={styles.locationName}>{locationDetails.pinName}</Text>
                            <Text style={styles.locationFloor}>Floor {locationDetails.floorNumber}</Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Description</Text>
                            <Text style={styles.descriptionText}>{locationDetails.pinDescription || "No description available."}</Text>
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.sectionTitle}>Additional Information</Text>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Building:</Text>
                                <Text style={styles.infoValue}>{locationDetails.buildingName}</Text>
                            </View>
                            <View style={styles.infoItem}>
                                <Text style={styles.infoLabel}>Room Type:</Text>
                                <Text style={styles.infoValue}>{locationDetails.pinType || "Not specified"}</Text>
                            </View>
                        </View>
                        
                        <View style={{ marginHorizontal: 20, marginVertical: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity 
                                style={[styles.navigationButton, { flex: 1, marginRight: 10 }]} 
                                onPress={handleStartNavigation}
                            >
                                <FontAwesomeIcon 
                                    icon={faDirections} 
                                    size={20} 
                                    color="#FFFFFF" 
                                    style={styles.buttonIcon} 
                                />
                                <Text style={styles.buttonText}>Navigate</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={[styles.favoriteButton, { flex: 1, backgroundColor: isFavorite ? '#FF4757' : COLORS.pmy.blue1 }]} 
                                onPress={toggleFavorite}
                            >
                                <FontAwesomeIcon 
                                    icon={faHeart} 
                                    size={20} 
                                    color="#FFFFFF" 
                                    style={styles.buttonIcon} 
                                />
                                <Text style={styles.buttonText}>
                                    {isFavorite ? 'Remove' : 'Favorite'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Could not load location details.</Text>
                        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
                            <Text style={styles.retryButtonText}>Go Back</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

export default LocationDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.pmy.white,
    },
    header: {
        backgroundColor: COLORS.pmy.blue1,
        padding: 20,
        paddingTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 0, // Changed from 20 to 0 for full-width carousel
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        fontSize: 16,
        color: COLORS.pmy.blue1,
        fontFamily: 'Montserrat-Regular',
    },
    locationHeader: {
        paddingHorizontal: 20, // Added horizontal padding
        marginTop: 10,
    },
    locationName: {
        fontSize: 24,
        color: COLORS.pmy.blue1,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 5,
    },
    locationFloor: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Montserrat-Regular',
    },
    infoSection: {
        marginVertical: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 20, // Added horizontal margin
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        borderWidth: 1, 
        borderColor: COLORS.pmy.blue1 
    },
    sectionTitle: {
        fontSize: 18,
        color: COLORS.pmy.blue1,
        fontFamily: 'Montserrat-Bold',
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#333333',
        fontFamily: 'Montserrat-Regular',
        lineHeight: 24,
    },
    infoItem: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    infoLabel: {
        fontSize: 16,
        color: '#666666',
        fontFamily: 'Montserrat-Bold',
        width: 120,
    },
    infoValue: {
        fontSize: 16,
        color: '#333333',
        fontFamily: 'Montserrat-Regular',
        flex: 1,
    },
    navigationButton: {
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 25,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonIcon: {
        marginRight: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
    favoriteButton: {
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 25,
        paddingVertical: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: '#E74C3C',
        fontFamily: 'Montserrat-Regular',
        marginBottom: 15,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
    carouselContainer: {
        width: screenWidth,
        height: 250,
        position: 'relative',
        marginBottom: 10,
    },
    carouselImage: {
        width: screenWidth,
        height: 250,
        resizeMode: 'cover', // Ensures the image covers the area properly
    },
    heartIconButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 20,
        padding: 5,
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 4,
    },
    paginationInactiveDot: {
        opacity: 0.5,
    },
    noContributionsContainer: {
        width: screenWidth,
        height: 250,
        backgroundColor: '#E8EEF2', // Light blue background that matches your app's color scheme
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    noContributionsText: {
        fontSize: 18,
        color: COLORS.pmy.blue1,
        fontFamily: 'Montserrat-Medium',
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 24,
    },
    postNowButton: {
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 25,
        paddingVertical: 12,
        paddingHorizontal: 30,
        marginTop: 10,
    },
    postNowButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
});

