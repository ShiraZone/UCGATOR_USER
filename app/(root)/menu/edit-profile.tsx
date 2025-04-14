// COMPONENTS
import { 
    Image, 
    ScrollView,
    StyleSheet, 
    Text, 
    View, 
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground, 
    KeyboardAvoidingView,
    Keyboard,
    StatusBar,
    Dimensions,
    Alert, // Import Alert for feedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

// UTILS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';

// ICONS
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

// Basic Information
interface User {
    id: string;
    email: string;
    avatar: string;
    firstName: string;
    middleName: string;
    lastName: string;
    verified: boolean;
}

// TEMPLATE VALUES
const ProfileInformation = {
    "name": "Jane Doe",
    "type": "student",
    "date_of_birth": "2000-01-01",
    "gender": "female",
    "address": "ZZZ",
    "email_address": "rat_fucker@gmail.com",
    "password": "janedoeisarat",
    "Bio": "*sqeak*"
}
const AccountType = {
    "type": "student",
    //"type": "teacher",
    //"type": "visitor",
    "verified": false,
}


const EditProfile = () => {
    const { user } = useAuth();
    const router = useRouter();
    const [bio, setBio] = useState(ProfileInformation.Bio); // State for the bio

    const saveBio = () => {
        ProfileInformation.Bio = bio; // Save the updated bio
        Alert.alert('Success', 'Your bio has been updated!');
        console.log('Updated Bio:', ProfileInformation.Bio); // Log the updated bio
    };

    const isSaveDisabled = () => {
        return bio === ProfileInformation.Bio; 
    };  

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white.white1 }}>
            {/* Header Content */}
            <ImageBackground style={styles.profileHeaderContainer} source={IMAGES.menu_image_cover} resizeMode='stretch'>
                <Text style={{ fontSize: 22, textAlign: 'left', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white}}>Profile</Text>
                <View style={styles.profileHeader}>

                    {user?.avatar ? (
                        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
                    ) : (
                        <FontAwesomeIcon icon={faCircleUser} size={65} color={COLORS.pmy.white} style={{ marginRight: 8}}/>
                    )}

                    {/* Profile Name and Email */}
                    <View>
                        <Text style={{ color: COLORS.pmy.white, fontSize: 18, fontFamily: 'Montserrat-Bold', }}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                        <Text style={{ color: '#d0e0f0', fontFamily: 'Montserrat-Regular',}}>{user?.email}</Text>
                    </View>
                    
                </View>
            </ImageBackground>
            {/* Main Content */}
            <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 175 }} showsVerticalScrollIndicator={false}>

                        {/* About Me Section */}
                        <View style={{ backgroundColor: '#87A8C3', margin: 10, borderRadius: 10, padding: 15 }}>
                            <Text style={{ color: '#FFFFFF', marginBottom: 5, fontFamily: 'Montserrat-Bold' }}>About Me</Text>
                            
                            <TextInput style={{ backgroundColor: '#FFFFFF', borderRadius: 5, padding: 10, minHeight: 100, textAlignVertical: 'top', color: '#000000', marginBottom: 10 }}
                                multiline
                                numberOfLines={5}
                                value={bio}
                                onChangeText={setBio}
                                placeholder="Write something about yourself..."
                                placeholderTextColor="#A9A9A9"
                            />

                            <TouchableOpacity
                                style={{
                                    marginTop: 10,
                                    backgroundColor: isSaveDisabled() ? '#A9A9A9' : '#0056A8', // Gray if disabled
                                    padding: 10,
                                    borderRadius: 5,
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    saveBio();
                                    setBio(ProfileInformation.Bio); // Reset the state to match the saved bio
                                }}
                                disabled={isSaveDisabled()} // Disable the button if no edits are made
                            >
                                <Text style={styles.saveButton}>Save</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Display Name */}
                        <View style={{ backgroundColor: '#87A8C3', margin: 10, borderRadius: 10, padding: 15, }}>
                            <Text style={{ color: '#FFFFFF', marginBottom: 5, fontFamily: 'Montserrat-Bold' }}>Display Name</Text>
                            <View>
                                <View>
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 5 }}>First Name</Text>
                                    <TextInput
                                        style={styles.nameInputField}
                                        placeholder="Enter your first name"
                                        placeholderTextColor="#A9A9A9"
                                        value={user?.firstName || ''}
                                        onChangeText={(text) => console.log('First Name:', text)} // Replace with actual handler
                                    />
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 5 }}>Middle Name</Text>
                                    <TextInput
                                        style={styles.nameInputField}
                                        placeholder="Enter your middle name"
                                        placeholderTextColor="#A9A9A9"
                                        value={user?.middleName || ''}
                                        onChangeText={(text) => console.log('Middle Name:', text)} // Replace with actual handler
                                    />
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 5 }}>Last Name</Text>
                                    <TextInput
                                        style={styles.nameInputField}
                                        placeholder="Enter your last name"
                                        placeholderTextColor="#A9A9A9"
                                        value={user?.lastName || ''}
                                        onChangeText={(text) => console.log('Last Name:', text)} // Replace with actual handler
                                    />
                                    <TouchableOpacity
                                        style={{
                                            marginTop: 10,
                                            backgroundColor: '#0056A8',
                                            padding: 10,
                                            borderRadius: 5,
                                            alignItems: 'center',
                                        }}
                                        onPress={() => {
                                            console.log('First Name:', user?.firstName);
                                            console.log('Middle Name:', user?.middleName);
                                            console.log('Last Name:', user?.lastName);
                                            Alert.alert('Success', 'Your name has been updated!'); // Replace with actual handler
                                        }}
                                    >
                                        <Text style={styles.saveButton}>Save</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>

                        {/* Account Type */}
                        <View style={{ backgroundColor: '#87A8C3', margin: 10, borderRadius: 10, padding: 15, }}>
                            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginBottom: 5, fontFamily: 'Montserrat-Bold' }}>Account Type</Text>
                            <View>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: AccountType.type === 'student' ? '#0056A8' : '#A9A9A9',
                                        padding: 10,
                                        borderRadius: 5,
                                        alignItems: 'center',
                                        marginBottom: 10,
                                    }}
                                    onPress={() => {
                                        AccountType.type = 'student';
                                        Alert.alert('Account Type', 'You selected Student!');
                                    }}
                                    disabled={AccountType.type === 'student'} // Disable if already selected
                                >
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Student</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: AccountType.type === 'teacher' ? '#0056A8' : '#A9A9A9',
                                        padding: 10,
                                        borderRadius: 5,
                                        alignItems: 'center',
                                        marginBottom: 10,
                                    }}
                                    onPress={() => {
                                        AccountType.type = 'teacher';
                                        Alert.alert('Account Type', 'You selected Teacher!');
                                    }}
                                    disabled={AccountType.type === 'teacher'} // Disable if already selected
                                >
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Teacher</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: AccountType.type === 'visitor' ? '#0056A8' : '#A9A9A9',
                                        padding: 10,
                                        borderRadius: 5,
                                        alignItems: 'center',
                                    }}
                                    onPress={() => {
                                        AccountType.type = 'visitor';
                                        Alert.alert('Account Type', 'You selected Visitor!');
                                    }}
                                    disabled={AccountType.type === 'visitor'} // Disable if already selected
                                >
                                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Visitor</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e7f1f8',
    },
    profileHeaderContainer: {
        height: 175,
        padding: 15,
        position: 'absolute',  
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    profileHeader: {
        width: '100%', 
        paddingVertical: 12, 
        paddingHorizontal: 8, 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 50,
    },
    avatar: {
        width: 65, 
        height: 65, 
        borderRadius: 32.5, 
        marginRight: 8, 
        borderWidth: 1.5, 
        borderColor: COLORS.pmy.white
    },
    nameInputField: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 10,
        color: '#000000',
        marginBottom: 10,
        fontFamily: 'Montserrat-Regular',
    },
    saveButton: {
        color: '#FFFFFF', 
        fontWeight: 'bold',
    },
});