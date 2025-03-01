import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { faMap, faCompass, faHeart, faBars } from '@fortawesome/free-solid-svg-icons'

const Tab = createBottomTabNavigator();

import React from 'react'
import MenuScreen from '../screens/home_screen/MenuScreen'
import MapScreen from '../screens/home_screen/MapScreen'
import NavigateScreen from '../screens/home_screen/NavigateScreen'
import FavoriteScreen from '../screens/home_screen/FavoriteScreen'

import { StyleSheet } from 'react-native';
import COLORS from '../assets/Colors';

const TabNavigator = () => {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ color, size }) => {
                let icon: any;

                if (route.name === "Map") {
                    icon = faMap;
                } else if (route.name === "Navigate") {
                    icon = faCompass;
                } else if (route.name === "Favorite") {
                    icon = faHeart;
                } else if (route.name === "Menu") {
                    icon = faBars;
                }

                return <FontAwesomeIcon icon={icon} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#007bff",
            tabBarInactiveTintColor: COLORS.nativeWhite,
            tabBarStyle: {
                height: '8%',
                paddingTop: 7,
                backgroundColor: COLORS.primaryBlue,
            },
            tabBarIconStyle: {
                alignSelf: "center",
            },
            tabBarLabelStyle: {
                fontSize: 12,
                textAlign: "center",
            },
        })}
        >
            <Tab.Screen name='Map' component={MapScreen} />
            <Tab.Screen name='Navigate' component={NavigateScreen} />
            <Tab.Screen name='Favorite' component={FavoriteScreen} />
            <Tab.Screen name='Menu' component={MenuScreen} />
        </Tab.Navigator>
    )
}

export default TabNavigator