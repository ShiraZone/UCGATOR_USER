import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, Image } from 'react-native';
import React from 'react';

const { width } = Dimensions.get('window');

/**
 * Renders the Explore screen, featuring a navigation header,
 * tabs for popular locations and user history, and placeholder sections.
 *
 * @component
 * @returns {JSX.Element} The rendered Explore screen.
 *
 * @example
 * // To use inside a navigator
 * <Explore />
 *
 * @features
 * - Image header with overlayed title and navigation button.
 * - Tabs for user history and frequently visited locations.
 * - Placeholder sections representing various locations (e.g., Cashier, Records).
 *
 * @style
 * Uses `StyleSheet` for layout and styling, including responsive image sizing
 * and button interactions.
 */

const Explore = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
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

          <TouchableOpacity style={styles.startButton}>
            <Text style={styles.startButtonText}>START NAVIGATION</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Widely Navigated Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Your History</Text>
        </TouchableOpacity>
      </View>

      {/* Sections */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cashier</Text>
        <View style={styles.sectionBox} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Records Section</Text>
        <View style={styles.sectionBox} />
      </View>
    </ScrollView>
  );
};

export default Explore;

const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  red: '#FF0000',
};

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
});
