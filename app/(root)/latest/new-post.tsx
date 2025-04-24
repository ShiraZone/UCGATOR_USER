import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming FontAwesome is used
import { useRouter } from 'expo-router';

/**
 * Predefined color constants for styling.
 * @const {object} COLORS
 */
const COLORS = {
  blue1: '#2B4F6E',  
  white: '#FFFFFF',
  lightGray: '#F0F2F5',
  darkGray: '#65676B',
  black: '#000000',
  green: '#4CAF50', 
  blueIcon: '#2E81F4', 
  yellowIcon: '#F7B928',
  redIcon: '#E4405F',
  locationIcon: '#F5533D',
  liveIcon: '#E02828',
  backgroundIcon: '#7B3CB4',
  cameraIcon: '#58C472',
  gifIcon: '#31A2F7',
};

/**
 * Represents the New Post screen UI.
 * Allows users to create a new post with text and various options.
 *
 * @component
 * @returns {JSX.Element} The rendered New Post screen.
 */
const NewPost = () => {
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    /**
     * Handles the action when the back button is pressed.
     * Navigates back to the previous screen.
     */
    const handleBack = () => {
        router.back();
    };

    /**
     * Handles the action when the 'Next' button is pressed.
     * Placeholder for post submission logic.
     */
    const handleNext = () => {
        console.log('Next button pressed');
        // Add logic to handle post creation/submission
    };

    /**
     * Toggles the visibility of the action drawer.
     */
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    /**
     * Renders a single action item in the bottom sheet.
     *
     * @param {object} props - The component props.
     * @param {string} props.iconName - The name of the FontAwesome icon.
     * @param {string} props.text - The text label for the action.
     * @returns {JSX.Element} The rendered action item.
     */
    const ActionItem = ({ iconName, text }: { iconName: string; text: string }) => (
        <TouchableOpacity style={styles.actionItem}>
            <FontAwesome name={iconName as any} size={24} color={COLORS.blue1} style={styles.actionIcon} />
            <Text style={styles.actionText}>{text}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <FontAwesome name="arrow-left" size={24} color={COLORS.black} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create post</Text>
                <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>POST</Text>
                </TouchableOpacity>
            </View>

            {/* User Info and Post Options */}
            <View style={styles.userInfoContainer}>
                <Image source={require('@/assets/images/profile-placeholder.png')} style={styles.profileImage} />
                <View>
                    <Text style={styles.userName}>Profile Name</Text>
                    <View style={styles.postOptionsRow}>
                        {/* Add actual option dropdowns/buttons here */}
                        <TouchableOpacity style={styles.optionButton}>
                           <FontAwesome name="globe" size={12} color={COLORS.darkGray} />
                           <Text style={styles.optionText}>Public</Text>
                           <FontAwesome name="caret-down" size={12} color={COLORS.darkGray} />
                        </TouchableOpacity>
                        {/* Add more options as needed */}
                    </View>
                </View>
            </View>

            {/* Text Input Area */}
            <ScrollView style={styles.inputScrollView}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Add post for announcement"
                    placeholderTextColor={COLORS.darkGray}
                    multiline
                />
            </ScrollView>

            {/* Bottom Action Sheet / Drawer */}
            <View style={styles.bottomSheet}>
                <TouchableOpacity style={styles.handleBarContainer} onPress={toggleDrawer}>
                   <View style={styles.handleBar} />
                   <FontAwesome
                       name={isDrawerOpen ? "chevron-down" : "chevron-up"}
                       size={16}
                       color={COLORS.blue1}
                       style={styles.drawerChevron}
                   />
                </TouchableOpacity>
                {isDrawerOpen && (
                    <>
                        <ActionItem iconName="photo" text="Photo/video" />
                        <ActionItem iconName="camera" text="Camera" />
                    </>
                )}
            </View>
        </View>
    );
};

/**
 * StyleSheet for the NewPost component.
 */
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightGray,
        backgroundColor: COLORS.white, 
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.black,
    },
    nextButton: {
        backgroundColor: COLORS.blue1,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 5,
    },
    nextButtonText: {
        color: COLORS.white,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
    },
    userInfoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    profileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userName: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
        color: COLORS.black,
        marginBottom: 4,
    },
    postOptionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionButton: {
       flexDirection: 'row',
       alignItems: 'center',
       backgroundColor: COLORS.lightGray,
       paddingHorizontal: 8,
       paddingVertical: 4,
       borderRadius: 15,
       marginRight: 8,
    },
    optionText: {
        fontSize: 12,
        color: COLORS.darkGray,
        marginLeft: 4,
        marginRight: 4,
        fontFamily: 'Montserrat-Regular',
    },
    inputScrollView: {
        flex: 1, 
        paddingHorizontal: 15,
    },
    textInput: {
        fontSize: 20, 
        color: COLORS.black,
        paddingTop: 10, 
        minHeight: 100, 
        fontFamily: 'Montserrat-Regular',
    },
    bottomSheet: {
        borderTopWidth: 1,
        borderTopColor: COLORS.lightGray,
        paddingBottom: 20, 
        backgroundColor: COLORS.white, 
    },
    handleBarContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    handleBar: {
        width: 40,
        height: 5,
        backgroundColor: COLORS.lightGray,
        borderRadius: 2.5,
    },
    drawerChevron: {
        position: 'absolute',
        right: 15,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
    },
    actionIcon: {
        width: 30,
        textAlign: 'center',
    },
    actionText: {
        marginLeft: 15,
        fontSize: 16,
        color: COLORS.black,
        fontFamily: 'Montserrat-Regular',
    },
});

export default NewPost;
