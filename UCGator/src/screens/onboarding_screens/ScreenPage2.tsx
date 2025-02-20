import React from 'react'

import { ImageBackground, Image, Text, View } from 'react-native'

import styles from './Onboarding.Style'

const ScreenPage2 = () => {
    return (
        <View style={styles.container}>
            <ImageBackground source={require('../../assets/onboarding_assets/bgraph_2.png')} resizeMode="stretch" style={styles.background}>
                <View style={styles.textContainer}>
                    <Text style={styles.textTitle}>Manage Your {'\n'}Time Better </Text>
                    <Text style={styles.textSubtitle}>With UCGator, our guidance allows you to manage your time better.</Text>
                </View>
                <Image source={require('../../assets/onboarding_assets/img_lght_2.png')} style={styles.imageHighlight} />
            </ImageBackground>
        </View>
    )
}

export default ScreenPage2