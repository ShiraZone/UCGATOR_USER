import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCheck, faGlobe } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

interface LanguageOption {
    id: string;
    name: string;
    nativeName: string;
}

const language = () => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('en');

    // Language options
    const languages: LanguageOption[] = [
        { id: 'en', name: 'English', nativeName: 'English' },
        { id: 'es', name: 'Spanish', nativeName: 'Español' },
        { id: 'fil', name: 'Filipino', nativeName: 'Filipino' },
        { id: 'zh', name: 'Chinese (Simplified)', nativeName: '中文(简体)' },
        { id: 'ja', name: 'Japanese', nativeName: '日本語' },
        { id: 'ko', name: 'Korean', nativeName: '한국어' },
    ];

    // Function to handle language change
    const handleLanguageChange = (languageId: string) => {
        setSelectedLanguage(languageId);
        // Here you would implement the actual language change logic
        // This could involve using an i18n library or context
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
                        Language
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
                        Select Language
                    </Text>
                    
                    {languages.map((language) => (
                        <TouchableOpacity 
                            key={language.id}
                            style={{ 
                                flexDirection: 'row', 
                                alignItems: 'center', 
                                justifyContent: 'space-between',
                                backgroundColor: COLORS.sdy.gray1,
                                borderRadius: 12,
                                padding: 15,
                                marginBottom: 15,
                                borderWidth: selectedLanguage === language.id ? 2 : 0,
                                borderColor: selectedLanguage === language.id ? COLORS.pmy.blue1 : 'transparent',
                            }} 
                            onPress={() => handleLanguageChange(language.id)}
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
                                    <FontAwesomeIcon icon={faGlobe} size={18} color={COLORS.pmy.blue1} />
                                </View>
                                <View>
                                    <Text style={{ fontFamily: 'Montserrat-Medium', fontSize: 16, color: COLORS.pmy.black }}>
                                        {language.name}
                                    </Text>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: 12, color: 'gray' }}>
                                        {language.nativeName}
                                    </Text>
                                </View>
                            </View>
                            {selectedLanguage === language.id && (
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
                            Apply Language
                        </Text>
                    </TouchableOpacity>
                    
                    <Text style={{
                        textAlign: 'center',
                        color: 'gray',
                        fontSize: 12,
                        fontFamily: 'Montserrat-Regular',
                        marginBottom: 30,
                    }}>
                        Changing the language will restart the app
                    </Text>
                </ScrollView>
            </SafeAreaView>
        </View>
    )
};

export default language;

const styles = StyleSheet.create({
    
});