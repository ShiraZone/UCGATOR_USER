import React, { memo, useContext } from "react";
import { useState } from "react";
import { Link } from "expo-router";
import { View, StyleSheet, Image, TouchableOpacity, Text, TextInput, StatusBar } from "react-native";
import { GestureHandlerRootView, PinchGestureHandler, PanGestureHandler, GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

import Marker from "../../components/marker-component"

const floorImages = {
  1.5: require("../../../assets/maps/old_building_mezzanine_floor.jpg"),
  2: require("../../../assets/maps/old_building_second_floor.jpg"),
}

const markersData = {
  1.5: [
    { id: "c2", x: 40, y: 42, label: "Computer Laboratory 2", type: "lab" },
    { id: "m1", x: 6, y: 57, label: "M1", type: "classroom" },
    { id: "m2", x: 24, y: 57, label: "M2", type: "classroom" },
    { id: "m3", x: 37.6, y: 57, label: "M3", type: "classroom" },
    { id: "m4", x: 48, y: 57, label: "M4", type: "classroom" },
    { id: "resRoom", x: 62, y: 57, label: "Research Room", type: "lab" },
    { id: "resHub", x: 73, y: 57.5, label: "Research Hub", type: "lab" },
    { id: "confRoom", x: 82, y: 57.5, label: "Conference Room", type: "conference" },
    { id: "gsr", x: 92, y: 58, label: "GSR", type: "classroom" },
  ],
  2: [
    { id: "lab1", x: 500, y: 300, label: "Lab 1", type: "lab" },
    { id: "lab2", x: 600, y: 400, label: "Lab 2", type: "lab" },
    { id: "office", x: 700, y: 500, label: "Office", type: "office" },
  ]
}

//COMPONENTS USED
import { FontAwesome } from '@expo/vector-icons';

export default function Index() {
  const [currentFloor, setCurrentFloor] = useState<keyof typeof floorImages>(1.5);
  const [selectedPOI, setSelectedPOI] = useState<{ type: string; label: string } | null>(null);

  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotation.value}rad` }, // Rotation in radians
    ],
  }));

  // Pinch Gesture (Zoom)
  const pinchGesture = Gesture.Pinch().onUpdate((event) => {
    scale.value = Math.max(0.1, Math.min(event.scale, 3));
  });

  // Pan Gesture (Drag)
  const panGesture = Gesture.Pan().onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
  });

  // Rotation Gesture (Two-Finger Rotate)
  const rotateGesture = Gesture.Rotation().onUpdate((event) => {
    rotation.value = event.rotation;
  });

  // Combine Gestures
  const gesture = Gesture.Simultaneous(panGesture, pinchGesture, rotateGesture);

  // Handle Floor Change & Reset Zoom/Pan
  const handleFloorChange = (floor: keyof typeof floorImages) => {
    setCurrentFloor(floor);
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    rotation.value = 0;
  };

  // Handle POI interaction based on type
  const handlePOIInteraction = (poi: { type: string; label: string }) => {
    if (poi.type === "classroom" || poi.type === "lab" || poi.type === "library") {
      // Show POI info
      setSelectedPOI(poi);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.exploreContainer}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerText}>Where to go?</Text>

          {/* Search Bar with TextInput */}
          <View style={styles.searchBar}>
            <FontAwesome name="search" size={20} color="#FFFFFF" style={{ marginLeft: 10 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for places..."
              placeholderTextColor="#FFFFFF"
            />
          </View>
        </View>
      </View>
      {/* Gesture Detector: Pan + Pinch Combined */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.imageContainer, animatedStyle]}>
          <Image source={floorImages[currentFloor]} style={styles.image} resizeMode="contain" />
          {markersData[currentFloor]?.map((marker) => (
            <Marker key={marker.id} marker={marker} scale={scale} rotation={rotation} onPress={() => handlePOIInteraction(marker)} />
          ))}
        </Animated.View>
      </GestureDetector>
      {/* Floor Selector */}
      <View style={styles.floorSelector}>
        {Object.keys(floorImages).map((floor) => (
          <TouchableOpacity key={floor} style={[styles.floorButton, currentFloor === Number(floor) && styles.activeButton]} onPress={() => handleFloorChange(Number(floor) as keyof typeof floorImages)}>
            <Text style={styles.buttonText}>Floor {floor}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
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
  poiInfo: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  poiText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeText: {
    fontSize: 14,
    color: "blue",
    textAlign: "right",
  },
  tabBar: {
    backgroundColor: '#0D2841',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 80,
    paddingBottom: 10,
  },
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  exploreContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingTop: 130,
  },
  headerSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0D2841',
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D95A',
    paddingVertical: 3,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#FFFFFF',
    fontSize: 16,
  },
});
