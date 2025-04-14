import React from 'react'

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
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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

const ProfileInformation = {
    "name": "Jane Doe",
    "type": "student",
    "date_of_birth": "2000-01-01",
    "gender": "female",
    "contact_number": "09123456789",
    "address": "ZZZ",
    "email_address": "rat_fucker@gmail.com",
    "password": "janedoeisarat",
    "Bio": "*sqeak*"
}

const ProfileInfoWindow = () => {
    const { user } = useAuth();
    const router = useRouter();

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={COLORS.pmy.blue1} barStyle="light-content" />
            {/* Profile Header */}
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
                        <Text style={{ color: COLORS.pmy.white, fontSize: 18, fontFamily: 'Montserrat-Bold',}}>{user?.lastName}, {user?.firstName} {user?.middleName}</Text>
                        <Text style={{ color: '#d0e0f0', fontFamily: 'Montserrat-Regular',}}>{user?.email}</Text>
                    </View>

                    {/* Edit Profile Icon */}
                    <TouchableOpacity style={styles.editProfile} onPress={() => router.push('./edit-profile')}>   
                        <FontAwesomeIcon icon={faPencil} size={15} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                </View>
            </ImageBackground>
            
            {/* Scrollable Content */}
            <KeyboardAvoidingView style={{ flex: 1 }} enabled>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView style={styles.container} contentContainerStyle={{ paddingTop: 175 }} > 

                        {/* About Me Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>About Me</Text>
                            <Text style={styles.sectionContent}>{ProfileInformation.Bio}</Text>
                        </View>

                        {/* Timeline Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Timeline</Text>
                            <Text style={styles.sectionContent}>Student</Text>
                        </View>

                        {/* Images Section FAK ET*/}
                        {[1, 2, 3, 4, 5].map((index) => (
                            <View key={index} style={styles.postContainer}>
                                {/* Combined Post Header and Content */}
                                <View style={{ padding: 10 }}>
                                    <View style={styles.postHeader}>
                                        
                                    {user?.avatar ? (
                                        <Image source={{ uri: user?.avatar }} style={styles.avatar_post} />
                                    ) : (
                                        <FontAwesomeIcon icon={faCircleUser} size={35} color={COLORS.pmy.white} style={{ marginRight: 8}}/>
                                    )}

                                        <Text style={styles.postUsername}>{ProfileInformation.name}</Text>
                                    </View>
                                    <Image
                                        source={require('@/assets/images/uc-building-image.jpg')}
                                        style={styles.postImage}
                                    />
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ProfileInfoWindow;

const screenWidth = Dimensions.get('window').width; // Get the screen width
const imageHeight = screenWidth * (9 / 16); // Calculate height for 16:9 aspect ratio

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    avatar_post: {
        width: 35, 
        height: 35, 
        borderRadius: 32.5, 
        marginRight: 8, 
        borderWidth: 1.5, 
        borderColor: COLORS.pmy.white
    },
    name: {
        color: COLORS.pmy.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
    editProfile: {
        backgroundColor: COLORS.pmy.blue2, 
        padding: 8, 
        borderRadius: 5, 
        position: 'absolute', 
        right: 0 
    },
    section: {
        backgroundColor: '#BCD4E6',
        margin: 10,
        borderRadius: 10,
        padding: 15,
    },
    sectionTitle: {
        marginBottom: 5,
        fontFamily: 'Montserrat-Bold',
    },
    sectionContent: {
        color: '#333333',
        fontFamily: 'Montserrat-Regular',
    },
    postContainer: {
        marginVertical: 10,
        backgroundColor: '#BCD4E6',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    postHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    postAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#CCCCCC',
        marginRight: 10,
    },
    postUsername: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 16,
    },
    postImage: {
        alignSelf: 'center',
        width: screenWidth,
        height: imageHeight,
    },
    imageBackground: {
        marginHorizontal: 5,
        marginBottom: 10,
        padding: 5,   
        borderRadius: 10,
        backgroundColor: COLORS.pmy.white,
    },
});