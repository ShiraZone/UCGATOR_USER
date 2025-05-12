import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Modal, Animated, Easing, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faRestroom, faGear, faTrash, faPlus, faFire, faClock } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import { useStopPoints } from '../../context/StopPointsContext';
import axios from 'axios';
import { config } from '@/app/lib/config';
import { getToken } from '@/app/lib/secure-store';

/**
 * AnimatedCheckmark Component (Copied from update-preferences.tsx)
 */
const AnimatedCheckmark = () => {
  const animation = useRef(new Animated.Value(0)).current;
  const AnimatedPath = Animated.createAnimatedComponent(Path);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
    // Simplified: Just draw once, don't loop or fade out for this modal
  }, []);

  const animatedStrokeDashoffset = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 0], // Assuming path length is 80
  });

  return (
    <Svg width="50" height="50" viewBox="0 0 50 50">
      <AnimatedPath
        d="M10 25 L20 35 L40 15" // Standard checkmark path
        stroke="#3D73A6"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        strokeDasharray={80} // Assuming path length is 80
        strokeDashoffset={animatedStrokeDashoffset}
      />
    </Svg>
  );
};

/**
 * SearchboxFunctionScreen Component
 * 
 * @component
 * @description A search interface for finding locations within the campus.
 * Features a search bar, quick access shortcuts, and recent search history.
 *
 * @features
 * - Search bar with back navigation
 * - Quick access shortcuts for common locations
 * - Recent search history display
 * - Category-based icons for different location types
 *
 * @navigation
 * - Back button returns to previous screen
 * - Shortcuts provide quick access to common destinations
 *
 * @returns {React.ReactElement} The rendered SearchboxFunctionScreen component
 */

const SearchboxFunctionScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ source?: string }>();
  const { addStopPoint } = useStopPoints();
  const [isStopPoints, setIsStopPoints] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [addedLocation, setAddedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // State for popular and recent searches
  const [popularSearches, setPopularSearches] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Ref to track fetch attempts and prevent excessive retries
  const fetchAttemptsRef = useRef(0);

  // Sample locations data for stop points view
  const sampleLocations = [
    { id: '1', name: 'Library' },
    { id: '2', name: 'Student Center' },
    { id: '3', name: 'Cafeteria' },
    { id: '4', name: 'Admin Building' },
  ];

  /**
   * Fetches popular and recent searches from the API
   */
  const fetchSearchData = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      if (!token) {
        console.error('No token available');
        setIsLoading(false);
        return;
      }

      try {
        // Fetch popular searches (limit to top 3)
        const popularResponse = await axios.get(
          `${config.endpoint}/search/popular?limit=3`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (popularResponse.data.success) {
          setPopularSearches(popularResponse.data.data);
        }
      } catch (popularError: any) {
        console.error('Error fetching popular searches:', popularError.response.data.error);
        // Set empty popular searches to prevent undefined errors
        setPopularSearches([]);
      }

      try {
        // Fetch user's recent searches
        const recentResponse = await axios.get(
          `${config.endpoint}/search/recent?limit=5`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (recentResponse.data.success) {
          setRecentSearches(recentResponse.data.data);
        }
      } catch (recentError: any) {
        console.error('Error fetching recent searches:', recentError.response.data.error);
        // Set empty recent searches to prevent undefined errors
        setRecentSearches([]);
      }

    } catch (error: any) {
      console.error('General error in fetchSearchData:', error.message);
      // Initialize with empty arrays in case of errors
      setPopularSearches([]);
      setRecentSearches([]);
    } finally {
      setIsLoading(false);
    }
  };
  /**
 * Handles performing a search and navigating to results
 */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const token = await getToken();
      // Navigate back to the map and pass the search query as a parameter
      router.replace({
        pathname: '/(root)/(tabs)',
        params: {
          search: searchQuery.trim(),
        }
      });
    } catch (error: any) {
      console.error('Search error:', error.message);
      throw new Error(error);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handles clicking a search item (popular or recent)
   */
  const handleSearchItemClick = (query: string, pinType?: string) => {
    // Navigate back to the map and pass the search query as a parameter
    router.replace({
      pathname: '/(root)/(tabs)',
      params: {
        search: query,
        pinType: pinType || '',
      }
    });
  };

  /**
   * Handles adding a location as a stop point.
   * Sets the location name and shows the confirmation modal.
   * @param locationName The name of the location being added.
   */
  const handleAddStopPoint = (locationName: string) => {
    setAddedLocation(locationName);
    setShowModal(true);
  };

  /**
   * Handles closing the modal and navigating back.
   */
  const handleModalOk = () => {
    setShowModal(false);
    if (addedLocation) {
      addStopPoint(addedLocation);
      router.back();
    }
    setAddedLocation(null);
  }; useEffect(() => {
    console.log('SearchboxFunctionScreen local params:', params);
    if (params.source === 'stopPoints') {
      setIsStopPoints(true);
    } else if (fetchAttemptsRef.current < 2) { // Limit to 2 attempts
      // Increment fetch attempt counter
      fetchAttemptsRef.current += 1;
      // Fetch popular and recent searches
      fetchSearchData();
    }
  }, [params.source]); // Only depend on params.source, not the entire params object

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoFocus
          />
          {isSearching ? (
            <ActivityIndicator size="small" color="#2B4F6E" style={styles.searchIcon} />
          ) : (
            searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchIcon}>
                <Ionicons name="close-circle" size={20} color="#666" />
              </TouchableOpacity>
            ) : null
          )}
        </View>
      </View>

      {isStopPoints ? (
        // Render only locations and search box for stop points
        <View style={styles.locationsContainer}>
          <Text style={styles.locationsTitle}>Recent Stop Points</Text>
          <ScrollView>
            {sampleLocations.map((location) => (
              <View key={location.id} style={styles.locationItemContainer}>
                <Text style={styles.locationText}>{location.name}</Text>
                <TouchableOpacity
                  style={styles.addLocationButton}
                  onPress={() => handleAddStopPoint(location.name)}
                >
                  <FontAwesomeIcon icon={faPlus} size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        // Original content
        <>
          {/* Shortcut Buttons */}
          <View style={styles.shortcutsOuterContainer}>
            <View style={styles.shortcutsContainer}>
              <Shortcut icon={faUtensils} label="Canteen" />
              <Shortcut icon={faRestroom} label="CR" />
              <Shortcut icon={faGear} label="Services" />
              <Shortcut icon={faTrash} label="CR" />
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          ) : (
            <>
              {/* Popular Searches Section */}
              {popularSearches.length > 0 && (
                <>
                  <View style={styles.sectionHeaderContainer}>
                    <FontAwesomeIcon icon={faFire} size={16} color="#fff" />
                    <Text style={styles.sectionHeaderText}>Popular Searches</Text>
                  </View>
                  <View>
                    {popularSearches.map((item, index) => (
                      <TouchableOpacity
                        style={styles.searchItem}
                        key={`popular-${index}`}
                        onPress={() => handleSearchItemClick(item.query, item.pinType)}
                      >
                        <FontAwesomeIcon icon={faFire} size={16} color="#FFC107" style={styles.searchItemIcon} />
                        <View style={styles.searchItemTextContainer}>
                          <Text style={styles.searchItemText}>{item.query}</Text>
                          {item.pinType && (
                            <Text style={styles.searchItemSubtext}>{item.pinType}</Text>
                          )}
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}

              {/* Recent Searches Label */}
              <View style={styles.sectionHeaderContainer}>
                <FontAwesomeIcon icon={faClock} size={16} color="#fff" />
                <Text style={styles.sectionHeaderText}>Recent Searches</Text>
              </View>

              {/* Recent Searches List */}
              {recentSearches.length > 0 ? (
                <ScrollView>
                  {recentSearches.map((item, index) => (
                    <TouchableOpacity
                      style={styles.searchItem}
                      key={`recent-${index}`}
                      onPress={() => handleSearchItemClick(item.query, item.pinType)}
                    >
                      <Ionicons name="time-outline" size={20} color="#fff" style={styles.searchItemIcon} />
                      <View style={styles.searchItemTextContainer}>
                        <Text style={styles.searchItemText}>{item.query}</Text>
                        {item.pinType && (
                          <Text style={styles.searchItemSubtext}>{item.pinType}</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <Text style={styles.emptyText}>No recent searches</Text>
              )}
            </>
          )}
        </>
      )}

      {/* Success Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={handleModalOk}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              {showModal && <AnimatedCheckmark />}
            </View>
            <Text style={styles.modalTitle}>Success!</Text>
            <Text style={styles.modalText}>
              {addedLocation ? `'${addedLocation}' added as Stop Point Successfully` : 'Stop Point added successfully'}
            </Text>
            <TouchableOpacity style={styles.okButton} onPress={handleModalOk}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

/**
 * Shortcut Component
 * 
 * @component
 * @description Renders an individual shortcut button with an icon and label.
 * 
 * @param {Object} props - Component props
 * @param {IconDefinition} props.icon - FontAwesome icon to display
 * @param {string} props.label - Text label for the shortcut
 * @returns {React.ReactElement} The rendered Shortcut component
 */
const Shortcut = ({ icon, label }: { icon: any; label: string }) => {
  return (
    <TouchableOpacity style={styles.shortcut}>
      <View style={styles.shortcutIconContainer}>
        <FontAwesomeIcon icon={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.shortcutLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the SearchboxFunctionScreen component
 * 
 * @property {Object} container - Main container with background color
 * @property {Object} searchBarContainer - Container for search bar and back button
 * @property {Object} searchInputContainer - White container for search input
 * @property {Object} searchInput - Text input styling
 * @property {Object} shortcutsOuterContainer - Outer container for shortcuts section
 * @property {Object} shortcutsContainer - Grid container for shortcut buttons
 * @property {Object} shortcut - Individual shortcut button styling
 * @property {Object} shortcutIconContainer - Circle container for shortcut icons
 * @property {Object} shortcutLabel - Text styling for shortcut labels
 * @property {Object} recentText - "Recent" section header styling
 * @property {Object} historyContainer - Container for search history list
 * @property {Object} historyItem - Individual history item styling
 * @property {Object} historyIcon - Icon styling for history items
 * @property {Object} historyText - Text styling for history items
 * @property {Object} locationsContainer - Container for locations section
 * @property {Object} locationsTitle - Text styling for locations title
 * @property {Object} locationItemContainer - Styling for location items in stop points mode
 * @property {Object} locationText - Text styling for location names
 * @property {Object} addLocationButton - Styling for the add button
 * @property {Object} modalOverlay - Styling for the modal overlay
 * @property {Object} modalContent - Styling for the modal content
 * @property {Object} iconContainer - Styling for the checkmark icon container in modal
 * @property {Object} modalTitle - Styling for the modal title
 * @property {Object} modalText - Styling for the modal text
 * @property {Object} okButton - Styling for the OK button in modal
 * @property {Object} okButtonText - Text styling for the OK button text
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B4F6E',
    padding: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  searchIcon: {
    padding: 5,
  },
  shortcutsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  shortcut: {
    alignItems: 'center',
    width: 70,
  },
  shortcutIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3D73A6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  shortcutLabel: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Montserrat-Regular',
  },
  recentText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Montserrat-Bold',
  },
  historyContainer: {
    flex: 1,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  historyIcon: {
    marginRight: 10,
  },
  historyText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
  },
  shortcutsOuterContainer: {
    backgroundColor: '#2E5A84',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  locationsContainer: {
    padding: 16,
    flex: 1,
  },
  locationsTitle: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
  },
  locationItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  locationText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  addLocationButton: {
    padding: 5,
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
  }, okButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeaderText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    marginLeft: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchItemIcon: {
    marginRight: 12,
  },
  searchItemTextContainer: {
    flex: 1,
  },
  searchItemText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Montserrat-Regular',
  },
  searchItemSubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontFamily: 'Montserrat-Regular',
    marginTop: 2,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SearchboxFunctionScreen;