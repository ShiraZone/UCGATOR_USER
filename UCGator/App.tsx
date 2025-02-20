import React from 'react';
import { useState, useEffect } from 'react';

import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens...
import { OnboardingScreen } from './src/screens/main';
import { AuthenticationScreen } from './src/screens/main';
import { HomeScreen } from './src/screens/main';

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
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Authentication" component={AuthenticationScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}