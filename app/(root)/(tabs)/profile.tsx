import React from 'react';
// components
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { SafeAreaView } from 'react-native-safe-area-context';
// utilities
import COLORS from '@/app/constants/colors';
// hooks
import { useAuth } from '@/app/lib/auth-context';
// ICON
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faWarning } from '@fortawesome/free-solid-svg-icons';
import { faHeartPulse } from '@fortawesome/free-solid-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';
import { faShare } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'expo-router';

interface SettingsItemProps {
    icon: any,
    title: string,
    onPress: () => void,
}

const SettingsItem = ({ icon, title, onPress }: SettingsItemProps) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.settingsItem}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
                <FontAwesomeIcon icon={icon} size={22} color={COLORS.white.white1}/>
                <Text style={{ flex: 1, marginLeft: 10, fontSize: 18, color: COLORS.white.white1 }}>{title}</Text>
                <FontAwesomeIcon icon={faArrowRight} size={14} color={COLORS.white.white1}/>
            </View>
        </TouchableOpacity>
    );
}

const Profile = () => {
    const { logout } = useAuth();

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
            case 'FAQs':
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
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.accent.accent1, padding: 10 }}>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} style={{ paddingVertical: 10, flex: 1 }}>
                <View style={[styles.panel, {justifyContent: 'center', alignItems: 'center'}]}>
                    <FontAwesomeIcon icon={faCircleUser} size={75} color={COLORS.white.white1} style={{ marginVertical: 10}}/>
                    <Text style={{ fontSize: 24, fontFamily: 'Montserrat-Medium', color: COLORS.white.white1}}>Charles Peter L. Tigoy</Text>
                </View>
                <View style={styles.panel}>
                    <SettingsItem icon={faUser} title='Profile Information' onPress={() => handlePress('Profile Information')} />
                    <SettingsItem icon={faBell} title='Notification' onPress={() => handlePress('Notification')} />
                    <SettingsItem icon={faHeartPulse} title='First Aid' onPress={() => handlePress('First Aid')} />
                    <SettingsItem icon={faWarning} title='Emergency' onPress={() => handlePress('Emergency')} />
                    <SettingsItem icon={faGear} title='Settings' onPress={() => handlePress('Settings')} />
                </View>
                <View style={styles.panel}>
                    <SettingsItem icon={faQuestionCircle} title='FAQs' onPress={() => handlePress('FAQs')} />
                    <SettingsItem icon={faShare} title='Share the App' onPress={() => handlePress('Share the App')} />
                    <SettingsItem icon={faDoorOpen} title='Logout' onPress={() => {logout()}} />
                </View>
                <View style={{flexDirection: 'row', backgroundColor: COLORS.accent.accent2, marginVertical: 10, marginHorizontal: 15, padding: 25, justifyContent: 'center', borderRadius: 8}}>
                    <FontAwesomeIcon icon={faHeadset} size={24} color={COLORS.white.white1}/>
                    <Text style={{ textAlign: 'center', marginLeft: 10, fontFamily: 'Montserrat-MediumItalic', fontSize: 16, color: COLORS.white.white1}}>Send your inquiries here.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    settingsItem: {
        width: '100%',
        marginVertical: 3
    },
    panel: {
        paddingHorizontal: 4, 
        paddingVertical: 8, 
        backgroundColor: COLORS.accent.accent4, 
        marginVertical: 8, 
        marginHorizontal: 6, 
        borderRadius: 12
    }
})