import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/lib/auth-context';

const WelcomeScreen = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggedIn) router.replace('/');
    }, 5000);

    return () => clearTimeout(timer); // Cleanup the timer on component unmount
  }, [router]);

  return (
    <View>
      <Text>WelcomeScreen</Text>
    </View>
  );
};

export default WelcomeScreen

const styles = StyleSheet.create({})