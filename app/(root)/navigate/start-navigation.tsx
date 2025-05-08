import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faArrowRight, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from "expo-router";
import { useStopPoints } from '../../context/StopPointsContext';

/**
 * StartNavigation Component
 * 
 * @component
 * @description Main navigation interface for setting up a route between locations.
 * Allows users to input source and destination locations, add stop points,
 * and update navigation preferences.
 *
 * @features
 * - Location input fields for source and destination
 * - Interactive arrow button for route confirmation
 * - Preferences update option
 * - Stop points management
 * - Modern translucent card design
 *
 * @navigation
 * - Arrow click navigates to route confirmation screen
 * - Update preferences button for navigation settings
 * - Add stop points functionality for multi-point navigation
 *
 * @returns {React.ReactElement} The rendered StartNavigation component
 */
const StartNavigation = () => {
  const router = useRouter();
  const { stopPoints, removeStopPoint } = useStopPoints();

  /**
   * Handles the arrow button click event
   * Navigates to the route confirmation screen
   */
  const handleArrowClick = () => {
    router.push("/navigate/arrow-clicked");
  };

  const handleUpdatePreferences = () => {
    router.push("/navigate/update-preferences");
  };

  const handleStopPoints = () => {
    router.push("/maps/searchbox-function-screen?source=stopPoints");
  };

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
        <FontAwesomeIcon icon={faArrowRight} size={24} color="#FFFFFF" style={styles.backIcon} />
      </TouchableOpacity>
      <Text style={styles.title}>Set your destination</Text>

      <View style={styles.navigationCard}>
        {/* From Location */}
        <View style={styles.inputRow}>
          <FontAwesomeIcon icon={faLocationDot} size={24} color="#FFFFFF" style={styles.locationIcon} />
          <TextInput
            style={styles.input}
            placeholder="From"
            placeholderTextColor="#FFFFFF"
          />
        </View>

        {/* Target Location */}
        <View style={styles.inputRow}>
          <FontAwesomeIcon icon={faLocationDot} size={24} color="#FFFFFF" style={styles.locationIcon} />
          <TextInput
            style={styles.input}
            placeholder="Target Location"
            placeholderTextColor="#FFFFFF"
          />
        </View>

        {/* Arrow Icon */}
        <TouchableOpacity 
          style={styles.arrowContainer}
          onPress={handleArrowClick}
        >
          <FontAwesomeIcon 
            icon={faArrowRight} 
            size={24} 
            color="#FFFFFF"
          />
        </TouchableOpacity>
      </View>

      {/* Update Preferences Button */}
      <TouchableOpacity 
        style={styles.updateButton}
        onPress={handleUpdatePreferences}
      >
        <Text style={styles.updateButtonText}>UPDATE YOUR PREFERENCES</Text>
      </TouchableOpacity>

      {/* Stop Points Section (includes added points and add button) */}
      <View style={styles.stopPointsSection}>
        <Text style={styles.stopPointsTitle}>Stop Points</Text>
        
        {/* List of added stop points */}
        {stopPoints.map((point: string, index: number) => (
          <View key={index} style={styles.addedStopPointContainer}>
            <Text style={styles.addedStopPointText}>{point}</Text>
            <TouchableOpacity onPress={() => removeStopPoint(index)} style={styles.removeStopPointButton}>
              <FontAwesomeIcon icon={faTimes} size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        ))}
        
        {/* Add Stop Points Button */}
        <TouchableOpacity 
          style={styles.addStopButton}
          onPress={handleStopPoints}
        >
          <FontAwesomeIcon icon={faPlus} size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/**
 * @constant styles
 * @description StyleSheet for the StartNavigation component
 * 
 * @property {Object} container - Main container with dark blue background
 * @property {Object} title - Navigation title text styling
 * @property {Object} navigationCard - Translucent card container for location inputs
 * @property {Object} inputRow - Container for location input field and icon
 * @property {Object} locationIcon - Location pin icon styling
 * @property {Object} input - Text input field styling with bottom border
 * @property {Object} arrowContainer - Floating arrow button container
 * @property {Object} updateButton - Update preferences button with glow effect
 * @property {Object} updateButtonText - Button text styling
 * @property {Object} stopPointsSection - Container for stop points feature
 * @property {Object} stopPointsTitle - Section title styling
 * @property {Object} addStopButton - Dashed border button for adding stops
 * @property {Object} backButton - Back button container
 * @property {Object} backIcon - Back button icon styling
 * @property {Object} addedStopPointContainer - Styles for added stop points
 * @property {Object} addedStopPointText - Styles for added stop points text
 * @property {Object} removeStopPointButton - Style for the remove button
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B4F6E',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'Montserrat-Bold',
    marginBottom: 20,
    marginLeft: 40,
  },
  navigationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 5,
    paddingRight: 70,
  },
  locationIcon: {
    marginRight: 15,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Regular',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    width: '85%',
    alignSelf: 'flex-start',
  },
  arrowContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -12 }],
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 12,
  },
  updateButton: {
    backgroundColor: '#3D73A6',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#9BC9F5',
    shadowColor: '#9BC9F5',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5, 
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    letterSpacing: 0.5,
  },
  stopPointsSection: {
    marginTop: 10,
    paddingBottom: 60,
  },
  stopPointsTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    marginBottom: 10,
  },
  addStopButton: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
    borderRadius: 8,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  backIcon: {
    transform: [{ rotate: '180deg' }],
    marginLeft: 10,
    marginTop: 13,
  },
  addedStopPointContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  addedStopPointText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Montserrat-Regular',
  },
  removeStopPointButton: {
    padding: 5,
    marginLeft: 10,
  },
});

export default StartNavigation;