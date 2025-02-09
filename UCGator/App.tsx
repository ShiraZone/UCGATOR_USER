import React from 'react';

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Onboarding Screen

import SplashScreen_First from './app/screen/splash_screens/SplashScreen_First';
import SplashScreen_Second from './app/screen/splash_screens/SplashScreen_Second';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions ={{headerShown: false}}>
        <Stack.Screen name='UCGATOR' component={SplashScreen_Second} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}