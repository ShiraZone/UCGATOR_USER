import React from 'react';
import { Stack } from 'expo-router';

export default function MenuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      {/* Add other menu screens here */}
    </Stack>
  );
}
