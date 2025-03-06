//DEPENDENCIES use "npm install" on terminal
import React from 'react';

//COMPONENTS USED
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

// SCREENS
const ExploreScreen = () => {
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
};

const RouteScreen = () => <View style={styles.screen}><Text>Route</Text></View>;
const FavoriteScreen = () => <View style={styles.screen}><Text>Favorite</Text></View>;
const MeScreen = () => <View style={styles.screen}><Text>Me</Text></View>;

// NAVIGATION MENU
const Tab = createBottomTabNavigator();

const HomeScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#5FBFF9',
        tabBarInactiveTintColor: '#c4c4c4',
        tabBarIconStyle: {marginTop: 20}
      }}
    >
      <Tab.Screen 
        name="Explore" 
        component={ExploreScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="search" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Route" 
        component={RouteScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="exchange" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Favorite" 
        component={FavoriteScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="heart" size={size} color={color} />
        }} 
      />
      <Tab.Screen 
        name="Me" 
        component={MeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => <FontAwesome name="user" size={size} color={color} />
        }} 
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;

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
