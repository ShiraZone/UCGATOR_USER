import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import COLORS from '@/app/constants/colors'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faHouse, faMap, faShoePrints, faUser } from '@fortawesome/free-solid-svg-icons'
import { icon } from '@fortawesome/fontawesome-svg-core'

interface TabIcon {
    title: string,
    focused: boolean,
    icon: any
}

const TabIcon = ({ title, icon, focused }: TabIcon) => (
    <View style={styles.tabButton}>
        <FontAwesomeIcon icon={icon} size={24} color={COLORS.white.white1} />
        <Text style={styles.tabButtonText}>{title}</Text>
    </View>
)

const TabsLayout = () => {
    return (
        <Tabs screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: COLORS.accent.accent1,
                position: 'absolute',
                borderTopColor: COLORS.primary.primaryColor1,
                borderTopWidth: 1,
                minHeight: 70,
                paddingTop: 20
            }
        }}>
            <Tabs.Screen name='index' options={{
                title: 'Map',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={faMap} focused={focused} title='MAP' />
                )
            }}></Tabs.Screen>
            <Tabs.Screen name='explore' options={{
                title: 'Explore',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={faShoePrints} focused={focused} title='EXPLORE' />
                )
            }}></Tabs.Screen>
            <Tabs.Screen name='profile' options={{
                title: 'Profile',
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                    <TabIcon icon={faUser} focused={focused} title='PROFILE' />
                )
            }}></Tabs.Screen>
        </Tabs>
    )
}

export default TabsLayout

const styles = StyleSheet.create({
    tabButton: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabButtonText: {
        color: COLORS.white.white1,
        fontFamily: "Montserrat-Medium",
        fontSize: 10,
        width: '100%',
        textAlign: 'center',
        marginTop: 2,
    }
})