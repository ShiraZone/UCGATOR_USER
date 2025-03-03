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
import { Ionicons } from '@expo/vector-icons';

type AuthScreenProps = NativeStackScreenProps<RootStackAuthList, 'ChangePassword'>

const ChangePasswordScreen: React.FC<AuthScreenProps> = ({ navigation }) => {

    const navigateLogin = () => navigation.replace('Login');

    const [email, setEmail] = useState('');

    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [passwordInfo, setPasswordInfo] = useState<{
        newPassword?: string,
        confirmPassword?: string        
    }>({});
    const [errors, setErrors] = useState<{
        newPassword?: string,
        confirmPassword?: string
    }>({});

    const handleInputChange = (field: keyof typeof passwordInfo, value: string) => {
        setPasswordInfo((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        const errorHandler: { newPassword?: string, confirmPassword?: string } = {};

        if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
            errorHandler.confirmPassword = 'Passwords do not match.';
        }

        if (Object.keys(errorHandler).length > 0) {
            setErrors(errorHandler);
            setTimeout(() => {
                setErrors({});
            }, 5000);
            return;
        }

        // Add your submit logic here
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView style={styles.container}>
                    <ImageBackground source={require('../../assets/auth_assets/gphc_img_2.png')} 
                        style={[styles.container, styles.graphicsImage]} resizeMode='contain'>
                        
                        <View style={styles.logoContainer}>
                            <Image source={require('../../assets/def_assets/adaptive-logo.png')} 
                                style={styles.logo} />
                        </View>

                        <Text style={styles.title}>Forgot Password</Text>

                        <View style={styles.ContentWrapper}>
                            <View style={styles.inputContainer}>
                                <View style={styles.passwordFieldContainer}>
                                    <TextInput
                                        style={styles.inputFields}
                                        placeholder='Enter New Password'
                                        value={passwordInfo.newPassword || ``} 
                                        onChangeText={(text) => handleInputChange('newPassword', text)}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                    
                                </View>

                                <TextInput
                                    style={styles.inputFields}
                                    placeholder='Confirm New Password'
                                    value={passwordInfo.confirmPassword || ``}
                                    onChangeText={(text) => handleInputChange('confirmPassword', text)}
                                    secureTextEntry={!isPasswordVisible}
                                />
                            </View>

                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Ionicons name={isPasswordVisible ? 'eye-off' : 'eye'} size={24} color="black" />
                            </TouchableOpacity>

                            {errors.confirmPassword && (
                                <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                            )}

                            <TouchableOpacity style={styles.Submitbutton} onPress={handleSubmit}>
                                <Text style={styles.SubmitbuttonText}>Submit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.ReturnLogin} onPress={navigateLogin}>
                                <Text style={styles.ReturnLoginText}>Return to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </ImageBackground>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ChangePasswordScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    graphicsImage: {
        flex: 1,
        width: '100%'
    },
    logoContainer: {
        marginBottom: 20,
    },
    logo: {
        height: 125,
        width: '100%',
        resizeMode: 'contain',
        margin: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#002F5F',
        textAlign: 'center',
    },
    ContentWrapper: {
        margin: 10,
        alignItems: 'center',
    },
    inputContainer: {
        width: '100%',
        alignItems: 'center',
    },
    passwordFieldContainer: {
        width: '100%',
        marginBottom: 15,
        alignItems: 'center'
    },
    inputFields: {
        width: '90%',
        height: 50,
        borderBottomWidth: 2,
        borderColor: '#183C5E',
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    Submitbutton: {
        width: '80%',
        backgroundColor: '#002F5F',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        marginTop: 50,
        margin: 10,
    },
    SubmitbuttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    ReturnLogin: {
        margin: 10,
    },
    ReturnLoginText: {
        color: '#002F5E',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
    errorText: {
        color: '#ff0000',
        marginBottom: 10,
        position: 'absolute',
        top: 170,
    },
    
});