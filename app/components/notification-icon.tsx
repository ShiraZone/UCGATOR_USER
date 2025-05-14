import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    AppState,
    AppStateStatus
} from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '@/app/lib/auth-context';
import axios from 'axios';
import { getToken } from '@/app/lib/secure-store';
import socketService from '@/app/services/socket.service';
import COLORS from '@/app/constants/colors';

interface NotificationIconProps {
    color?: string;
    size?: number;
}

// Listen for notification events
interface NotificationEvent {
    _id: string;
    type: string;
    message: string;
    createdAt: string;
    read: boolean;
    [key: string]: any; // For any additional properties
}

const NotificationIcon = ({ color = COLORS.pmy.white, size = 24 }: NotificationIconProps) => {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    // Initialize socket and fetch notifications when component mounts
    useEffect(() => {
        if (!isLoggedIn || !user?._id) return;

        const fetchUnreadCount = async () => {
            try {
                const token = await getToken();
                const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications/unread-count`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setUnreadCount(response.data.data.count);
                }
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        // Connect to socket
        socketService.connect();
        socketService.authenticate(user._id);

        socketService.on('notification', (notification: NotificationEvent) => {
            setUnreadCount(prev => prev + 1);

            // Show a local notification if app is in background
            if (appState !== 'active' && Platform.OS !== 'web') {
                // You would implement local notifications here
                // using expo-notifications or react-native-push-notification
            }
        });

        // Fetch initial unread count
        fetchUnreadCount();

        // Setup app state listener
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);

            // When app comes back to foreground, refresh notifications
            if (nextAppState === 'active') {
                fetchUnreadCount();
            }
        });

        return () => {
            // Cleanup
            socketService.off('notification');
            subscription.remove();
        };
    }, [user?._id, isLoggedIn]);

    const goToNotifications = () => {
        router.push('/menu/notifications');
    };

    return (
        <TouchableOpacity style={styles.container} onPress={goToNotifications}>
            <FontAwesomeIcon icon={faBell} size={size} color={color} />
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 11,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
});

export default NotificationIcon;
