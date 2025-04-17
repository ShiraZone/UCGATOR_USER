import React, { useState } from 'react'

import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ImageBackground, KeyboardAvoidingView } from 'react-native'
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

                - Don’t rush in—you must stay safe to help.

                2. Check the Person
                - Is the person responsive? Gently tap and ask, “Are you okay?”
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
                - If trained, give CPR or rescue breathing if NEEDED and the person is unresponsive.
                `, 
        icon: faFirstAid 
    },
    { 
        id: 2, 
        title: 'Bleeding',
        content: `How to handle general bleeding injuries.
            
1. Apply Direct Pressure: Use a clean cloth or sterile bandage and press firmly on the wound to help stop the bleeding.

2. Elevate the Injured Area (if possible): If the wound is on an arm or leg, raise it above heart level to slow the bleeding.

3. Maintain Pressure Until Bleeding Stops: Keep holding firm pressure for several minutes—don’t lift the bandage to check too soon.

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
- Snakebites: Keep victim calm, immobilize limb, don’t suck venom or apply tourniquet.
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
2nd-degree burn: Blisters, swelling – same care, don’t pop blisters.
3rd-degree burn: Charred/white, numb – do not remove clothing stuck to skin.
`, 
        icon: faFire 
    },
];

const FirstAid = () => {
    const router = useRouter();
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

    const toggleDropdown = (id: number) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const randomNum = Math.floor(Math.random() * 1000) + 1; // Generate a random number between 1 and 1000, debugging purposes for location

    return (
        <View style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={styles.topHeader} source={IMAGES.placement_image_cover} resizeMode="stretch">
                <TouchableOpacity style={{ backgroundColor: COLORS.pmy.blue2, padding: 5, borderRadius: 8, width: 'auto', position: 'absolute', left: 15, top: 15 }} onPress={() => router.back()}>
                    <FontAwesomeIcon icon={faArrowLeft} size={22} color={COLORS.pmy.white} />
                </TouchableOpacity>
                    <Text style={{ fontSize: 22, textAlign: 'center', fontFamily: 'Montserrat-ExtraBold', color: COLORS.pmy.white }}>First Aid</Text>
                </ImageBackground>
                <ScrollView contentContainerStyle={{ flexGrow: 1, paddingTop: 100 }} showsVerticalScrollIndicator={false} style={{ paddingHorizontal: 15, marginBottom: 20}} >
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Bold', marginVertical: 15, color: COLORS.pmy.blue1 }}>Tap each to show details.</Text>
                    <Text style={{ fontSize: 18, fontFamily: 'Montserrat-Regular', marginBottom: 15, color: COLORS.pmy.blue1 }}>Current Location: {randomNum}</Text>
                    {CONTENT_ITEMS.map((item) => (
                    <View key={item.id} style={{ marginBottom: 10 }}>
                    <TouchableOpacity style={styles.dropdown} onPress={() => toggleDropdown(item.id)}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={item.icon} size={16} color={COLORS.pmy.white} style={{ marginRight: 10 }} />
                            <Text style={styles.dropdownText}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                    {activeDropdown === item.id && (
                        <View style={styles.dropdownContent}>
                            <Text style={styles.dropdownContentText}>{item.content}</Text>
                        </View>
                    )}
                    </View>
                ))}
                </ScrollView>
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
    dropdown: {
        backgroundColor: COLORS.pmy.blue1,
        padding: 10,
        borderRadius: 8,
    },
    dropdownText: {
        color: COLORS.pmy.white,
        fontSize: 16,
        fontFamily: 'Montserrat-Bold',
    },
    dropdownContent: {
        backgroundColor: COLORS.pmy.white,
        padding: 10,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        marginTop: 0,
        borderWidth: 1,
        borderColor: COLORS.pmy.blue2,
        marginHorizontal: 5,
    },
    dropdownContentText: {
        color: COLORS.pmy.black,
        fontSize: 14,
        fontFamily: 'Montserrat-Regular',
    },
});