import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
    faArrowLeft, 
    faBell, 
    faUserGroup, 
    faCalendarCheck, 
    faExclamationTriangle,
    faBuilding,
    faMapMarkerAlt,
    faLock,
    faCommentAlt,
    faCogs
} from '@fortawesome/free-solid-svg-icons';

import COLORS from '@/app/constants/colors';

interface NotificationOption {
    id: string;
    title: string;
    description: string;
    icon: any;
    defaultEnabled: boolean;
}

const push_notifications = () => {
    const router = useRouter();

    // Notification categories with default states
    const notificationOptions: NotificationOption[] = [
        { 
            id: 'news_updates', 
            title: 'App Updates', 
            description: 'New features and important updates', 
            icon: faCogs,
            defaultEnabled: true
        },
        { 
            id: 'campus_events', 
            title: 'Campus Events', 
            description: 'Upcoming events around you', 
            icon: faCalendarCheck,
            defaultEnabled: true
        },
        { 
            id: 'friends_activity', 
            title: 'Friend Activity', 
            description: 'When someone follows you or interacts', 
            icon: faUserGroup,
            defaultEnabled: false
        },
        { 
            id: 'emergency_alerts', 
            title: 'Emergency Alerts', 
            description: 'Critical campus safety notifications', 
            icon: faExclamationTriangle,
            defaultEnabled: true
        },
        { 
            id: 'nearby', 
            title: 'Nearby Notifications', 
            description: 'Points of interest when you\'re on campus', 
            icon: faMapMarkerAlt,
            defaultEnabled: false
        },
        { 
            id: 'location_updates', 
            title: 'Location Changes', 
            description: 'Changes to buildings or navigation', 
            icon: faBuilding,
            defaultEnabled: false
        },
        { 
            id: 'messages', 
            title: 'Message Notifications', 
            description: 'When you receive new messages', 
            icon: faCommentAlt,
            defaultEnabled: true
        },
        { 
            id: 'security', 
            title: 'Security Alerts', 
            description: 'Account security and login notifications', 
            icon: faLock,
            defaultEnabled: true
        }
    ];

    // Initialize notification states from default values
    const initialNotificationStates: {[key: string]: boolean} = {};
    notificationOptions.forEach(option => {
        initialNotificationStates[option.id] = option.defaultEnabled;
    });

    // State to track notification preferences
    const [notificationStates, setNotificationStates] = useState<{[key: string]: boolean}>(initialNotificationStates);

    // State for the master toggle (enabled if any notification is enabled)
    const [allNotifications, setAllNotifications] = useState(
        Object.values(initialNotificationStates).some(value => value)
    );

    // State for system permission status
    const [systemPermissionGranted, setSystemPermissionGranted] = useState(true);

    // Toggle individual notification
    const toggleNotification = (id: string) => {
        if (!systemPermissionGranted) {
            // If system permission not granted, don't allow toggling individual notifications
            requestSystemPermission();
            return;
        }

        setNotificationStates(prev => {
            const newState = {
                ...prev,
                [id]: !prev[id]
            };
            
            // Check if any notification is turned on
            const anyOn = Object.values(newState).some(value => value);
            setAllNotifications(anyOn);
            
            return newState;
        });
    };

    // Toggle all notifications
    const toggleAllNotifications = () => {
        if (!systemPermissionGranted && !allNotifications) {
            // If trying to turn on notifications but no system permission
            requestSystemPermission();
            return;
        }

        const newAllState = !allNotifications;
        setAllNotifications(newAllState);
        
        // Update all individual notifications
        const newStates = {...notificationStates};
        Object.keys(newStates).forEach(key => {
            newStates[key] = newAllState;
        });
        
        setNotificationStates(newStates);
    };

    // Request system permission (placeholder)
    const requestSystemPermission = () => {
        // In a real implementation, this would use Expo's Notifications API
        // to request permission from the device
        alert('This would trigger the system permission dialog for notifications');
        
        // For demonstration, we'll simulate permission being granted
        setSystemPermissionGranted(true);
    };

    // Utility to count enabled notifications
    const getEnabledCount = () => {
        return Object.values(notificationStates).filter(Boolean).length;
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
                        Push Notifications
                    </Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                    {!systemPermissionGranted && (
                        <View style={{ 
                            backgroundColor: 'rgba(252, 174, 27, 0.15)',
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 20,
                            borderWidth: 1,
                            borderColor: COLORS.alert.warning,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <FontAwesomeIcon icon={faExclamationTriangle} size={22} color={COLORS.alert.warning} style={{ marginRight: 10 }} />
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-SemiBold', fontSize: 14, color: COLORS.pmy.black }}>
                                    Notifications are disabled
                                </Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'gray', marginTop: 2 }}>
                                    {Platform.OS === 'ios' ? 
                                        'Go to device Settings > Notifications > UC Gator to enable' : 
                                        'Please allow notification access for UC Gator'}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={{
                                    backgroundColor: COLORS.alert.warning,
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    borderRadius: 8
                                }}
                                onPress={requestSystemPermission}
                            >
                                <Text style={{ color: 'white', fontFamily: 'Montserrat-SemiBold', fontSize: 12 }}>
                                    Enable
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <Text style={{ 
                        fontSize: 16, 
                        fontFamily: 'Montserrat-Regular', 
                        color: 'gray',
                        marginTop: 10,
                        marginBottom: 20
                    }}>
                        Control which push notifications you receive from UC Gator
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
                                    All Push Notifications
                                </Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'gray' }}>
                                    {allNotifications ? 
                                        `${getEnabledCount()} of ${notificationOptions.length} enabled` : 
                                        'All disabled'}
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
                        Notification Types
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
                                opacity: allNotifications && systemPermissionGranted ? 1 : 0.6
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
                                value={notificationStates[option.id] && allNotifications && systemPermissionGranted}
                                onValueChange={() => toggleNotification(option.id)}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                                disabled={!allNotifications || !systemPermissionGranted}
                            />
                        </View>
                    ))}

                    <TouchableOpacity 
                        style={{
                            backgroundColor: COLORS.pmy.blue2,
                            paddingVertical: 15,
                            borderRadius: 10,
                            alignItems: 'center',
                            marginBottom: 15,
                            marginTop: 10,
                        }}
                    >
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
                        Notifications help you stay updated with campus activities and your friends
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default push_notifications;

const styles = StyleSheet.create({

});