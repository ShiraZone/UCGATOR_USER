// file path: app/components/toast-utils.tsx

/**
 * Toast Utils
 * 
 * This file contains utility functions for displaying Toast messages.

 */

// Core Components
import { config } from "@fortawesome/fontawesome-svg-core";
import Toast from "react-native-toast-message";

// Constants
import COLORS from "../constants/colors";

// Error Toast Style Config
const ErrorToastConfig = {
    error: (props: any) => (
        <Toast
            {...props}
            style={{
                borderLeftColor: COLORS.alert.error,      // Customize the border color
                borderWidth: 2,                         // Add a border
                borderRadius: 8,                        // Add rounded corners
                backgroundColor: COLORS.pmy.white,      // Customize the background color
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
};

// Success Toast Style Config
const SuccessToastConfig = {
    error: (props: any) => (
        <Toast
            {...props}
            style={{
                borderLeftColor: COLORS.alert.success,      // Customize the border color
                borderWidth: 2,                         // Add a border
                borderRadius: 8,                        // Add rounded corners
                backgroundColor: COLORS.pmy.white,      // Customize the background color
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
};

// Warning Toast Style Config
const WarningToastConfig = {
    error: (props: any) => (
        <Toast
            {...props}
            style={{
                borderLeftColor: COLORS.alert.warning,      // Customize the border color
                borderWidth: 2,                         // Add a border
                borderRadius: 8,                        // Add rounded corners
                backgroundColor: COLORS.pmy.white,      // Customize the background color
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
};

// Function to show an error toast
export const showErrorToast = (message: string, title: string = "Error") => {
    Toast.show({
        type: "error",
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
    });
    return (
        <>
            {/* Your app components */}
            <Toast config={ErrorToastConfig} />
        </>
    );
};

// Function to show a success toast
export const showSuccessToast = (message: string, title: string = "Success") => {
    Toast.show({
        type: "success",
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
    });
    return (
        <>
            {/* Your app components */}
            <Toast config={SuccessToastConfig} />
        </>
    );
};

// Function to show an info toast
export const showInfoToast = (message: string, title: string = "Info") => {
    Toast.show({
        type: "info",
        text1: title,
        text2: message,
        visibilityTime: 3000,
        autoHide: true,
    });
    return (
        <>
            {/* Your app components */}
            <Toast config={WarningToastConfig} />
        </>
    );
};