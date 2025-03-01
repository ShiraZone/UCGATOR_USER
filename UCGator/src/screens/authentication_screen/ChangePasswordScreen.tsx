import React, { useState } from 'react'
import { 
    StyleSheet,
    View, 
    Text,
    KeyboardAvoidingView,
    ImageBackground,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native'

import { RootStackAuthList } from '../AuthenticationScreen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'ChangePassword'>

const ChangePasswordScreen: React.FC<AuthScreenProps> = ({ navigation }) => {

    const handleSubmit = () => {
        
    };

    return (
        <SafeAreaProvider>

        </SafeAreaProvider>
    );
};

export default ChangePasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    
}); 