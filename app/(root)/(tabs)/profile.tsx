import React from 'react';
// components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, StatusBar, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SafeAreaView } from 'react-native-safe-area-context';
// utilities
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';
// hooks
import { useAuth } from '@/app/lib/auth-context';
// ICON
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

interface SettingsItemProps {
    icon: any,
    title: string,
    subtitle: string | null
    onPress: () => void,
}

interface User {
    id: string;
    email: string;
    avatar: string;
    firstName: string;
    middleName: string;
    lastName: string;
    verified: boolean;
}

const SettingsItem = ({ icon, title, subtitle, onPress }: SettingsItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.settingsItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8 }}>
                <FontAwesomeIcon icon={icon} size={28} color={COLORS.pmy.blue1} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', letterSpacing: 1.25 }}>{title}</Text>
                    <Text style={{ fontSize: 12, fontFamily: 'Montserrat-Regular' }}>{subtitle}</Text>
                </View>
                <FontAwesomeIcon icon={faArrowRight} size={18} color={COLORS.pmy.blue1} style={{ position: 'absolute', right: 0 }} />
            </View>
        </TouchableOpacity>
    );
}

const Profile = () => {
    const { logout, user } = useAuth();
    const router = useRouter();

    const handlePress = (title: string) => {
        switch (title) {
            case 'Profile Information':
                router.push('/(root)/menu/profile-information');
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
            default:
                alert(`${title} is clicked`);
        }
    }

    return (
        <ScrollView contentContainerStyle={{ paddingBottom: 75, flex: 1 }} showsVerticalScrollIndicator={false}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle={'light-content'} />
            <ImageBackground style={{ minHeight: 'auto', maxHeight: 175, height: 175, padding: 15 }} source={IMAGES.menu_image_cover}>
                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', letterSpacing: 1.5, color: COLORS.pmy.white }}>Menu</Text>
                <View style={{ width: '100%', paddingVertical: 12, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', marginBottom: 50 }}>
                    {user?.avatar ? (
                        <Image source={{uri: user.avatar}} style={{ width: 65, height: 65, borderRadius: 32.5, marginRight: 8, borderWidth: 1.5, borderColor: COLORS.pmy.white}} resizeMode='contain'/>
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                    )}
                    <View style={{ flexDirection: 'column', gap: 2 }}>
                        <Text style={{ fontSize: 20, fontFamily: 'Montserrat-Bold', textAlign: 'left', color: COLORS.pmy.white }}>{user?.firstName} {user?.lastName}</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Light', color: COLORS.pmy.white }}>{user?.email}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 8, borderRadius: 5, position: 'absolute', right: 0 }}>
                        <FontAwesomeIcon icon={faPencil} size={15} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            <View style={{ paddingHorizontal: 15 }}>
                <SettingsItem icon={faUser} title='Profile Information' subtitle='Your profile information' onPress={() => handlePress('Profile Information')} />
                <SettingsItem icon={faBell} title='Notification' subtitle='System notification settings' onPress={() => handlePress('Notification')} />
                <SettingsItem icon={faHeartPulse} title='First Aid' subtitle='Learn first aid tips' onPress={() => handlePress('First Aid')} />
                <SettingsItem icon={faWarning} title='Emergency' subtitle='Emergency contact details' onPress={() => handlePress('Emergency')} />
                <SettingsItem icon={faGear} title='Settings' subtitle='App settings and preferences' onPress={() => handlePress('Settings')} />
                <SettingsItem icon={faQuestionCircle} title='Help Center' subtitle='Frequently asked questions and help center' onPress={() => handlePress('Help')} />
                <SettingsItem icon={faShare} title='Share the App' subtitle='Invite friends to use the app' onPress={() => handlePress('Share the App')} />
                <SettingsItem icon={faDoorOpen} title='Logout' subtitle='Logout your account' onPress={() => { logout() }} />
            </View>
        </ScrollView>
    )
}

export default Profile

const styles = StyleSheet.create({
    settingsItem: {
        width: '100%',
        marginVertical: 3
    }
})