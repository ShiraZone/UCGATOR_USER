import React from 'react';
// components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// utilities
import COLORS from '@/app/constants/colors';
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
    faShare,
    faBell
} from '@fortawesome/free-solid-svg-icons';

import { useRouter } from 'expo-router';
import NotificationIcon from '@/app/components/notification-icon';

interface SettingsItemProps {
    id: number,
    icon: any,
    title: string,
    onPress: () => void,
}

const SettingsItem1 = ({ id, icon, title, onPress }: SettingsItemProps) => {
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
    const { user, logout } = useAuth();
    const router = useRouter();

    const handlePress = (routeName: string) => {
        switch (routeName) {
            case 'Profile':
                // Navigate to the user's profile screen
                if (user?._id) {
                    router.push({
                        pathname: '/(root)/user/[id]',
                        params: { id: user._id }
                    });
                }
                break;
            case 'Settings':
                // Navigate to settings
                router.push('/(root)/menu/settings');
                break;
            case 'Help':
                // Navigate to help/about
                router.push('/(root)/menu/faq-section');
                break;
            case 'Save':
                // Navigate to saved items
                router.push('/(root)/menu/saves');
                break;
            case 'First Aid':
                // Navigate to first aid
                router.push('/(root)/menu/first-aid');
                break;
            case 'Emergency':
                // Navigate to emergency
                router.push('/(root)/menu/emergency');
                break;
            case 'Share the App':
                router.push('/(root)/menu/share')
                break;
            default:
                console.log('Route not defined:', routeName);
        }
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white' }} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle={'light-content'} backgroundColor={COLORS.pmy.blue1} />
            <View style={{ margin: 10, backgroundColor: COLORS.pmy.blue1, borderRadius: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 25 }}>
                <TouchableOpacity onPress={() => handlePress('Profile')} style={{ flexDirection: 'row', alignItems: 'center'}}>
                    {user?.avatar ? (
                        <Image source={{ uri: user.avatar }} style={{ width: 75, height: 75, borderRadius: 50, marginRight: 10, borderWidth: 2, borderColor: 'white' }} resizeMode='contain' />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={200} color={COLORS.pmy.blue1} style={{ width: '100%', height: 200, backgroundColor: COLORS.pmy.blue1, borderRadius: 10 }} />
                    )}
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', textAlign: 'left', color: COLORS.pmy.white }}>{user?.firstName} {user?.lastName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', color: COLORS.pmy.white }}>{user?.email}</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/(root)/menu/notifications')}>
                    <NotificationIcon color={COLORS.pmy.white} size={22} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 15 }}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <SettingsItem2 id={1} title='Save List' icon={faBookmark} onPress={() => handlePress('Save')} />
                    <SettingsItem2 id={2} title='First Aid' icon={faHeartPulse} onPress={() => handlePress('First Aid')} />
                </View>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <SettingsItem2 id={3} title='Emergency' icon={faWarning} onPress={() => handlePress('Emergency')} />
                    <SettingsItem2 id={4} title='Settings' icon={faGear} onPress={() => handlePress('Settings')} />
                </View>
                <View style={{ flexDirection: 'column', width: '100%', borderRadius: 10, padding: 15, borderWidth: 1, borderColor: COLORS.pmy.blue1 }}>
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
        borderRadius: 10,
        paddingVertical: 5,
        width: '100%', // Adjusted to take full width of the view for one item per row
    },
    settingsItem2: {
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        width: '48%', // Adjusted to take half the width of the view for two items per row
        marginHorizontal: '1%', // Added margin to create spacing between items
        borderWidth: 1,
        borderColor: COLORS.pmy.blue1
    }
})