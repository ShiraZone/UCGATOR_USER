import { StyleSheet, Text, View, Dimensions, ScrollView, TouchableOpacity, Animated, Button, Image, StatusBar } from 'react-native';
import React, { useState, useRef } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

/**
 * Latest component displays a scrollable list of announcements with interactive features.
 *
 * @component
 * @returns {JSX.Element} The rendered Latest screen with dynamic header and announcement cards.
 *
 * @example
 * // Use in your navigation stack or render directly
 * <Latest />
 *
 * @features
 * - Shrinking header on scroll using Animated.
 * - Touchable placeholders for announcements.
 * - Add and remove announcements dynamically with buttons.
 *
 * @state
 * @state {Animated.Value} scrollY - Tracks the vertical scroll offset.
 * @state {number} headerHeight - Controls the height of the header (shrinks with scroll).
 * @state {string[]} announcements - List of current announcements shown in the scroll view.
 * @state {boolean[]} liked - Tracks whether each announcement is liked.
 * @state {boolean[]} hidden - Tracks whether each announcement is hidden.
 * @state {boolean[]} showLikePopup - Tracks whether each announcement's like popup is shown.
 *
 * @function handleAddAnnouncement - Adds a new announcement to the list.
 * @function handleRemoveAnnouncement - Removes the last announcement from the list.
 * @function handlePlaceholderClick - Handles tap event for a specific announcement.
 * @function handleScroll - Updates the header height when scrolling.
 * @function handleLikeToggle - Toggles the like status of an announcement.
 * @function handleHideAnnouncement - Hides an announcement.
 * @function handleUndoHide - Undoes the hiding of an announcement.
 *
 * @style
 * Styles are defined using StyleSheet for layout, color, and typography customization.
 */

