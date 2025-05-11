import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

const downloaded_maps = () => {
    const router = useRouter();

    return (
         <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>Downloaded Maps</Text>
                </View>

                
            </SafeAreaView>
        </View>
    )
};

export default downloaded_maps;

const styles = StyleSheet.create({
    
});