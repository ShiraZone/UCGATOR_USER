import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck, faMap, faMapMarked, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const map_style = () => {
    const router = useRouter();
    const [selectedStyle, setSelectedStyle] = useState('standard');

    // Sample map style palettes
    const mapStyles = [
        {
            id: 'standard',
            name: 'Standard',
            description: 'Default UC Gator map style',
            colors: ['#E6EEF9', '#A6CCF4', '#2B4F6E', '#122E48'],
            previewImage: require('@/assets/images/uc-building-image.jpg')
        },
        {
            id: 'satellite',
            name: 'Satellite',
            description: 'Photographic view from above',
            colors: ['#36454f', '#5F7A8C', '#8B9DAE', '#C0CBD7'],
            previewImage: require('@/assets/images/uc-building-image.jpg')
        },
        {
            id: 'night',
            name: 'Night Mode',
            description: 'Dark theme for low light use',
            colors: ['#121212', '#1E1E1E', '#2C2C2C', '#383838'],
            previewImage: require('@/assets/images/uc-building-image.jpg')
        },
        {
            id: 'accessibility',
            name: 'High Contrast',
            description: 'Improved visibility for accessibility',
            colors: ['#FFFFFF', '#FFFF00', '#000099', '#000000'],
            previewImage: require('@/assets/images/uc-building-image.jpg')
        },
    ];

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.pmy.white }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Map Style</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                    <Text style={{ 
                        fontSize: 18, 
                        fontFamily: 'Montserrat-SemiBold', 
                        color: COLORS.pmy.blue1, 
                        marginVertical: 15 
                    }}>
                        Choose Map Style
                    </Text>
                    
                    {mapStyles.map((style) => (
                        <TouchableOpacity 
                            key={style.id}
                            style={{ 
                                marginBottom: 20,
                                backgroundColor: COLORS.sdy.gray1,
                                borderRadius: 12,
                                overflow: 'hidden',
                                borderWidth: selectedStyle === style.id ? 2 : 0,
                                borderColor: selectedStyle === style.id ? COLORS.pmy.blue1 : 'transparent',
                            }} 
                            onPress={() => setSelectedStyle(style.id)}
                        >
                            <View style={{ width: '100%', height: 120 }}>
                                <Image
                                    source={style.previewImage}
                                    style={{ width: '100%', height: '100%', opacity: style.id === 'night' ? 0.7 : 1 }}
                                    resizeMode="cover"
                                />
                                <View 
                                    style={{ 
                                        position: 'absolute', 
                                        top: 0, 
                                        left: 0, 
                                        right: 0, 
                                        bottom: 0, 
                                        backgroundColor: style.id === 'night' ? 'rgba(0,0,0,0.5)' : 'transparent'
                                    }}
                                />
                                <View style={{ 
                                    position: 'absolute', 
                                    bottom: 0, 
                                    height: 8, 
                                    width: '100%', 
                                    flexDirection: 'row' 
                                }}>
                                    {style.colors.map((color, index) => (
                                        <View 
                                            key={index} 
                                            style={{ flex: 1, backgroundColor: color }}
                                        />
                                    ))}
                                </View>
                                {selectedStyle === style.id && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        width: 24,
                                        height: 24,
                                        borderRadius: 12,
                                        backgroundColor: COLORS.pmy.blue1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <FontAwesomeIcon icon={faCheck} size={14} color={COLORS.pmy.white} />
                                    </View>
                                )}
                            </View>

                            <View style={{ padding: 15, flexDirection: 'row' }}>
                                <View style={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: 20,
                                    backgroundColor: 'rgba(43, 79, 110, 0.1)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 12
                                }}>
                                    <FontAwesomeIcon 
                                        icon={style.id === 'satellite' ? faMap : 
                                              style.id === 'accessibility' ? faLayerGroup : faMapMarked} 
                                        size={18} 
                                        color={COLORS.pmy.blue1} 
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{ 
                                        fontSize: 16, 
                                        fontFamily: 'Montserrat-Bold',
                                        color: COLORS.pmy.black
                                    }}>
                                        {style.name}
                                    </Text>
                                    <Text style={{ 
                                        fontSize: 12, 
                                        fontFamily: 'Montserrat-Regular',
                                        color: 'gray'
                                    }}>
                                        {style.description}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}

                    <Text style={{ 
                        fontSize: 18, 
                        fontFamily: 'Montserrat-SemiBold', 
                        color: COLORS.pmy.blue1, 
                        marginVertical: 15 
                    }}>
                        Preview
                    </Text>

                    <View style={{ 
                        marginBottom: 20, 
                        borderRadius: 12,
                        overflow: 'hidden',
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}>
                        <Image
                            source={require('@/assets/images/uc-building-image.jpg')}
                            style={{ 
                                width: '100%', 
                                height: 200,
                                opacity: selectedStyle === 'night' ? 0.7 : 1
                            }}
                            resizeMode="cover"
                        />
                        <View 
                            style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                right: 0, 
                                bottom: 0, 
                                backgroundColor: selectedStyle === 'night' ? 'rgba(0,0,0,0.5)' : 
                                                selectedStyle === 'accessibility' ? 'rgba(255,255,0,0.1)' : 
                                                'transparent'
                            }}
                        />
                        <View style={{
                            position: 'absolute',
                            bottom: 15,
                            left: 15,
                            right: 15,
                            padding: 10,
                            backgroundColor: selectedStyle === 'night' ? 'rgba(18, 18, 18, 0.8)' : 
                                            selectedStyle === 'accessibility' ? 'rgba(0, 0, 0, 0.9)' :
                                            'rgba(255, 255, 255, 0.8)',
                            borderRadius: 8,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontFamily: 'Montserrat-Bold',
                                color: selectedStyle === 'night' || selectedStyle === 'accessibility' ? 
                                        COLORS.pmy.white : COLORS.pmy.blue1
                            }}>
                                University of Cebu - Main Campus
                            </Text>
                            <Text style={{
                                fontSize: 12,
                                fontFamily: 'Montserrat-Regular',
                                color: selectedStyle === 'night' || selectedStyle === 'accessibility' ? 
                                        'rgba(255, 255, 255, 0.8)' : 'gray'
                            }}>
                                Colon St, Cebu City, 6000 Cebu
                            </Text>
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
                            Apply Map Style
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Regular',
                        marginBottom: 30,
                    }}>
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

export default map_style;