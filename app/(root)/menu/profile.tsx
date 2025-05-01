import React, { useEffect, useState  } from 'react'

// COMPONENTS
import { Image, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, Keyboard, StatusBar, Dimensions, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Post from '@/app/components/posts-component';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';

// ICONS
import { faCircleUser, faPlus, faArrowLeft, faUser, faChartBar, faEllipsis, faHeart as faHeartSolid, faImages } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';

// API
import axios from 'axios';
import { config } from '@/app/lib/config';
import { getToken } from '@/app/lib/secure-store';

interface Post {
    id: string;
    mediaUrls: string[];
    style: {
        fontFamily: string;
        fontSize: string;
        color: string;
        backgroundColor: string;
        textAlign: string;
        fontWeight: string;
        _id: string;
    };
    caption?: string;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    deletionDate: null | string;
    createdBy: {
        id: string;
        name: string;
        avatar: string;
        type: string;
    };
    likeCount: number;
    hasLiked: boolean;
    location?: {
        pinID: string;
        pinName: string;
    } | null;
}

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

const ProfileInfoWindow = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [posts, setPosts] = useState<Post[]>([]);
    const [cachedPosts, setCachedPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [token, setToken] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const userToken = await getToken();
            setToken(userToken);
        };
        loadToken();
    }, []);

    const fetchPosts = async (page: number = 1, forceRefresh: boolean = false) => {
        try {
            setLoading(true);
            
            // If we have cached posts and it's not a force refresh, use cached data
            if (cachedPosts.length > 0 && !forceRefresh) {
                setPosts(cachedPosts);
                setLoading(false);
                return;
            }

            const response = await axios.get    (`${config.endpoint}/post/all?page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                const data = response.data.data;
                if (page === 1) {
                    setPosts(data);
                    setCachedPosts(data); // Cache the first page of posts
                } else {
                    setPosts(prevPosts => [...prevPosts, ...data]);
                    setCachedPosts(prevPosts => [...prevPosts, ...data]); // Cache additional pages
                }
                
                const likedState: Record<string, boolean> = {};
                data.forEach((post: Post) => {
                    likedState[post.id] = post.hasLiked;
                });
                setLikedPosts(prev => ({
                    ...prev,
                    ...likedState
                }));
                
                setHasMore(page < response.data.totalPages);
            }
        } catch (error: any) {
            console.error('Error fetching posts:', error);
            // If there's an error, try to use cached data
            if (cachedPosts.length > 0) {
                setPosts(cachedPosts);
            }
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            fetchPosts(nextPage);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, [token]);

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchPosts(1, true); // Force refresh when pulling down
    };

    const renderHeader = () => (
        <SafeAreaView>
            {/* Header Container */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginHorizontal: 5}} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1}}>Profile</Text>
            </View>

            {/* Profile Info */}
            <View style={{borderRadius: 10, padding: 15 }}>
                <View style={styles.profileHeader}>
                    {user?.avatar ? (
                        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                    )}
                    <View>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue2 }}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2 }}>{user?.email}</Text>
                    </View>
                </View>
                
                <View style= {{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TouchableOpacity style={{ width: '70%',backgroundColor: COLORS.pmy.blue1, padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 15 }} onPress={() => router.push('./edit-profile')} >
                        <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold',}}>Edit Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style ={{ width: '25%', backgroundColor: COLORS.pmy.blue1, padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 15}} >
                        <FontAwesomeIcon icon={faEllipsis} size={18} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                </View>
                
                <View style={{ backgroundColor: '#BCD4E6', borderRadius: 10, padding: 10 }}>
                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: COLORS.pmy.white, marginBottom: 10, }}>{user?.bio || 'Lorem ipsum dolor dolores sentissima.'}</Text>
                    <View style={styles.detailRow}>
                        <FontAwesomeIcon icon={faUser} size={18} color={COLORS.pmy.blue1} />
                        <Text style={styles.detailText}>{user?.profileType || 'Student'}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <FontAwesomeIcon icon={faChartBar} size={18} color={COLORS.pmy.blue1} />
                        <Text style={styles.detailText}>Total Contribution: {posts.length}</Text>
                    </View>
                </View>
            </View>

            {/* Posts Section Header */}
            <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1, margin: 10, }}>Posts</Text>
            <TouchableOpacity style={styles.addPostButton} onPress={() => router.push('/(root)/latest/new-post')}>
                <FontAwesomeIcon icon={faPlus} size={35} color={COLORS.pmy.blue1} />
                <Text style={styles.addPostText}>Add new contribution...</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

    const renderPost = ({ item }: { item: Post }) => {
        const mediaUrls = item?.mediaUrls || [];
        const style = item?.style || {
            fontFamily: 'Arial',
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

        return (
            <View style={styles.postContainer}>
                {/* User info header */}
                <View style={styles.postHeader}>
                    <View style={styles.userInfo}>
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
                    </View>
                </View>

                {/* Media content */}
                {mediaUrls.length > 0 && (
                    <View style={styles.mediaContainer}>
                        {mediaUrls.length === 1 ? (
                            <Image 
                                source={{ uri: mediaUrls[0] }} 
                                style={styles.singleImage} 
                                resizeMode="cover"
                            />
                        ) : (
                            <View>
                                <FlatList
                                    data={mediaUrls}
                                    horizontal
                                    pagingEnabled
                                    showsHorizontalScrollIndicator={false}
                                    keyExtractor={(url, index) => `${item.id || index}-${index}`}
                                    renderItem={({ item: url }) => (
                                        <Image 
                                            source={{ uri: url }} 
                                            style={styles.multiImage} 
                                            resizeMode="cover"
                                        />
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
        );
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle="light-content" />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <FlatList
                    data={posts}
                    renderItem={renderPost}
                    keyExtractor={(item) => item.id}
                    ListHeaderComponent={renderHeader}
                    onRefresh={handleRefresh}
                    refreshing={loading}
                    ListEmptyComponent={
                        !loading ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No posts available</Text>
                            </View>
                        ) : null
                    }
                />
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default ProfileInfoWindow;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 15,
    },
    backButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 5,
        borderRadius: 8,
    },
    headerTitle: {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Montserrat-ExtraBold',
        color: COLORS.pmy.white,
        flex: 1,
    },
    profileInfoContainer: {
        borderRadius: 10,
        margin: 10,
        padding: 15,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 65,
        height: 65,
        borderRadius: 32.5,
        marginRight: 10,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    detailText: {
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.white,
        fontSize: 14,   
        marginLeft: 10,
    },
    addPostButton: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderRadius: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        borderWidth: 1, 
        borderColor: COLORS.pmy.blue1, 
        borderStyle: 'dashed', 
    },
    addPostText: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.blue1,
        marginLeft: 10,
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
        height: screenWidth,
        position: 'relative',
    },
    singleImage: {
        width: '100%',
        height: '100%',
    },
    multiImage: {
        width: screenWidth,
        height: screenWidth,
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
});