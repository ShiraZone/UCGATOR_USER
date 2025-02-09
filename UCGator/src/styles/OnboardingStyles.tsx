import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    vector: {
        width: '100%',
        height: '35%',
        position: 'absolute',
        zIndex: 0,
    },
    image: {
        flex: 0.6,
        justifyContent: 'center',
        width: '100%',
    },
    textContainer: {
        padding: 25,
        margin: 5,
        flex: 0.4,
    },
    title: {
        fontSize: 32,
        fontWeight: 800,
    },
    subtitle: {
        fontSize: 18,
        marginVertical: 15,
        fontWeight: 300,
        lineHeight: 25,
    }
})

export default styles;