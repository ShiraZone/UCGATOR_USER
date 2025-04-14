import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, StatusBar, TouchableOpacity, Modal, FlatList } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass, faMicrophone, faMapMarkerAlt, faCloud, faUser, faComment, faLocationArrow, faExpand, faCompress, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';

// CONSTANTS
const COLORS = {
  pmy: {
    white: '#F6F6F6',
    blue1: '#2B4F6E',
  },
};

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

  return (
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
  );
}

const styles = StyleSheet.create({
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