// REACT
import React from 'react';
import { useState, useEffect, useMemo } from 'react';

// REACT NATIVE
import Animated from 'react-native-reanimated';
import { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// COMPONENTS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import { StyleSheet, View, Text, Image, TextInput, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { faMicrophone, faLocationArrow, faExpand, faCompress, faChevronUp, faChevronDown, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

// CONSTANTS
const COLORS = {
  pmy: {
    white: '#F6F6F6',
    blue1: '#2B4F6E',
  },
};

// AXIOS
import axios from 'axios';

// HOOKS
import { config } from '@/app/lib/config';
import { useLoading } from '@/app/lib/load-context';
import { getToken } from '@/app/lib/secure-store';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';

/**
 * Index Component
 * 
 * @component
 * @description Main map view interface for building navigation with interactive floor plans.
 * Features gesture controls for map manipulation, floor selection, and location search.
 *
 * @features
 * - Interactive map with gesture controls:
 *   - Pinch to zoom (scale: 0.1 to 3x)
 *   - Pan to move
 *   - Two-finger rotation
 * - Floor selection system:
 *   - Quick floor switching
 *   - Modal-based floor picker
 *   - Automatic map data fetching
 * - Search interface:
 *   - Search bar with voice input option
 *   - Building name display
 * - Map controls:
 *   - Expand/Compress buttons
 *   - Location arrow for navigation
 *
 * @gestures
 * - Pinch: Zoom in/out with scale limits
 * - Pan: Drag the map with position memory
 * - Rotate: Two-finger rotation with radian calculation
 *
 * @api
 * - Fetches map data from server using authenticated requests
 * - Handles floor-specific map images
 *
 * @returns {React.ReactElement} The rendered Index component
 */

export default function Index(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');

  const [isFloorMenuVisible, setFloorMenuVisible] = useState<boolean>(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [currentFloor, setCurrentFloor] = useState(1);

  const { setLoading } = useLoading();

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [pois, setPois] = useState<any[]>([]);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [naturalImageSize, setNaturalImageSize] = useState({ width: 0, height: 0 });

  // Gesture shared values
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  /**
   * Animated style for map transformations
   * Combines scale, translation, and rotation
   */
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}rad` },
    ],
  }));

  const [buildingName, setBuildingName] = useState<string>();
  const [floorData, setFloorData] = useState<any[]>([]);

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

  const getMapData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/map/user/building/load`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (!response.data.success) {
        console.error('Failed to load building data.');
        return;
      }

      const buildings = response.data.buildings;

      if (buildings && buildings.length > 0) {
        const currentBuilding = buildings[0];
        const { buildingID, buildingName, floors } = currentBuilding;
        setBuildingName(buildingName);
        setFloorData(floors);

        // Only set initial floor if no floor is currently selected
        if (!selectedFloor && floors && floors.length > 0) {
          setSelectedFloor(floors[0].floorName);
          setCurrentFloor(floors[0].floorNumber);
          await loadFloorData(floors[0].floorID);
        }
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }

  const loadFloorData = async (floorID: string) => {
    try {
      const response = await axios.get(`${config.endpoint}/map/user/building/${floorID}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (response.data.success) {
        const { floorImage, pois } = response.data.floor;
        setCurrentImage(floorImage);
        setPois(pois);
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = Math.max(0.1, Math.min(event.scale, 3));
  });

  // Pan Gesture (Drag)
  const panGesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = offsetX.value + event.translationX;
    translateY.value = offsetY.value + event.translationY;
  }).onEnd(() => {
    offsetX.value = translateX.value;
    offsetY.value = translateY.value;
  });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = event.rotation;
    });

  const gesture = Gesture.Simultaneous(pinchGesture, panGesture, rotateGesture);

  // Handle Floor Change & Reset Zoom/Pan
  const handleFloorChange = async (floorNumber: number) => {
    setCurrentFloor(floorNumber);
    scale.value = withTiming(1);
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    rotation.value = withTiming(0);

    // Find the floor ID for the selected floor number
    const selectedFloorData = floorData.find(floor => floor.floorNumber === floorNumber);
    if (selectedFloorData) {
      await loadFloorData(selectedFloorData.floorID);
    }
  };

  useEffect(() => {
    getMapData();
  }, []);

  // Update floor selection when floorData changes
  useEffect(() => {
    if (floorData.length > 0 && !selectedFloor) {
      setSelectedFloor(floorData[0].floorName);
      setCurrentFloor(floorData[0].floorNumber);
      loadFloorData(floorData[0].floorID);
    }
  }, [floorData]);

  const onImageLayout = (event: any) => {
    const { width, height } = event.nativeEvent.layout;
    setImageDimensions({ width, height });
  };

  useEffect(() => {
    if (currentImage) {
      Image.getSize(currentImage, (width, height) => {
        setNaturalImageSize({ width, height });
      });
    }
  }, [currentImage]);

  const getDisplayedImageLayout = () => {
    const { width: cW, height: cH } = imageDimensions;
    const { width: iW, height: iH } = naturalImageSize;
    if (!cW || !cH || !iW || !iH) return { x: 0, y: 0, width: 0, height: 0 };

    const scale = Math.min(cW / iW, cH / iH);
    const displayedWidth = iW * scale;
    const displayedHeight = iH * scale;
    const offsetX = (cW - displayedWidth) / 2;
    const offsetY = (cH - displayedHeight) / 2;
    return { x: offsetX, y: offsetY, width: displayedWidth, height: displayedHeight };
  };

  const calculatePoiPosition = (xPercent: number, yPercent: number) => {
    const { x, y, width, height } = getDisplayedImageLayout();
    return {
      x: x + (xPercent / 100) * width,
      y: y + (yPercent / 100) * height,
    };
  };

  // Animated style for keeping POI labels upright
  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${-rotation.value}rad` }, // Counter-rotate to stay upright
    ],
  }));

  // Zoom limits
  const MIN_ZOOM = 0.5;
  const MAX_ZOOM = 3;

  // Navigation control functions
  const handleZoomIn = () => {
    scale.value = withTiming(Math.min(scale.value * 1.2, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    scale.value = withTiming(Math.max(scale.value / 1.2, MIN_ZOOM));
  };

  const handleCenter = () => {
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
  };

  /**
   * Navigate to the search function screen
   */
  const handleSearchPress = () => {
    router.push('/(root)/maps/searchbox-function-screen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.pmy.white} />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 100}
      >
        <View style={styles.mainContainer}>
          <View style={styles.contentContainer}>
            {/* Search Bar */}
            <TouchableOpacity 
              style={styles.searchBarContainer}
              onPress={handleSearchPress}
            >
              <FontAwesomeIcon icon={faSearch} size={20} color={COLORS.pmy.white} style={styles.searchIcon} />
              <Text style={styles.searchInput}>Try searching for a room...</Text>
              <FontAwesomeIcon icon={faMicrophone} size={20} color={COLORS.pmy.white} style={styles.searchIcon} />
            </TouchableOpacity>
            {/* Building Name */}
            <Text style={styles.buildingTitle}>{buildingName}</Text>
            {/* Map Area with Gesture Handlers */}
            <GestureHandlerRootView style={styles.mapContainer}>
              <GestureDetector gesture={gesture}>
                <Animated.View style={[animatedStyle]}>
                  {currentImage && (
                    <>
                      <Image source={{ uri: currentImage }} style={{ height: '100%', width: '100%' }} resizeMode='contain' onLayout={onImageLayout} />
                      {pois.map((poi) => {
                        const position = calculatePoiPosition(poi.coordinates.x, poi.coordinates.y);
                        return (
                          <View key={poi._id} style={[ styles.poiContainer, { left: position.x, top: position.y, }]}>
                            <View style={styles.poiMarker} />
                            <Animated.View style={[styles.poiLabelContainer, labelAnimatedStyle]}>
                              <Text style={styles.poiLabel} numberOfLines={2}>{poi.details.pinName}</Text>
                            </Animated.View>
                          </View>
                        );
                      })}
                    </>
                  )}
                </Animated.View>
              </GestureDetector>
            </GestureHandlerRootView>
            {/* Navigation Controls */}
            <View style={styles.navigationControls}>
              <TouchableOpacity style={styles.controlButton} onPress={handleZoomIn}>
                <FontAwesomeIcon icon={faExpand} color={COLORS.pmy.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleCenter}>
                <FontAwesomeIcon icon={faLocationArrow} color={COLORS.pmy.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.controlButton} onPress={handleZoomOut}>
                <FontAwesomeIcon icon={faCompress} color={COLORS.pmy.white} />
              </TouchableOpacity>
            </View>
            {/* Floor Selector */}
            <TouchableOpacity style={styles.floorSelector} onPress={() => setFloorMenuVisible(!isFloorMenuVisible)}>
              <Text style={styles.floorText}>{selectedFloor} <FontAwesomeIcon icon={isFloorMenuVisible ? faChevronUp : faChevronDown} color={COLORS.pmy.white} /></Text>
            </TouchableOpacity>
            {/* Floor Dropdown */}
            {isFloorMenuVisible && (
              <View style={styles.dropdownContainer}>
                <View style={styles.dropdownContent}>
                  {floorData.map((floor) => (
                    <TouchableOpacity
                      key={floor.floorID}
                      style={[styles.floorOption, selectedFloor === floor.floorName && styles.selectedFloorOption]}
                      onPress={() => {
                        setFloorMenuVisible(false);
                        setSelectedFloor(floor.floorName);
                        setCurrentFloor(floor.floorNumber);
                        handleFloorChange(floor.floorNumber);
                      }}
                    >
                      <Text style={[styles.floorOptionText, selectedFloor === floor.floorName && styles.selectedFloorOptionText]}>
                        {floor.floorName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * @constant styles
 * @description StyleSheet for the Index component
 * 
 * @property {Object} floorSelector - Floor selection buttons container
 * @property {Object} activeButton - Active floor button styling
 * @property {Object} buttonText - Floor button text styling
 * @property {Object} container - Main container layout
 * @property {Object} searchContainer - Search bar positioning
 * @property {Object} searchBar - Search bar styling with blue background
 * @property {Object} searchInput - Search input text styling
 * @property {Object} buildingName - Building title text styling
 * @property {Object} mapControls - Map control buttons container
 * @property {Object} controlButton - Individual control button styling
 * @property {Object} floorButton - Floor selector button styling
 * @property {Object} floorText - Floor text styling
 * @property {Object} modalOverlay - Floor menu modal overlay
 * @property {Object} floorMenu - Floor menu popup styling
 * @property {Object} floorOption - Floor option button styling
 * @property {Object} floorOptionText - Floor option text styling
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mainContainer: {
    flex: 1,
    position: 'relative',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  searchBarContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    height: 50,
    backgroundColor: '#2B4F6E',
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    zIndex: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: '#D9D9D9',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    textAlignVertical: 'center',
    paddingTop: 1.5,
  },
  buildingTitle: {
    position: 'absolute',
    top: 70,
    left: 10,
    fontSize: 20,
    color: '#2B4F6E',
    zIndex: 5,
    fontFamily: 'Montserrat-Bold',
  },
  mapContainer: {
    flex: 1,
    marginTop: 100,
  },
  mapContent: {
    flex: 1,
  },
  placeholderMap: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  navigationControls: {
    position: 'absolute',
    right: 10,
    top: '40%',
    alignItems: 'center',
    zIndex: 5,
  },
  floorSelector: {
    position: 'absolute',
    right: 10,
    bottom: 70,
    backgroundColor: '#2B4F6E',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 5,
  },
  floorText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  controlButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2B4F6E',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    right: 10,
    bottom: 120,
    width: '40%',
    zIndex: 10,
  },
  dropdownContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floorOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedFloorOption: {
    backgroundColor: '#2B4F6E',
  },
  floorOptionText: {
    fontSize: 16,
    color: '#333333',
    fontFamily: 'Montserrat-Regular',
  },
  selectedFloorOptionText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
  },
  poiContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
  },
  poiLabelContainer: {
    backgroundColor: '#2B4F6E',
    borderRadius: 4,
    paddingVertical: 2,
    paddingHorizontal: 4,
    position: 'absolute',
    top: 5, // Position at top of container
  },
  poiLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    flexShrink: 1, // Allow text to shrink if needed
    flexWrap: 'wrap', // Allow text to wrap
    fontFamily: 'Montserrat-Regular',
  },
  poiMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
    position: 'absolute', // Position in center of container
  },
});