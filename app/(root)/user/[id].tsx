import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import axios from 'axios';
import { getToken } from '@/app/lib/secure-store';
import { useAuth } from '@/app/lib/auth-context';
import COLORS from '@/app/constants/colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Posts from '@/app/components/posts-component';
import socketService from '@/app/services/socket.service';
import { config } from '@/app/lib/config';
import { showErrorToast } from '@/app/components/toast-config';

interface UserProfile {
    _id: string;
    email: string;
    status: string;
    verified: boolean;
    profile: {
        firstName: string;
        lastName: string;
        middleName?: string;
        avatar: string;
        bio?: string;
        gender: string;
        profileType: string;
        followers: string[];
        following: string[];
        followersCount: number;
        followingCount: number;
    };
}

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

const UserProfileScreen = () => {
    const params = useLocalSearchParams();
    const userId = params.id as string;
    const router = useRouter();
    const { user } = useAuth();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [followLoading, setFollowLoading] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [posts, setPosts] = useState<Post[]>([]);
    const [postLoading, setPostLoading] = useState(false);    
    const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
    const [currentPage, setCurrentPage] = useState(1);    
    const [hasMore, setHasMore] = useState(true);
    // Check if profile being viewed is the user's own profile
    const isOwnProfile = user?._id === userId;

    useEffect(() => {
        fetchUserProfile();
        fetchUserPosts(1);
    }, [userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const token = await getToken();

            // Get user profile
            const response = await axios.get(`${config.endpoint}/profile/user/read/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setProfile(response.data.data);
                const currentUserFollowing = response.data.data.profile.followers.includes(user?._id);
                setIsFollowing(currentUserFollowing);
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            showErrorToast('Failed to load user profile.', 'Error');
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async (page: number) => {
        try {
            setPostLoading(true);

            const response = await axios.get(`${config.endpoint}/post/user/${userId}?page=${page}&limit=5`, {
                headers: {
                    Authorization: `Bearer ${await getToken()}`,
                }
            });

            if (response.data.success) {
                const newPosts = response.data.data;

                // Create liked posts map
                const likedPostsMap = newPosts.reduce((acc: Record<string, boolean>, post: Post) => {
                    acc[post.id] = post.hasLiked;
                    return acc;
                }, {});

                if (page === 1) {
                    setPosts(newPosts);
                    setLikedPosts(likedPostsMap);
                } else {
                    setPosts(prevPosts => [...prevPosts, ...newPosts]);
                    setLikedPosts(prev => ({
                        ...prev,
                        ...likedPostsMap
                    }));
                }

                setHasMore(newPosts.length === 5);
                setCurrentPage(page);
            }
        } catch (error: any) {
            console.error('Error fetching user posts:', error.message);
        } finally {
            setPostLoading(false);
        }
    };

    const handleFollow = async () => {
        if (!profile) return;

        try {
            setFollowLoading(true);
            const token = await getToken();

            const endpoint = isFollowing ?
                `${process.env.EXPO_PUBLIC_API_URL}/api/profile/unfollow/${userId}` :
                `${process.env.EXPO_PUBLIC_API_URL}/api/profile/follow/${userId}`;

            const response = await axios.post(endpoint, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                setIsFollowing(!isFollowing);

                // Update follower count
                setProfile(prevProfile => {
                    if (!prevProfile) return null;

                    return {
                        ...prevProfile,
                        profile: {
                            ...prevProfile.profile,
                            followersCount: isFollowing
                                ? Math.max(0, prevProfile.profile.followersCount - 1)
                                : prevProfile.profile.followersCount + 1
                        }
                    };
                });

                // Connect socket and emit event if following
                if (!isFollowing) {
                    socketService.connect();
                    socketService.authenticate(user?._id || '');
                }
            }
        } catch (error) {
            console.error('Error following/unfollowing user:', error);
            Alert.alert('Error', 'Failed to update follow status');
        } finally {
            setFollowLoading(false);
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
        if (!postLoading && hasMore) {
            const nextPage = currentPage + 1;
            fetchUserPosts(nextPage);
        }
    };

    const handleRefresh = () => {
        setCurrentPage(1);
        fetchUserProfile();
        fetchUserPosts(1);
    };
      const handleEditProfile = () => {
        // Navigate to edit profile page
        router.push({
            pathname: '/(root)/menu/edit-profile',
            // Optionally pass user ID if needed
            params: { id: userId }
        });
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.pmy.blue1} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    if (!profile) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Text style={styles.errorText}>User profile not found</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    const fullName = `${profile.profile.firstName} ${profile.profile.middleName ? profile.profile.middleName + ' ' : ''}${profile.profile.lastName}`;

    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar backgroundColor='white' barStyle={'dark-content'} />
            {/* Header Container */}
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Profile</Text>
            </View>
            <Posts
                posts={posts}
                loading={postLoading}
                onRefresh={handleRefresh}
                onLoadMore={handleLoadMore}
                hasMore={hasMore}
                likedPosts={likedPosts}
                onLikeUpdate={handleLikeUpdate}
                ListHeaderComponent={
                    <View style={[styles.profileInfoContainer, { backgroundColor: COLORS.pmy.blue1 }]}>
                        <View style={styles.profileHeader}>
                            <Image
                                source={{ uri: profile.profile.avatar || 'https://via.placeholder.com/150' }}
                                style={styles.avatar}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.detailText, { fontSize: 16, marginBottom: 0, marginLeft: 0 }]}>{fullName}</Text>
                                <Text style={[styles.detailText, { fontSize: 13, color: '#D9D9D9', marginLeft: 0 }]}>
                                    {profile.profile.profileType}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 }}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.detailText, { fontSize: 18, marginLeft: 0 }]}>{posts.length}</Text>
                                <Text style={[styles.detailText, { fontSize: 14, color: '#D9D9D9', marginLeft: 0 }]}>Posts</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.detailText, { fontSize: 18, marginLeft: 0 }]}>{profile.profile.followersCount}</Text>
                                <Text style={[styles.detailText, { fontSize: 14, color: '#D9D9D9', marginLeft: 0 }]}>Followers</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={[styles.detailText, { fontSize: 18, marginLeft: 0 }]}>{profile.profile.followingCount}</Text>
                                <Text style={[styles.detailText, { fontSize: 14, color: '#D9D9D9', marginLeft: 0 }]}>Following</Text>
                            </View>
                        </View>

                        {profile.profile.bio && (
                            <Text style={[styles.detailText, { fontSize: 14, marginBottom: 15 }]}>{profile.profile.bio}</Text>
                        )}

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            {isOwnProfile ? (
                                <TouchableOpacity
                                    style={styles.editProfileButton}
                                    onPress={handleEditProfile}
                                >
                                    <Text style={styles.editProfileButtonText}>Edit Profile</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.followButton,
                                        { backgroundColor: isFollowing ? 'transparent' : COLORS.pmy.white, borderWidth: isFollowing ? 1 : 0 }
                                    ]}
                                    onPress={handleFollow}
                                    disabled={followLoading}
                                >
                                    {followLoading ? (
                                        <ActivityIndicator size="small" color={isFollowing ? COLORS.pmy.white : COLORS.pmy.blue1} />
                                    ) : (
                                        <Text style={[
                                            styles.followButtonText,
                                            { color: isFollowing ? COLORS.pmy.white : COLORS.pmy.blue1 }
                                        ]}>
                                            {isFollowing ? 'Following' : 'Follow'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default UserProfileScreen;

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    headerContainer: {
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
    followButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderRadius: 10,
        marginRight: 5,
        borderColor: COLORS.pmy.white,
        borderWidth: 0
    },
    followButtonText: {
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
    },
    editProfileButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderRadius: 10,
        borderColor: COLORS.pmy.white,
        borderWidth: 0
    },
    editProfileButtonText: {
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
    },
    messageButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderRadius: 10,
        marginLeft: 5
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF'
    },
    loadingText: {
        fontFamily: 'Montserrat-Regular',
        marginTop: 10,
        color: COLORS.pmy.blue1
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20
    },
    errorText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: 16,
        color: '#FF3B30',
        textAlign: 'center',
        marginBottom: 20
    },    backButtonText: {
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.white
    }
});
