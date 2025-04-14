// REACT
import React from 'react'

// COMPONENTS
import { View, Text, ScrollView, StatusBar, ImageBackground, TouchableOpacity } from 'react-native'

// UTILTIES
import COLORS from '@/app/constants/colors'
import IMAGES from '@/app/constants/images'

// ICON
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

const explore = () => {
    return (
        <ScrollView>
            <StatusBar barStyle='light-content' backgroundColor={COLORS.pmy.blue1} />
            <ImageBackground style={{ minHeight: 'auto', maxHeight: 175, height: 175, padding: 15 }} source={IMAGES.menu_image_cover}>
                <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', letterSpacing: 1.5, color: COLORS.pmy.white }}>Navigate</Text>
                <TouchableOpacity>
                    
                </TouchableOpacity>
            </ImageBackground>
        </ScrollView>
    )
}

export default explore