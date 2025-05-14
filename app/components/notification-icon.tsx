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
import notificationServiceInstance from '@/app/services/notification.service';
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
    isRead?: boolean; // Some notifications might use isRead instead of read
    [key: string]: any; // For any additional properties
}

const NotificationIcon = ({ color = COLORS.pmy.white, size = 24 }: NotificationIconProps) => {
    const router = useRouter();
    const { user, isLoggedIn } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);    // Initialize notifications and fetch data when component mounts
    
    // Initialize notifications and fetch data when component mounts
    useEffect(() => {
        console.log("NotificationIcon: useEffect triggered", { isLoggedIn, userId: user?._id });
        
        if (!isLoggedIn || !user?._id) {
            console.log("NotificationIcon: User not logged in, exiting useEffect");
            return;
        }
        
        const fetchUnreadCount = async () => {
            try {
                console.log("NotificationIcon: Fetching unread count");
                const count = await notificationServiceInstance.getUnreadCount();
                console.log("NotificationIcon: Unread count fetched:", count);
                setUnreadCount(count);
                console.log("NotificationIcon: State updated with count:", count);
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };
        
        // Handle new notifications via the notification service
        const handleNotification = (notification: NotificationEvent | null, action?: { type: string }) => {
            console.log("NotificationIcon: handleNotification called with:", { notification, action });
            
            // Handle new notifications
            if (notification) {
                console.log("NotificationIcon: New notification received, incrementing count");
                setUnreadCount(prev => {
                    const newCount = prev + 1;
                    console.log("NotificationIcon: Updated unread count:", newCount);
                    return newCount;
                });
                
                // Show a local notification if app is in background
                if (appState !== 'active' && Platform.OS !== 'web') {
                    // You would implement local notifications here
                }
            } else if (action) { // Handle read notifications
                console.log("NotificationIcon: Action received:", action);
                
                if (action.type === 'READ_ALL') {
                    console.log("NotificationIcon: READ_ALL action, resetting count to 0");
                    setUnreadCount(0);
                } else if (action.type === 'READ') {
                    console.log("NotificationIcon: READ action, decrementing count");
                    setUnreadCount(prev => {
                        const newCount = Math.max(0, prev - 1);
                        console.log("NotificationIcon: Updated unread count after READ:", newCount);
                        return newCount;
                    });
                }
            }
        };
        
        console.log("NotificationIcon: Registering notification callback");
        notificationServiceInstance.registerNotificationCallback(handleNotification);
        
        // Fetch initial unread count
        fetchUnreadCount();
        
        // Setup app state listener
        console.log("NotificationIcon: Setting up app state listener");
        const subscription = AppState.addEventListener('change', nextAppState => {
            console.log("NotificationIcon: App state changed to:", nextAppState);
            setAppState(nextAppState);
            if (nextAppState === 'active') {
                fetchUnreadCount();
            }
        });
        
        return () => {
            // Cleanup
            console.log("NotificationIcon: Cleaning up notification callback and subscription");
            notificationServiceInstance.unregisterNotificationCallback(handleNotification);
            subscription.remove();
        };
    }, [user?._id, isLoggedIn]);

    const goToNotifications = () => {
        router.push('/menu/notifications');
    };    // Log the unreadCount value to debug why the badge isn't showing
    console.log('NotificationIcon rendering with unreadCount:', unreadCount);

    return (
        <TouchableOpacity style={styles.container} onPress={goToNotifications}>
            <FontAwesomeIcon icon={faBell} size={size} color={color} />
            {unreadCount > 0 && (
                <View style={styles.badge} />
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
    }, badge: {
        position: 'absolute',
        top: 5,  // Adjusted position
        right: 5, // Adjusted position
        backgroundColor: 'red', // Use standard red color
        borderRadius: 6,
        width: 12,
        height: 12,
        borderWidth: 2,   // Thicker border
        borderColor: '#FFFFFF', // White border
        elevation: 4,     // Increased Android elevation
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        zIndex: 999,      // Ensure it's above other elements
    },
});

export default NotificationIcon;
