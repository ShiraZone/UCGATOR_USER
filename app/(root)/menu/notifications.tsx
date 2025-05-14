import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Image,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import axios from 'axios';
import { getToken } from '@/app/lib/secure-store';
import { useAuth } from '@/app/lib/auth-context';
import COLORS from '@/app/constants/colors';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons';

interface Notification {
    _id: string;
    recipient: string;
    sender: {
        _id: string;
        profile: {
            firstName: string;
            lastName: string;
            avatar: string;
        }
    };
    type: 'follow' | 'message' | 'post' | 'comment' | 'like';
    content: string;
    isRead: boolean;
    relatedItem?: string;
    itemModel?: string;
    createdAt: string;
    updatedAt: string;
}

const NotificationsScreen = () => {
    const router = useRouter();
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async (refresh = false) => {
        try {
            if (refresh) {
                setRefreshing(true);
                setPage(1);
            } else {
                setLoading(true);
            }

            const token = await getToken();
            const currentPage = refresh ? 1 : page;

            const response = await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/notifications/?page=${currentPage}&limit=15`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const newNotifications = response.data.data;
                if (refresh || currentPage === 1) {
                    setNotifications(newNotifications);
                } else {
                    setNotifications(prev => [...prev, ...newNotifications]);
                }

                // Check if there are more pages
                setHasMore(newNotifications.length === 15);
                if (!refresh) setPage(currentPage + 1);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        fetchNotifications(true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchNotifications();
        }
    };

    const markAsRead = async (notificationId: string) => {
        try {
            const token = await getToken();
            await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/notifications/${notificationId}/read`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update the local state
            setNotifications(prev =>
                prev.map(notification =>
                    notification._id === notificationId
                        ? { ...notification, isRead: true }
                        : notification
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        try {
            const token = await getToken();
            await axios.put(`${process.env.EXPO_PUBLIC_API_URL}/notification/read-all`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Update all notifications to read
            setNotifications(prev =>
                prev.map(notification => ({ ...notification, isRead: true }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleNotificationPress = (notification: Notification) => {
        // If not read, mark it as read
        if (!notification.isRead) {
            markAsRead(notification._id);
        }

        // Navigate based on notification type
        if (notification.type === 'follow' && notification.sender) {
            router.push({
                pathname: '/(root)/user/[id]',
                params: { id: notification.sender._id }
            });
        } else if (notification.type === 'post' && notification.relatedItem) {
            router.push({
                pathname: '/(root)/posts/[id]',
                params: { id: notification.relatedItem }
            });
        }
    };

    const formatTimeAgo = (date: string) => {
        try {
            return formatDistanceToNow(new Date(date), { addSuffix: true });
        } catch (error) {
            return '';
        }
    };

    const renderNotificationItem = ({ item }: { item: Notification }) => {
        return (
            <TouchableOpacity
                style={[styles.notificationItem, !item.isRead && styles.unreadItem]}
                onPress={() => handleNotificationPress(item)}
            >
                <View style={styles.notificationContent}>
                    <Image
                        source={{
                            uri: item.sender?.profile?.avatar || 'https://via.placeholder.com/50'
                        }}
                        style={styles.avatar}
                    />
                    <View style={styles.textContainer}>
                        <Text style={styles.notificationText}>{item.content}</Text>
                        <Text style={styles.timestamp}>{formatTimeAgo(item.createdAt)}</Text>
                    </View>
                </View>
                {!item.isRead && (
                    <View style={styles.unreadIndicator} />
                )}
            </TouchableOpacity>
        );
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Notifications</Text>
                {unreadCount > 0 && (
                    <TouchableOpacity onPress={markAllAsRead} style={styles.markAllReadButton}>
                        <FontAwesomeIcon icon={faCheck} size={16} color={COLORS.pmy.white} />
                        <Text style={styles.markAllReadText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>
            {loading && page === 1 ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={COLORS.pmy.blue1} />
                </View>
            ) : notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No notifications yet</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderNotificationItem}
                    keyExtractor={(item) => item._id}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            colors={[COLORS.pmy.blue1]}
                            tintColor={COLORS.pmy.blue1}
                        />
                    }
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={
                        loading && page > 1 ? (
                            <View style={styles.footerLoading}>
                                <ActivityIndicator size="small" color={COLORS.pmy.blue1} />
                            </View>
                        ) : null
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.blue1,
        padding: 15,
    },
    backButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 10,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: 'Montserrat-ExtraBold',
        color: COLORS.pmy.white,
        flex: 1,
        textAlign: 'center',
    },
    markAllReadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.blue2,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
    },
    markAllReadText: {
        color: COLORS.pmy.white,
        fontFamily: 'Montserrat-Bold',
        fontSize: 12,
        marginLeft: 5,
    },
    notificationItem: {
        flexDirection: 'row',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    unreadItem: {
        backgroundColor: '#E6F3FF',
    },
    notificationContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    textContainer: {
        flex: 1,
    },
    notificationText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 15,
        color: '#333',
        marginBottom: 4,
    },
    timestamp: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#999',
    },
    unreadIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.pmy.blue1,
        marginLeft: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#999',
    },
    footerLoading: {
        paddingVertical: 20,
    },
});
