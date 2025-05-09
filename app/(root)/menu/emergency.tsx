import React, { useState, useEffect } from 'react';

// COMPONENTS
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, TextInput, Modal, KeyboardAvoidingView, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useRouter } from 'expo-router';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CallingCode } from 'react-native-country-picker-modal';

// ICONS
import { faArrowLeft, faPlus, faPhone, faEdit } from '@fortawesome/free-solid-svg-icons';

// CONSTANTS
import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

// Static contact for every user
const STATIC_CONTACT_LIST = [
    {
        id: 0,
        contact_title: 'Emergency Service',
        contact_number: '911',
        country_code: '', // No country code needed for emergency services
    },
    {
        id: 1,
        contact_title: 'TEST',
        contact_number: '9164549897',
        country_code: '+63',
    },
];

// List of Country Codes for modal use. 
// Any country code in this list will be added to the custom modal country code list
const COUNTRY_CODES = [
    { code: 'BD', name: 'Bangladesh', callingCode: '+880' },
    { code: 'CN', name: 'China', callingCode: '+86' },
    { code: 'ID', name: 'Indonesia', callingCode: '+62' },
    { code: 'IN', name: 'India', callingCode: '+91' },
    { code: 'JP', name: 'Japan', callingCode: '+81' },
    { code: 'KR', name: 'South Korea', callingCode: '+82' },
    { code: 'LK', name: 'Sri Lanka', callingCode: '+94' },
    { code: 'MM', name: 'Myanmar', callingCode: '+95' },
    { code: 'MY', name: 'Malaysia', callingCode: '+60' },
    { code: 'NP', name: 'Nepal', callingCode: '+977' },
    { code: 'PH', name: 'Philippines', callingCode: '+63' },
    { code: 'PK', name: 'Pakistan', callingCode: '+92' },
    { code: 'SG', name: 'Singapore', callingCode: '+65' },
    { code: 'TH', name: 'Thailand', callingCode: '+66' },
    { code: 'US', name: 'United States', callingCode: '+1' },
    { code: 'VN', name: 'Vietnam', callingCode: '+84' },
];

const uniqueCountryCodes = Array.from(
    new Map(COUNTRY_CODES.map((country) => [country.code, country])).values()
);

