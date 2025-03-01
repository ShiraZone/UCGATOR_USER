import React from 'react'

// dependency import
import { StyleSheet, TouchableOpacity } from 'react-native'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'

// component import
import COLORS from '../assets/Colors';

interface CustomProps {
    icon: any;
    onPressFunction: () => void;
}

const SmallButton: React.FC<CustomProps> = ({
    icon,
    onPressFunction,
}) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPressFunction}>
            <FontAwesomeIcon icon={icon} style={{ color: COLORS.nativeWhite }} size={22} />
        </TouchableOpacity>
    )
}

export default SmallButton

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        backgroundColor: COLORS.primaryBlue,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12
    },
})