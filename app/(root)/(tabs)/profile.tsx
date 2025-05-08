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
    faBookmark,
    faCircleUser, 
    faArrowRight,
    faWarning, 
    faHeartPulse, 
    faQuestionCircle, 
    faGear, 
    faDoorOpen, 
    faShare } from '@fortawesome/free-solid-svg-icons';
    
import { useRouter } from 'expo-router';

interface SettingsItemProps {
    id: number,
    icon: any,
    title: string,
    onPress: () => void,
}

const SettingsItem1 = ({ id, icon, title, onPress}: SettingsItemProps) => {
    return (
        <TouchableOpacity id={id.toString()} onPress={onPress} style={styles.settingsItem1}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <FontAwesomeIcon icon={icon} size={28} color={COLORS.pmy.blue1} />
                <Text style={{ marginLeft: 10 }}>{title}</Text>
                <FontAwesomeIcon icon={faArrowRight} size={20} color={COLORS.pmy.blue1} style={{ position: 'absolute', right: 10 }} />
            </View>
        </TouchableOpacity>
    )
}

const SettingsItem2 = ({ id, icon, title, onPress }: SettingsItemProps) => {
    return (
        <TouchableOpacity id={id.toString()} onPress={onPress} style={styles.settingsItem2}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <FontAwesomeIcon icon={icon} size={28} color={COLORS.pmy.blue1} />
                <Text style={{ marginLeft: 10 }}>{title}</Text>
            </View>
        </TouchableOpacity>
    )
}

const Profile = () => {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handlePress = (title: string) => {
        switch (title) {
            case 'Favorites':
                router.push('/(root)/menu/favorites');
                break;
            case 'Notification':
                router.push('/(root)/menu/notification');
                break;
            case 'First Aid':
                router.push('/(root)/menu/first-aid');
                break;
            case 'Emergency':
                router.push('/(root)/menu/emergency');
                break;
            case 'Settings':
                router.push('/(root)/menu/settings');
                break;
            case 'Help':
                router.push('/(root)/menu/faq-section');
                break;
            case 'Share the App':
                router.push('/(root)/menu/share');
                break;
            case 'Profile':
                router.push('/(root)/menu/profile');
                break;
            default:
                alert(`${title} is clicked`);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 75, flex: 1 }} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle={'light-content'} />
            <ImageBackground style={{ minHeight: 'auto', maxHeight: 175, height: 175, padding: 15 }} source={IMAGES.menu_image_cover}>
                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', letterSpacing: 1.5, color: COLORS.pmy.white }}>Menu</Text>
                <TouchableOpacity style={{ width: '100%', paddingVertical: 12, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 50 }} onPress={() => handlePress('Profile')}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 65, height: 65, borderRadius: 32.5, marginRight: 8, borderWidth: 1.5, borderColor: COLORS.pmy.white }} resizeMode='contain' />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                    )}
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', textAlign: 'left', color: COLORS.pmy.white }}>{user?.firstName} {user?.lastName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', color: COLORS.pmy.white }}>{user?.email}</Text>
                    </View>
                </TouchableOpacity>
            </ImageBackground>
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <SettingsItem2 id={1} title='Bookmarks' icon={faBookmark} onPress={() => handlePress('Favorites')} />
                    <SettingsItem2 id={2} title='First Aid' icon={faHeartPulse} onPress={() => handlePress('First Aid')} />
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <SettingsItem2 id={3} title='Emergency' icon={faWarning} onPress={() => handlePress('Emergency')} />
                    <SettingsItem2 id={4} title='Settings' icon={faGear} onPress={() => handlePress('Settings')} />
                </View>
                <View style={{ flexDirection: 'column', width: '100%', backgroundColor: COLORS.pmy.white, borderRadius: 10, padding: 15 }}>
                    <SettingsItem1 id={5} title='About UCGator' icon={faQuestionCircle} onPress={() => handlePress('Help')} />
                    <SettingsItem1 id={6} title='Share the App' icon={faShare} onPress={() => handlePress('Share the App')} />
                    <SettingsItem1 id={7} title='Logout' icon={faDoorOpen} onPress={logout} />
                </View>
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    settingsItem1: {
        backgroundColor: COLORS.pmy.white,
        borderRadius: 10,
        paddingVertical: 5,
        width: '100%', // Adjusted to take full width of the view for one item per row
    },
    settingsItem2: {
        backgroundColor: COLORS.pmy.white,
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        width: '48%', // Adjusted to take half the width of the view for two items per row
        marginHorizontal: '1%', // Added margin to create spacing between items
    }
})