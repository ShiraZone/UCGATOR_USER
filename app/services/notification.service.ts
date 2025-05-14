import socketServiceInstance from './socket.service';
import * as SecureStore from '../lib/secure-store';

/**
 * NotificationService - Handles notification-related functionality
 */
class NotificationService {
    private notifications: any[] = [];
    private notificationCallbacks: Set<Function> = new Set();

    /**
     * Initialize the notification service and set up socket listeners
     */
    initialize = async (): Promise<void> => {
        try {
            // Make sure socket is connected
            if (!socketServiceInstance.isSocketConnected()) {
                await socketServiceInstance.connect();
            }

            // Set up notification listener
            socketServiceInstance.onNotification(this.handleNewNotification);

            console.log('Notification service initialized');
        } catch (error) {
            console.error('Error initializing notification service:', error);
        }
    };

    /**
     * Handle incoming notifications from the socket
     * @param notification - The notification object received
     */
    handleNewNotification = (notification: any): void => {
        console.log('New notification received:', notification);

        // Add to local notifications cache
        this.notifications.unshift(notification);

        // Notify all registered callbacks
        this.notificationCallbacks.forEach(callback => callback(notification));
    };

    /**
     * Register a callback to be notified when new notifications arrive
     * @param callback - The function to call when a new notification is received
     */
    registerNotificationCallback = (callback: Function): void => {
        this.notificationCallbacks.add(callback);
    };

    /**
     * Remove a previously registered notification callback
     * @param callback - The callback function to remove
     */
    unregisterNotificationCallback = (callback: Function): void => {
        this.notificationCallbacks.delete(callback);
    };

    /**
     * Mark a notification as read locally and on the server
     * @param notificationId - The ID of the notification to mark as read
     */
    markAsRead = async (notificationId: string): Promise<void> => {
        try {
            const token = await SecureStore.getToken();

            if (!token) {
                console.error('No authentication token available');
                return;
            }

            // Update on the server
            const response = await fetch(`${process.env.API_URL}/api/notifications/${notificationId}/read`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark notification as read');
            }

            // Update locally
            this.notifications = this.notifications.map(notification => {
                if (notification._id === notificationId) {
                    return { ...notification, isRead: true };
                }
                return notification;
            });

            // Notify callbacks about the update
            this.notificationCallbacks.forEach(callback =>
                callback(null, { type: 'READ', notificationId })
            );

        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    /**
     * Mark all notifications as read
     */
    markAllAsRead = async (): Promise<void> => {
        try {
            const token = await SecureStore.getToken();

            if (!token) {
                console.error('No authentication token available');
                return;
            }

            // Update on the server
            const response = await fetch(`${process.env.API_URL}/api/notifications/read-all`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to mark all notifications as read');
            }

            // Update locally
            this.notifications = this.notifications.map(notification => ({
                ...notification,
                isRead: true
            }));

            // Notify callbacks about the update
            this.notificationCallbacks.forEach(callback =>
                callback(null, { type: 'READ_ALL' })
            );

        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    /**
     * Clean up the notification service
     */
    cleanup = (): void => {
        socketServiceInstance.offNotification(this.handleNewNotification);
        this.notificationCallbacks.clear();
        this.notifications = [];
    };
}

// Create a singleton instance
const notificationServiceInstance = new NotificationService();

export default notificationServiceInstance;