const Emergency = () => {
    const router = useRouter();

    const [customContacts, setCustomContacts] = useState<{ id: number; contact_title: string; country_code: string; contact_number: string; relation: string }[]>([]);
    const [editingContact, setEditingContact] = useState<{ id: number; contact_title: string; country_code: string; contact_number: string; relation: string } | null>(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [newContactName, setNewContactName] = useState('');
    const [newContactNumber, setNewContactNumber] = useState('');
    const [newContactRelation, setNewContactRelation] = useState('');
    const [callingCode, setCallingCode] = useState<CallingCode>('+63');
    const [isCountryPickerVisible, setIsCountryPickerVisible] = useState(false);

    const STORAGE_KEY = '@custom_contacts';

    // CREATE
    const addCustomContact = () => {
        if (newContactName && newContactNumber) {
            const newContact = {
                id: customContacts.length,
                contact_title: newContactName,
                country_code: callingCode,
                contact_number: newContactNumber,
                relation: newContactRelation,
            };
            const updatedContacts = [...customContacts, newContact];
            setCustomContacts(updatedContacts);
            saveCustomContacts(updatedContacts);
            setNewContactName('');
            setNewContactNumber('');
            setNewContactRelation('');
            setModalVisible(false);
            console.log('newContact: ', newContact); // DEBUG
        }
    };

    // RETRIEVE
    useEffect(() => {
        const loadCustomContacts = async () => {
            try {
                const storedContacts = await AsyncStorage.getItem(STORAGE_KEY);
                if (storedContacts) {
                    setCustomContacts(JSON.parse(storedContacts));
                    console.log('loadedCustomContacts: ', JSON.parse(storedContacts));
                }
            } catch (error) {
                console.error('Error loading custom contacts:');
            }
        };
        loadCustomContacts();
    }, []);

    const saveCustomContacts = async (contacts: typeof customContacts) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
            console.log('savedCustomContacts: ', contacts); // DEBUG
        } catch (error) {
            console.error('Error loading custom contacts:');
        }
    };

    // UPDATE
    const updateCustomContact = (id: number) => {
        const updatedContacts = customContacts.map((contact) =>
            contact.id === id
                ? {
                    ...contact,
                    contact_title: newContactName,
                    country_code: callingCode,
                    contact_number: newContactNumber,
                    relation: newContactRelation
                }
                : contact
        );
        setCustomContacts(updatedContacts);
        saveCustomContacts(updatedContacts);
        setEditingContact(null);
        setNewContactName('');
        setNewContactNumber('');
        setNewContactRelation('');
        setModalVisible(false);
        console.log('updatedContact: ', updatedContacts); // DEBUG
    };

    // DELETE
    const deleteCustomContact = (id: number) => {
        const updatedContacts = customContacts.filter((contact) => contact.id !== id);
        setCustomContacts(updatedContacts);
        saveCustomContacts(updatedContacts);
        console.log('deletedContact: ', updatedContacts); // DEBUG
    };

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Emergency</Text>
                </View>

                {/* Main Content Area */}
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15 }} >
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginTop: 15, color: COLORS.pmy.blue1, }}>List of Emergency Contacts:</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Regular', marginBottom: 15, color: COLORS.pmy.blue1, }}>Tap to Call</Text>
                    <View style={styles.contentContainer}>
                        {STATIC_CONTACT_LIST.map((contact) => (
                            <TouchableOpacity key={contact.id} style={styles.contactListContainer}
                                onPress={() => {
                                    const phoneNumber = `tel:${contact.country_code}${contact.contact_number}`;
                                    try { Linking.openURL(phoneNumber); } catch (error) { console.error('Error opening URL:', error); };
                                }}>
                                <FontAwesomeIcon icon={faPhone} size={20} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                <View>
                                    <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1, }}>{contact.contact_title} </Text>
                                    <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2, }}>{contact.country_code}{contact.contact_number}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Custom Contacts Section */}
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginTop: 15, marginBottom: 5, color: COLORS.pmy.blue1, }}>Custom Contacts:</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Regular', marginBottom: 15, color: COLORS.pmy.blue1, }}>Tap to Call</Text>
                    <View style={styles.customContactContainer}>
                        {customContacts.map((contact) => (
                            <View key={contact.id} style={[styles.contactListContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                                    onPress={() => {
                                        const phoneNumber = `tel:${contact.contact_number}`;
                                        Linking.openURL(phoneNumber);
                                    }}>
                                    <FontAwesomeIcon icon={faPhone} size={20} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                    <View>
                                        <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1 }}>{contact.contact_title}</Text>
                                        <Text style={{ fontSize: 14, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue2 }}>{contact.contact_number}</Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setEditingContact(contact);
                                            setNewContactName(contact.contact_title);
                                            setNewContactNumber(contact.contact_number);
                                            setNewContactRelation(contact.relation);
                                            setModalVisible(true);
                                        }}>
                                        <FontAwesomeIcon icon={faEdit} size={20} color={COLORS.pmy.blue1} style={{ marginRight: 10 }} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                        <TouchableOpacity style={[styles.contactListContainer, { justifyContent: 'center' }]}
                            onPress={() => {
                                setEditingContact(null);
                                setNewContactName('');
                                setNewContactNumber('');
                                setModalVisible(true);
                            }}>
                            <FontAwesomeIcon icon={faPlus} size={20} color={COLORS.pmy.blue1} />
                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1, marginLeft: 10, }}>Add New Contact</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Modal for Adding Custom Contact */}
            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <SafeAreaView style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
                        <View style={styles.modalContainer}>

                            {/* Name Input */}
                            <View style={styles.modalContent}>
                                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginBottom: 10, color: COLORS.pmy.blue1 }}> {editingContact ? 'Edit Contact' : 'Add New Contact'}</Text>
                                <TextInput placeholder="Name" value={newContactName} onChangeText={setNewContactName} style={styles.input} />
                                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>

                                    {/* Country Code Selector */}
                                    <TouchableOpacity
                                        style={{
                                            borderWidth: 1, borderColor: COLORS.pmy.blue2, borderRadius: 8, padding: 9, marginBottom: 10, justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                        onPress={() => setIsCountryPickerVisible(true)}
                                    >
                                        <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Bold', color: COLORS.pmy.blue1 }}>{callingCode}</Text>
                                    </TouchableOpacity>

                                    {/* Country Picker Modal */}
                                    <Modal visible={isCountryPickerVisible} transparent={true} animationType="slide">
                                        <View style={styles.modalContainer}>
                                            <View style={styles.modalContent}>
                                                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginBottom: 10, color: COLORS.pmy.blue1 }}>Select Country Code</Text>
                                                <ScrollView style={{ width: '100%' }}>
                                                    {uniqueCountryCodes.map((country) => (
                                                        <TouchableOpacity
                                                            key={country.code}
                                                            style={{
                                                                padding: 10,
                                                                borderBottomWidth: 1,
                                                                borderBottomColor: COLORS.pmy.blue2,
                                                            }}
                                                            onPress={() => {
                                                                setCallingCode(country.callingCode); // Set the calling code
                                                                setIsCountryPickerVisible(false); // Close the modal
                                                            }}
                                                        >
                                                            <Text style={{ fontSize: 16, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.blue1 }}>
                                                                {country.name} ({country.callingCode})
                                                            </Text>
                                                        </TouchableOpacity>
                                                    ))}
                                                </ScrollView>
                                                <TouchableOpacity
                                                    style={[styles.modalButton, { backgroundColor: COLORS.alert.error, marginTop: 10 }]}
                                                    onPress={() => setIsCountryPickerVisible(false)} // Close the modal
                                                >
                                                    <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold' }}>Cancel</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Modal>

                                    {/* Contact Number Input */}
                                    <TextInput
                                        placeholder="Contact Number"
                                        value={newContactNumber}
                                        onChangeText={(text) => { if (text.length <= 15) setNewContactNumber(text); }}
                                        style={[styles.input, { flex: 1, marginLeft: 10 }]}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                                <TextInput
                                    placeholder="Relation (e.g., Friend, Family, Doctor)"
                                    value={newContactRelation}
                                    onChangeText={setNewContactRelation}
                                    style={styles.input}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, { backgroundColor: COLORS.pmy.blue1, marginHorizontal: 5, borderWidth: 1 }]}
                                        onPress={() => {
                                            if (editingContact) { updateCustomContact(editingContact.id); }
                                            else { addCustomContact(); }
                                        }}>
                                        <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold' }}>{editingContact ? 'Save Changes' : 'Save'}</Text>
                                    </TouchableOpacity>

                                    {/* DELETE or CANCEL BUTTON */}
                                    {editingContact ? (
                                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: COLORS.alert.error, marginHorizontal: 5, borderWidth: 1 }]}
                                            onPress={() => { deleteCustomContact(editingContact.id); setModalVisible(false); }}>
                                            <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold' }}>Delete</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={[styles.modalButton, { backgroundColor: COLORS.alert.error, marginHorizontal: 5, borderWidth: 1 }]}
                                            onPress={() => setModalVisible(false)}>
                                            <Text style={{ color: COLORS.pmy.white, fontFamily: 'Montserrat-Bold' }}>Cancel</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </Modal>
        </View>
    );
};

export default Emergency;

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
        backgroundColor: COLORS.pmy.blue1,
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.pmy.blue2,
        marginHorizontal: 5,
    },
    contactListContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: COLORS.pmy.white,
        borderRadius: 8,
        margin: 5,
    },
    customContactContainer: {
        backgroundColor: COLORS.pmy.blue1,
        padding: 5,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: COLORS.pmy.blue2,
        marginHorizontal: 5,
        marginTop: 0,
    },
    modalContainer: {
        height: '75%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxHeight: '70%',
        backgroundColor: COLORS.pmy.white,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    input: {
        width: '100%',
        borderWidth: 1,
        borderColor: COLORS.pmy.blue2,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular',
    },
    modalButton: {
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '45%',
    },
});