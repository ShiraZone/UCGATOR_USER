import { StyleSheet, Text, View, Image, FlatList, Dimensions, TouchableOpacity, Alert, ImageSourcePropType, ImageStyle, Modal, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHeart as faHeartSolid, faImages } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import axios from 'axios';
import { config } from '../lib/config';
import { getToken } from '../lib/secure-store';
import notificationServiceInstance from '../services/notification.service';

interface PostStyle {
    fontFamily: string;
    fontSize: string;
    color: string;
    backgroundColor: string;
    textAlign: string;
    fontWeight: string;
    _id: string;
}

interface User {
    id: string;
    name: string;
    avatar: string;
    type: string;
}

interface Post {
    id: string;
    mediaUrls: string[];
    style: PostStyle;
    caption?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    deletionDate: null | string;
    createdBy: User;
    likeCount: number;
    hasLiked: boolean;
    location?: {
        pinID: string;
        pinName: string;
    } | null;
}

interface PostsProps {
    posts?: Post[];
    loading?: boolean;
    onRefresh?: () => void;
    onLoadMore?: () => void;
    hasMore?: boolean;
    likedPosts?: Record<string, boolean>;
    onLikeUpdate?: (postId: string, isLiked: boolean, newLikeCount: number) => void;
    ListHeaderComponent?: any;
}

interface ImageDimensions {
    width: number;
    height: number;
}

const { width } = Dimensions.get('window');

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
        return `${diffHours}h ago`;
    } else {
        return `${diffDays}d ago`;
    }
};

