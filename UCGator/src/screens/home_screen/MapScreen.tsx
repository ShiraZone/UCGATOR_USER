import React from 'react'

// dependency import
import { StatusBar, StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Hooks
import { RootStackHomeList } from '../HomeScreen';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

// icon import
import { faCloud, faMapMarkerAlt, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

// component import
import SmallButton from '../../component/SmallButton';
import COLORS from '../../assets/Colors';

const MapScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackHomeList>>();

    const searchHandlerFunc = () => {
        navigation.replace("SearchScreen");
    };

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' backgroundColor={COLORS.nativeWhite} />
                <View>
                    {/* RENDER MAP HERE */}
                </View>
                <SafeAreaView style={{ flex: 1 }}>
                    <View style={styles.container}>
                        {/* BOTTOM SHEET FOR SEARCH */}
                        <View style={styles.buttonContainer}>
                            <SmallButton icon={faMagnifyingGlass} onPressFunction={() => searchHandlerFunc()} />
                            <SmallButton icon={faCloud} onPressFunction={() => searchHandlerFunc()} />
                            <SmallButton icon={faMapMarkerAlt} onPressFunction={() => searchHandlerFunc()} />
                        </View>
                    </View>
                </SafeAreaView>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.nativeWhite
    },
    buttonContainer: {
        flexDirection: 'column',
        padding: 14,
        position: 'absolute',
        marginBottom: 5,
        justifyContent: 'flex-end',
        right: 0,
        top: 0,
    }
})