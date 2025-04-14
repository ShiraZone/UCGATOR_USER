import React from 'react';
import { memo } from "react";
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

type MarkerType = {
    id: string;
    x: number;
    y: number;
    label: string;
    type: string;
}

const Marker = memo(({ marker, scale, rotation, onPress }: { marker: MarkerType; scale: any; rotation: any; onPress: () => void }) => {
    const markerStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: 1 / scale.value },
            { rotate: `${-rotation.value}rad` },
        ]
    }));

    return (
        <TouchableOpacity style={[styles.marker, { left: `${marker.x}%`, top: `${marker.y}%` }]} onPress={onPress}>
            <Animated.Text style={[styles.markerLabel, markerStyle]}>{marker.label}</Animated.Text>
        </TouchableOpacity>
    );
})

export default Marker

const styles = StyleSheet.create({
    marker: {
        position: "absolute",
    },
    markerLabel: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 5,
        textAlign: "center",
        textShadowColor: "black",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
});