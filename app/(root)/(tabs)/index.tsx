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

// CONSTANTS
const COLORS = {
  pmy: {
    white: '#F6F6F6',
    blue1: '#2B4F6E',
  },
};

// CONSTANT
//import COLORS from '@/app/constants/colors';
import Toast from 'react-native-toast-message';

// AXIOS
import axios from 'axios';

// HOOKS
import { config } from '@/app/lib/config';
import { useLoading } from '@/app/lib/load-context';
import { getToken } from '@/app/lib/secure-store';
/**
 * Index screen component for a building navigation view.
 * Includes a search bar, map control buttons, and a dropdown to switch between building floors.
 *
 * @component
 * @returns {JSX.Element} The rendered index screen layout.
 *
 * @features
 * - Search bar with microphone icon (functionality can be expanded).
 * - Map control buttons: Expand, Locate, and Compress.
 * - Floor selector with modal-based dropdown.
 * - Responsive layout using absolute positioning and FlatList.
 *
 * @example
 * // Include in a navigator screen
 * <Index />
 *
 * @note
 * FontAwesome icons and custom Montserrat fonts are used for styling consistency.
 */

export default function Index() {
  const [isFloorMenuVisible, setFloorMenuVisible] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState("Floor 1");

  const floors = ["Floor 1", "Floor 2", "Floor 3", "Floor 4", "Floor 5"];

  const selectFloor = (floor: string) => {
    setSelectedFloor(floor);
    setFloorMenuVisible(false);
  };

  const handleMicrophonePress = () => {
    //add function for mic
  };

  const { setLoading } = useLoading();

  const [currentImage, setCurrentImage] = useState(null);
  const [currentFloor, setCurrentFloor] = useState(0);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}rad` }, // Rotation in radians
    ],
  }));

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

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      // Reset translation when starting a pinch
      offsetX.value = translateX.value;
      offsetY.value = translateY.value;
    })
    .onUpdate((event) => {
      scale.value = Math.max(0.1, Math.min(event.scale, 3));
    });

  // Pan Gesture (Drag)
  const panGesture = Gesture.Pan()
    .onStart(() => {
      // Reset scale when starting a pan
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

  // Rotation Gesture (Two-Finger Rotate)
  const rotateGesture = Gesture.Rotation()
    .onUpdate((event) => {
      rotation.value = event.rotation;
    });

  // Combine Gestures
  const gesture = useMemo(() => Gesture.Simultaneous(pinchGesture, panGesture, rotateGesture), [pinchGesture, panGesture, rotateGesture]);

  // Handle Floor Change & Reset Zoom/Pan
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
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <FontAwesomeIcon icon={faMagnifyingGlass} size={16} color="white" />
          <TextInput style={[styles.searchInput, { fontFamily: 'Montserrat-Regular' }]} placeholder ="Try searching for a room" placeholderTextColor="white"/>
          <TouchableOpacity onPress={handleMicrophonePress}>
            <FontAwesomeIcon icon={faMicrophone} size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

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