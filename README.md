# UCGator App

UCGator is a React Native application built with [Expo](https://expo.dev) that provides users with a comprehensive navigation and utility platform for campus-related activities. The app includes features such as interactive maps, emergency contact management, augmented reality navigation, and more.

---

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Folder Structure](#folder-structure)
5. [Key Components](#key-components)
6. [Constants](#constants)
7. [Contributing](#contributing)
8. [License](#license)

---

## Features

- **Interactive Maps**: Navigate campus buildings with zoom, pan, and floor selection.
- **Augmented Reality Navigation**: Use AR to enhance navigation with safety instructions.
- **Emergency Contact Management**: Add, edit, and delete emergency contacts.
- **Profile Management**: Edit user profiles, including bio and display name.
- **Settings**: Customize preferences such as themes, map styles, and notifications.
- **First Aid and FAQ Sections**: Access helpful resources for emergencies and general app usage.
- **Announcements**: View and manage campus announcements dynamically.

---

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/your-username/UCGATOR.git
    cd UCGATOR
    ```
2. Install Dependencies
    ```bash
    npm install
    ```
3. Start the App
    ```bash
    npx expo start
    ```

---

## Usage

Development
- Modify files in the app directory to implement new features or fix bugs.
- Use [Expo Router](#https://docs.expo.dev/router/introduction/) for file-based routing.

Reset Project:

To reset the project to a blank state:
    ```bash
    npx expo start
    ```

---

## Folder Structure

```
UCGATOR/
├── app/
│   ├── (root)/          # Main app screens and features
│   │   ├── auth/        # Authentication screens (Sign Up, Log In, etc.)
│   │   ├── menu/        # Menu-related screens (Settings, Profile, etc.)
│   │   ├── navigate/    # Navigation-related screens (AR, Maps, etc.)
│   │   ├── tabs/        # Tab-based navigation screens
│   ├── components/      # Reusable UI components
│   ├── constants/       # App-wide constants (colors, images, etc.)
│   ├── lib/             # Utility functions and context providers
│   ├── styles/          # Shared stylesheets
├── assets/              # Static assets (images, fonts, etc.)
├── babel.config.js      # Babel configuration
├── README.md            # Project documentation
```

---

## Key Components
Authentication
- **Sign-Up** *(app/(root)/(auth)/sign-up.tsx)*: Handles user registration.
- **Log-In** *(app/(root)/(auth)/log-in.tsx)*: Handles user login with email and password.

Navigation
- **Loading Screen** *(app/(root)/navigate/loading-screen.tsx)*: Displays an animated loading screen before navigation.
- **Augmented Reality** *(app/(root)/navigate/augmented-reality.tsx)*: Provides AR-based navigation with safety instructions.

Maps
- **Interactive Map** *(app/(root)/(tabs)/index.tsx)*: Provides gesture-based map navigation with floor selection.

---

## Constants

Colors
- Defined in *app/constants/colors.ts*, the app uses a consistent color palette for UI elements.

Images
- Defined in *app/constants/images.ts*, the app includes assets like logos and background images.

---

## Contributing

1. Fork the repository.
2. Create a new branch
```bash
git checkout -b feature-name
```
3. Commit your changes.
```bash
git commit -m "Add feature-name"
```
4. Push to your branch.
```bash
git push origin feature-name
```
5. Open a pull request

---

## license

This project is licensed under the *MIT License*. See the *LICENSE* file for details