const Latest = () => {
  const router = useRouter();
  const [scrollY, setScrollY] = useState(new Animated.Value(0));
  const [headerHeight, setHeaderHeight] = useState(189);
  const [announcements, setAnnouncements] = useState([
    'Profile name 1',
    'Profile name 2',
    'Profile name 3',
    'Profile name 4',
    'Profile name 5',
    'Profile name 6',
  ]);
  const [liked, setLiked] = useState(announcements.map(() => false));
  const [hidden, setHidden] = useState(announcements.map(() => false));
  const [showLikePopup, setShowLikePopup] = useState(announcements.map(() => false));
  const likeOpacity = useRef(announcements.map(() => new Animated.Value(0))).current;
  const likeScale = useRef(announcements.map(() => new Animated.Value(0))).current;

  const handlePlaceholderClick = (placeholderName: string) => {
    console.log(`${placeholderName} clicked`);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollOffset = event.nativeEvent.contentOffset.y;
        const newHeaderHeight = Math.max(100, 189 - scrollOffset);
        setHeaderHeight(newHeaderHeight);
      },
    }
  );
  
  /**
   * Handles the addition of a new announcement.
   * Increments the announcement count and updates the state.
   */
  const handleAddAnnouncement = () => {
    const newNumber = announcements.length + 1;
    setAnnouncements([...announcements, `Announcement ${newNumber}`]);
  };

  /**
   * Handles the removal of an announcement by index.
   * Updates the announcements, liked, and hidden states.
   *
   * @param {number} index - The index of the announcement to remove.
   */
  const handleRemoveAnnouncement = (index: number) => {
    if (announcements.length > 0) {
      setAnnouncements(announcements.filter((_, i) => i !== index));
      setLiked(liked.filter((_, i) => i !== index));
      setHidden(hidden.filter((_, i) => i !== index));
    }
  };

  /**
   * Toggles the like status of an announcement.
   * Animates the like popup and updates the liked state.
   *
   * @param {number} index - The index of the announcement to toggle like status.
   */
  const handleLikeToggle = (index: number) => {
    setLiked(liked.map((item, i) => (i === index ? !item : item)));
    setShowLikePopup(showLikePopup.map((item, i) => (i === index ? true : item)));
    Animated.parallel([
      Animated.timing(likeOpacity[index], {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale[index], {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(likeOpacity[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(likeScale[index], {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowLikePopup(showLikePopup.map((item, i) => (i === index ? false : item)));
        });
      }, 1000);
    });
  };

  /**
   *                                    ++====++*+=====-                                                 
                              ==**#####*++*#*****++=-=-:                                            
                         ***+*####%%%#######%%##*+++++==-:                                          
                         *#####%%%%%%%%%%%%%%%#%%####**++=---                                       
                        ###*##%%%%%%%@@%%%%%#*++#%%%#####*+=--                                      
                         **#%%%%%%%%%%##*#%%#%%#+-=++###*+*+=:                                      
                        ####%%@%%@@%#*++++##%%%@@%#*+-+**++=-:                                      
                        #%%%%%%%%%%#*++=---==+*##=+#%#++****+-:                                     
                       #%%%%%%@%%%##*++=----==++-:----:-   ++=-                                     
                      #%@@%%@@@@@%#***+==--++*+==:::::..                                            
                    ####%%%%%@@%%##**++===*#***==-:::...                                            
                   #%%%@%#%%%@@%%##***+++###*##*+=::....                                            
                  #%%%%#####%@%%%##*****%%%###%#*+-:....                                            
                 *#%%%##%%%%@@%%%##****#%%#%%%%%#*=-:...                                            
                ####%##%@@@@@%%%###****#%%%%%%@@%#*=-:..                                            
                #%%#%%%@@@@@@%%%####***#%%%%%%@@@%#+-:...                                           
                #%*#+#%@@@@@%%%%%%####*#*#%%%%@@@%#*+-:...                                          
               #%#*+##%@%%%%%%@@%%%#####**###%#*-:%#*=-::.                                          
               #%#++*#%@%%%%%%%%@@%%####****+=:.. %%#+=-::                                          
              #%%*=**%@@%%%%%%%%%@%%%##*+++-::.:-   %#*=-:                                          
              #%%++*%%@%#%##**#%%%@%%#*+==-::-+*+-   %%#                                            
              #%#=*%%%%%#%#####%%%@@%#*++-=*****==--                                                
               #*-+#%%%%%%%###**#%%%@@@%%#%%##***++=-                                               
              #*+-=%@@@##%%%##**    %%@@@@@@%%%%#*++-                                               
           %%%#*=+*%%%**#####*+      %%@@@@@@%%***=                                                 
          %%%%%#***%##*##*++*+=       %%@@@@@%#=+*+-                                                
          %%%%%*#*%%#%#*#+=++=        #%%%%%@#*=+++=--                                              
           ##%%%##%@%*%*=*+*=-     ****#%%%%#%+=%**+=+                                              
           #%%@%#%%%%++*++#*+=+     *##%%%%%%##+*#*+=-                                              
            %%%@@%%@*=#*#***+++     #%%%%%##**+#%+*#+==                                             
         ##%%%%@@@*-=*#%=**#*+=    #%%%%@@#**+*%%+***+=                                             
        ##%%###%@#=*#%#+%****++=  *#%%%@@%*%%##*-+==++-:                                            
       %%%%%@@@@%%*=%%#+%%+**++=  ##%%@@%%+=#%*#++#***+-::                                          
       %%%%@@%%%##*+%#+++#%+**+==#%%@%%%@@#==*##%*+*#***#=-                                         
     %%%@%%%@@@%%%%****++*##+*+**+*%%%@%%@#=#+####++***+##+-                                        
     @@@@@%%@%#%%%#######***#*+**##%%@%@@%+#@*##***%#*+*#**+-                                       
       @%%@@##%@@@@@@%##%******==#%%%@%@@%*%@#*#%#****++*#*#=                                       
        @%%#%@@%%%%#%*#***+++===--*%%%%%%%##@#+###*=-----=++                                        
        %%%%@%@#@@##@###=**+--:::::*%@%@@%%%@##**#*++==-:..:                                        
       @%%%%%%@%@@%#%#*##=====--::::-#%@%%%%%#%%*++*+====-:...                                      
       %%%@@%@%%@%%#%***#*===----:::::+%%%%#%#######*=+*+==-:...                                    
       %%@%%%%@@%%%*##**#+=+==---=-:::::*########***###++*--==:..:                                  
      %%%%##%#%%%###*****+-+*=+---+-:--..-*%%%%%%####***###+-:=-:::::                               
      #######*##*#*#***#*+--++-=+--+=::=::::=#%@@@@%%%###*###*+=-:::::::::--==-::                   
      %########*****#***#*-:=*+:-+=-==:-----==--=**#@@@%%##****+=-----::-=++=---::::.               
      %%%%%%%%%#******++**=:-=*+:-+-:+=:=+-::-+##*=-:=%@@%#######**##***++-::------:..:             
        @@@@@@@@%#***+=-+*=::-=++::=+==:.-*#+--*#***++==-:.:*#%%%###%####*=:::::-=--:.:::           
               @@%#***=-===:.:-=+=::=++=::+***==-:-++++=:::..:=+**%#*#*+++++=-=+====:.:-::          
                 %%##******+--*%%#+--*%%#*=:-%%#+--:=*#*+------:--==#@@%%########*++--:+*           
                  %%%######**=:-@%*+--*@%#+---*%#*+-:.-*#**+***+-:...   @@%%%%%%%%%#***             
                    @@@@@@%##+-:-%%*=-:=@%*+-::*%#*==-:-######*+=---:        @@@@@@                 
                           %%*+=-+%#*+--#%#*+=:-%%#*+-:.+%%%%%%##**+=                               
                            @%#+-=%%#*=:=@%**=-:=@#**+-::#@@@@@@%%%                                 
                              @%#%%@%##*#%@%%#*=+ @%%#**#                                           
   * Hides an announcement by index.
   * Updates the hidden state.
   *
   * @param {number} index - The index of the announcement to hide.
   */
  const handleHideAnnouncement = (index: number) => {
    setHidden(hidden.map((item, i) => (i === index ? true : item)));
  };

  /**
   * Undoes the hiding of an announcement by index.
   * Updates the hidden state.
   *
   * @param {number} index - The index of the announcement to unhide.
   */
  const handleUndoHide = (index: number) => {
    setHidden(hidden.map((item, i) => (i === index ? false : item)));
  };

  let lastTap: number | null = null;
  /**
   * HEHE
   * Handles a double-tap event on an announcement.
   * Toggles the like status if the announcement is not already liked.
   *
   * @param {number} index - The index of the announcement that was double-tapped.
   */
  const handleDoubleTap = (index: number) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      if (!liked[index]) {
        handleLikeToggle(index);
        setShowLikePopup(showLikePopup.map((item, i) => (i === index ? true : item)));
        Animated.parallel([
          Animated.timing(likeOpacity[index], {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(likeScale[index], {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(likeOpacity[index], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
              Animated.timing(likeScale[index], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }),
            ]).start(() => {
              setShowLikePopup(showLikePopup.map((item, i) => (i === index ? false : item)));
            });
          }, 1000);
        });
      } else {
        setShowLikePopup(showLikePopup.map((item, i) => (i === index ? true : item)));
        Animated.timing(likeOpacity[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setTimeout(() => {
            Animated.timing(likeOpacity[index], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              setShowLikePopup(showLikePopup.map((item, i) => (i === index ? false : item)));
            });
          }, 1000);
        });
      }
    } else {
      lastTap = now;
    }
  };

  /**
   * Handles the like button click event.
   * Toggles the like status and animates the like popup.
   *
   * @param {number} index - The index of the announcement for the like button clicked.
   */
  const handleLikeButtonClick = (index: number) => {
    if (!liked[index]) {
      setShowLikePopup(showLikePopup.map((item, i) => (i === index ? true : item)));
      Animated.parallel([
        Animated.timing(likeOpacity[index], {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(likeScale[index], {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(likeOpacity[index], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(likeScale[index], {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowLikePopup(showLikePopup.map((item, i) => (i === index ? false : item)));
          });
        }, 1000);
      });
    }
    handleLikeToggle(index);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      <ScrollView overScrollMode='never' bounces={false}>
        <View style={{ paddingHorizontal: 15, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 24, color: COLORS.blue1 }}>UCGATOR</Text>
          <View>
            <TouchableOpacity onPress={() => router.push('/(root)/latest/new-post')}>
              <FontAwesomeIcon icon={faPen} size={25} color={COLORS.blue1} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          bounces={false}
          overScrollMode='never'
        >
          {announcements.map((text, index) => (
            <TouchableOpacity key={index} onPress={() => handleDoubleTap(index)} activeOpacity={1}>
              <View style={styles.announcementContainer}>
                {hidden[index] ? (
                  <View style={styles.undoContainer}>
                    <Text style={styles.undoText}>Announcement hidden</Text>
                    <View style={styles.undoButtons}>
                      <TouchableOpacity onPress={() => handleUndoHide(index)}>
                        <Text style={styles.undoButton}>Undo</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleRemoveAnnouncement(index)}>
                        <Text style={styles.deleteButton}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <>
                    <TouchableOpacity style={styles.closeButton} onPress={() => handleHideAnnouncement(index)}>
                      <FontAwesome name="times" size={20} color={COLORS.blue1} />
                    </TouchableOpacity>
                    <View style={styles.profileContainer}>
                      <Image source={require('@/assets/images/profile-placeholder.png')} style={styles.profileImage} />
                      <Text style={styles.profileName}>{text}</Text>
                      <Text style={styles.announcementTime}>Posted 10 minutes ago</Text>
                    </View>
                    <Image source={require('@/assets/images/shark.webp')} style={styles.announcementImage} />
                    <Text style={styles.announcementMessage}>Announcement message</Text>
                    <View style={styles.likeContainer}>
                      <TouchableOpacity onPress={() => handleLikeButtonClick(index)}>
                        <FontAwesome
                          name={liked[index] ? "thumbs-up" : "thumbs-o-up"}
                          size={24}
                          color={COLORS.blue1}
                        />
                      </TouchableOpacity>
                    </View>
                    {showLikePopup[index] && (
                      <Animated.View style={[styles.likePopup, { opacity: likeOpacity[index] }]}>  
                        <FontAwesome name="thumbs-up" size={48} color={COLORS.blue1} />
                      </Animated.View>
                    )}
                  </>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Latest;

const COLORS = {
  blue1: '#2B4F6E',
  white: '#F6F6F6',
  gray: '#D3D3D3',
};

/**
 * Styles for the Latest component.
 *
 * @style
 * @property {object} container - Style for the main container.
 * @property {object} headerContainer - Style for the header container.
 * @property {object} headerBackground - Style for the header background.
 * @property {object} headerContent - Style for the header content.
 * @property {object} headerTitle - Style for the header title text.
 * @property {object} buttonRow - Style for the button row.
 * @property {object} scrollViewContent - Style for the scroll view content.
 * @property {object} announcementContainer - Style for the announcement container.
 * @property {object} profileName - Style for the profile name text.
 * @property {object} announcementMessage - Style for the announcement message text.
 * @property {object} announcementImage - Style for the announcement image.
 * @property {object} likeContainer - Style for the like button container.
 * @property {object} closeButton - Style for the close button.
 * @property {object} undoContainer - Style for the undo container.
 * @property {object} undoText - Style for the undo text.
 * @property {object} undoButtons - Style for the undo buttons.
 * @property {object} undoButton - Style for the undo button.
 * @property {object} deleteButton - Style for the delete button.
 * @property {object} likePopup - Style for the like popup animation.
 * @property {object} profileContainer - Style for the profile container.
 * @property {object} profileImage - Style for the profile image.
 * @property {object} announcementTime - Style for the announcement time text.
 */
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    flex: 1,
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