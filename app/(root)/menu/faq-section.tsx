import React, { useState } from 'react';

// COMPONENTS
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, LayoutAnimation, Platform, UIManager, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';

// ICONS
import { faArrowLeft, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// CONSTANTS
import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ = [
    {
        question: 'What is this app for?',
        answer: 'This app helps users manage emergency contacts, view profile information, and access FAQs for guidance.',
    },
    {
        question: 'Is this app free to use?',
        answer: 'Yes, the app is completely free to use.',
    },
    {
        question: 'Can I use this app offline?',
        answer: 'Yes, most features like managing emergency contacts and viewing profile information work offline. However, some features may require an internet connection.',
    },
    {
        question: 'How do I navigate the app?',
        answer: 'Use the menu to access different sections like Emergency Contacts, Profile Information, and FAQs.',
    },
    {
        question: 'What should I do if the app crashes?',
        answer: 'Restart the app. If the issue persists, try reinstalling it or contact support.',
    },
];


const ProfileInformation = [
    {
        question: 'How do I update my profile information?',
        answer: 'Navigate to the Profile Information section and edit your details.',
    },
    {
        question: 'Can I upload a profile picture?',
        answer: 'Yes, you can upload a profile picture in the Profile Information section.',
    },
    {
        question: 'What is the "About Me" section for?',
        answer: 'The "About Me" section allows you to add a short bio about yourself.',
    },
    {
        question: 'How do I change my email address?',
        answer: 'Go to the Profile Information section and update your email address.',
    },
    {
        question: 'Can I change my password?',
        answer: 'Yes, you can change your password in the Profile Information section.',
    },
];

const EmergencyContacts = [
    {
        question: 'How do I add a new emergency contact?',
        answer: 'Tap the "Add New Contact" button, fill in the required details (name, phone number, country code, and relation), and save.',
    },
    {
        question: 'Can I edit an existing emergency contact?',
        answer: 'Yes, tap the edit icon next to the contact you want to update, make changes, and save.',
    },
    {
        question: 'How do I delete an emergency contact?',
        answer: 'Tap the edit icon for the contact, then press the "Delete" button in the modal.',
    },
    {
        question: 'Why can’t I call a contact directly?',
        answer: 'Ensure the phone number is valid and includes the correct country code.',
    },
    {
        question: 'How many emergency contacts can I add?',
        answer: 'You can add as many emergency contacts as you need.',
    },
    {
        question: 'What happens if I don’t add a country code to a contact?',
        answer: 'The app may not be able to make calls to the contact without a valid country code.',
    },
];

const TechnicalIssues = [
    {
        question: 'Why is the app not saving my emergency contacts?',
        answer: 'Ensure you have granted the app storage permissions. If the issue persists, try restarting the app.',
    },
    {
        question: 'Why is the country code picker not working?',
        answer: 'Ensure you have selected a valid country code from the list. If the issue persists, check your internet connection.',
    },
    {
        question: 'What should I do if the app cannot connect to the server?',
        answer: 'Check your internet connection. If the issue persists, you will be redirected to the error page with further instructions.',
    },
    {
        question: 'How do I reset the app to its default state?',
        answer: 'Go to the settings and select "Reset App Data" to clear all saved information.',
    },
]

const FaqSection = () => {
    const router = useRouter();

    const [expandedFAQIndex, setExpandedFAQIndex] = useState<number | null>(null);
    const [expandedEmergencyContactsIndex, setExpandedEmergencyContactsIndex] = useState<number | null>(null);
    const [expandedProfileInfoIndex, setExpandedProfileInfoIndex] = useState<number | null>(null);
    const [expandedTechnicalIssuesIndex, setExpandedTechnicalIssuesIndex] = useState<number | null>(null);

    const resetAllExpandedStates = () => {
        setExpandedFAQIndex(null);
        setExpandedEmergencyContactsIndex(null);
        setExpandedProfileInfoIndex(null);
        setExpandedTechnicalIssuesIndex(null);
    };

    const toggleExpand = (
        index: number,
        setExpandedIndex: React.Dispatch<React.SetStateAction<number | null>>,
        expandedIndex: number | null
    ) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        if (expandedIndex === index) {
            setExpandedIndex(null);
        } else {
            resetAllExpandedStates();
            setExpandedIndex(index);
        }
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
                        <Text style={styles.textStyle}>UCGATOR</Text>
                        <View style={styles.maincontent}>
                            {FAQ.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index, setExpandedFAQIndex, expandedFAQIndex)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon 
                                            icon={ expandedFAQIndex === index ? faChevronUp : faChevronDown }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedFAQIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginVertical: 20, borderBottomWidth: 2, borderBottomColor: '#b1b1b1', }} />

                    {/* Profile information */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Profile Information</Text>
                        <View style={styles.maincontent}>
                            {ProfileInformation.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index, setExpandedProfileInfoIndex, expandedProfileInfoIndex)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={ expandedProfileInfoIndex === index ? faChevronUp : faChevronDown }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedProfileInfoIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginVertical: 20, borderBottomWidth: 2, borderBottomColor: '#b1b1b1', }} />

                    {/* Emergency Contacts */}  
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Emergency Contacts</Text>
                        <View style={styles.maincontent}>
                            {EmergencyContacts.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index, setExpandedEmergencyContactsIndex, expandedEmergencyContactsIndex)}>
                                        <Text style={styles.questionText}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={ expandedEmergencyContactsIndex === index ? faChevronUp : faChevronDown }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedEmergencyContactsIndex === index && (
                                        <Text style={styles.answerText}>{item.answer}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginVertical: 20, borderBottomWidth: 2, borderBottomColor: '#b1b1b1', }} />

                    {/* Technical Issues */}
                    <View style={styles.contentContainer}>
                        <Text style={styles.textStyle}>Technical Issues</Text>
                        <View style={styles.maincontent}>
                            {TechnicalIssues.map((item, index) => (
                                <View key={index} style={styles.faqItem}>
                                    <TouchableOpacity style={styles.faqQuestion} onPress={() => toggleExpand(index, setExpandedTechnicalIssuesIndex, expandedTechnicalIssuesIndex)}>
                                        <Text style={[styles.questionText, {flexShrink: 1, marginRight: 10}]}>{item.question}</Text>
                                        <FontAwesomeIcon
                                            icon={ expandedTechnicalIssuesIndex === index ? faChevronUp : faChevronDown }
                                            size={16}
                                            color={COLORS.pmy.blue1}
                                        />
                                    </TouchableOpacity>
                                    {expandedTechnicalIssuesIndex === index && <Text style={styles.answerText}>{item.answer}</Text>}
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ marginVertical: 20, borderBottomWidth: 2, borderBottomColor: '#b1b1b1', }} />

                    {/* Additional Info */}
                    <View style={{ margin: 15, padding: 10, }}>
                        <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1, marginBottom: 10, textAlign: 'center',}}>Contact Us</Text>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10, }}>Email</Text>
                        <View style={{marginBottom: 10, padding: 10, backgroundColor: COLORS.pmy.white, borderRadius: 8,}}>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:support@uc.edu.ucgator.ph')}>
                                <Text style={styles.contactText}>support@uc.edu.ucgator.ph</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto:info@uc.edu.ucgator.ph')}>
                                <Text style={styles.contactText}>info@uc.edu.ucgator.ph</Text>
                            </TouchableOpacity> 
                        </View>
                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, marginBottom: 10, }}>Developers</Text>
                        <View style={{ padding: 10, backgroundColor: COLORS.pmy.white, borderRadius: 8,}}>
                        <TouchableOpacity onPress={() => Linking.openURL('mailto: tigoy.petercharles@gmail.com')}>
                                <Text style={styles.contactText}>Tigoy, Charles Peter</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto: spaghettipizzasauce@gmail.com')}>
                                <Text style={styles.contactText}>Ayuban, Lowell Grey</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto: rajefpit@gmail.com')}>
                                <Text style={styles.contactText}>Tag-at, Raj efpi</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => Linking.openURL('mailto: jimena.marckyle123@gmail.com')}>
                                <Text style={styles.contactText}>Jimena, Marc Kyle</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default FaqSection;

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
        padding: 5,
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
        color: COLORS.pmy.blue1,
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
        flexWrap: 'nowrap',
    },
    questionText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        maxWidth: '95%',
    },
    answerText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.blue2,
        marginTop: 5,
    },
    contactText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 10,
    },
});