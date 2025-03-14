import React from 'react'

import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useRouter } from 'expo-router';

// ICONS
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faRoute } from '@fortawesome/free-solid-svg-icons'
import { faMap } from '@fortawesome/free-solid-svg-icons'
import { faRuler } from '@fortawesome/free-solid-svg-icons'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { faUniversalAccess } from '@fortawesome/free-solid-svg-icons'
import { faPalette } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { faDatabase } from '@fortawesome/free-solid-svg-icons'
import { faLocation } from '@fortawesome/free-solid-svg-icons'
import { faBell } from '@fortawesome/free-solid-svg-icons'
import { faAt } from '@fortawesome/free-solid-svg-icons'

// CONSTANTS
import IMAGES from '@/app/constants/images'
import COLORS from '@/app/constants/colors'

// Settings
// >> Preferences
//      >> Routing Options
//      >> Downloaded Maps
//      >> Measurement Units
//      >> Suggestions
// >> Appearance
//      >> Theme
//      >> Map Style
// >> Application
//      >> Language
//      >> Power Saving Mode
// >> Notifications
//      >> Push Notifications
//      >> Email Notifications
// >> Privacy
//      >> Location Services
//      >> Data Sharing

interface SettingsItemProps {
  icon: any,
  title: string,
  onPress: () => void,
}

const SettingsItem = ({ icon, title, onPress }: SettingsItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.settingsItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
        <FontAwesomeIcon icon={icon} size={18} color={COLORS.pmy.blue1} />
        <Text style={{ flex: 1, marginLeft: 10, fontSize: 16, fontFamily: 'Montserrat-Regular' }}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const Settings = () => {
  const router = useRouter();

  return (
    <View style={{ backgroundColor: COLORS.pmy.white, flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground style={{flexDirection: 'row', height: 100, padding: 15, marginBottom: 10, justifyContent: 'center' }} source={IMAGES.placement_image_cover} resizeMode='stretch'>
          <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15, top: 15 }} onPress={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
          </TouchableOpacity>
          <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white}}>Settings</Text>
        </ImageBackground>
        <ScrollView showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15}}>
          <View>
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>Preferences</Text>
              <View style={styles.settingsPanelContent}>
                <SettingsItem icon={faRoute} title='Routing Options' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faMap} title='Downloaded Maps' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faRuler} title='Measurement Units' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faExclamation} title='Suggestions' onPress={() => alert('Routing Options')} />
              </View>
            </View>
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>Appearnaces</Text>
              <View style={styles.settingsPanelContent}>
                <SettingsItem icon={faPalette} title='Theme' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faLayerGroup} title='Map Style' onPress={() => alert('Routing Options')} />
              </View>
            </View>
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>Application</Text>
              <View style={styles.settingsPanelContent}>
                <SettingsItem icon={faLanguage} title='Language' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faUniversalAccess} title='Accessibility' onPress={() => alert('Routing Options')} />
              </View>
            </View>
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>Notification</Text>
              <View style={styles.settingsPanelContent}>
                <SettingsItem icon={faBell} title='Push Notification' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faAt} title='Email Notification' onPress={() => alert('Routing Options')} />
              </View>
            </View>
            <View style={styles.settingsPanel}>
              <Text style={styles.settingsPanelTitle}>Privacy</Text>
              <View style={styles.settingsPanelContent}>
                <SettingsItem icon={faLocation} title='Location Services' onPress={() => alert('Routing Options')} />
                <SettingsItem icon={faDatabase} title='Data Sharing' onPress={() => alert('Routing Options')} />
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({
  settingsItem: {
    width: '100%',
    marginVertical: 3
  },
  settingsPanel: {
    marginBottom: 8,
  },
  settingsPanelTitle: {
    paddingBottom: 8, 
    fontFamily: 'Montserrat-SemiBold', 
    fontSize: 20
  },
  settingsPanelContent: {
    marginHorizontal: 10, 
    padding: 8, 
    backgroundColor: COLORS.sdy.gray1,
    borderRadius: 15
  }
})