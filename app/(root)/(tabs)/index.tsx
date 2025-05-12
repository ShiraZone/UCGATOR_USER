// REACT
import React from 'react';
import { useState, useEffect, useMemo } from 'react';

// REACT NATIVE
import Animated from 'react-native-reanimated';
import { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

// COMPONENTS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GestureHandlerRootView, GestureDetector, Gesture } from "react-native-gesture-handler";
import { StyleSheet, View, Text, Image, Modal, StatusBar, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { faMicrophone, faLocationArrow, faExpand, faCompress, faChevronUp, faChevronDown, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

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

export default function Index(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [isFloorMenuVisible, setFloorMenuVisible] = useState<boolean>(false);
  const [selectedFloor, setSelectedFloor] = useState<string>("");
  const [currentFloor, setCurrentFloor] = useState(1);

  const { setLoading } = useLoading();
  const router = useRouter();
  const params = useLocalSearchParams<{ search?: string, pinType?: string }>();

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
   * Perform search for pins based on query and optional pin type
   * @param query The search query string
   * @param pinType Optional pin type filter
   */
  const performSearch = async (query: string, pinType?: string) => {
    if (!query.trim()) {
      setSearchQuery('');
      // Reset to show all pins
      if (currentImage) {
        const currentFloorData = floorData.find(floor => floor.floorNumber === currentFloor);
        if (currentFloorData) {
          loadFloorData(currentFloorData.floorID);
        }
      }
      return;
    }
    
    setIsSearching(true);
    setSearchQuery(query);
    
    try {
      const token = await getToken();
      
      if (!token) {
        console.error('No token available');
        return;
      }
      
      // Build the search URL with parameters
      let searchUrl = `${config.endpoint}/search/pins?query=${encodeURIComponent(query.trim())}`;
      if (pinType) {
        searchUrl += `&pinType=${encodeURIComponent(pinType)}`;
      }
      
      const response = await axios.get(searchUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSearchResults(response.data.data);
        
        // If there are search results, go to the first result's building and floor
        if (response.data.data.length > 0) {
          const firstResult = response.data.data[0];
          const buildingData = await loadBuildingData(firstResult.buildingID);
          
          if (buildingData) {
            // Find the floor data and load it
            const targetFloor = buildingData.floors.find(
              (f: any) => f.floorID === firstResult.floor?.id
            );
            
            if (targetFloor) {
              setSelectedFloor(targetFloor.floorName);
              setCurrentFloor(targetFloor.floorNumber);
              
              // Load floor data and filter pins based on search query
              await loadFloorData(targetFloor.floorID, query, pinType, firstResult);
            } else {
              // Floor not found, but we have the building - select first available floor
              if (buildingData.floors && buildingData.floors.length > 0) {
                const firstFloor = buildingData.floors[0];
                setSelectedFloor(firstFloor.floorName);
                setCurrentFloor(firstFloor.floorNumber);
                
                await loadFloorData(firstFloor.floorID, query, pinType);
              }
            }
          }
        } else {
          // No search results, but still filter current floor pins if applicable
          if (currentImage && floorData.length > 0) {
            const currentFloorData = floorData.find(floor => floor.floorNumber === currentFloor);
            if (currentFloorData) {
              loadFloorData(currentFloorData.floorID, query, pinType);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Search error:', error.response?.data?.message || error.message);
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Load building data
   * @param buildingId The ID of the building to load
   * @returns Building data object
   */  
  const loadBuildingData = async (buildingId: string) => {
    try {
      const token = await getToken();
      const response = await axios.get(`${config.endpoint}/map/user/building/${buildingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        return response.data.building;
      }
    } catch (error: any) {
      console.error('Error loading building:', error.response?.data?.error);
    }
    // If we can't load the specific building, try to load any available building as fallback
    try {
      const allBuildingsResponse = await axios.get(`${config.endpoint}/map/user/building/load`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      
      if (allBuildingsResponse.data.success && 
          allBuildingsResponse.data.buildings && 
          allBuildingsResponse.data.buildings.length > 0) {
        return allBuildingsResponse.data.buildings[0];
      }
    } catch (fallbackError) {
      console.error('Fallback building load failed:', fallbackError);
    }
    
    return null;
  };

  const getMapData = async () => {
    setLoading(true);
    const token = await getToken();

    if (!token) {
      return;
    }

    try {
      const response = await axios.get(`${config.endpoint}/map/user/building/load`, {
        headers: {
          Authorization: `Bearer ${token}`
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
        setFloorData(floors);      // Only set initial floor if no floor is currently selected
      if (!selectedFloor && floors && floors.length > 0) {
        setSelectedFloor(floors[0].floorName);
        setCurrentFloor(floors[0].floorNumber);
        await loadFloorData(floors[0].floorID, searchQuery);
      }
      }
    } catch (error: any) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  }  
  
  const loadFloorData = async (floorID: string, searchQuery?: string, pinType?: string, targetPin?: any) => {
    try {
      const response = await axios.get(`${config.endpoint}/map/user/building/${floorID}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (response.data.success) {
        const { floorImage, pois } = response.data.floor;
        setCurrentImage(floorImage);
        
        // If we have a search query, filter the pins
        if (searchQuery) {
          const filteredPois = pois.filter((poi: any) => {
            // Match pin name or description
            const nameMatch = poi.details.pinName.toLowerCase().includes(searchQuery.toLowerCase());
            const descriptionMatch = poi.details.pinDescription?.toLowerCase().includes(searchQuery.toLowerCase());
            const typeMatch = !pinType || poi.details.pinType?.toLowerCase() === pinType.toLowerCase();
            
            return (nameMatch || descriptionMatch) && typeMatch;
          });
          
          setPois(filteredPois);
          
          // If we have a target pin or filtered pins, focus on the first one
          if (filteredPois.length > 0) {
            // Find the pin to focus on - either the target pin or the first filtered pin
            const pinToFocus = targetPin ? 
              filteredPois.find((poi: any) => poi._id === targetPin._id) || filteredPois[0] : 
              filteredPois[0];
            
            // Wait for the image to load and layout to complete
            setTimeout(() => {
              if (pinToFocus && imageDimensions.width && imageDimensions.height) {
                // Calculate the position of the pin
                const position = calculatePoiPosition(pinToFocus.coordinates.x, pinToFocus.coordinates.y);
                
                // Calculate the center of the viewport
                const centerX = imageDimensions.width / 2;
                const centerY = imageDimensions.height / 2;
                
                // Calculate the translation needed to center the pin
                const targetTranslateX = centerX - position.x;
                const targetTranslateY = centerY - position.y;
                
                // Zoom in and center on the pin
                scale.value = withTiming(1.8);
                translateX.value = withTiming(targetTranslateX);
                translateY.value = withTiming(targetTranslateY);
                rotation.value = withTiming(0);
                
                // Update offset values
                offsetX.value = targetTranslateX;
                offsetY.value = targetTranslateY;
              }
            }, 300); // Small delay to ensure the image has been processed
          } else {
            // No matches found, reset the view
            scale.value = withTiming(1);
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            rotation.value = withTiming(0);
            offsetX.value = 0;
            offsetY.value = 0;
          }
        } else {
          // No search query, just show all pins
          setPois(pois);
          
          // Reset view
          scale.value = withTiming(1);
          translateX.value = withTiming(0);
          translateY.value = withTiming(0);
          rotation.value = withTiming(0);
          offsetX.value = 0;
          offsetY.value = 0;
        }
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
    if (selectedFloorData) {      // If there's an active search query, carry it over to the new floor
      if (searchQuery) {
        const pinType = params.pinType;
        await loadFloorData(selectedFloorData.floorID, searchQuery, pinType);
      } else {
        await loadFloorData(selectedFloorData.floorID);
      }
    }
  };

  useEffect(() => {
    getMapData();
  }, []);

  // Handle search params when navigating from search screen
  useEffect(() => {
    if (params.search) {
      performSearch(params.search, params.pinType);
    }
  }, [params.search, params.pinType]);

  // Update floor selection when floorData changes
  useEffect(() => {
    if (floorData.length > 0 && !selectedFloor) {
      setSelectedFloor(floorData[0].floorName);
      setCurrentFloor(floorData[0].floorNumber);
      loadFloorData(floorData[0].floorID, searchQuery);
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

  const handleTargetPin = (poiId: string) => {
    // Navigate to location details screen with the pin ID
    router.push({
      pathname: '/(root)/maps/location-details',
      params: { id: poiId }
    });
  }

  /**
   * Zoom and center on a specific pin
   * @param poi The pin to focus on
   */
  const focusOnPin = (poi: any) => {
    if (!poi || !imageDimensions.width || !imageDimensions.height) return;
    
    // Calculate the position of the POI in the map
    const position = calculatePoiPosition(poi.coordinates.x, poi.coordinates.y);
    
    // Calculate center offsets
    const centerX = imageDimensions.width / 2;
    const centerY = imageDimensions.height / 2;
    
    // Calculate the translation needed to center the POI
    const targetTranslateX = centerX - position.x;
    const targetTranslateY = centerY - position.y;
    
    // Zoom in slightly and center on the POI
    scale.value = withTiming(1.8);
    translateX.value = withTiming(targetTranslateX);
    translateY.value = withTiming(targetTranslateY);
    rotation.value = withTiming(0);
    
    // Update shared values offsets
    offsetX.value = targetTranslateX;
    offsetY.value = targetTranslateY;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      <View style={styles.mainContainer}>
        <View style={styles.contentContainer}>          
          {/* Search Bar */}          
          <TouchableOpacity style={styles.searchBarContainer} onPress={handleSearchPress}>
            <FontAwesomeIcon icon={faSearch} size={20} color={COLORS.pmy.white} style={styles.searchIcon} />
            <Text style={styles.searchInput}>{searchQuery || 'Try searching for a room...'}</Text>            
            {isSearching ? (
              <ActivityIndicator size="small" color={COLORS.pmy.white} style={styles.searchIcon} />
            ) : (
              searchQuery ? (
                <TouchableOpacity onPress={() => performSearch('')}>
                  <FontAwesomeIcon icon={faTimes} size={20} color={COLORS.pmy.white} style={styles.searchIcon} />
                </TouchableOpacity>
              ) : (
                <FontAwesomeIcon icon={faMicrophone} size={20} color={COLORS.pmy.white} style={styles.searchIcon} />
              )
            )}
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
                        <View key={poi._id} style={[styles.poiContainer, { left: position.x, top: position.y, }]}>
                          <View style={styles.poiMarker} />
                          <Animated.View style={[styles.poiLabelContainer, labelAnimatedStyle]}>
                            <TouchableOpacity onPress={() => handleTargetPin(poi._id)}>
                              <Text style={styles.poiLabel} numberOfLines={2}>{poi.details.pinName}</Text>
                            </TouchableOpacity>
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
            <View style={styles.floorSelectorContent}>
              <Text style={styles.floorText}>{selectedFloor}</Text>
              <FontAwesomeIcon icon={isFloorMenuVisible ? faChevronUp : faChevronDown} color={COLORS.pmy.white} />
            </View>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  floorSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  floorText: {
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginRight: 5,
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
    top: 5,
  },
  poiLabel: {
    color: '#FFFFFF',
    fontSize: 8,
    textAlign: 'center',
    flexShrink: 1,
    flexWrap: 'wrap',
    fontFamily: 'Montserrat-Regular',
  },
  poiMarker: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'red',
    position: 'absolute',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.pmy.white,
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
    position: 'relative'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.pmy.blue1,
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    padding: 10,
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.pmy.blue1,
  },
});