import React, { useEffect, useState } from 'react'

// COMPONENTS
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Keyboard, StatusBar, Dimensions, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Posts from '@/app/components/posts-component';

// UTILS
import COLORS from '@/app/constants/colors';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';

// ICONS
import { faCircleUser, faPlus, faArrowLeft, faUser, faChartBar, faEllipsis, } from '@fortawesome/free-solid-svg-icons';

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
    likeCount: number;
    hasLiked: boolean;
    createdBy: {
        id: string;
        name: string;
        avatar: string;
        type: string;
    };
}

const ProfileInfoWindow = () => {
    const { user } = useAuth();
    const router = useRouter();

    // POSTS
    const [loading, setLoading] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [cachedPosts, setCachedPosts] = useState<Post[]>([]);
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (page: number = 1, forceRefresh: boolean = false) => {
        try {
            setLoading(true);

            // If we have cached posts and it's not a force refresh, use cached data
            if (cachedPosts.length > 0 && !forceRefresh) {
                setPosts(cachedPosts);
                setLoading(false);
                return;
            }

            const response = await axios.get(`${config.endpoint}/post/user?page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
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
            console.error('Error fetching posts:', error.response?.data?.error);
            // If there's an error, try to use cached data
            if (cachedPosts.length > 0) {
                setPosts(cachedPosts);
            }
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };

    const handleLikeUpdate = (postId: string, isLiked: boolean, newLikeCount: number) => {
        // Update the liked status
        setLikedPosts(prev => ({
            ...prev,
            [postId]: isLiked
        }));

        // Update the like count in the posts array
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                    ? { ...post, likeCount: newLikeCount }
                    : post
            )
        );
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
    }, []);

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchPosts(1, true); // Force refresh when pulling down
    };

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor='white' barStyle={'dark-content'} />
            {/* Header Container */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginHorizontal: 5 }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1 }}>Profile</Text>
            </View>

            {/* Use FlatList with ListHeaderComponent instead of ScrollView */}
            <Posts
                posts={posts}
                loading={loading}
                onRefresh={handleRefresh}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                likedPosts={likedPosts}
                onLikeUpdate={handleLikeUpdate}
                ListHeaderComponent={
                    <>
                        {/* Profile Info */}
                        <View style={{ borderRadius: 10, padding: 15 }}>
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

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                <TouchableOpacity style={{ width: '100%', backgroundColor: COLORS.pmy.blue1, padding: 10, borderRadius: 5, alignItems: 'center', marginBottom: 15 }} onPress={() => router.push('./edit-profile')} >
                                    <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold', }}>Edit Profile</Text>
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
                    </>
                }
            />
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