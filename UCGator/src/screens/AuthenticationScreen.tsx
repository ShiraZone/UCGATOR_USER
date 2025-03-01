import React from 'react'

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../App'

import LoginScreen from './authentication_screen/LoginScreen';
import RegisterScreen from './authentication_screen/RegisterScreen';
import ForgotPasswordScreen from './authentication_screen/ForgotPasswordScreen';
import ChangePasswordScreen from './authentication_screen/ChangePasswordScreen';
import WelcomeScreen from './authentication_screen/WelcomeScreen';
import HomeScreen from './HomeScreen';

type AuthenticationScreenProps = NativeStackScreenProps<RootStackParamList, 'Authentication'>;

export type RootStackAuthList = {
    Register: undefined;
    Login: undefined;
    ForgotPassword: undefined;
    ChangePassword: undefined;
    GetStarted: undefined;
    Home: undefined;
}

const Stack = createNativeStackNavigator<RootStackAuthList>();

const AuthenticationScreen: React.FC<AuthenticationScreenProps> = ({ navigation }) => {
    return (
        <Stack.Navigator initialRouteName='GetStarted' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='GetStarted' component={WelcomeScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='Register' component={RegisterScreen} />
            <Stack.Screen name='ForgotPassword' component={ForgotPasswordScreen} />
            <Stack.Screen name='ChangePassword' component={ChangePasswordScreen} />
            <Stack.Screen name='Home' component={HomeScreen} />
        </Stack.Navigator>
    )
}

export default AuthenticationScreen