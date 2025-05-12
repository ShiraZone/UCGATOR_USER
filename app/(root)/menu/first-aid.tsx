import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, Modal, Dimensions, StatusBar } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { useRouter } from 'expo-router'

// ICONS
import { faArrowLeft, faHandsHelping, faFirstAid, faTint, faLungs, faBug, faHeartbeat, faFire } from '@fortawesome/free-solid-svg-icons'

// CONSTANTS
import IMAGES from '@/app/constants/images'
import COLORS from '@/app/constants/colors'

// MAIN CONTENT ITEMS
const CONTENT_ITEMS = [
    {
        id: 1,
        title: 'How to Give First Aid',
        content: `
1. Check the Scene for Safety
- Ensure the environment is safe for you and the injured person.
- Don't rush in—you must stay safe to help.

2. Check the Person
- Is the person responsive? Gently tap and ask, "Are you okay?"
- If unresponsive, call for help and check breathing.
- If responsive, ask about their pain or symptoms.

3. Call Emergency Services
- Dial your local emergency number (e.g., 911).
- Provide clear info: location, what happened, number of people hurt.

4. Monitor Their Condition
- Stay with them.
- Watch for changes in breathing, color, alertness.
- Be calm and reassuring.

5. Wait for Help to Arrive
- Continue providing care.
- If trained, give CPR or rescue breathing if NEEDED and the person is unresponsive.`,
        icon: faFirstAid
    },
    {
        id: 2,
        title: 'Bleeding',
        content: `How to handle general bleeding injuries.
            
1. Apply Direct Pressure: Use a clean cloth or sterile bandage and press firmly on the wound to help stop the bleeding.

2. Elevate the Injured Area (if possible): If the wound is on an arm or leg, raise it above heart level to slow the bleeding.

3. Maintain Pressure Until Bleeding Stops: Keep holding firm pressure for several minutes—don't lift the bandage to check too soon.

4. Apply a Bandage: Once the bleeding slows, secure the wound with a sterile dressing or bandage.

If the bleeding is from a minor cut or scrape, cleaning the wound with water and applying antiseptic can help prevent infection.`,
        icon: faTint
    },
    {
        id: 3,
        title: 'Choking',
        content: `
Step-by-Step (Adult/Child over 1 year)

1. Ask if they are choking
- Can they speak, cough, or breathe?
- Note: If they can cough forcefully, encourage them to continue coughing.

2. Call for help
- Dial emergency services if needed (e.g., 911).
- Give 5 Back Blows

3. Stand to the side and slightly behind the person.
- Use the heel of your hand between the shoulder blades.
- Give 5 Abdominal Thrusts (Heimlich Maneuver)

4. Stand behind them, wrap arms around waist.
- Make a fist just above the navel, grasp with the other hand.
- Thrust inward and upward.

5. Alternate Back Blows and Thrusts
- Continue until the object is expelled or the person becomes unresponsive.

6. If unconscious, begin CPR
- Start chest compressions, check airway for object each time before rescue breaths.

Additional Notes:
- Infants (<1 year): Use 5 back blows and 5 chest thrusts (not abdominal).
- Pregnant or obese: Use chest thrusts instead of abdominal.
- Never perform blind finger sweeps—may push object deeper.
`,
        icon: faLungs
    },
    {
        id: 4,
        title: 'Bites and Stings',
        content: `
Step-by-Step (Adult/Child over 1 year)

1. Move away from danger
- Ensure safety (e.g., leave area with wasps, dogs, etc.).

2. Assess and Clean the Wound
- Wash with soap and water thoroughly.
- Pat dry and apply antiseptic.

3. Apply a cold compress
- Reduces swelling and pain.

4. Monitor for Allergic Reaction
- Watch for hives, swelling, difficulty breathing, dizziness.

5. Administer Epinephrine (if prescribed)
- For known anaphylaxis risk (e.g., EpiPen).
- Then call emergency services immediately.

6. Cover the wound with a sterile bandage
- For larger or deeper bites, seek medical help.

Additional Notes:
- Animal/human bites: High infection risk — seek medical attention.
- Snakebites: Keep victim calm, immobilize limb, don't suck venom or apply tourniquet.
- Bee stings: Remove stinger by scraping (not tweezing) to avoid squeezing more venom.
`,
        icon: faBug
    },
    {
        id: 5,
        title: 'Chest and Abdominal Injuries',
        content: `
Step-by-Step (Adult/Child over 1 year)

1. Call emergency services immediately
- These injuries can be life-threatening.

2. Assess Breathing and Consciousness
- Provide reassurance and keep still.

3. For Open Chest Wounds (sucking chest wound)
- Cover with a non-porous material (e.g., plastic wrap).
- Tape three sides only to create a flutter valve.
- Allows air out, prevents air in.

4. For Abdominal Evisceration (organs protruding)
- Do not push organs back in.
- Cover with moist sterile dressing.
- Then cover with dry dressing or clean cloth.

5. Position the person carefully
- Semi-sitting or on side (if conscious and no spinal injury suspected).
- Keep still and calm.

6. Monitor and support until help arrives
- Check breathing, pulse, and signs of shock.

Additional Notes:
- Never apply direct pressure on chest or abdomen wounds.
- Look for signs of internal bleeding (e.g., pale, cold, weak pulse).
- Avoid giving food or water.
`,
        icon: faHeartbeat
    },
    {
        id: 6,
        title: 'Burns',
        content: `
Step-by-Step

1. Ensure scene safety.
- Remove person from source (fire, chemical, electricity).

2. Cool the burn with cool running water (10–20 minutes)
- As soon as possible.
- Do not use ice.

3. Remove tight clothing/jewelry
- Only if not stuck to skin.

4. Cover the burn with sterile, non-stick dressing
- Or clean cloth.
- Avoid cotton balls or fluffy material.

5. Do not apply creams, butter, or ointments

6. Monitor for shock
- Keep person warm, elevate legs unless injury prevents it.

7. Seek medical help if:
- Burn is larger than palm of hand.
- Burn is on face, hands, feet, genitals.
- Chemical or electrical burn.
- Blisters are extensive or burn is deep.

Additional Notes:
1st-degree burn: Red, dry, painful – cool and cover.
2nd-degree burn: Blisters, swelling – same care, don't pop blisters.
3rd-degree burn: Charred/white, numb – do not remove clothing stuck to skin.
`,
        icon: faFire
    },
];

