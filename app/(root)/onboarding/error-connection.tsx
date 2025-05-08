import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import NetInfo from '@react-native-community/netinfo'

const errorConnection = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState('We couldn\'t connect to the server. Please check your internet connection and try again.');

    useEffect(() => {
        const checkConnection = async () => {
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
                setErrorMessage('No internet connection detected. Please check your WiFi or mobile data and try again.');
            } else if (netInfo.type !== 'wifi') {
                setErrorMessage('Please connect to a WiFi network for better performance.');
            }
        };
        checkConnection();
    }, []);

    const handleRetry = async () => {
        const netInfo = await NetInfo.fetch();
        if (netInfo.isConnected && netInfo.type === 'wifi') {
            router.replace('/(root)/(auth)/log-in');
        }
    };
            
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <MaterialIcons name="wifi-off" size={80} color="#FF3B30" />
                <Text style={styles.title}>Connection Error</Text>
                <Text style={styles.message}>
                    {errorMessage}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <Text style={styles.retryButtonText}>Retry Connection</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default errorConnection;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    retryButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
})