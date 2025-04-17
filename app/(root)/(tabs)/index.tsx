// REACT
import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';

// REACT NATIVE
import Animated from 'react-native-reanimated';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// COMPONENTS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GestureHandlerRootView, PinchGestureHandler, PanGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";
import { showErrorToast } from '@/app/components/toast-config';
import { StyleSheet, View, Text, Image, TextInput, StatusBar, TouchableOpacity, Modal, FlatList } from 'react-native';
import { faMagnifyingGlass, faMicrophone, faMapMarkerAlt, faCloud, faUser, faComment, faLocationArrow, faExpand, faCompress, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

// CONSTANTS
const COLORS = {
  pmy: {
    white: '#F6F6F6',
    blue1: '#2B4F6E',
  },
};

// CONSTANT
import Toast from 'react-native-toast-message';

// AXIOS
import axios from 'axios';

// HOOKS
import { config } from '@/app/lib/config';
import { useLoading } from '@/app/lib/load-context';
import { getToken } from '@/app/lib/secure-store';

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
export default function Index() {
  const [isFloorMenuVisible, setFloorMenuVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("Floor 1");
  const floors = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];

  /**
   * Updates the selected floor and closes the floor menu
   * @param {string} floor - The floor identifier to select
   */
  const selectFloor = (floor: string) => {
    setSelectedFloor(floor);
    setFloorMenuVisible(false);
  };

  /**
   * Handles microphone button press for voice input
   * @todo Implement voice input functionality
   */
  const handleMicrophonePress = () => {
    //add function for mic
  };

  const { setLoading } = useLoading();
  const [currentImage, setCurrentImage] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(0);

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

  /**
   * Fetches map data for a specific floor
   * @param {number} floor - The floor number to fetch
   */
  const getMapData = async (floor: number) => {
    setLoading(true);
    try {
      const response = await axios.get(`${config.endpoint}/map/get-map?name=old_building&floor=${floor}`, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      if (!response.data.success) return;
      setCurrentImage(response.data.mapImage);
    } catch (error: any) {
      console.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  }

  // Gesture Handlers
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(0.1, Math.min(event.scale, 3));
    });

  const panGesture = Gesture.Pan()
    .onStart(() => {
      scale.value = withSpring(1);
    })
    .onUpdate((event) => {
      translateX.value = offsetX.value + event.translationX;
      translateY.value = offsetY.value + event.translationY;
    })
    .onEnd(() => {
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = event.rotation;
    });

  const gesture = useMemo(() => Gesture.Simultaneous(pinchGesture, panGesture, rotateGesture), [pinchGesture, panGesture, rotateGesture]);

  /**
   * Handles floor change and resets map transformations
   * @param {number} floor - The floor number to switch to
   */
  const handleFloorChange = (floor: number) => {
    setCurrentFloor(floor);
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotation.value = 0;
    getMapData(floor);
  };

  useEffect(() => {
    getMapData(1);
  }, []);

  const router = useRouter();

  return (
    <>
          <GestureHandlerRootView style={{ flex: 1 }} >
      <StatusBar barStyle="dark-content" backgroundColor={'#F0F0F0'} />
      <GestureDetector gesture={gesture}>
        <Animated.View style={[animatedStyle]}>
          <Image source={{ uri: currentImage! }} style={{ height: '100%', width: '100%' }} resizeMode="contain" />
        </Animated.View>
      </GestureDetector>
      <View style={styles.floorSelector}>
        <TouchableOpacity style={[styles.floorButton]} onPress={() => handleFloorChange(1)}>
          <Text style={styles.buttonText}>Floor 1</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floorButton]} onPress={() => handleFloorChange(1.5)}>
          <Text style={styles.buttonText}>Floor 1.5</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.floorButton]} onPress={() => handleFloorChange(2)}>
          <Text style={styles.buttonText}>Floor 2</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/** SEARCH BAR */}
<TouchableOpacity 
  style={styles.searchContainer} 
  onPress={() => { router.push('/(root)/maps/searchbox-function-screen'); }}
>
  <View style={styles.searchBar}>
    <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="white" />
    <Text style={[styles.searchInput, { fontFamily: 'Montserrat-Regular', color: 'white' }]}>
      Try searching for a room
    </Text>
    <TouchableOpacity onPress={handleMicrophonePress}>
      <FontAwesomeIcon icon={faMicrophone} size={16} color="white" />
    </TouchableOpacity>
  </View>
</TouchableOpacity>
      {/** BUILDING NAME */}
      <Text style={styles.buildingName}>Old Building</Text>

      {/** LOCATION BUTTONS */}
      <View style={styles.mapControls}>
        <TouchableOpacity style={styles.controlButton}>
          <FontAwesomeIcon icon={faExpand} size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <FontAwesomeIcon icon={faLocationArrow} size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton}>
          <FontAwesomeIcon icon={faCompress} size={18} color="white" />
        </TouchableOpacity>
      </View>

      {/** FLOOR SELECTOR - DROPDOWN MENU */}
      <TouchableOpacity 
        style={styles.floorButton} 
        onPress={() => setFloorMenuVisible(!isFloorMenuVisible)}
      >
        <Text style={styles.floorText}>
          {selectedFloor} <FontAwesomeIcon icon={isFloorMenuVisible ? faChevronDown : faChevronUp} size={14} color="white" />
        </Text>
      </TouchableOpacity>

      {/** FLOOR DROPDOWN MODAL */}
      <Modal
        transparent
        visible={isFloorMenuVisible}
        animationType="fade"
        onRequestClose={() => setFloorMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          onPress={() => setFloorMenuVisible(false)}
        />
        <View style={styles.floorMenu}>
          <FlatList
            data={floors}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.floorOption} onPress={() => selectFloor(item)}>
                <Text style={styles.floorOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
    </>
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
  floorSelector: {
    position: "absolute",
    top: 30,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },

  activeButton: {
    backgroundColor: "#005BBB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  container: { 
    flex: 1, 
    backgroundColor: COLORS.pmy.white 
  },

  searchContainer: { 
    position: 'absolute', 
    top: 10, 
    left: 10, 
    right: 10, 
    zIndex: 1
  },

  searchBar: { 
    backgroundColor: COLORS.pmy.blue1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderRadius: 20
  },

  searchInput: { 
    flex: 1, 
    color: 'white', 
    marginLeft: 10 
  },

  buildingName: { 
    fontSize: 18, 
    fontFamily: 'Montserrat-Bold',
    marginLeft: 10, 
    marginTop: 80, 
    color: COLORS.pmy.blue1 
  },

  mapControls: { 
    position: 'absolute', 
    right: 10, 
    top: '45%', 
    zIndex: 1 
  },

  controlButton: { 
    backgroundColor: COLORS.pmy.blue1, 
    padding: 10, 
    borderRadius: 8, 
    marginVertical: 5 
  },

  floorButton: { 
    position: 'absolute',
    bottom: 0, 
    right: 10, 
    backgroundColor: COLORS.pmy.blue1, 
    padding: 10, 
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  floorText: { 
    color: 'white', 
    fontFamily: 'Montserrat-Bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  floorMenu: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },

  floorOption: {
    padding: 10,
  },

  floorOptionText: {
    fontSize: 16,
    color: COLORS.pmy.blue1,
    fontFamily: 'Montserrat-Bold',
  },
});