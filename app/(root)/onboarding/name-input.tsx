// REACT
import React, { useEffect, useState, useCallback } from 'react';

// REACT NATIVE
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// HOOKS
import { useAuth } from '@/app/lib/auth-context';
import { useRouter, useSearchParams } from 'expo-router/build/hooks';

// CONSTANTS
import COLORS from '@/app/constants/colors';
import IMAGES from '@/app/constants/images';

// UTILS
import axios from 'axios';
import { config } from '@/app/lib/config';
import { getToken } from '@/app/lib/secure-store';

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faUserGraduate } from '@fortawesome/free-solid-svg-icons';
import { faChalkboardTeacher } from '@fortawesome/free-solid-svg-icons';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { faMale, faFemale, } from '@fortawesome/free-solid-svg-icons';
import { useLoading } from '@/app/lib/load-context';
import { saveRegistrationStatus } from '@/app/lib/async-store';

const OnboardingScreen1 = () => {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);
  const [personalInfo, setPersonalInfo] = useState<{ firstName?: string, middleName?: string, lastName?: string, accountType?: string, gender?: string }>({}); // Register information state.
  const [step, setStep] = useState(1); // Step state for tracking the current step.
  const handleInputChange = (field: keyof typeof personalInfo, value: string) => { setPersonalInfo((prev) => ({ ...prev, [field]: value })) }; // Handle input change for the form.
  const handleVerifyInput = () => {
    if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName) {
      alert('Please provide your first name and last name.');
      return false;
    }

    return true;
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${config.endpoint}/user/create-profile`, {
        firstName: personalInfo.firstName,
        middleName: personalInfo.middleName,
        lastName: personalInfo.lastName,
        type: personalInfo.accountType,
        gender: personalInfo.gender,
      }, {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });

      const registrationStep = response.data?.registrationStep;

      await saveRegistrationStatus(registrationStep);
      
      alert('Profile created successfully.');
      
      router.replace('/');
    } catch (error: any) {
      alert(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: COLORS.white.white1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            <View style={styles.topWrapper}>
              <Image source={IMAGES.ucgator_logo} style={styles.logo} resizeMode='contain' />
            </View>
            <View style={styles.formWrapper}>
              <View>
                <Text style={{
                  color: COLORS.pmy.white,
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 32,
                }}>Personal Info</Text>
                <Text
                  style={{
                    color: COLORS.pmy.white,
                    fontFamily: 'Montserrat-Regular',
                    fontSize: 14,
                    marginTop: 5,
                    marginBottom: 25
                  }}>Please provide the following information about yourself. This helps us keep our service relevant to you.</Text>
              </View>
              <View>
                {step === 1 && (
                  <>
                    {/* FIRST NAME */}
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        style={styles.textInputField}
                        placeholder="First Name"
                        onChangeText={(text) => handleInputChange('firstName', text)}
                      />
                    </View>
                    {/* MIDDLE NAME */}
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        style={styles.textInputField}
                        placeholder="Middle Name (Optional)"
                        onChangeText={(text) => handleInputChange('middleName', text)}
                      />
                    </View>
                    {/* LAST NAME */}
                    <View style={styles.textInputWrapper}>
                      <TextInput
                        style={styles.textInputField}
                        placeholder="Last Name"
                        onChangeText={(text) => handleInputChange('lastName', text)}
                      />
                    </View>
                    <View>
                      <TouchableOpacity style={styles.button} onPress={() => { if (handleVerifyInput()) setStep(2); }} >
                        <Text style={styles.buttonText}>Continue</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {step === 2 && (
                  <>
                    <View>
                      <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.yellow }}>What is your role in the campus?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                      <TouchableOpacity style={[styles.button2, selectedAccountType === 'student' && styles.selectedButton]} onPress={() => { handleInputChange('accountType', 'student'); setSelectedAccountType('student') }}>
                        <FontAwesomeIcon icon={faUserGraduate} color={COLORS.pmy.white} size={40} style={{ marginBottom: 5 }} />
                        <Text style={styles.button2Text}>Student</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.button2, selectedAccountType === 'faculty' && styles.selectedButton]} onPress={() => { handleInputChange('accountType', 'faculty'); setSelectedAccountType('faculty') }}>
                        <FontAwesomeIcon icon={faChalkboardTeacher} color={COLORS.pmy.white} size={40} style={{ marginBottom: 5 }} />
                        <Text style={styles.button2Text}>Faculty</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.button2, selectedAccountType === 'visitor' && styles.selectedButton]} onPress={() => { handleInputChange('accountType', 'visitor'); setSelectedAccountType('visitor') }}>
                        <FontAwesomeIcon icon={faNetworkWired} color={COLORS.pmy.white} size={40} style={{ marginBottom: 5 }} />
                        <Text style={styles.button2Text}>Visitor</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={[styles.button, !selectedAccountType && { backgroundColor: COLORS.sdy.gray1 }]} onPress={() => { if (selectedAccountType) setStep(3); }} disabled={!selectedAccountType}>
                        <Text style={styles.buttonText}>Next</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {step === 3 && (
                  <>
                    <View>
                      <Text style={{ fontSize: 18, marginBottom: 10, fontFamily: 'Montserrat-Regular', color: COLORS.pmy.yellow }}>Your gender?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 10 }}>
                      <TouchableOpacity style={[styles.button2, selectedGender === 'male' && styles.selectedButton]} onPress={() => { handleInputChange('gender', 'male'); setSelectedGender('male') }}>
                        <FontAwesomeIcon icon={faMale} color={COLORS.pmy.white} size={40} style={{ marginBottom: 5 }} />
                        <Text style={styles.button2Text}>Male</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.button2, selectedGender === 'female' && styles.selectedButton]} onPress={() => { handleInputChange('gender', 'female'); setSelectedGender('female') }}>
                        <FontAwesomeIcon icon={faFemale} color={COLORS.pmy.white} size={40} style={{ marginBottom: 5 }} />
                        <Text style={styles.button2Text}>Female</Text>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={[styles.button, !selectedGender && { backgroundColor: COLORS.sdy.gray1 }]} onPress={() => handleSubmit()} disabled={!selectedAccountType}>
                        <Text style={styles.buttonText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default OnboardingScreen1

const styles = StyleSheet.create({
  topWrapper: {
    height: 'auto',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 40
  },
  logo: {
    width: 'auto',
    minWidth: '50%',
    maxHeight: 100,
    minHeight: 60,
    marginRight: 10
  },

  // FORM WRAPPER
  formWrapper: {
    marginBottom: 20,
    marginTop: 10,
    paddingVertical: 45,
    paddingHorizontal: 25,
    backgroundColor: COLORS.pmy.blue2,
    justifyContent: "center",
  },

  // TEXTINPUT WRAPPER
  textInputWrapper: {
    padding: 5,
    backgroundColor: COLORS.pmy.white,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 15,
  },
  textInputIcon: {
    margin: 5,
  },
  textInputField: {
    width: '100%',
    fontFamily: 'Montserrat-Regular',
    fontSize: 16,
  },

  // BUTTOM
  button: {
    height: 50,
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary.primaryColor1,
    borderRadius: 25,
    marginTop: 35,
    borderWidth: 1,
    borderColor: COLORS.accent.accent2
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.white.white1
  },

  // BUTTON 2
  button2: {
    borderWidth: 2,
    paddingVertical: 25,
    borderRadius: 10,
    borderColor: COLORS.pmy.white,
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
  },
  button2Text: {
    fontSize: 16,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.white.white1
  },
  selectedButton: {
    borderColor: COLORS.pmy.yellow,
  }
})