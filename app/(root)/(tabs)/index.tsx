import React from 'react';

//COMPONENTS USED
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

export default function Index() {
  return (
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

      {/* Placeholder for Map */}
      <View>
          <Text>Insert Map here : this code is in line 22 (home_screen.tsx)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
