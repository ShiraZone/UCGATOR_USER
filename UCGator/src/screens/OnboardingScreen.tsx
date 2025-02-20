import React, { useState, useRef, useEffect } from 'react';

import { View, StyleSheet, Text, Animated } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App'

import PagerView from 'react-native-pager-view';
import ScreenPage1 from './onboarding_screens/ScreenPage1'
import ScreenPage2 from './onboarding_screens/ScreenPage2'
import ScreenPage3 from './onboarding_screens/ScreenPage3'

type OnboardingScreenProps = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {

    const pagerViewRef = useRef<PagerView>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = 3;

    const funcGetStarted = () => {
        navigation.navigate('Authentication')
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPage((prevPage) => {
                const nextPage = prevPage + 1;
                if (nextPage < totalPages) {
                    pagerViewRef.current?.setPage(nextPage);
                    return nextPage;
                } else {
                    pagerViewRef.current?.setPage(0);
                    return 0;
                }
            });
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <PagerView style={styles.pager} ref={pagerViewRef} overScrollMode={'always'}>
                <ScreenPage1 key='1' />
                <ScreenPage2 key='2' />
                <ScreenPage3 key='3' />
            </PagerView>
            <View style={styles.skipContainer}>
                <Text onPress={funcGetStarted}>Get Started</Text>
            </View>
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
    skipContainer: {
        position: 'absolute',
        paddingVertical: 50,
        right: 20
    }
})