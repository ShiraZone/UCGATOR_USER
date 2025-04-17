import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, ViewStyle } from 'react-native';
import { useRouter } from "expo-router";

/**
 * LoadingScreen Component
 * 
 * @component
 * @description Displays an animated loading screen with morphing dots that transform into a circle.
 * The animation consists of four dots that rotate, merge into a circle, and split back into dots.
 * After 3 seconds, it automatically navigates to the augmented reality screen.
 *
 * @features
 * - Smooth dot-to-circle morphing animation
 * - Continuous rotation effect
 * - Automatic navigation after timeout
 * - Responsive dot positioning and scaling
 *
 * @animation
 * - Duration: 900ms per rotation
 * - Phases: 
 *   1. Four dots rotating (0-40%)
 *   2. Dots merging to center (40-50%)
 *   3. Circle formation (50-60%)
 *   4. Circle splitting to dots (60-100%)
 *
 * @returns {React.ReactElement} The rendered LoadingScreen component
 */

const LoadingScreen = () => {
    const router = useRouter();
    const spinAnimation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Navigation timeout
        const timer = setTimeout(() => {
            router.push("/navigate/augmented-reality");
        }, 3000);

        // Spinning animation
        Animated.loop(
            Animated.timing(spinAnimation, {
                toValue: 1,
                duration: 900,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();

        return () => clearTimeout(timer);
    }, []);

    /**
     * Generates rotation transform for the entire dot group
     * @returns {Object} Transform style for rotation animation
     */

    const getRotation = () => ({
        transform: [{
            rotate: spinAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
            })
        }]
    });

    /**
     * Generates styles for individual dots including position, scale, and opacity
     * @param {number} index - Index of the dot (0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right)
     * @returns {Object} Combined styles for dot animation
     */

    const getDotStyle = (index: number) => {
        const isRight = index % 2 === 1;
        const isBottom = index >= 2;
        
        const moveX = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [
                isRight ? 42 : 0,      
                isRight ? 21 : 21,     
                21,                    
                isRight ? 21 : 21,    
                isRight ? 42 : 0      
            ]
        });

        const moveY = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [
                isBottom ? 42 : 0,     
                isBottom ? 21 : 21, 21,                    
                isBottom ? 21 : 21,   
                isBottom ? 42 : 0     
            ]
        });

        // para smooth transition
        const scale = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [1, 1.2, 0, 0, 1]
        });

        // opacity for smooth fade
        const opacity = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [1, 1, 0, 0, 1]
        });

        return {
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: '#FFFFFF',
            opacity,
            transform: [
                { translateX: moveX },
                { translateY: moveY },
                { scale }
            ]
        };
    };

    /**
     * Generates styles for the central circle during morphing
     * @returns {Animated.WithAnimatedObject<ViewStyle>} Animated styles for the circle
     */

    const getCircleStyle = (): Animated.WithAnimatedObject<ViewStyle> => {
        const scale = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [0, 0, 1, 1, 0]
        });

        const opacity = spinAnimation.interpolate({
            inputRange: [0, 0.4, 0.5, 0.6, 1],
            outputRange: [0, 0, 1, 1, 0]
        });

        return {
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: '#FFFFFF',
            position: 'absolute' as const,
            opacity,
            transform: [{ scale }],
            left: 6,
            top: 6
        };
    };

    return (
        <View style={styles.container}>
            <View style={styles.dotsWrapper}>
                <Animated.View style={[styles.dotsContainer, getRotation()]}>
                    <View style={styles.dotGroup}>
                        <Animated.View style={[styles.dot, getDotStyle(0)]} />
                        <Animated.View style={[styles.dot, getDotStyle(1)]} />
                        <Animated.View style={[styles.dot, getDotStyle(2)]} />
                        <Animated.View style={[styles.dot, getDotStyle(3)]} />
                        <Animated.View style={getCircleStyle()} />
                    </View>
                </Animated.View>
            </View>
        </View>
    );
};

/**
 * @constant styles
 * @description StyleSheet for the LoadingScreen component
 * 
 * @property {Object} container - Main container with centered content
 * @property {Object} dotsWrapper - Wrapper for the animated dots
 * @property {Object} dotsContainer - Container for the rotating dots group
 * @property {Object} dotGroup - Group container for dots and circle
 * @property {Object} dot - Individual dot styling
 */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2B4F6E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotsWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    dotsContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dotGroup: {
        width: 60,
        height: 60,
        position: 'relative',
    },
    dot: {
        position: 'absolute',
        backgroundColor: '#FFFFFF',
    },
});

export default LoadingScreen;  
