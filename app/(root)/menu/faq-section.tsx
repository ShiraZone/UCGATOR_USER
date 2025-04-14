import React, { useState } from 'react';

// COMPONENTS
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';

// ICONS
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// CONSTANTS
import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';


const FAQDATA = [
    {
        question: 'What is this app for?',
        answer: 'This app helps users manage emergency contacts, view profile information, and access FAQs for guidance.',
    },
    {
        question: 'How do I add a new emergency contact?',
        answer: 'Tap the "Add New Contact" button, fill in the required details (name, phone number, country code, and relation), and save.',
    },
    {
        question: 'Can I edit an existing emergency contact?',
        answer: 'Yes, tap the edit icon next to the contact you want to update, make changes, and save.',
    },
    {
        question: 'Why can’t I call a contact directly?',
        answer: 'Ensure the phone number is valid and includes the correct country code.',
    },
    {
        question: 'How do I reset the app to its default state?',
        answer: 'Go to the settings and select "Reset App Data" to clear all saved information.',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
    {
        question: ' ',
        answer: ' ',
    },
];

const FirstAid = () => {
    const router = useRouter();
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={styles.topHeader} source={IMAGES.placement_image_cover} resizeMode="stretch">
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15, top: 15 }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white }}>FAQ</Text>
                </ImageBackground>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 100 }} showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15, marginBottom: 20}} >
                    
                    {/* General Questions */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Frequently Asked Questions</Text>
                        <View style={styles.maincontent}>
                            {FAQDATA.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={
                                                expandedIndex === index ? faChevronUp : faChevronDown
                                            }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Emergency Contacts */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Frequently Asked Questions</Text>
                        <View style={styles.maincontent}>
                            {FAQDATA.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={
                                                expandedIndex === index ? faChevronUp : faChevronDown
                                            }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Profile information */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Frequently Asked Questions</Text>
                        <View style={styles.maincontent}>
                            {FAQDATA.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={
                                                expandedIndex === index ? faChevronUp : faChevronDown
                                            }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* FAQ Section */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Frequently Asked Questions</Text>
                        <View style={styles.maincontent}>
                            {FAQDATA.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={
                                                expandedIndex === index ? faChevronUp : faChevronDown
                                            }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>
            
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default FirstAid;

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        height: 100,
        padding: 15,
        marginBottom: 150,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    contentContainer: {
        margin: 10,
        backgroundColor: COLORS.pmy.blue1,
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.pmy.blue2,
        marginHorizontal: 5,
    },
    maincontent: {
        padding: 10,
        backgroundColor: COLORS.pmy.white,
        borderRadius: 8,
        margin: 5,
    },
    textStyle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.white,
        marginBottom: 10,
    },
    faqItem: {
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.pmy.blue2,
        paddingBottom: 10,
    },
    faqQuestion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    questionText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
    },
    answerText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.blue2,
        marginTop: 5,
    },
});