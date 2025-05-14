import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faArrowLeft, 
    faEnvelope, 
    faBell, 
    faUserGroup, 
    faCalendarCheck, 
    faExclamationTriangle,
    faBuilding,
    faLock
} from '@fortawesome/free-solid-svg-icons';

import COLORS from '@/app/constants/colors';

interface NotificationOption {
    id: string;
    title: string;
    description: string;
    icon: any;
}

const email_notifications = () => {
    const router = useRouter();

    // Notification categories
    const notificationOptions: NotificationOption[] = [
        { 
            id: 'news_updates', 
            title: 'News & Updates', 
            description: 'Important news and app updates', 
            icon: faEnvelope 
        },
        { 
            id: 'campus_events', 
            title: 'Campus Events', 
            description: 'Upcoming events in your campus', 
            icon: faCalendarCheck 
        },
        { 
            id: 'friends_activity', 
            title: 'Friends Activity', 
            description: 'Actions from people you follow', 
            icon: faUserGroup 
        },
        { 
            id: 'emergency_alerts', 
            title: 'Emergency Alerts', 
            description: 'Critical safety notifications', 
            icon: faExclamationTriangle 
        },
        { 
            id: 'location_updates', 
            title: 'Location Updates', 
            description: 'Changes to campus buildings or routes', 
            icon: faBuilding 
        },
        { 
            id: 'security', 
            title: 'Security & Privacy', 
            description: 'Account security notifications', 
            icon: faLock 
        },
    ];

    // State to track notification preferences
    const [notificationStates, setNotificationStates] = useState<{[key: string]: boolean}>({
        news_updates: true,
        campus_events: true,
        friends_activity: false,
        emergency_alerts: true,
        location_updates: false,
        security: true,
    });

    // State for the master toggle
    const [allNotifications, setAllNotifications] = useState(true);

    // Toggle individual notification
    const toggleNotification = (id: string) => {
        setNotificationStates(prev => {
            const newState = {
                ...prev,
                [id]: !prev[id]
            };
            
            // Check if all notifications are turned off
            const allOff = Object.values(newState).every(value => !value);
            setAllNotifications(!allOff);
            
            return newState;
        });
    };

    // Toggle all notifications
    const toggleAllNotifications = () => {
        const newAllState = !allNotifications;
        setAllNotifications(newAllState);
        
        // Update all individual notifications
        const newStates = {...notificationStates};
        Object.keys(newStates).forEach(key => {
            newStates[key] = newAllState;
        });
        
        setNotificationStates(newStates);
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.pmy.white }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                    <TouchableOpacity 
                        style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} 
                        onPress={() => router.back()}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ 
                        fontSize: 22, 
                        textAlign: 'center', 
                        fontFamily: 'Montserrat-ExtraBold', 
                        color: COLORS.pmy.blue1, 
                        paddingLeft: 5 
                    }}>
                        Email Notifications
                    </Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                    <Text style={{ 
                        fontSize: 16, 
                        fontFamily: 'Montserrat-Regular', 
                        color: 'gray',
                        marginTop: 10,
                        marginBottom: 20
                    }}>
                        Choose which notifications you'd like to receive via email
                    </Text>

                    {/* All Notifications Toggle */}
                    <View style={{ 
                        flexDirection: 'row', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        backgroundColor: COLORS.sdy.gray1,
                        borderRadius: 12,
                        padding: 15,
                        marginBottom: 20,
                        borderWidth: 2,
                        borderColor: COLORS.pmy.blue1
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: 18, 
                                backgroundColor: 'rgba(43, 79, 110, 0.1)', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginRight: 12,
                            }}>
                                <FontAwesomeIcon icon={faBell} size={18} color={COLORS.pmy.blue1} />
                            </View>
                            <View>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: COLORS.pmy.black }}>
                                    All Email Notifications
                                </Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'gray' }}>
                                    {allNotifications ? 'On' : 'Off'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={allNotifications}
                            onValueChange={toggleAllNotifications}
                            trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                            thumbColor={COLORS.pmy.white}
                        />
                    </View>

                    <Text style={{ 
                        fontSize: 18, 
                        fontFamily: 'Montserrat-SemiBold', 
                        color: COLORS.pmy.blue1, 
                        marginBottom: 15 
                    }}>
                        Notification Categories
                    </Text>
                    
                    {/* Individual Notification Options */}
                    {notificationOptions.map((option) => (
                        <View 
                            key={option.id}
                            style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                backgroundColor: COLORS.sdy.gray1,
                                borderRadius: 12,
                                padding: 15,
                                marginBottom: 15,
                                opacity: allNotifications ? 1 : 0.6
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                <View style={{ 
                                    width: 36, 
                                    height: 36, 
                                    borderRadius: 18, 
                                    backgroundColor: 'rgba(43, 79, 110, 0.1)', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    marginRight: 12,
                                }}>
                                    <FontAwesomeIcon icon={option.icon} size={16} color={COLORS.pmy.blue1} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: COLORS.pmy.black }}>
                                        {option.title}
                                    </Text>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'gray' }}>
                                        {option.description}
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={notificationStates[option.id] && allNotifications}
                                onValueChange={() => toggleNotification(option.id)}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                                disabled={!allNotifications}
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={{
                        backgroundColor: COLORS.pmy.blue2,
                        paddingVertical: 15,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginBottom: 15,
                        marginTop: 10,
                    }}>
                        <Text style={{
                            color: COLORS.pmy.white,
                            fontSize: 16,
                            fontFamily: 'Montserrat-SemiBold',
                        }}>
                            Save Preferences
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Regular',
                        marginBottom: 30,
                    }}>
                        You can change your notification settings at any time
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default email_notifications;

const styles = StyleSheet.create({
    
});