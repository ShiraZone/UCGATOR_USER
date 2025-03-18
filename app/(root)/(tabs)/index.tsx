import React from 'react-native';

// COMPONENTS
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

// ICONS
import { faMagnifyingGlass, faMicrophone, faPlus, faMinus, faArrowUp, faAlignCenter, faCloud } from '@fortawesome/free-solid-svg-icons';

// CONSTANT
import COLORS from '@/app/constants/colors';

export default function Index() {

  return (
    <View style={{ backgroundColor: COLORS.pmy.white, flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {/** SEARCH BAR */}
      <View style={{ position: 'absolute', top: 10, left: 10, right: 10, zIndex: 1 }}>
        <View style={{ backgroundColor: COLORS.pmy.blue1, padding: 10, borderRadius: 8 }}>
          <Text>Search Bar</Text>
        </View>
      </View>
      {/** MAP */}
      <View style={{ flex: 1 }}>
        {/* Replace this with your map component */}
        <Text>Map Placeholder</Text>
      </View>
      {/** BUTTONS */}
      <View style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1 }}>
        <FontAwesomeIcon icon={faPlus} size={24} color={COLORS.pmy.blue1} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});
