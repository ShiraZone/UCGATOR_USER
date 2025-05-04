
import { FontAwesome } from '@expo/vector-icons';

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faSquareCaretRight
} from '@fortawesome/free-solid-svg-icons';

// RECT
import React from 'react';
import { useState } from 'react';

// ROUTER
import { useRouter } from 'expo-router';

// COMPONENTS
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar, 
  Dimensions, 
  Image 
} from 'react-native';


const { width } = Dimensions.get('window');

const Explore = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('widelyNavigated');

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
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={{ paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24, color: COLORS.blue1 }}>Explore</Text>
          <View>
            <TouchableOpacity onPress={() => router.push('/(root)/navigate/start-navigation')}>
              <FontAwesomeIcon icon={faSquareCaretRight} size={32} color={COLORS.blue1} />
            </TouchableOpacity>
          </View>
        </View>
        {/* Tabs */}
        <View style={{  paddingHorizontal: 15, flexDirection: 'row', gap: 10}}>
          <TouchableOpacity onPress={handleWidelyNavigatedPress} style={[styles.tabButtons, activeTab === 'widelyNavigated' && styles.activeTab]}>
            <Text style={styles.tabText}>Widely Navigated</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleHistoryPress} style={[styles.tabButtons, activeTab === 'history' && styles.activeTab]}>
            <Text style={styles.tabText}>Your History</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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

const styles = StyleSheet.create({
  tabButtons: {
    backgroundColor: COLORS.blue1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  tabText: {
    color: COLORS.white,
    fontSize: 12,
    fontFamily: 'Montserrat-Bold'
  },
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
