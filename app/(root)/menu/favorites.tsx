import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import COLORS from '@/app/constants/colors'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { router } from 'expo-router'

const favorites = () => {
  return (
    <View>
      <SafeAreaView>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}>
          <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', marginRight: 5 }} onPress={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1 }}>Bookmarks</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default favorites