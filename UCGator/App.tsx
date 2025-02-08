import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//Slashscreen 1

import SplashScreen_First from './app/screen/splash_screens/SplashScreen_First';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='SplashScreen'>
        <Stack.Screen name='first_splash' component={SplashScreen_First} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}