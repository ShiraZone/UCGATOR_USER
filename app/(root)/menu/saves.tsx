import { View, Text, SafeAreaView, TouchableOpacity, StatusBar, FlatList, StyleSheet, Image, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import COLORS from '@/app/constants/colors'
import { faArrowLeft, faPencil, faTrash, faLocationDot, faBuilding, faFlask, faMarker, faMapLocation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { router } from 'expo-router'
import axios from 'axios'
import { config } from '@/app/lib/config'
import { getToken } from '@/app/lib/secure-store'
import Toast from 'react-native-toast-message'

// Define the type for saved pin items
interface SavedPin {
  _id: string
  buildingId: string
  floorId: string
  poiId: string
  dateAdded: string
  saveNote?: string
  buildingName: string
  floorName: string
  pinName: string
  pinDescription: string
  pinType: string
}

const SavesScreen = () => {
  const [savedPins, setSavedPins] = useState<SavedPin[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [editingPin, setEditingPin] = useState<string | null>(null)
  const [noteText, setNoteText] = useState<string>('')
  const [refreshing, setRefreshing] = useState<boolean>(false)

  // Fetch saved pins when component mounts
  useEffect(() => {
    fetchSavedPins()
  }, [])

  // Function to fetch saved pins from API
  const fetchSavedPins = async () => {
    try {
      const token = await getToken()
      if (!token) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in again',
        })
        router.replace('/(root)/(auth)/log-in')
        return
      }

      const response = await axios.get(`${config.endpoint}/saves/pin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setSavedPins(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching saved pins:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to load saved pins',
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Handle refreshing the list
  const handleRefresh = () => {
    setRefreshing(true)
    fetchSavedPins()
  }

  // Delete a saved pin
  const handleDeletePin = async (pinId: string) => {
    try {
      const token = await getToken()
      if (!token) return

      await axios.delete(`${config.endpoint}/saves/pin/${pinId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Remove the deleted pin from state
      setSavedPins(prevPins => prevPins.filter(pin => pin._id !== pinId))
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Pin removed from saved locations',
      })
    } catch (error) {
      console.error('Error deleting pin:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete saved pin',
      })
    }
  }

  // Start editing a pin's note
  const handleEditPin = (pin: SavedPin) => {
    setEditingPin(pin._id)
    setNoteText(pin.saveNote || '')
  }

  // Save the edited note
  const handleSaveNote = async (pinId: string) => {
    try {
      const token = await getToken()
      if (!token) return

      await axios.patch(`${config.endpoint}/saves/pin/${pinId}`, 
        { saveNote: noteText },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      // Update the pin in state
      setSavedPins(prevPins => 
        prevPins.map(pin => 
          pin._id === pinId 
            ? { ...pin, saveNote: noteText } 
            : pin
        )
      )
      
      // Exit edit mode
      setEditingPin(null)
      
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Note updated successfully',
      })
    } catch (error) {
      console.error('Error updating note:', error)
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update note',
      })
    }
  }

  // Navigate to location details
  const navigateToLocation = (pin: SavedPin) => {
    router.push(`/maps/location-details?id=${pin.poiId}`)
  }

  // Render a saved pin item
  const renderItem = ({ item }: { item: SavedPin }) => {
    return (
      <TouchableOpacity 
        style={styles.pinCard}
        onPress={() => navigateToLocation(item)}
      >
        <View style={styles.pinHeader}>
          <Text style={styles.pinTitle}>{item.pinName}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleEditPin(item)}
            >
              <FontAwesomeIcon icon={faPencil} size={16} color={COLORS.pmy.blue1} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleDeletePin(item._id)}
            >
              <FontAwesomeIcon icon={faTrash} size={16} color={COLORS.pmy.blue1} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.pinTypeRow}>
          <View style={styles.pinTypeContainer}>
            <FontAwesomeIcon 
              icon={
                item.pinType === 'classroom' ? faFlask : 
                item.pinType === 'service' ? faLocationDot : 
                faBuilding
              } 
              size={14} 
              color={COLORS.pmy.blue1} 
            />
            <Text style={styles.pinTypeText}>{item.pinType.charAt(0).toUpperCase() + item.pinType.slice(1)}</Text>
          </View>
        </View>

        <View style={styles.locationInfo}>
          <FontAwesomeIcon icon={faMapLocation} size={14} color={COLORS.pmy.blue1} />
          <Text style={styles.locationText}>
            {item.buildingName}, {item.floorName}
          </Text>
        </View>

        {editingPin === item._id ? (
          <View style={styles.noteEditContainer}>
            <TextInput
              style={styles.noteInput}
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Add a note for this place..."
              multiline
            />
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={() => handleSaveNote(item._id)}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noteContainer}>
            <Text style={styles.noteLabel}>Note:</Text>
            <Text style={styles.noteText}>
              {item.saveNote || "Add a note for this place."}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor='white' barStyle={'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Saved Locations</Text>
      </View>
      
      {/* Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.pmy.blue1} />
          <Text style={styles.loadingText}>Loading your saved locations...</Text>
        </View>
      ) : savedPins.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No saved locations</Text>
          <Text style={styles.emptyText}>
            Your saved locations will appear here. Visit a location and save it to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedPins}
          renderItem={renderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      )}

      <Toast />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white'
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
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.pmy.blue1
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.pmy.blue1,
    marginBottom: 10
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.pmy.blue1,
    textAlign: 'center'
  },
  listContainer: {
    padding: 10
  },
  pinCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5
  },
  pinTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat-Bold',
    color: COLORS.pmy.blue1,
    flex: 1
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 5,
    marginLeft: 10
  },
  pinTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5
  },
  pinTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1F8',
    paddingVertical: 3,
    paddingHorizontal: 10,
    borderRadius: 12
  },
  pinTypeText: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.pmy.blue1,
    marginLeft: 4
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: COLORS.pmy.blue1,
    marginLeft: 8
  },
  noteContainer: {
    marginTop: 5,
    padding: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 5
  },
  noteLabel: {
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: COLORS.pmy.blue1,
    marginBottom: 3
  },
  noteText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Regular',
    color: '#666'
  },
  noteEditContainer: {
    marginTop: 5
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    padding: 10,
    fontFamily: 'Montserrat-Regular',
    fontSize: 14,
    minHeight: 60,
    backgroundColor: '#FFF',
    color: COLORS.pmy.blue1
  },
  saveButton: {
    backgroundColor: COLORS.pmy.blue2,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5
  },
  saveButtonText: {
    color: COLORS.pmy.white,
    fontFamily: 'Montserrat-Bold',
    fontSize: 14
  }
})

export default SavesScreen