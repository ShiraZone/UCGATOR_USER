// REACT
import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';

// REACT NATIVE
import Animated from 'react-native-reanimated';
import { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

// COMPONENTS
import { StyleSheet, StatusBar, Image, View, Text, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { GestureHandlerRootView, PinchGestureHandler, PanGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";
// ICONS
import { faMagnifyingGlass, faMicrophone, faPlus, faMinus, faArrowUp, faAlignCenter, faCloud } from '@fortawesome/free-solid-svg-icons';

// CONSTANT
import COLORS from '@/app/constants/colors';

// AXIOS
import axios from 'axios';

// HOOKS
import { config } from '@/app/lib/config';
import { useLoading } from '@/app/lib/load-context';
import { getToken } from '@/app/lib/secure-store';

export default function Index() {

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
  floorButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  activeButton: {
    backgroundColor: "#005BBB",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});