const Posts = ({ 
    posts = [], 
    loading = false, 
    onRefresh, 
    onLoadMore, 
    hasMore = false,
    likedPosts = {},
    onLikeUpdate,
    ListHeaderComponent
}: PostsProps) => {
    const [token, setToken] = useState<string | null>(null);
    const [imageDimensions, setImageDimensions] = useState<Record<string, ImageDimensions>>({});
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    useEffect(() => {
        const loadToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        loadToken();
    }, []);    
    
    const handleLike = async (postId: string) => {
        if (!token) {
            Alert.alert('Error', 'Please log in to like posts');
            return;
        }

        try {
            const response = await axios.post(
                `${config.endpoint}/post/${postId}/like`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // Call the parent component's onLikeUpdate function
                if (onLikeUpdate) {
                    onLikeUpdate(postId, true, response.data.data.likeCount);
                }
                
                // Refresh notifications count to show the red dot if needed
                notificationServiceInstance.getUnreadCount();
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to like the post. Please try again.');
            console.error('Error liking post:', error.response?.data || error.message);
        }
    };

    const handleUnlike = async (postId: string) => {
        if (!token) {
            Alert.alert('Error', 'Please log in to unlike posts');
            return;
        }

        try {
            const response = await axios.delete(
                `${config.endpoint}/post/${postId}/like`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // Call the parent component's onLikeUpdate function
                if (onLikeUpdate) {
                    onLikeUpdate(postId, false, response.data.data.likeCount);
                }
            }
        } catch (error: any) {
            Alert.alert('Error', 'Failed to unlike the post. Please try again.');
            console.error('Error unliking post:', error.response?.data || error.message);
        }
    };

    const handleImageLoad = (postId: string, url: string) => {
        Image.getSize(url, (width, height) => {
            setImageDimensions(prev => ({
                ...prev,
                [postId]: { width, height }
            }));
        });
    };

    const handleImageLongPress = (url: string) => {
        setZoomedImage(url);
    };

    const handleCloseZoom = () => {
        setZoomedImage(null);
    };

    const renderPost = ({ item }: { item: Post }) => {
        // Add null checks to prevent TypeError
        const mediaUrls = item?.mediaUrls || [];
        const style = item?.style || {
            fontFamily: 'Montserrat-Regular',
            fontSize: '16px',
            color: '#000000',
            backgroundColor: '#ffffff',
            textAlign: 'left',
            fontWeight: 'normal',
            _id: ''
        };
        const createdBy = item?.createdBy || {
            id: '',
            name: 'Unknown User',
            avatar: 'https://api.dicebear.com/7.x/thumbs/png?seed=default',
            type: 'User'
        };
        const caption = item?.caption || '';
        const createdAt = item?.createdAt || new Date().toISOString();
        const postId = item?.id || '';
        const isLiked = likedPosts[postId] || item.hasLiked || false;
        const likeCount = item.likeCount || 0;
        const location = item?.location;
        const dimensions = imageDimensions[item.id];
        const imageStyle: ImageStyle = dimensions ? {
            width: width,
            height: (width * dimensions.height) / dimensions.width,
        } : {
            width: '100%',
            aspectRatio: 1,
        };

        return (
            <View style={styles.postContainer}>
                {/* User info header */}                
                <View style={styles.postHeader}>
                    <TouchableOpacity 
                        style={styles.userInfo}
                        onPress={() => {
                            const { router } = require('expo-router');
                            router.push(`/user/${createdBy.id}`);
                        }}
                    >
                        <Image 
                            source={{ uri: createdBy.avatar }} 
                            style={styles.avatar} 
                        />
                        <View>
                            <Text style={styles.userName}>{createdBy.name}</Text>
                            <View style={styles.timestampContainer}>
                                <Text style={styles.timestamp}>
                                    {formatDate(createdAt)}
                                </Text>
                                {location && (
                                    <>
                                        <Text style={styles.timestampDot}>•</Text>
                                        <Text style={styles.locationText}>{location.pinName}</Text>
                                    </>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>                
                {/* Media content */}
                {mediaUrls.length > 0 && (
                    <View style={styles.mediaContainer}>
                        {mediaUrls.length === 1 ? (
                            <View style={styles.imageWrapper}>
                                <Pressable
                                    onLongPress={() => handleImageLongPress(mediaUrls[0])}
                                    delayLongPress={200}
                                >
                                    <Image 
                                        source={{ uri: mediaUrls[0] }} 
                                        style={imageStyle}
                                        resizeMode="contain"
                                        onLoad={() => handleImageLoad(item.id, mediaUrls[0])}
                                    />
                                </Pressable>
                            </View>
                        ) : (
                            <View style={styles.multiImageContainer}>
                                <FlatList
                                    data={mediaUrls}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(url, index) => `${item.id || index}-${index}`}
                                    renderItem={({ item: url }) => (
                                        <View style={styles.multiImageWrapper}>
                                            <Pressable
                                                onLongPress={() => handleImageLongPress(url)}
                                                delayLongPress={200}
                                            >
                                                <Image 
                                                    source={{ uri: url }} 
                                                    style={[imageStyle, styles.multiImage]}
                                                    resizeMode="contain"
                                                    onLoad={() => handleImageLoad(item.id, url)}
                                                />
                                            </Pressable>
                                        </View>
                                    )}
                                />
                                <View style={styles.imageIndicator}>
                                    <FontAwesomeIcon icon={faImages} size={16} color="#fff" />
                                    <Text style={styles.imageCount}>{mediaUrls.length}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* Caption and like button */}
                <View style={styles.postFooter}>
                    {caption ? (
                        <Text style={[
                            styles.caption,
                            {
                                fontFamily: style.fontFamily,
                                fontSize: parseInt(style.fontSize) || 16,
                                color: style.color,
                                fontWeight: style.fontWeight === 'normal' ? 'normal' : 
                                        style.fontWeight === 'bold' ? 'bold' : 'normal',
                                textAlign: style.textAlign as any,
                            }
                        ]}>
                            {caption}
                        </Text>
                    ) : null}
                    
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => isLiked ? handleUnlike(postId) : handleLike(postId)}
                        >
                            <FontAwesomeIcon 
                                icon={isLiked ? faHeartSolid : faHeartRegular}
                                size={20} 
                                color={isLiked ? "#FF3B30" : "#333"} 
                            />
                            <Text style={[
                                styles.actionText,
                                isLiked && styles.likedText
                            ]}>
                                {likeCount > 0 ? `${likeCount} Like${likeCount !== 1 ? 's' : ''}` : 'Like'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <>
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item) => item?.id || Math.random().toString()}
                contentContainerStyle={styles.container}
                refreshing={loading}
                onRefresh={onRefresh}
                onEndReached={hasMore ? onLoadMore : undefined}
                onEndReachedThreshold={0.5}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeaderComponent}
                ListEmptyComponent={() => {
                    if (!loading) {
                        return (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No posts yet</Text>
                            </View>
                        );
                    }
                    return null;
                }}
            />

            <Modal
                visible={!!zoomedImage}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseZoom}
            >
                <View style={styles.modalContainer}>
                    <Pressable style={styles.modalContent} onPress={handleCloseZoom}>
                        {zoomedImage && (
                            <Image
                                source={{ uri: zoomedImage }}
                                style={styles.zoomedImage}
                                resizeMode="contain"
                            />
                        )}
                    </Pressable>
                </View>
            </Modal>
        </>
    )
}

export default Posts

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20,
    },
    postContainer: {
        backgroundColor: '#fff',
        marginBottom: 15,
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: '#333',
    },
    timestampContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    timestamp: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#888',
    },
    timestampDot: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 12,
        color: '#888',
        marginHorizontal: 4,
    },
    locationText: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 13,
        color: '#2B4F6E',
    },
    mediaContainer: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    imageWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    multiImageContainer: {
        width: '100%',
        position: 'relative',
        backgroundColor: '#f0f0f0',
    },
    multiImageWrapper: {
        width: width,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
    },
    singleImage: {
        width: '100%',
        aspectRatio: 1,
    },
    multiImage: {
        width: width,
        height: width,
    },
    postFooter: {
        padding: 12,
    },
    caption: {
        marginBottom: 10,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    },
    actionText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#333',
        marginLeft: 5,
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#888',
    },
    imageIndicator: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 15,
        paddingHorizontal: 8,
        paddingVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageCount: {
        color: '#fff',
        fontFamily: 'Montserrat-Bold',
        fontSize: 12,
        marginLeft: 4,
    },
    likedText: {
        color: '#FF3B30',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    zoomedImage: {
        width: width,
        height: width,
        maxHeight: '80%',
    },
})