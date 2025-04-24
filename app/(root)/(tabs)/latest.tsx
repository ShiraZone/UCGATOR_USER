// REACT
import React, {
  useState,
  useEffect
} from 'react';
// REACT NATIVE
import { 
  Text, 
  View, 
  Dimensions,
  StyleSheet, 
  StatusBar,
  TouchableOpacity,
  Alert
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
// ICON
import { 
  faPlusSquare 
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// AUTH
import { getToken } from '@/app/lib/secure-store';
// AXIOS
import axios from 'axios';
// API
import { config } from '@/app/lib/config';
import Posts from '@/app/components/posts-component';

const { width } = Dimensions.get('window');

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

const Latest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});

  const loadPosts = async (page: number) => {
    if (loading) return;
    
    setLoading(true);
    setError('');

    try {
      const userToken = await getToken();
      setToken(userToken);
      
      const response = await axios.get(`${config.endpoint}/post/all?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      
      const data = response.data.data;
      
      // Create liked posts map from the hasLiked field
      const likedPostsMap = data.reduce((acc: Record<string, boolean>, post: Post) => {
        acc[post.id] = post.hasLiked;
        return acc;
      }, {});

      // Update posts and liked status
      if (page === 1) {
        setPosts(data);
        setLikedPosts(likedPostsMap);
      } else {
        setPosts(prevPosts => [...prevPosts, ...data]);
        setLikedPosts(prev => ({
          ...prev,
          ...likedPostsMap
        }));
      }

      setHasMore(currentPage < response.data.totalPages);

    } catch (error: any) {
      console.error('Error loading posts:', error);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    loadPosts(1);
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPosts(nextPage);
    }
  };

  // Function to update like count when a post is liked/unliked
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

  useEffect(() => {
    loadPosts(1);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24, color: COLORS.blue1 }}>UCGATOR</Text>
          <View>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faPlusSquare} size={32} color={COLORS.blue1} />
            </TouchableOpacity>
          </View>
        </View>
        
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Posts 
            posts={posts}
            loading={loading}
            onRefresh={handleRefresh}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            likedPosts={likedPosts}
            onLikeUpdate={handleLikeUpdate}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Latest;

const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  gray: '#D3D3D3',
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  errorText: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: COLORS.blue1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  retryButtonText: {
    fontFamily: 'Montserrat-Bold',
    fontSize: 16,
    color: 'white',
  },

  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    overflow: 'hidden',
  },

  headerBackground: {
    backgroundColor: COLORS.blue1,
    width: width,
    height: '100%',
  },

  headerContent: {
    position: 'absolute',
    top: 30,
    left: 10,
    alignItems: 'flex-start',
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  buttonRow: {
    marginTop: 200,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  scrollViewContent: {
    paddingBottom: 40,
  },

  announcementContainer: {
    backgroundColor: COLORS.gray,
    marginVertical: 5,
    height: 'auto',
    overflow: 'hidden',
  },

  profileName: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    margin: 0,
  },

  announcementMessage: {
    fontSize: 16,
    margin: 10,
    fontFamily: 'Montserrat-Regular',
    marginLeft: 20,
  },

  announcementImage: {
    width: '100%',
    height: 300,
    marginBottom: 10,
  },

  likeContainer: {
    alignItems: 'flex-start',
    margin: 10,
    marginLeft: 20,
    marginBottom: 20,
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },

  undoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    padding: 10,
    borderRadius: 8,
  },

  undoText: {
    color: COLORS.blue1,
    fontSize: 14,
    marginTop: 0,
    fontFamily: 'Montserrat-Regular',
  },

  undoButtons: {
    flexDirection: 'row',
    marginTop: 0,
  },

  undoButton: {
    color: COLORS.blue1,
    fontSize: 14,
    marginRight: 10,
    fontFamily: 'Montserrat-Bold',
  },

  deleteButton: {
    color: 'red',
    fontSize: 14,
    marginLeft: 10,
    fontFamily: 'Montserrat-Bold',
  },

  likePopup: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    zIndex: 2,
  },

  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },

  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 10,
  },

  announcementTime: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    position: 'absolute',
    paddingTop: 30,
    paddingLeft: 50,
  },
});