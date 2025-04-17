import React, { useEffect } from 'react'

// COMPONENTS
import {  Image, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, Keyboard, StatusBar, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';

// ICONS
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// Debug Function
const generateRandomTimestamp = (): Date => {
    const now = new Date();
    const randomTime = Math.floor(Math.random() * now.getTime());
    return new Date(randomTime);
};

const ProfileInfoWindow = () => {
    const { user } = useAuth();
    const router = useRouter();
    generateRandomTimestamp();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle="light-content" />
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView style={styles.container}>

                        {/* Profile Header */}
                        <ImageBackground style={styles.profileHeaderContainer} source={IMAGES.menu_image_cover} resizeMode='stretch'>   
                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15 }} onPress={() => router.back()}>
                                <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                                </TouchableOpacity>
                                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white }}>First Aid</Text>
                            </View>
                            
                            <View>
                                <View style={styles.profileHeader}>
                                    {user?.avatar ? (
                                        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8}}/>
                                    )}

                                    {/* Profile Name and Email */}
                                    <View>
                                        <Text style={{ color: COLORS.pmy.white, fontSize: 18, fontFamily: 'Montserrat-Bold',}}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                                        <Text style={{ color: '#d0e0f0', fontFamily: 'Montserrat-Regular',}}>{user?.email}</Text>
                                    </View>

                                    {/* Edit Profile Icon */}
                                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 8, borderRadius: 5, position: 'absolute', right: 10 }} onPress={() => router.push('./edit-profile')}>   
                                        <FontAwesomeIcon icon={faPencil} size={15} color={COLORS.pmy.white} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            
                        </ImageBackground>

                        {/* About Me Section */}
                        <View style={{ backgroundColor: '#BCD4E6', marginHorizontal: 10, marginBottom: 5, borderRadius: 10, padding: 15}}>
                            <Text style={styles.sectionTitle}>About Me</Text>
                            <Text style={styles.sectionContent}>{}</Text>
                        </View>

                        {/* Timeline Section */}
                        <View style={{ backgroundColor: '#BCD4E6', marginHorizontal: 10, marginBottom: 5, borderRadius: 10, padding: 15 }}>
                            <Text style={styles.sectionTitle}>Timeline</Text>
                            <Text style={styles.sectionContent}>Student</Text>
                        </View>

                        {/* Images Section FAK ET*/}
                        {[1, 2, 3, 4, 5].map((index) => (
                        <View key={index} style={{ marginVertical: 10, alignItems: 'center' }}>
                            <View style={{ backgroundColor: '#BCD4E6', borderRadius: 10, width: '95%' }}>

                            {/* Combined Post Header and Content */}
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                        
                                    {user?.avatar ? (
                                        <Image source={{ uri: user?.avatar }} style={styles.avatar_post} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCircleUser} size={35} color={COLORS.pmy.white} style={{ marginRight: 8}}/>
                                    )}
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, }}>{user?.lastName}, {user?.firstName}</Text>
                                            <Text style ={{ color: '#000000', fontFamily: 'Montserrat-Regular', }}>{generateRandomTimestamp().toLocaleString()}</Text>
                                        </View>
                                    </View>
                                    
                                    <Image source={require('@/assets/images/uc-building-image.jpg')} style={styles.postImage} />
                                </View>
                            </View>
                        </View>
                        ))}
                    </ScrollView>
                </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

export default ProfileInfoWindow;

const screenWidth = Dimensions.get('window').width; // Get the screen width
const imageHeight = screenWidth * (9 / 16); // Calculate height for 16:9 aspect ratio

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    profileHeaderContainer: {
        height: 175,
        padding: 15,
    },
    profileHeader: {
        width: '100%', 
        paddingVertical: 12, 
        paddingHorizontal: 8, 
        flexDirection: 'row', 
        alignItems: 'center', 
    },
    avatar: {
        width: 65, 
        height: 65, 
        borderRadius: 32.5, 
        marginRight: 8, 
        borderWidth: 1.5, 
        borderColor: COLORS.pmy.white
    },
    avatar_post: {
        width: 35, 
        height: 35, 
        borderRadius: 32.5, 
        marginRight: 8, 
        borderWidth: 1.5, 
        borderColor: COLORS.pmy.white
    },
    name: {
        color: COLORS.pmy.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    editProfile: {
    },
    sectionTitle: {
        marginBottom: 5,
        fontFamily: 'Montserrat-Bold',
    },
    sectionContent: {
        color: '#333333',
        fontFamily: 'Montserrat-Regular',
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CCCCCC',
        marginRight: 10,
    },
    postUsername: {
        
    },
    postImage: {
        alignSelf: 'center',
        width: screenWidth,
        height: imageHeight,
    },
});