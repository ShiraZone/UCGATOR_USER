import React from 'react';

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Onboarding Screen


import ScreenPage2 from './src/screens/onboarding_screens/ScreenPage2';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions ={{headerShown: false}}>
        <Stack.Screen name='ScreenPage2' component={ScreenPage2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}