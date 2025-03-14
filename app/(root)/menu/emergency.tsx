import React from 'react'

import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useRouter } from 'expo-router';

// ICONS
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

// CONSTANTS
import IMAGES from '@/app/constants/images'
import COLORS from '@/app/constants/colors'

const Emergency = () => {
  const router = useRouter();
  return (
    <View style={{ backgroundColor: COLORS.pmy.white, flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground style={{flexDirection: 'row', height: 100, padding: 15, marginBottom: 10, justifyContent: 'center' }} source={IMAGES.placement_image_cover} resizeMode='stretch'>
          <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15, top: 15 }} onPress={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white}}>Emergency</Text>
        </ImageBackground>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15}}>
          
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Emergency

const styles = StyleSheet.create({})