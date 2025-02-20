import React from 'react'

import { ImageBackground, Image, Text, View } from 'react-native'

import styles from './Onboarding.Style'

const ScreenPage1 = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/onboarding_assets/bgraph_1.png')} resizeMode="stretch" style={styles.background}>
                <View style={styles.textContainer}>
                    <Text style={styles.textTitle}>Unique Campus {'\n'}Experience </Text>
                    <Text style={styles.textSubtitle}>Enjoy your campus vacation. UCGator will guide you throughout your journey within the campus.</Text>
                </View>
                <Image source={require('../../assets/onboarding_assets/img_lght_1.png')} style={styles.imageHighlight} />
            </ImageBackground>
        </View>
    )
}

export default ScreenPage1