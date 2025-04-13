import React from 'react';
// components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, StatusBar, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// utilities
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
// hooks
import { useAuth } from '@/app/lib/auth-context';
// ICON
import {
    faBell,
    faBookmark,
    faCircleUser,
    faArrowRight,
    faPencil,
    faArrowRightToBracket,
    faWarning,
    faHeartPulse,
    faQuestionCircle,
    faGear,
    faDoorOpen,
    faShare
} from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

const Profile = () => {
    const { logout, user } = useAuth();
    const router = useRouter();
    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 75, flex: 1 }} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle={'light-content'} />
            <ImageBackground style={{ minHeight: 'auto', maxHeight: 175, height: 175, padding: 15 }} source={IMAGES.menu_image_cover}>
                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', letterSpacing: 1.5, color: COLORS.pmy.white }}>Menu</Text>
                <View style={{ width: '100%', paddingVertical: 12, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 50 }}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 65, height: 65, borderRadius: 32.5, marginRight: 8, borderWidth: 1.5, borderColor: COLORS.pmy.white }} resizeMode='contain' />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                    )}
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', textAlign: 'left', color: COLORS.pmy.white }}>{user?.firstName} {user?.lastName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', color: COLORS.pmy.white }}>{user?.email}</Text>
                    </View>
                </View>
            </ImageBackground>
        </ScrollView>
    )
}

export default Profile