const FirstAid = () => {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<number | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const openModal = (id: number) => {
        setSelectedItem(id);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    const randomNum = Math.floor(Math.random() * 1000) + 1;

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar backgroundColor='white' barStyle={'dark-content'} />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', padding: 15, }}>
                    <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto' }} onPress={() => router.back()}>
                        <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.blue1, paddingLeft: 5 }}>First Aid</Text>
                </View>
                <ScrollView contentContainerStyle={{ flexGrow: 1}} style={{ paddingHorizontal: 15}} showsVerticalScrollIndicator={false}>
                    <Text style={styles.subtitle}>Tap each icon to show details.</Text>
                    <Text style={styles.locationText}>Current Location: {randomNum}</Text>
                    <View style={styles.gridContainer}>
                        {CONTENT_ITEMS.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.gridItem}
                                onPress={() => openModal(item.id)}
                            >
                                <View style={styles.iconContainer}>
                                    <FontAwesomeIcon icon={item.icon} size={40} color={COLORS.pmy.white} />
                                </View>
                                <Text style={styles.gridItemText}>{item.title}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {selectedItem !== null && (
                                <>
                                    <View style={styles.modalHeader}>
                                        <FontAwesomeIcon
                                            icon={CONTENT_ITEMS[selectedItem - 1].icon}
                                            size={24}
                                            color={COLORS.pmy.white}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text style={styles.modalTitle}>
                                            {CONTENT_ITEMS[selectedItem - 1].title}
                                        </Text>
                                    </View>
                                    <ScrollView style={styles.modalScroll}>
                                        <Text style={styles.modalText}>
                                            {CONTENT_ITEMS[selectedItem - 1].content}
                                        </Text>
                                    </ScrollView>
                                    <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                        <Text style={styles.closeButtonText}>Close</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

export default FirstAid;

const styles = StyleSheet.create({
    topHeader: {
        flexDirection: 'row',
        height: 100,
        padding: 15,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
    },
    backButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 5,
        borderRadius: 8,
        width: 'auto',
        position: 'absolute',
        left: 15,
        top: 15
    },
    headerText: {
        fontSize: 22,
        textAlign: 'center',
        fontFamily: 'Montserrat-ExtraBold',
        color: COLORS.pmy.white
    },
    scrollContent: {
        flexGrow: 1,
        paddingTop: 100,
        paddingHorizontal: 15,
        marginBottom: 20
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Montserrat-Bold',
        marginVertical: 15,
        color: COLORS.pmy.blue1
    },
    locationText: {
        fontSize: 18,
        fontFamily: 'Montserrat-Regular',
        marginBottom: 15,
        color: COLORS.pmy.blue1
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10
    },
    gridItem: {
        width: (Dimensions.get('window').width - 40) / 2,
        marginBottom: 20,
        alignItems: 'center'
    },
    iconContainer: {
        backgroundColor: COLORS.pmy.blue1,
        width: 80,
        height: 80,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    gridItemText: {
        color: COLORS.pmy.blue1,
        fontSize: 14,
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalContent: {
        backgroundColor: COLORS.pmy.white,
        borderRadius: 10,
        padding: 20,
        width: '90%',
        maxHeight: '80%'
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.pmy.blue1,
        padding: 15,
        borderRadius: 8,
        marginBottom: 15
    },
    modalTitle: {
        color: COLORS.pmy.white,
        fontSize: 18,
        fontFamily: 'Montserrat-Bold'
    },
    modalScroll: {
        maxHeight: '70%'
    },
    modalText: {
        color: COLORS.pmy.black,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
        lineHeight: 20
    },
    closeButton: {
        backgroundColor: COLORS.pmy.blue2,
        padding: 15,
        borderRadius: 8,
        marginTop: 15,
        alignItems: 'center'
    },
    closeButtonText: {
        color: COLORS.pmy.white,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold'
    }
});