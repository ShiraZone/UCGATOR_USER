import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App'

import LoginScreen from './authentication_screen/LoginScreen';
import RegisterScreen from './authentication_screen/RegisterScreen';
import ForgotPassword from './authentication_screen/ForgotPassword';
import WelcomeScreen from './authentication_screen/WelcomeScreen';

type AuthenticationScreenProps = NativeStackScreenProps<RootStackParamList, 'Authentication'>;

export type RootStackAuthList = {
    Register: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    GetStarted: undefined;
}

const Stack = createNativeStackNavigator<RootStackAuthList>();

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName='GetStarted' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='GetStarted' component={WelcomeScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
        </Stack.Navigator>
    )
}

export default AuthenticationScreen