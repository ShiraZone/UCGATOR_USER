import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// LOADING CONTEXT PROVIDER
import { useLoading } from '../lib/load-context';
import { Keyboard } from 'react-native';

const LoadingIndicator = () => {
  const { isLoading } = useLoading();

  // Returns null if loading is false
  if (!isLoading) return null;
  
  // Dismiss the keyboard if it is open
  Keyboard.dismiss();
  
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size={200} />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000, // Ensure it appears above other components
  },
});

export default LoadingIndicator;
