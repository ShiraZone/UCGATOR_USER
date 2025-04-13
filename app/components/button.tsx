import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import COLORS from '../constants/colors';

interface ButtonProps {
    title: string;
    onPress: () => void;
}

const button = ({ title, onPress }: ButtonProps) => {
    return (
        <TouchableOpacity style={styles.button} onPress={() => onPress()}>
            <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
    )
}

export default button

const styles = StyleSheet.create({
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
    }
})