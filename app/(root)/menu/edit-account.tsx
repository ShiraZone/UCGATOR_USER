import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Image, ScrollView, StyleSheet, Text, View, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Keyboard, Alert, } from 'react-native';
import { router, useRouter } from 'expo-router';

// UTILS
import COLORS from '@/app/constants/colors';

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';


const EditAccount = () => {
    const { user } = useAuth();
    return (
        <SafeAreaView style={{ flex: 1}}>
            {/* Header Content */}
            <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.pmy.white, padding: 15 }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginRight: 5 }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1 }}>Profile</Text>
            </View>
            {/* Main Content */}
            <KeyboardAvoidingView style={{ flex: 1, backgroundColor: COLORS.pmy.white }} enabled>
                {/* Profile Info */}
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ padding: 15 }} showsVerticalScrollIndicator={false}>
                        <View style={{ borderRadius: 10, padding: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                                {user?.avatar ? (
                                    <Image source={{ uri: user?.avatar }} style={{ width: 65, height: 65, borderRadius: 32.5, marginRight: 10 }} />
                                ) : (
                                    <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8 }} />
                                )}
                                <View>
                                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue2 }}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2 }}>{user?.email}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default EditAccount