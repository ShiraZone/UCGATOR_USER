import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Modal, Alert, Platform, Dimensions, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { faArrowLeft, faMapMarkerAlt, faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { config } from '@/app/lib/config';
import { getToken } from '@/app/lib/secure-store';
import { useAuth } from '@/app/lib/auth-context';

/**
 * Predefined color constants for styling.
 * @const {object} COLORS
 */
const COLORS = {
  blue1: '#2B4F6E',  
  white: '#FFFFFF',
  lightGray: '#F0F2F5',
  darkGray: '#65676B',
  black: '#000000',
  green: '#4CAF50', 
  blueIcon: '#2E81F4', 
  yellowIcon: '#F7B928',
  redIcon: '#E4405F',
  locationIcon: '#F5533D',
  liveIcon: '#E02828',
  backgroundIcon: '#7B3CB4',
  cameraIcon: '#58C472',
  gifIcon: '#31A2F7',
};

/**
 * Represents the New Post screen UI.
 * Allows users to create a new post with text and various options.
 *
 * @component
 * @returns {JSX.Element} The rendered New Post screen.
 */
const NewPost = (): JSX.Element => {
    const router = useRouter();
    const { user } = useAuth();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<{ id: string; name: string } | null>(null);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [locations, setLocations] = useState<Array<{
        id: string;
        name: string;
        building: string;
        description: string;
    }>>([]);
    const [isLoadingLocations, setIsLoadingLocations] = useState(false);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLocations, setFilteredLocations] = useState<Array<{
        id: string;
        name: string;
        building: string;
        description: string;
    }>>([]);
    const [postText, setPostText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        fetchLocations();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredLocations(locations);
        } else {
            const filtered = locations.filter(location => 
                location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                location.building.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLocations(filtered);
        }
    }, [searchQuery, locations]);

    const fetchLocations = async () => {
        setIsLoadingLocations(true);
        setLocationError(null);
        try {
            const userToken = await getToken();
            if (!userToken) {
                setLocationError('Authentication required');
                return;
            }

            const response = await axios.get(`${config.endpoint}/map/user/pins/all`, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.data.success) {
                const formattedLocations = response.data.data.map((pin: any) => ({
                    id: pin.pinID,
                    name: pin.pinName,
                    building: pin.buildingName,
                    description: pin.pinDescription
                }));
                setLocations(formattedLocations);
            } else {
                setLocationError('Failed to fetch locations');
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocationError('Failed to load locations. Please try again.');
        } finally {
            setIsLoadingLocations(false);
        }
    };

    const handleBack = () => {
        router.back();
    };

    const createPost = async () => {
        if (!selectedLocation) {
            Alert.alert('Error', 'Please select a location for your post');
            return;
        }

        if (!postText.trim() && selectedImages.length === 0) {
            Alert.alert('Error', 'Please add some text or images to your post');
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const userToken = await getToken();
            if (!userToken) {
                setSubmitError('Authentication required');
                return;
            }

            const formData = new FormData();
            
            // Append caption if not empty
            if (postText.trim()) {
                formData.append('caption', postText.trim());
            }
            
            // Append location pinID
            formData.append('location', selectedLocation.id);

            // Append all media files
            selectedImages.forEach((uri, index) => {
                const filename = uri.split('/').pop() || `image${index}.jpg`;
                const match = /\.(\w+)$/.exec(filename);
                const type = match ? `image/${match[1]}` : 'image/jpeg';

                formData.append('media', {
                    uri,
                    name: filename,
                    type,
                } as any);
            });

            const response = await axios.post(`${config.endpoint}/post/create`, formData, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'Post created successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                setSubmitError('Failed to create post');
            }
        } catch (error: any) {
            console.error('Error creating post:', error);
            // Handle specific error cases from the backend
            if (error.response?.data?.message) {
                setSubmitError(error.response.data.message);
            } else if (error.response?.status === 404) {
                setSubmitError('Selected location is no longer available');
            } else if (error.response?.status === 400) {
                setSubmitError('Invalid location selected');
            } else {
                setSubmitError('Failed to create post. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => {
        createPost();
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImages([...selectedImages, ...result.assets.map(asset => asset.uri)]);
        }
    };

    const handleLocationSelect = (location: { id: string; name: string }) => {
        setSelectedLocation(location);
        setShowLocationModal(false);
    };

    const removeImage = (index: number) => {
        const newImages = [...selectedImages];
        newImages.splice(index, 1);
        setSelectedImages(newImages);
    };

    const ActionItem = ({ iconName, text, onPress }: { iconName: string; text: string; onPress: () => void }) => (
        <TouchableOpacity style={styles.actionItem} onPress={onPress}>
            <FontAwesome name={iconName as any} size={24} color={COLORS.blue1} style={styles.actionIcon} />
            <Text style={styles.actionText}>{text}</Text>
        </TouchableOpacity>
    );

    const isPostButtonDisabled = !postText.trim() && selectedImages.length === 0;

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <FontAwesomeIcon icon={faArrowLeft} size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create post</Text>
                <TouchableOpacity 
                    style={[
                        styles.nextButton, 
                        (isSubmitting || isPostButtonDisabled) && styles.nextButtonDisabled
                    ]} 
                    onPress={handleNext}
                    disabled={isSubmitting || isPostButtonDisabled}
                >
                    {isSubmitting ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                    ) : (
                        <Text style={[
                            styles.nextButtonText,
                            isPostButtonDisabled && styles.nextButtonTextDisabled
                        ]}>POST</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* User Info and Post Options */}
            <View style={styles.userInfoContainer}>
                {user?.avatar ? (
                    <Image source={{ uri: user.avatar }} style={styles.profileImage} />
                ) : (
                    <FontAwesomeIcon icon={faCircleUser} size={40} color={COLORS.blue1} />
                )}
                <View>
                    <Text style={styles.userName}>{user?.firstName} {user?.lastName}</Text>
                    <View style={styles.postOptionsRow}>
                        <TouchableOpacity 
                            style={styles.optionButton}
                            onPress={() => setShowLocationModal(true)}
                        >
                            <FontAwesomeIcon icon={faMapMarkerAlt} size={12} color={COLORS.darkGray} />
                            <Text style={styles.optionText}>
                                {selectedLocation?.name || 'Add Location'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Text Input Area */}
            <ScrollView style={styles.inputScrollView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Add post for announcement"
                    placeholderTextColor={COLORS.darkGray}
                    multiline
                    value={postText}
                    onChangeText={setPostText}
                />
                
                {/* Image List */}
                {selectedImages.length > 0 && (
                    <View style={styles.imageListContainer}>
                        <ScrollView 
                            horizontal 
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.imageListContent}
                        >
                            {selectedImages.map((uri, index) => (
                                <View key={index} style={styles.imageItem}>
                                    <Image source={{ uri }} style={styles.imagePreview} />
                                    <TouchableOpacity 
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <FontAwesome name="times-circle" size={24} color={COLORS.redIcon} />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}
            </ScrollView>

            {/* Bottom Action Sheet / Drawer */}
            <View style={styles.bottomSheet}>
                <TouchableOpacity style={styles.handleBarContainer} onPress={toggleDrawer}>
                    <View style={styles.handleBar} />
                    <FontAwesome
                        name={isDrawerOpen ? "chevron-down" : "chevron-up"}
                        size={16}
                        color={COLORS.blue1}
                        style={styles.drawerChevron}
                    />
                </TouchableOpacity>
                {isDrawerOpen && (
                    <>
                        <ActionItem iconName="photo" text="Photo" onPress={pickImage} />
                    </>
                )}
            </View>

            {/* Location Selection Modal */}
            <Modal
                visible={showLocationModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowLocationModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select Location</Text>
                        {isLoadingLocations ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={COLORS.blue1} />
                                <Text style={styles.loadingText}>Loading locations...</Text>
                            </View>
                        ) : locationError ? (
                            <View style={styles.errorContainer}>
                                <Text style={styles.errorText}>{locationError}</Text>
                                <TouchableOpacity 
                                    style={styles.retryButton}
                                    onPress={fetchLocations}
                                >
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <>
                                <View style={styles.searchContainer}>
                                    <FontAwesome name="search" size={16} color={COLORS.darkGray} style={styles.searchIcon} />
                                    <TextInput
                                        style={styles.searchInput}
                                        placeholder="Search locations..."
                                        placeholderTextColor={COLORS.darkGray}
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                    />
                                    {searchQuery.length > 0 && (
                                        <TouchableOpacity 
                                            onPress={() => setSearchQuery('')}
                                            style={styles.clearButton}
                                        >
                                            <FontAwesome name="times-circle" size={16} color={COLORS.darkGray} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <ScrollView style={styles.locationList}>
                                    {filteredLocations.map((location) => (
                                        <TouchableOpacity
                                            key={location.id}
                                            style={styles.locationItem}
                                            onPress={() => handleLocationSelect(location)}
                                        >
                                            <FontAwesomeIcon icon={faMapMarkerAlt} size={20} color={COLORS.blue1} />
                                            <View style={styles.locationTextContainer}>
                                                <Text style={styles.locationName}>{location.name}</Text>
                                                <Text style={styles.locationDescription}>{location.building}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    ))}
                                    {filteredLocations.length === 0 && (
                                        <View style={styles.noResultsContainer}>
                                            <Text style={styles.noResultsText}>No locations found</Text>
                                        </View>
                                    )}
                                </ScrollView>
                            </>
                        )}
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShowLocationModal(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {submitError && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorBannerText}>{submitError}</Text>
                </View>
            )}
        </View>
    );
};

/**
 * StyleSheet for the NewPost component.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        backgroundColor: COLORS.white, 
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.black,
    },
    nextButton: {
        backgroundColor: COLORS.blue1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    nextButtonText: {
        color: COLORS.white,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 4,
    },
    postOptionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionButton: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: COLORS.lightGray,
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 15,
       marginRight: 8,
    },
    optionText: {
        fontSize: 12,
        color: COLORS.darkGray,
        marginLeft: 4,
        marginRight: 4,
        fontFamily: 'Montserrat-Regular',
    },
    inputScrollView: {
        flex: 1, 
        paddingHorizontal: 15,
    },
    textInput: {
        fontSize: 20, 
        color: COLORS.black,
        paddingTop: 10, 
        minHeight: 100, 
        fontFamily: 'Montserrat-Regular',
    },
    bottomSheet: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingBottom: 20, 
        backgroundColor: COLORS.white, 
    },
    handleBarContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: COLORS.lightGray,
        borderRadius: 2.5,
    },
    drawerChevron: {
        position: 'absolute',
        right: 15,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    actionIcon: {
        width: 30,
        textAlign: 'center',
    },
    actionText: {
        marginLeft: 15,
        fontSize: 16,
        color: COLORS.black,
        fontFamily: 'Montserrat-Regular',
    },
    imageListContainer: {
        marginTop: 15,
        marginBottom: 15,
    },
    imageListContent: {
        paddingHorizontal: 15,
    },
    imageItem: {
        marginRight: 10,
        position: 'relative',
    },
    imagePreview: {
        width: 200,
        height: 200,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 12,
        padding: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.black,
        marginBottom: 15,
        textAlign: 'center',
    },
    locationList: {
        maxHeight: 400,
    },
    locationItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
    },
    locationTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    locationName: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.black,
    },
    locationDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.darkGray,
        marginTop: 2,
    },
    closeButton: {
        backgroundColor: COLORS.blue1,
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
    },
    closeButtonText: {
        color: COLORS.white,
        textAlign: 'center',
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: COLORS.darkGray,
        fontFamily: 'Montserrat-Regular',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: COLORS.redIcon,
        fontFamily: 'Montserrat-Regular',
        textAlign: 'center',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: COLORS.blue1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: COLORS.white,
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.lightGray,
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 15,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.black,
    },
    clearButton: {
        padding: 4,
    },
    noResultsContainer: {
        padding: 20,
        alignItems: 'center',
    },
    noResultsText: {
        fontSize: 16,
        color: COLORS.darkGray,
        fontFamily: 'Montserrat-Regular',
    },
    nextButtonDisabled: {
        opacity: 0.5,
        backgroundColor: COLORS.lightGray,
    },
    nextButtonTextDisabled: {
        color: COLORS.darkGray,
    },
    errorBanner: {
        backgroundColor: COLORS.redIcon,
        padding: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    errorBannerText: {
        color: COLORS.white,
        textAlign: 'center',
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
    },
});

export default NewPost;
