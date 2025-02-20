import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%'
    },
    background: {
        flex: 1,
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    textTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 1.5
    },
    textSubtitle: {
        fontSize: 16,
        fontWeight: 300,
        letterSpacing: 0.75,
        lineHeight: 20,
        marginTop: 10
    },
    imageHighlight: {
        flex: 0,
        width: 325,
        height: 450,
        alignSelf: 'flex-end',
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



export default styles;