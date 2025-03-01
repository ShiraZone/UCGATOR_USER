import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type RootStackHomeList = {
    MapScreen: undefined;
    SearchScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackHomeList>();

import TabNavigator from '../component/TabNavigator';
import SearchScreenMap from './home_screen/mapScreens/SearchScreenMap';

const HomeScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='MapScreen' component={TabNavigator} />
            {/* HOME SCREEN SCREENS*/}
            <Stack.Screen name='SearchScreen' component={SearchScreenMap} />
        </Stack.Navigator>
    );
}

export default HomeScreen;