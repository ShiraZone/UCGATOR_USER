import React from 'react';
import { useState, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';


import ScreenPage2 from './src/screens/onboarding_screens/ScreenPage2';

export type RootStackParamList = {
  Onboarding: undefined;
  Authentication: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  /*
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  
  useEffect(() => {
    
    const appState = async () => {
      const onboarded = await AsyncStorage.getItem('hasOnboarded');
      const userToken = await AsyncStorage.getItem('userToken');
  
      if (!onboarded) {
        setInitialRoute('Onboarding')
      } else if (userToken) {
        setInitialRoute('Home')
      } else {
        setInitialRoute('Authentication');
      }
  
      setIsLoading(false);
    };
  }, []);
  initialRouteName={initialRoute!}
  if (isLoading) return null; */


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions ={{headerShown: false}}>
        <Stack.Screen name='ScreenPage2' component={ScreenPage2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}