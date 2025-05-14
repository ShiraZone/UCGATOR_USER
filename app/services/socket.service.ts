import { io, Socket } from 'socket.io-client';
import { config } from '../lib/config';
import * as SecureStore from '../lib/secure-store';
import NetInfo from '@react-native-community/netinfo';

/**
 * SocketService - A singleton service to handle all Socket.IO connections
 */
class SocketService {
    private socket: Socket | null = null;
    private isConnected: boolean = false;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private listeners: Map<string, Set<Function>> = new Map();
    private userId: string | null = null;

    /**
     * Initialize the socket connection
     * @param token - JWT authentication token
     */
    async connect(): Promise<void> {
        // Don't create a new connection if one already exists
        if (this.socket && this.isConnected) return;

        try {
            // Get the authentication token
            const token = await SecureStore.getToken();
            if (!token) {
                console.log('No token available for socket connection');
                return;
            }

            // Check for internet connectivity
            const netInfo = await NetInfo.fetch();
            if (!netInfo.isConnected) {
                console.log('No internet connection available');
                return;
            }

            // Initialize socket with auth and connection options
            this.socket = io(config.endpoint, {
                auth: { token },
                transports: ['websocket'],
                reconnection: true,
                reconnectionAttempts: this.maxReconnectAttempts,
                reconnectionDelay: 1000,
                timeout: 10000
            });

            this.setupListeners();
        } catch (error) {
            console.error('Error initializing socket connection:', error);
        }
    }

    /**
     * Set up the basic socket event listeners
     */
    private setupListeners(): void {
        if (!this.socket) return;

        this.socket.on('connect', () => {
            console.log('Socket connected with ID:', this.socket?.id);
            this.isConnected = true;
            this.reconnectAttempts = 0;

            // Re-authenticate after reconnection if we have userId
            if (this.userId) {
                this.authenticate(this.userId);
            }
        });

        this.socket.on('disconnect', (reason) => {
            console.log(`Socket disconnected: ${reason}`);
            this.isConnected = false;
        });

        this.socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error.message);
            this.reconnectAttempts += 1;

            if (this.reconnectAttempts >= this.maxReconnectAttempts) {
                console.log('Max reconnection attempts reached');
                this.disconnect();
            }
        });

        // Handle device going offline/online
        NetInfo.addEventListener(state => {
            if (state.isConnected && !this.isConnected && this.socket) {
                console.log('Network reconnected, attempting to reconnect socket');
                this.socket.connect();
            }
        });
    }

    /**
     * Authenticate the user with the socket server
     * @param userId - The user's ID
     */
    authenticate(userId: string): void {
        if (!this.socket || !this.isConnected) {
            console.log('Socket not connected, cannot authenticate');
            return;
        }

        this.userId = userId;
        this.socket.emit('authenticate', userId);
        console.log(`User ${userId} authenticated with socket server`);
    }

    /**
     * Subscribe to a socket event
     * @param event - The event name to listen for
     * @param callback - The callback function to execute when the event is received
     */
    on(event: string, callback: Function): void {
        if (!this.socket) {
            console.log('Socket not initialized, cannot add listener');
            return;
        }

        // Store callback in our listeners map
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);

        // Add the actual socket listener
        this.socket.on(event, (data) => callback(data));
    }

    /**
     * Unsubscribe from a socket event
     * @param event - The event name to unsubscribe from
     * @param callback - The callback function to remove (if not provided, removes all listeners for the event)
     */
    off(event: string, callback?: Function): void {
        if (!this.socket) return;

        if (callback) {
            // Remove specific callback
            this.socket.off(event, callback as any);
            this.listeners.get(event)?.delete(callback);
        } else {
            // Remove all callbacks for this event
            this.socket.off(event);
            this.listeners.delete(event);
        }
    }

    /**
     * Emit an event to the socket server
     * @param event - The event name to emit
     * @param data - The data to send with the event
     */
    emit(event: string, data: any): void {
        if (!this.socket || !this.isConnected) {
            console.log('Socket not connected, cannot emit event:', event);
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * Disconnect the socket
     */
    disconnect(): void {
        if (!this.socket) return;

        // Remove all event listeners
        for (const event of this.listeners.keys()) {
            this.socket.off(event);
        }

        // Clear internal listeners
        this.listeners.clear();
        this.userId = null;

        // Disconnect the socket
        this.socket.disconnect();
        this.socket = null;
        this.isConnected = false;
        console.log('Socket disconnected');
    }

    /**
     * Check if the socket is currently connected
     * @returns boolean indicating connection status
     */
    isSocketConnected(): boolean {
        return this.isConnected && !!this.socket;
    }
}

// Create a singleton instance
const socketServiceInstance = new SocketService();

export default socketServiceInstance;