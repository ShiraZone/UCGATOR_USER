import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck, faSun, faMoon, faMobile } from '@fortawesome/free-solid-svg-icons';
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

const theme = () => {
    const router = useRouter();
    const [selectedTheme, setSelectedTheme] = useState('light');

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
                        Theme
                    </Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                    <Text style={{ 
                        fontSize: 18, 
                        fontFamily: 'Montserrat-SemiBold', 
                        color: COLORS.pmy.blue1, 
                        marginTop: 20, 
                        marginBottom: 15 
                    }}>
                        Choose Theme
                    </Text>
                    
                    {/* Light Theme Option */}
                    <TouchableOpacity 
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: COLORS.sdy.gray1,
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 15,
                            borderWidth: selectedTheme === 'light' ? 2 : 0,
                            borderColor: selectedTheme === 'light' ? COLORS.pmy.blue1 : 'transparent',
                        }} 
                        onPress={() => setSelectedTheme('light')}
                    >
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
                                <FontAwesomeIcon icon={faSun} size={20} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: COLORS.pmy.black }}>
                                Light
                            </Text>
                        </View>
                        {selectedTheme === 'light' && (
                            <View style={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: 12, 
                                backgroundColor: COLORS.pmy.blue1, 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}>
                                <FontAwesomeIcon icon={faCheck} size={16} color={COLORS.pmy.white} />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* Dark Theme Option */}
                    <TouchableOpacity 
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: COLORS.sdy.gray1,
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 15,
                            borderWidth: selectedTheme === 'dark' ? 2 : 0,
                            borderColor: selectedTheme === 'dark' ? COLORS.pmy.blue1 : 'transparent',
                        }} 
                        onPress={() => setSelectedTheme('dark')}
                    >
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
                                <FontAwesomeIcon icon={faMoon} size={20} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: COLORS.pmy.black }}>
                                Dark
                            </Text>
                        </View>
                        {selectedTheme === 'dark' && (
                            <View style={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: 12, 
                                backgroundColor: COLORS.pmy.blue1, 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}>
                                <FontAwesomeIcon icon={faCheck} size={16} color={COLORS.pmy.white} />
                            </View>
                        )}
                    </TouchableOpacity>

                    {/* System Theme Option */}
                    <TouchableOpacity 
                        style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            backgroundColor: COLORS.sdy.gray1,
                            borderRadius: 12,
                            padding: 15,
                            marginBottom: 15,
                            borderWidth: selectedTheme === 'system' ? 2 : 0,
                            borderColor: selectedTheme === 'system' ? COLORS.pmy.blue1 : 'transparent',
                        }} 
                        onPress={() => setSelectedTheme('system')}
                    >
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
                                <FontAwesomeIcon icon={faMobile} size={20} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: COLORS.pmy.black }}>
                                System Default
                            </Text>
                        </View>
                        {selectedTheme === 'system' && (
                            <View style={{ 
                                width: 24, 
                                height: 24, 
                                borderRadius: 12, 
                                backgroundColor: COLORS.pmy.blue1, 
                                justifyContent: 'center', 
                                alignItems: 'center' 
                            }}>
                                <FontAwesomeIcon icon={faCheck} size={16} color={COLORS.pmy.white} />
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={{ 
                        fontSize: 18, 
                        fontFamily: 'Montserrat-SemiBold', 
                        color: COLORS.pmy.blue1, 
                        marginTop: 20, 
                        marginBottom: 15 
                    }}>
                        Preview
                    </Text>

                    {/* Theme Preview */}
                    <View style={{ marginBottom: 20 }}>
                        <View style={{
                            borderRadius: 12,
                            padding: 20,
                            backgroundColor: selectedTheme === 'dark' ? '#1A1A1A' : COLORS.pmy.white,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                            elevation: 3,
                        }}>
                            <Text style={{
                                fontSize: 16,
                                fontFamily: 'Montserrat-Bold',
                                marginBottom: 15,
                                color: selectedTheme === 'dark' ? COLORS.pmy.white : COLORS.pmy.black,
                            }}>
                                Theme Preview
                            </Text>
                            
                            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                <View style={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: 8, 
                                    marginRight: 10,
                                    backgroundColor: selectedTheme === 'dark' ? '#3A6186' : COLORS.pmy.blue1 
                                }} />
                                <View style={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: 8, 
                                    marginRight: 10,
                                    backgroundColor: selectedTheme === 'dark' ? '#2E5175' : COLORS.pmy.blue2 
                                }} />
                                <View style={{ 
                                    width: 60, 
                                    height: 60, 
                                    borderRadius: 8, 
                                    marginRight: 10,
                                    backgroundColor: selectedTheme === 'dark' ? '#89CFF0' : COLORS.accent.accent3 
                                }} />
                            </View>
                            
                            <TouchableOpacity style={{
                                paddingVertical: 12,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                alignItems: 'center',
                                backgroundColor: selectedTheme === 'dark' ? '#3A6186' : COLORS.pmy.blue2,
                                alignSelf: 'flex-start'
                            }}>
                                <Text style={{ 
                                    color: COLORS.pmy.white, 
                                    fontFamily: 'Montserrat-Medium', 
                                    fontSize: 14 
                                }}>
                                    Sample Button
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity style={{
                        backgroundColor: COLORS.pmy.blue2,
                        paddingVertical: 15,
                        borderRadius: 10,
                        alignItems: 'center',
                        marginBottom: 15,
                    }}>
                        <Text style={{
                            color: COLORS.pmy.white,
                            fontSize: 16,
                            fontFamily: 'Montserrat-SemiBold',
                        }}>
                            Apply Theme
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Regular',
                        marginBottom: 30,
                    }}>
                        Note: This is a placeholder UI and doesn't actually change the app theme.
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default theme;