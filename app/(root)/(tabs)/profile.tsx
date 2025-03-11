import { ScrollView, Settings, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import COLORS from '@/app/constants/colors'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useAuth } from '@/app/lib/auth-context'

interface SettingsItemProps {
    icon: any,
    title: string,
    onPress: () => void,
    textStyle: any,
    showArrow: boolean
}

const SettingsItem = ({ icon, title, onPress, textStyle, showArrow }: SettingsItemProps) => {
    <TouchableOpacity>
        <View>
            <FontAwesomeIcon icon={icon} />
            <Text>{title}</Text>
        </View>
    </TouchableOpacity>
}

const Profile = () => {
    const { logout } = useAuth();

    return (
        <SafeAreaView style={{ height: '100%', backgroundColor: COLORS.white.white1 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 10 }}>
                <Text>Profile</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 8 }}>

                </View>
                <View>

                </View>
                <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, }}>

                </View>
                <TouchableOpacity onPress={() => {logout()}}>
                    <Text>LOGOUT</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        height: '100%'
    }
})