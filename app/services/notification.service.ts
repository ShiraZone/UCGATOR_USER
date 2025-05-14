import socketServiceInstance from './socket.service';
import * as SecureStore from '../lib/secure-store';
import { config } from '../lib/config';
import axios from 'axios';

/**
 * NotificationService - Handles notification-related functionality
 */
class NotificationService {
    private notifications: any[] = [];
    private notificationCallbacks: Set<Function> = new Set();
    private unreadCount: number = 0;

    /**
     * Initialize the notification service and set up socket listeners
     */    
    initialize = async (): Promise<void> => {
        try {
            // Make sure socket is connected
            await socketServiceInstance.connect();

            // Set up notification listener
            socketServiceInstance.onNotification(this.handleNewNotification);

            // Fetch initial unread count on initialization
            const count = await this.getUnreadCount();
            console.log('Initial unread notification count:', count);
            console.log('Notification service initialized successfully');
        } catch (error) {
            console.error('Error initializing notification service:', error);
        }
    };

    /**
     * Get the current unread notification count
     * @returns The number of unread notifications
     */
    getUnreadCount = async (): Promise<number> => {
        try {
            const token = await SecureStore.getToken();

            if (!token) {
                console.error('No authentication token available');
                return this.unreadCount;
            }
            
            const response = await axios.get(`${config.endpoint}/notifications/unread-count`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
                this.unreadCount = response.data.count;
                return this.unreadCount;
            }

            return this.unreadCount;
        } catch (error) {
            console.error('Error fetching unread count:', error);
            return this.unreadCount;
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

        // Update unread count
        this.unreadCount++;
        console.log('Updated unread count:', this.unreadCount);

        // Notify all registered callbacks with the notification object
        this.notificationCallbacks.forEach(callback => {
            try {
                callback(notification);
            } catch (error) {
                console.error('Error in notification callback:', error);
            }
        });
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
            const response = await axios.put(`${config.endpoint}/notifications/${notificationId}/read`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (response.data.success) {
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
            } else {
                throw new Error('Failed to mark notification as read');
            }

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
            const response = await axios.put(`${config.endpoint}/notifications/read-all`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                // Update locally
                this.notifications = this.notifications.map(notification => ({
                    ...notification,
                    isRead: true
                }));

                // Notify callbacks about the update
                this.notificationCallbacks.forEach(callback =>
                    callback(null, { type: 'READ_ALL' })
                );
            } else {
                throw new Error('Failed to mark all notifications as read');
            }

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
