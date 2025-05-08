// file path: app/components/toast-utils.tsx

/**
 * Toast Utils
 * 
 * This file contains utility functions for displaying Toast messages.
 * idk ang gibutang man kay i-initialize ang toast sa app.tsx, fak et
 */

// CORE COMPONENTS
import React from 'react';
import Toast, { BaseToast, SuccessToast, ErrorToast } from "react-native-toast-message";

// UTILS
import COLORS from "../constants/colors";

// Constants
const TOAST_DURATION = 3000;

export const toastWrapper = {
    error: (props: any) => (
        <ErrorToast
            {...props}
            style={{
                borderLeftColor: '#000',
                backgroundColor: COLORS.alert.error,
            }}
            text1Style={{
                font: 'Montserrat-Bold',
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.sdy.gray1,
            }}
            text2Style={{
                font: 'Montserrat-Regular',
                fontSize: 14,
                color: COLORS.sdy.gray1,
            }}
        />
    ),
    success: (props: any) => (
        <SuccessToast
            {...props}
            style={{
                borderLeftColor: '#000',
                backgroundColor: COLORS.alert.success,
            }}
            text1Style={{
                font: 'Montserrat-Bold',
                fontSize: 20,
                fontWeight: 'bold',
                color: COLORS.sdy.gray1,
            }}
            text2Style={{
                font: 'Montserrat-Regular',
                fontSize: 16,
                color: COLORS.sdy.gray1,
            }}
        />
    ),
    info: (props: any) => (
        <BaseToast
            {...props}
            style={{
                borderLeftColor: '#000',
                backgroundColor: COLORS.alert.warning,
            }}
            text1Style={{
                font: 'Montserrat-Bold',
                fontSize: 16,
                fontWeight: 'bold',
                color: COLORS.sdy.gray1,
            }}
            text2Style={{
                font: 'Montserrat-Regular',
                fontSize: 14,
                color: COLORS.sdy.gray1,
            }}
        />
    )
};

// Function to show an error toast
export const showErrorToast = (message: string, title: string = "Error") => {
    Toast.show({
        type: "error",
        text1: title,
        text2: message,
        visibilityTime: TOAST_DURATION,
        autoHide: true,
    });
};

// Function to show a success toast
export const showSuccessToast = (message: string, title: string = "Success") => {
    Toast.show({
        type: "success",
        text1: title,
        text2: message,
        visibilityTime: TOAST_DURATION,
        autoHide: true,
    });
};

// Function to show an info toast
export const showInfoToast = (message: string, title: string = "Info") => {
    Toast.show({
        type: "info",
        text1: title,
        text2: message,
        visibilityTime: TOAST_DURATION,
        autoHide: true,
    });
};