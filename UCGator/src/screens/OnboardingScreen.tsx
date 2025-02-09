import React from 'react';

import { View, StyleSheet } from 'react-native';
import ScreenPage1 from './onboarding_screens/ScreenPage1'
import ScreenPage2 from './onboarding_screens/ScreenPage2'
import ScreenPage3 from './onboarding_screens/ScreenPage3'

import Paginator from '../component/paginator';

import ViewPager from '@react-native-community/viewpager';

const OnboardingScreen = () => {
    return (
        <View style={styles.container}>
            <ViewPager style={styles.pager}>
                <View key='1'>
                    <ScreenPage1 />
                </View>
                <View key='2'>
                    <ScreenPage2 />
                </View>
                <View key='3'>
                    <ScreenPage3 />
                </View>
            </ViewPager>
        </View>
    )
}

export default OnboardingScreen


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pager: {
        flex: 1,
    },
    paginator: {
        zIndex: 2,
    }
})