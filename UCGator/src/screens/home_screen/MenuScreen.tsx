import React from 'react'

// hooks

// components
import COLORS from '../../assets/Colors';

// icons
import { faCircleUser, faStarOfLife, faUser, faSquareH, faGear, faTag } from '@fortawesome/free-solid-svg-icons';

// dependency
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const MenuScreen = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                {/* TOP BAR */}
                <View style={styles.topBar}>
                    <Text style={styles.topBarTitle}>Menu</Text>
                </View>
                {/* BODY */}
                <View style={{ padding: 14 }}>
                    {/* PROFILE ICON AND PROFILE NAME */}
                    <View style={{ borderBottomWidth: 1, paddingVertical: 6, borderBottomColor: COLORS.nativeWhite }}>
                        <View>
                            <FontAwesomeIcon icon={faCircleUser} size={32} color={COLORS.nativeWhite} />
                            <Text>USER GIVE NAME HERE</Text>
                        </View>
                    </View>
                    {/* MENU NAVITAION */}
                    <View style={{ paddingVertical: 14 }}>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faUser} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faStarOfLife} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Firs AId</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faTag} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Preference</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faSquareH} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Emergency</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faGear} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ fontSize: 14, color: COLORS.nativeWhite, fontWeight: 300, letterSpacing: 1.5, fontStyle: 'italic' }}>More</Text>
                    <View style={{ borderBottomWidth: 1, paddingVertical: 14, borderBottomColor: COLORS.nativeWhite }}>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faSquareH} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>About UCGator</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faGear} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Contact Us</Text>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faSquareH} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Facebook</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.navigationButtons}>
                            <FontAwesomeIcon icon={faGear} size={24} color={COLORS.nativeWhite} style={styles.navigationButtonIcon} />
                            <Text style={styles.navigationButtonText}>Instagram</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default MenuScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlue
    },
    topBar: {
        minHeight: 60,
        maxHeight: 65,
        flexBasis: 'auto',
        justifyContent: 'center',
        paddingHorizontal: 14,
    },
    topBarTitle: {
        fontSize: 32,
        fontWeight: 700,
        color: COLORS.nativeWhite,
        letterSpacing: 1.7
    },
    profileIcon: {

    },
    profileText: {
        fontSize: 32,
    },
    navigationButtons: {
        flexDirection: 'row',
        paddingVertical: 8,
        paddingHorizontal: 5,
        alignItems: 'center',
        marginTop: 12,
    },
    navigationButtonIcon: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5,
        marginLeft: 14,
        marginRight: 24,
    },
    navigationButtonText: {
        fontSize: 18,
        fontWeight: 400,
        color: COLORS.nativeWhite,
        textAlign: 'center',
    }
})