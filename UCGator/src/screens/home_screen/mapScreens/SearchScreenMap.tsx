import React from 'react'

// dependency import
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { BackHandler, StatusBar, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// icon import
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

// component import
import COLORS from '../../../assets/Colors';

// Hooks
import { useEffect } from 'react';
import { RootStackHomeList } from '../../HomeScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

const SearchScreenMap = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackHomeList>>();

    const returnHandlerFunction = () => {
        navigation.replace("MapScreen")
    };

    useEffect(() => {
        const returnAction = () => {
            navigation.replace("MapScreen");
            return true;
        };

        const returnHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            returnAction
        );

        return () => returnHandler.remove();
    }, [navigation])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle='light-content' backgroundColor={COLORS.primaryBlue} />
                <View style={{ flex: 1 }}>
                    <View style={styles.searchContainer}>
                        {/* RETURN ICON */}
                        <TouchableOpacity style={styles.returnIconBox} onPress={() => returnHandlerFunction()}>
                            <FontAwesomeIcon icon={faChevronLeft} style={{ color: COLORS.nativeWhite }} size={24} />
                        </TouchableOpacity>
                        {/* SEARCH BOX */}
                        <TextInput style={styles.input} placeholder='Search' placeholderTextColor={COLORS.nativeWhite} />
                    </View>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default SearchScreenMap

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.primaryBlue,
    },

    searchContainer: {
        minHeight: '8%',
        maxHeight: '8%',
        paddingHorizontal: 14,
        paddingTop: 14,
        paddingBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.nativeWhite,
    },
    returnIconBox: {
        height: 'auto',
        width: '12%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 'auto',
        width: '88%',
        paddingHorizontal: 15,
        fontSize: 16,
        borderRadius: 25,
        backgroundColor: COLORS.areaInputColor,
        color: COLORS.nativeWhite
    },
})