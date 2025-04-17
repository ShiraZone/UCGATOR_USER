import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUtensils, faRestroom, faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

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
          />
        </View>
      </View>

      {/* Shortcut Buttons */}
      <View style={styles.shortcutsOuterContainer}>
        <View style={styles.shortcutsContainer}>
          <Shortcut icon={faUtensils} label="Canteen" />
          <Shortcut icon={faRestroom} label="CR" />
          <Shortcut icon={faGear} label="Services" />
          <Shortcut icon={faTrash} label="CR" />
        </View>
      </View>

      {/* Recent Label */}
      <Text style={styles.recentText}>Recent</Text>

      {/* Search History List */}
      <ScrollView style={styles.historyContainer}>
        {[1, 2, 3, 4].map((item, index) => (
          <TouchableOpacity style={styles.historyItem} key={index}>
            <Ionicons name="time-outline" size={20} color="#fff" style={styles.historyIcon} />
            <Text style={styles.historyText}>Search History</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
      <View style={styles.iconContainer}>
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
 * @property {Object} iconContainer - Circle container for shortcut icons
 * @property {Object} shortcutLabel - Text styling for shortcut labels
 * @property {Object} recentText - "Recent" section header styling
 * @property {Object} historyContainer - Container for search history list
 * @property {Object} historyItem - Individual history item styling
 * @property {Object} historyIcon - Icon styling for history items
 * @property {Object} historyText - Text styling for history items
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
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
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
  iconContainer: {
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
});

export default SearchboxFunctionScreen;