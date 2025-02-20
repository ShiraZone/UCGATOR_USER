import { StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';


import { ImageBackground, Image, Text, View } from 'react-native'

import styles from './Onboarding.Style'

const ScreenPage2 = () => {
    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Text style={styles.title}>Manage Your Time Better</Text>
                <Text style = {styles.description}>
                    With UCGator, our guidance
                    allows you to manage your time better.
                </Text>
            </View>
            <View style = {styles.imageContainer}>
                <Image 
                    source={require("../../assets/onboarding_assets/splash_2_person.png")} 
                    style={styles.image}
                />
            </View>  
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingTop: 80,
        padding: 40,
    },

    gradientImage: {

    },

    // Text
    textContainer: {
        alignItems: "flex-start",
        width: "100%",
    },
    title: {
        fontSize: 45,
        fontWeight: "bold",
        textAlign: "left",
        color: "#000",
    },
    description: {
        fontSize: 16,
        textAlign: "left",
        color: "#666",
        marginTop: 8,
    },

     // Image
     imageContainer: {
        alignItems: "flex-start",
        marginBottom: 20,
    },
    image: {
        width: 500,
        height: 500,
        resizeMode: "contain",
        alignSelf: "flex-end",
    },
});

export default ScreenPage2