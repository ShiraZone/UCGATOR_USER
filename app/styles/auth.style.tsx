import { StyleSheet } from "react-native";

import COLORS from '@/app/constants/colors'

const styles = StyleSheet.create({
    topWrapper: {
        height: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 40
    },
    logo: {
        width: 'auto',
        minWidth: '50%',
        maxHeight: 100,
        minHeight: 60,
        marginRight: 10
    },
    title: {
        fontFamily: 'Montserrat-Regular',
        color: COLORS.white.white1,
        position: 'absolute',
        top: 10,
        alignSelf: 'center',
        fontSize: 18
    },
    subtitle: {
        fontFamily: 'Montserrat-Bold',
        fontSize: 20,
        color: COLORS.white.white2,
        top: -10
    },

    // FORM WRAPPER
    formWrapper: {
        borderRadius: 15,
        marginBottom: 20,
        marginTop: 10,
        paddingVertical: 45,
        marginHorizontal: 20,
        paddingHorizontal: 25,
        backgroundColor: COLORS.accent.accent1,
        justifyContent: "center",
    },

    // TEXTINPUT WRAPPER
    textInputWrapper: {
        padding: 5,
        backgroundColor: COLORS.white.white1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginBottom: 25,
    },
    textInputIcon: {
        margin: 5,
    },
    textInputField: {
        width: '100%'
    },

    // EXTRA
    sublimeText: {
        fontFamily: "MontSerrat-SemiBold",
        color: COLORS.white.white1
    },

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