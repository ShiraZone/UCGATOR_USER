import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faArrowLeft, 
  faTextHeight, 
  faAdjust, 
  faBullhorn, 
  faClosedCaptioning, 
  faEye, 
  faHandHoldingHeart
} from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const accessibility = () => {
    const router = useRouter();
    
    // State for accessibility settings
    const [textSize, setTextSize] = useState('medium');
    const [highContrast, setHighContrast] = useState(false);
    const [screenReader, setScreenReader] = useState(false);
    const [reduceMotion, setReduceMotion] = useState(false);
    const [captions, setCaptions] = useState(false);

    // Text size options
    const textSizes = [
        { id: 'small', label: 'Small', size: 12 },
        { id: 'medium', label: 'Medium', size: 14 },
        { id: 'large', label: 'Large', size: 16 },
        { id: 'extra-large', label: 'Extra Large', size: 18 }
    ];

    // Preview text based on selected text size
    const getTextSize = () => {
        const selectedSize = textSizes.find(size => size.id === textSize);
        return selectedSize ? selectedSize.size : 14;
    };

    return (
        <View style={{ flex: 1, backgroundColor: COLORS.pmy.white }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Accessibility</Text>
                </View>

                <ScrollView style={{ flex: 1, paddingHorizontal: 20 }}>
                    {/* Text Size Section */}
                    <View style={{ marginBottom: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: 18, 
                                backgroundColor: 'rgba(43, 79, 110, 0.1)', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginRight: 12 
                            }}>
                                <FontAwesomeIcon icon={faTextHeight} size={18} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ 
                                fontSize: 18, 
                                fontFamily: 'Montserrat-SemiBold', 
                                color: COLORS.pmy.blue1 
                            }}>
                                Text Size
                            </Text>
                        </View>
                        
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 }}>
                            {textSizes.map(size => (
                                <TouchableOpacity 
                                    key={size.id}
                                    style={{ 
                                        flex: 1, 
                                        marginHorizontal: 4, 
                                        paddingVertical: 12, 
                                        alignItems: 'center', 
                                        backgroundColor: textSize === size.id ? COLORS.pmy.blue1 : COLORS.sdy.gray1,
                                        borderRadius: 8
                                    }}
                                    onPress={() => setTextSize(size.id)}
                                >
                                    <Text style={{ 
                                        fontSize: size.size, 
                                        color: textSize === size.id ? COLORS.pmy.white : COLORS.pmy.black,
                                        fontFamily: 'Montserrat-Medium'
                                    }}>
                                        {size.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Contrast Settings */}
                    <View style={{ marginBottom: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: 18, 
                                backgroundColor: 'rgba(43, 79, 110, 0.1)', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginRight: 12 
                            }}>
                                <FontAwesomeIcon icon={faAdjust} size={18} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ 
                                fontSize: 18, 
                                fontFamily: 'Montserrat-SemiBold', 
                                color: COLORS.pmy.blue1 
                            }}>
                                Display Settings
                            </Text>
                        </View>

                        <View style={{ backgroundColor: COLORS.sdy.gray1, borderRadius: 12, padding: 15, marginBottom: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faEye} size={16} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                    <Text style={{ 
                                        fontSize: getTextSize(), 
                                        fontFamily: 'Montserrat-Medium',
                                        color: highContrast ? COLORS.pmy.black : 'gray'
                                    }}>
                                        High Contrast
                                    </Text>
                                </View>
                                <Switch
                                    value={highContrast}
                                    onValueChange={setHighContrast}
                                    trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                    thumbColor={COLORS.pmy.white}
                                />
                            </View>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ 
                                        fontSize: getTextSize(), 
                                        fontFamily: 'Montserrat-Medium',
                                        color: highContrast ? COLORS.pmy.black : 'gray'
                                    }}>
                                        Reduce Motion
                                    </Text>
                                </View>
                                <Switch
                                    value={reduceMotion}
                                    onValueChange={setReduceMotion}
                                    trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                    thumbColor={COLORS.pmy.white}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Screen Reader */}
                    <View style={{ marginBottom: 25 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                            <View style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: 18, 
                                backgroundColor: 'rgba(43, 79, 110, 0.1)', 
                                justifyContent: 'center', 
                                alignItems: 'center',
                                marginRight: 12 
                            }}>
                                <FontAwesomeIcon icon={faBullhorn} size={18} color={COLORS.pmy.blue1} />
                            </View>
                            <Text style={{ 
                                fontSize: 18, 
                                fontFamily: 'Montserrat-SemiBold', 
                                color: COLORS.pmy.blue1 
                            }}>
                                Audio & Vision
                            </Text>
                        </View>

                        <View style={{ backgroundColor: COLORS.sdy.gray1, borderRadius: 12, padding: 15, marginBottom: 15 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faHandHoldingHeart} size={16} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                    <Text style={{ 
                                        fontSize: getTextSize(), 
                                        fontFamily: 'Montserrat-Medium',
                                        color: highContrast ? COLORS.pmy.black : 'gray'
                                    }}>
                                        Screen Reader
                                    </Text>
                                </View>
                                <Switch
                                    value={screenReader}
                                    onValueChange={setScreenReader}
                                    trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                    thumbColor={COLORS.pmy.white}
                                />
                            </View>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={faClosedCaptioning} size={16} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                    <Text style={{ 
                                        fontSize: getTextSize(), 
                                        fontFamily: 'Montserrat-Medium',
                                        color: highContrast ? COLORS.pmy.black : 'gray'
                                    }}>
                                        Closed Captions
                                    </Text>
                                </View>
                                <Switch
                                    value={captions}
                                    onValueChange={setCaptions}
                                    trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                    thumbColor={COLORS.pmy.white}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Preview Section */}
                    <View style={{ marginBottom: 25 }}>
                        <Text style={{ 
                            fontSize: 18, 
                            fontFamily: 'Montserrat-SemiBold', 
                            color: COLORS.pmy.blue1,
                            marginBottom: 15
                        }}>
                            Preview
                        </Text>

                        <View style={{ 
                            backgroundColor: highContrast ? '#FFFFFF' : COLORS.sdy.gray1, 
                            borderRadius: 12, 
                            padding: 20,
                            borderWidth: highContrast ? 1 : 0,
                            borderColor: '#000000',
                            marginBottom: 20
                        }}>
                            <Text style={{ 
                                fontSize: getTextSize() + 4,
                                fontFamily: 'Montserrat-Bold',
                                marginBottom: 10,
                                color: highContrast ? '#000000' : COLORS.pmy.blue1
                            }}>
                                UC Gator Navigation
                            </Text>
                            
                            <Text style={{ 
                                fontSize: getTextSize(),
                                fontFamily: 'Montserrat-Medium',
                                marginBottom: 15,
                                color: highContrast ? '#000000' : 'gray',
                                lineHeight: getTextSize() * 1.5
                            }}>
                                This is a preview of how text will appear with your selected accessibility settings. The size, contrast, and other options affect how content is displayed throughout the app.
                            </Text>
                            
                            <TouchableOpacity style={{
                                backgroundColor: highContrast ? '#000000' : COLORS.pmy.blue2,
                                paddingVertical: 10,
                                paddingHorizontal: 20,
                                borderRadius: 8,
                                alignItems: 'center',
                                alignSelf: 'flex-start'
                            }}>
                                <Text style={{
                                    color: '#FFFFFF',
                                    fontSize: getTextSize(),
                                    fontFamily: 'Montserrat-SemiBold'
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
                            Apply Settings
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

export default accessibility;
