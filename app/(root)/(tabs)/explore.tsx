import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
const { width } = Dimensions.get('window');

/**
 * Explore Component
 * 
 * @component
 * @description Main explore screen interface that provides navigation options and location discovery.
 * Features a visually appealing header with navigation controls and categorized location sections.
 *
 * @features
 * - Hero image header with overlaid navigation controls
 * - Start Navigation button for quick route planning
 * - Tab-based navigation between popular locations and user history
 * - Section cards for different campus locations (Cashier, Records)
 * - Responsive design adapting to screen width
 *
 * @navigation
 * - START NAVIGATION button routes to start-navigation screen
 * - Tabs switch between widely navigated locations and user history
 * - Section cards provide quick access to specific locations
 *
 * @styling
 * - Uses custom color palette defined in COLORS constant
 * - Montserrat font family for consistent typography
 * - Responsive image sizing based on device width
 * - Modern UI elements with rounded corners and borders
 *
 * @returns {React.ReactElement} The rendered Explore component
 */
const Explore = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState('widelyNavigated');

  /**
   * Handles navigation to the start navigation screen
   * Triggered by the START NAVIGATION button press
   */
  const handleStartNavigation = () => {
    router.push('/(root)/navigate/start-navigation');
  };

  const handleHistoryPress = () => {
    setActiveTab('history');
  };

  const handleWidelyNavigatedPress = () => {
    setActiveTab('widelyNavigated');
  };

  const sampleLocations = [
    'Library',
    'Canteen',
    'UCLM Covered Court',
    'CCS Deans Office',
    'Records Office',
    'Cashier',
  ];

  const sampleHistory = [
    'Cashier',
    'Records Office',
    'Canteen',
    'UCLM Covered Court',
    'CCS Deans Office',
    'Library',
  ];

  return (
    <View style={styles.container}>
      {/* Header Components */}
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/menu_image_cover.png')} 
          style={styles.headerImage}
          resizeMode="contain"
        />

        {/* Title and Start Button on top of the image */}
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Navigate</Text>

          <TouchableOpacity style={styles.startButton} onPress={handleStartNavigation} >
            <Text style={styles.startButtonText}>START NAVIGATION</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'widelyNavigated' && styles.activeTab]}
          onPress={handleWidelyNavigatedPress}
        >
          <Text style={styles.tabText}>Widely Navigated Location</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={handleHistoryPress}
        >
          <Text style={styles.tabText}>Your History</Text>
        </TouchableOpacity>
      </View>

      {/* Dynamic Content */}
      {activeTab === 'widelyNavigated' ? (
        <ScrollView style={styles.widelyNavigatedContent}>
          {sampleLocations.map((location, index) => (
            <View key={index} style={styles.locationItem}>
              <Text style={styles.locationText}>{location}</Text>
              <TouchableOpacity>
                <FontAwesome name="map-marker" size={24} color={COLORS.blue1} style={styles.navigateIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        <ScrollView style={styles.historyContent}>
          {sampleHistory.map((history, index) => (
            <View key={index} style={styles.locationItem}>
              <Text style={styles.locationText}>{history}</Text>
              <TouchableOpacity>
                <FontAwesome name="map-marker" size={24} color={COLORS.blue1} style={styles.navigateIcon} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Explore;

/**
 * @constant COLORS
 * @description Color palette used throughout the Explore component
 * 
 * @property {string} blue1 - Primary blue color (#2B4F6E)
 * @property {string} white - Background and text color (#F6F6F6)
 * @property {string} red - Accent color for sections (#FF0000)
 */
const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  red: '#FF0000',
};

/**
 * @constant styles
 * @description StyleSheet for the Explore component
 * 
 * @property {Object} container - Main scroll container styling
 * @property {Object} headerContainer - Container for the hero image and overlay content
 * @property {Object} headerImage - Hero image styling with responsive width
 * @property {Object} headerContent - Overlay content positioning and layout
 * @property {Object} headerTitle - Title text styling
 * @property {Object} startButton - Navigation button with glowing border effect
 * @property {Object} startButtonText - Button text styling
 * @property {Object} tabRow - Container for navigation tabs
 * @property {Object} tab - Individual tab styling
 * @property {Object} tabText - Tab text styling
 * @property {Object} section - Section container layout
 * @property {Object} sectionTitle - Section header text styling
 * @property {Object} sectionBox - Placeholder box styling for sections
 * @property {Object} activeTab - Active tab styling
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingBottom: 40,
  },

  headerContainer: {
    position: 'relative', 
  },

  headerImage: {
    width: width - 0, 
    height: 189,
    alignSelf: 'center',
  },

  headerContent: {
    position: 'absolute', 
    top: '10%', 
    left: 10, 
    right: 20, 
    alignItems: 'flex-start',
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    marginBottom: 20,
    fontFamily: 'Montserrat-Bold'
  },

  startButton: {
    backgroundColor: '#3D73A6',
    paddingVertical: 10,
    paddingHorizontal: 110,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#9BC9F5',
    alignSelf: 'center',
    marginBottom: 15,
  },

  startButtonText: {
    color: COLORS.white,
    fontFamily: 'Montserrat-Bold'
  },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },

  tab: {
    backgroundColor: COLORS.blue1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
  },

  tabText: {
    color: COLORS.white,
    fontSize: 12,
    paddingHorizontal: 35,
    fontFamily: 'Montserrat-Bold'
  },

  section: {
    marginTop: 20,
    marginHorizontal: 10,
  },

  sectionTitle: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    marginBottom: 4,
    marginLeft: 5,
  },

  sectionBox: {
    height: 100,
    backgroundColor: COLORS.red,
    borderRadius: 8,
  },

  activeTab: {
    backgroundColor: '#3D73A6',
  },

  widelyNavigatedContent: {
    height: 550,
    backgroundColor: '#3D73A6',
    margin: 10,
    marginLeft: 11,
    marginRight: 11,
    marginTop: 0,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  historyContent: {
    height: 550,
    backgroundColor: '#3D73A6',
    margin: 10,
    marginTop: 0,
    marginLeft: 11,
    marginRight: 11,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  scrollContent: {
    paddingVertical: 10,
  },

  locationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    height: 100,
  },

  locationText: {
    fontSize: 16,
    color: COLORS.blue1,
    fontFamily: 'Montserrat-Bold',
  },

  navigateIcon: {
    marginRight: 10,
  },
});
