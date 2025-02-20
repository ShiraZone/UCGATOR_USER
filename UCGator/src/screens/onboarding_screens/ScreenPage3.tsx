import React from 'react'

import { ImageBackground, Image, Text, View } from 'react-native'

import styles from './Onboarding.Style'

const ScreenPage3 = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/onboarding_assets/bgraph_3.png')} resizeMode="stretch" style={styles.background}>
                <View style={styles.textContainer}>
                    <Text style={styles.textTitle}>Discover the {'\n'}University Better </Text>
                    <Text style={styles.textSubtitle}>Save the moments that matter. Blog let’s you discover moments together with the community.</Text>
                </View>
                <Image source={require('../../assets/onboarding_assets/img_lght_3.png')} style={styles.imageHighlight} />
            </ImageBackground>
        </View>
    )
}

export default ScreenPage3