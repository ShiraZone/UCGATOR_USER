import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import COLORS from '@/app/constants/colors'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faNewspaper, faMap, faCompass, faUser } from '@fortawesome/free-solid-svg-icons'
import { useFonts } from 'expo-font'

interface TabIconProps {
    title: string;
    focused: boolean;
    icon: any;
}

const TabIcon = ({ title, icon, focused}: TabIconProps) => {
    return (
        <View style={[styles.tabButton, focused && styles.selectedTab]}>
            <FontAwesomeIcon icon={icon} size={20} color={focused ? COLORS.pmy.blue1 : COLORS.white.white1} />
            {focused && <Text style={styles.selectedText}>{title}</Text>}
        </View>
    );
};

const TabsLayout = () => {
    // Load Montserrat fonts
    const [fontsLoaded] = useFonts({
        'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
        'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    });

    // Don't render until fonts are loaded
    if (!fontsLoaded) {
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
    }

    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: styles.tabBar
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Map",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={faMap} focused={focused} title="MAP"/>
                    ),
                }}
            />
            <Tabs.Screen
                name='explore'
                options={{
                    title: 'Explore',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={faCompass} focused={focused} title='EXPLORE'/>
                    )
                }}
            />
            <Tabs.Screen
                name='latest'
                options={{
                    title: 'Latest',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={faNewspaper} focused={focused} title='LATEST'/>
                    )
                }}
            />
            <Tabs.Screen
                name='profile'
                options={{
                    title: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon icon={faUser} focused={focused} title='PROFILE'/>
                    )
                }}
            />
        </Tabs>
    )
}

export default TabsLayout

const styles = StyleSheet.create({
    // KNOWN ISSUE:
    // POSSIBLE:
    // MAP WILL NOT BE VISIBLE IN HERE
    tabBar: {
        backgroundColor: COLORS.pmy.blue1,
        borderTopWidth: 1,
        height: 60,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingTop: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        margin: 10,
    },
    tabButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 25,
    },
    selectedTab: {
        backgroundColor: COLORS.pmy.white,
        minWidth: 80,
    },
    selectedText: {
        color: COLORS.pmy.blue1,
        marginLeft: 5,
        fontFamily: 'Montserrat-Bold',
        fontSize: 12,
    },
})