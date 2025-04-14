import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Animated, Button } from 'react-native';
import React, { useState } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

const { width } = Dimensions.get('window');

/**
 * Displays the "Latest" screen which features a scrollable list of announcement placeholders.
 * The header at the top dynamically shrinks when the user scrolls.
 *
 * @component
 * @returns {JSX.Element} The rendered Latest screen with dynamic header and announcement cards.
 *
 * @example
 * // Use in your navigation stack or render directly
 * <Latest />
 *
 * @features
 * - Shrinking header on scroll using Animated.
 * - Touchable placeholders for announcements.
 * - Add and remove announcements dynamically with buttons.
 *
 * @state
 * @state {Animated.Value} scrollY - Tracks the vertical scroll offset.
 * @state {number} headerHeight - Controls the height of the header (shrinks with scroll).
 * @state {string[]} announcements - List of current announcements shown in the scroll view.
 *
 * @function handleAddAnnouncement - Adds a new announcement to the list.
 * @function handleRemoveAnnouncement - Removes the last announcement from the list.
 * @function handlePlaceholderClick - Handles tap event for a specific announcement.
 * @function handleScroll - Updates the header height when scrolling.
 *
 * @style
 * Styles are defined using StyleSheet for layout, color, and typography customization.
 */

const Latest = () => {
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(189);
  const [announcements, setAnnouncements] = useState([
    'Announcement 1',
    'Announcement 2',
    'Announcement 3',
    'Announcement 4',
    'Announcement 5',
    'Announcement 6',
  ]);

  const handlePlaceholderClick = (placeholderName: string) => {
    console.log(`${placeholderName} clicked`);
  };

  //scroller
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const newHeaderHeight = Math.max(100, 189 - scrollOffset);
        setHeaderHeight(newHeaderHeight);
      },
    }
  );
  
  //for adding more annoucncement
  const handleAddAnnouncement = () => {
    const newNumber = announcements.length + 1;
    setAnnouncements([...announcements, `Announcement ${newNumber}`]);
  };

  //for removing announcement 
  const handleRemoveAnnouncement = () => {
    if (announcements.length > 0) {
      setAnnouncements(announcements.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, { height: headerHeight }]}>
        <View style={styles.headerBackground} />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Latest</Text>
        </View>
      </View>

      {/* Buttons to Add/Remove */
      //for placeholder purposes can be changed into dynamic via database
      }
      <View style={styles.buttonRow}>
        <Button title="Add Announcement" onPress={handleAddAnnouncement} />
        <Button title="Remove Announcement" onPress={handleRemoveAnnouncement} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {announcements.map((text, index) => (
          <TouchableOpacity
            key={index}
            style={styles.placeholderContainer}
            onPress={() => handlePlaceholderClick(text)}
          >
            <Text style={styles.placeholderText}>{text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Latest;

const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  gray: '#D3D3D3',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },

  headerBackground: {
    backgroundColor: COLORS.blue1,
    width: width,
    height: '100%',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerContent: {
    position: 'absolute',
    top: 30,
    left: 10,
    alignItems: 'flex-start',
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  buttonRow: {
    marginTop: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  scrollViewContent: {
    paddingBottom: 40,
  },

  placeholderContainer: {
    backgroundColor: COLORS.gray,
    width: width - 40,
    height: 150,
    marginVertical: 10,
    padding: 10,
    alignItems: 'flex-start',
    borderRadius: 20,
    alignSelf: 'center',
  },

  placeholderText: {
    color: '#333',
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
  },
});
