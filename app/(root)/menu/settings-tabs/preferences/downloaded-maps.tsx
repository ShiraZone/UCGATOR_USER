import React, { useState, useEffect } from 'react';

import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Switch, FlatList, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faDownload, faTrash, faMap, faSdCard, faCheck, faExclamation, faWifi } from '@fortawesome/free-solid-svg-icons';

import IMAGES from '@/app/constants/images';
import COLORS from '@/app/constants/colors';

// Define a map item type
interface MapItem {
    id: string;
    name: string;
    description: string;
    size: string;
    downloaded: boolean;
    lastUpdated: string;
}

const downloaded_maps = () => {
    const router = useRouter();
    const [downloadedMaps, setDownloadedMaps] = useState<MapItem[]>([]);
    const [availableMaps, setAvailableMaps] = useState<MapItem[]>([]);
    const [autoUpdate, setAutoUpdate] = useState(false);
    const [downloadOnWifiOnly, setDownloadOnWifiOnly] = useState(true);
    const [storageUsed, setStorageUsed] = useState('45 MB');
    const [storageAvailable, setStorageAvailable] = useState('1.2 GB');
    
    // Load sample data (this would come from an API in a real app)
    useEffect(() => {
        // Simulate maps that are already downloaded
        setDownloadedMaps([
            {
                id: '1',
                name: 'UC Main Campus - Ground Floor',
                description: 'Includes all classrooms and facilities',
                size: '15 MB',
                downloaded: true,
                lastUpdated: '2023-05-10'
            },
            {
                id: '2',
                name: 'UC Main Campus - Second Floor',
                description: 'Administrative offices and labs',
                size: '12 MB',
                downloaded: true,
                lastUpdated: '2023-05-10'
            },
            {
                id: '3',
                name: 'UC Main Campus - Third Floor',
                description: 'Libraries and study areas',
                size: '18 MB',
                downloaded: true,
                lastUpdated: '2023-05-08'
            },
        ]);
        
        // Simulate maps available for download
        setAvailableMaps([
            {
                id: '4',
                name: 'UC Law Building',
                description: 'Law classrooms and moot court',
                size: '10 MB',
                downloaded: false,
                lastUpdated: '2023-05-01'
            },
            {
                id: '5',
                name: 'UC Athletic Complex',
                description: 'Gymnasium, courts, and facilities',
                size: '22 MB',
                downloaded: false,
                lastUpdated: '2023-04-28'
            },
        ]);
    }, []);

    // Handle downloading a map
    const handleDownload = (mapId: string) => {
        // In a real app, this would initiate an actual download
        const mapToDownload = availableMaps.find(map => map.id === mapId);
        if (mapToDownload) {
            // Move from available to downloaded
            setAvailableMaps(availableMaps.filter(map => map.id !== mapId));
            setDownloadedMaps([...downloadedMaps, {...mapToDownload, downloaded: true, lastUpdated: new Date().toISOString().split('T')[0]}]);
            Alert.alert('Download Started', `${mapToDownload.name} is downloading. This may take a few minutes.`);
        }
    };
    
    // Handle deleting a map
    const handleDelete = (mapId: string) => {
        Alert.alert(
            'Delete Map',
            'Are you sure you want to delete this offline map? You\'ll need to download it again to use it offline.',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const mapToDelete = downloadedMaps.find(map => map.id === mapId);
                        if (mapToDelete) {
                            // Move from downloaded to available
                            setDownloadedMaps(downloadedMaps.filter(map => map.id !== mapId));
                            setAvailableMaps([...availableMaps, {...mapToDelete, downloaded: false}]);
                        }
                    }
                }
            ]
        );
    };
    
    // Render each downloaded map item
    const renderDownloadedItem = ({ item }: { item: MapItem }) => (
        <View style={styles.mapItem}>
            <View style={styles.mapIconContainer}>
                <FontAwesomeIcon icon={faMap} size={24} color={COLORS.pmy.blue1} />
            </View>
            
            <View style={styles.mapInfoContainer}>
                <Text style={styles.mapName}>{item.name}</Text>
                <Text style={styles.mapDescription}>{item.description}</Text>
                <Text style={styles.mapDetails}>Size: {item.size} • Last updated: {item.lastUpdated}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={() => handleDelete(item.id)}
            >
                <FontAwesomeIcon icon={faTrash} size={20} color={COLORS.pmy.blue1} />
            </TouchableOpacity>
        </View>
    );
    
    // Render each available map item
    const renderAvailableItem = ({ item }: { item: MapItem }) => (
        <View style={styles.mapItem}>
            <View style={styles.mapIconContainer}>
                <FontAwesomeIcon icon={faMap} size={24} color={COLORS.pmy.blue1} />
            </View>
            
            <View style={styles.mapInfoContainer}>
                <Text style={styles.mapName}>{item.name}</Text>
                <Text style={styles.mapDescription}>{item.description}</Text>
                <Text style={styles.mapDetails}>Size: {item.size}</Text>
            </View>
            
            <TouchableOpacity 
                style={styles.downloadButton} 
                onPress={() => handleDownload(item.id)}
            >
                <FontAwesomeIcon icon={faDownload} size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Downloaded Maps</Text>
                </View>

                <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                    {/* Storage Info Section */}
                    <View style={styles.storageContainer}>
                        <View style={styles.storageIconContainer}>
                            <FontAwesomeIcon icon={faSdCard} size={20} color={COLORS.pmy.blue1} />
                        </View>
                        <View style={styles.storageInfo}>
                            <Text style={styles.storageTitle}>Storage Used</Text>
                            <Text style={styles.storageText}>{storageUsed} used of {storageAvailable} available</Text>
                            <View style={styles.storageProgressContainer}>
                                <View style={[styles.storageProgressBar, { width: '30%' }]} />
                            </View>
                        </View>
                    </View>

                    {/* Settings Section */}
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Download Settings</Text>
                        <View style={styles.settingItem}>
                            <View style={styles.settingTextContainer}>
                                <FontAwesomeIcon icon={faCheck} size={16} color={COLORS.pmy.blue1} style={styles.settingIcon} />
                                <Text style={styles.settingText}>Auto update offline maps</Text>
                            </View>
                            <Switch
                                value={autoUpdate}
                                onValueChange={setAutoUpdate}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                        <View style={styles.settingItem}>
                            <View style={styles.settingTextContainer}>
                                <FontAwesomeIcon icon={faWifi} size={16} color={COLORS.pmy.blue1} style={styles.settingIcon} />
                                <Text style={styles.settingText}>Download over Wi-Fi only</Text>
                            </View>
                            <Switch
                                value={downloadOnWifiOnly}
                                onValueChange={setDownloadOnWifiOnly}
                                trackColor={{ false: '#D9D9D9', true: COLORS.pmy.blue1 }}
                                thumbColor={COLORS.pmy.white}
                            />
                        </View>
                    </View>

                    {/* Downloaded Maps Section */}
                    <View style={styles.mapSection}>
                        <Text style={styles.sectionTitle}>Downloaded Maps</Text>
                        {downloadedMaps.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <FontAwesomeIcon icon={faExclamation} size={20} color="#888" style={styles.emptyIcon} />
                                <Text style={styles.emptyText}>No downloaded maps</Text>
                                <Text style={styles.emptySubtext}>Downloaded maps will appear here</Text>
                            </View>
                        ) : (
                            downloadedMaps.map(item => (
                                <View key={item.id}>
                                    {renderDownloadedItem({ item })}
                                </View>
                            ))
                        )}
                    </View>

                    {/* Available Maps Section */}
                    <View style={styles.mapSection}>
                        <Text style={styles.sectionTitle}>Available Maps</Text>
                        {availableMaps.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <FontAwesomeIcon icon={faExclamation} size={20} color="#888" style={styles.emptyIcon} />
                                <Text style={styles.emptyText}>No maps available</Text>
                                <Text style={styles.emptySubtext}>Check back later for new maps</Text>
                            </View>
                        ) : (
                            availableMaps.map(item => (
                                <View key={item.id}>
                                    {renderAvailableItem({ item })}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

export default downloaded_maps;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    safeArea: {
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    backButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 5,
        borderRadius: 8,
        width: 'auto'
    },
    headerTitle: {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Montserrat-ExtraBold',
        color: COLORS.pmy.blue1,
        paddingLeft: 5
    },
    storageContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
        marginBottom: 20,
    },
    storageIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(43, 79, 110, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    storageInfo: {
        flex: 1,
    },
    storageTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 4
    },
    storageText: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        marginBottom: 8
    },
    storageProgressContainer: {
        width: '100%',
        height: 6,
        backgroundColor: '#E0E0E0',
        borderRadius: 3
    },
    storageProgressBar: {
        height: 6,
        backgroundColor: COLORS.pmy.blue1,
        borderRadius: 3
    },
    settingsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 12
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 8
    },
    settingTextContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    settingIcon: {
        marginRight: 10
    },
    settingText: {
        fontSize: 16,
        fontFamily: 'Montserrat-Regular',
        color: COLORS.pmy.black
    },
    mapSection: {
        marginBottom: 20
    },
    mapItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 15,
        marginBottom: 8
    },
    mapIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(43, 79, 110, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15
    },
    mapInfoContainer: {
        flex: 1
    },
    mapName: {
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
        color: COLORS.pmy.blue1,
        marginBottom: 4
    },
    mapDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        marginBottom: 4
    },
    mapDetails: {
        fontSize: 12,
        fontFamily: 'Montserrat-Regular',
        color: '#888'
    },
    downloadButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: COLORS.pmy.blue1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(43, 79, 110, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyContainer: {
        backgroundColor: COLORS.sdy.gray1,
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8
    },
    emptyIcon: {
        marginBottom: 10
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'Montserrat-SemiBold',
        color: COLORS.pmy.blue1,
        marginBottom: 4
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        color: 'gray',
        textAlign: 'center'
    }
});