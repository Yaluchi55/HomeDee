import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Import all screens
import HomeScreen from './Screens/HomeScreen';
import MapScreen from './Screens/MapScreen';
import ChatScreen from './Screens/ChatScreen';
import ProfileScreen from './Screens/ProfileScreen';
import FilterScreen from './Screens/FilterScreen';
import HouseDetailsScreen from './Screens/HouseDetailsScreen';
import CheckoutScreen from './Screens/CheckoutScreen';
import MessageListScreen from './Screens/MessageListScreen';
import UserProfileScreen from './Screens/UserProfileScreen';
import EditProfileScreen from './Screens/EditProfileScreen';
import PersonalInformationScreen from './Screens/PersonalInformationScreen';
import LoginAndSecurityScreen from './Screens/LoginAndSecurityScreen';
import ChangePasswordScreen from './Screens/ChangePasswordScreen';
import UpdatePhoneNumberScreen from './Screens/UpdatePhoneNumberScreen';
import UpdateEmailScreen from './Screens/UpdateEmailScreen';
import AccessibilityScreen from './Screens/AccessibilityScreen';
import PrivacySharingScreen from './Screens/PrivacySharingScreen';
import LoginScreen from './Screens/LoginScreen';
import SignUpScreen from './Screens/SignUpScreen';
import PriceScreen from './Screens/PriceScreen';
import SetLocationScreen from './Screens/SetLocationScreen';
import RenterHomeScreen from './Screens/RenterHomeScreen';
import AddListingScreen from './Screens/AddListingScreen';
import BarcodeScannerScreen from './Screens/BarcodeScannerScreen';
import ScannedDataScreen from './Screens/ScannedDataScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const API_BASE_URL = 'https://dwello-sigma.vercel.app';

// ---------- Home Stack ----------
const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={{
        headerTitle: () => <Text style={styles.headerTitle}>ZedCribs</Text>,
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#d3d3d3',
        },
      }}
    />
    <Stack.Screen name="Filter" component={FilterScreen} options={{ headerTitle: 'Filter' }} />
    <Stack.Screen name="HouseDetails" component={HouseDetailsScreen} options={{ headerTitle: 'House Details' }} />
    <Stack.Screen name="Next" component={CheckoutScreen} options={{ headerTitle: 'Checkout' }} />
  </Stack.Navigator>
);

// ---------- Map Stack ----------
const MapStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Map" component={MapScreen} options={{ headerTitle: 'Map' }} />
    <Stack.Screen name="HouseDetails" component={HouseDetailsScreen} options={{ headerTitle: 'House Details' }} />
  </Stack.Navigator>
);

// ---------- Chat Stack ----------
const ChatStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="MessageList" component={MessageListScreen} options={{ headerTitle: 'Messages' }} />
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={({ route }) => ({ headerTitle: route.params?.user?.name || 'Chat' })}
    />
    <Stack.Screen name="UserProfile" component={UserProfileScreen} options={{ headerTitle: 'User Profile' }} />
  </Stack.Navigator>
);

// ---------- Profile Stack ----------
const ProfileStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerTitle: 'Profile' }} />
    <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ headerTitle: 'Edit Profile' }} />
    <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} options={{ headerTitle: 'Personal Information' }} />
    <Stack.Screen name="PrivacySharing" component={PrivacySharingScreen} options={{ headerTitle: 'Privacy & Sharing' }} />
    <Stack.Screen name="LoginAndSecurity" component={LoginAndSecurityScreen} options={{ headerTitle: 'Login and Security' }} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ headerTitle: 'Change Password' }} />
    <Stack.Screen name="UpdatePhoneNumber" component={UpdatePhoneNumberScreen} options={{ headerTitle: 'Change Phone Number' }} />
    <Stack.Screen name="UpdateEmail" component={UpdateEmailScreen} options={{ headerTitle: 'Change Email' }} />
    <Stack.Screen name="Accessibility" component={AccessibilityScreen} options={{ headerTitle: 'Accessibility' }} />
  </Stack.Navigator>
);

// ---------- Renter Stack ----------
const RenterStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="RenterHome"
      component={RenterHomeScreen}
      options={{
        headerTitle: 'My Listings',
        headerTitleAlign: 'left',
        headerStyle: {
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#d3d3d3',
        },
      }}
    />
    <Stack.Screen name="AddListing" component={AddListingScreen} options={{ headerTitle: 'Add Listing' }} />
    <Stack.Screen name="PriceScreen" component={PriceScreen} options={{ headerTitle: 'Set Price' }} />
    <Stack.Screen name="SetLocation" component={SetLocationScreen} options={{ headerTitle: 'Set Address and Location' }} />
    <Stack.Screen name="BarcodeScannerScreen" component={BarcodeScannerScreen} options={{ headerTitle: 'Scan QR Code' }} />
    <Stack.Screen name="ScannedDataScreen" component={ScannedDataScreen} options={{ headerTitle: 'Scanned Data' }} />
  </Stack.Navigator>
);

// ---------- Auth Stack ----------
const AuthStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SignUp" component={SignUpScreen} options={{ headerTitle: 'Sign Up' }} />
  </Stack.Navigator>
);

// ---------- Main App ----------
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isRenter, setIsRenter] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');

        if (!token) {
          setIsAuthenticated(false);
          setCheckingAuth(false);
          return;
        }

        // NOTE: every confirmed real endpoint (login, signup, listings)
        // lives under /api/*. This bare "/auth-status" path is unverified —
        // if your backend only routes /api/*, this 404s and lands right
        // here, which matches the /404.html hits seen in your Vercel
        // dashboard. Check your Vercel Logs tab during a login attempt to
        // confirm the real path, then fix this line to match.
        const response = await axios.get(`${API_BASE_URL}/api/auth-status`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.authenticated) {
          setIsAuthenticated(true);
          setIsRenter(!!response.data.isRenter);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication Error:', error?.response?.status, error?.response?.data || error.message);
        setIsAuthenticated(false);
        // Only alert on real network/server errors, not "no token found".
        // Shows the actual status/response so you're not stuck guessing.
        if (error.response) {
          Alert.alert(
            'Login Failed',
            `Server responded ${error.response.status}: ${
              JSON.stringify(error.response.data) || 'no details returned'
            }`
          );
        } else if (error.request) {
          Alert.alert('Login Failed', 'No response from server — check your network or the API URL.');
        }
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuthentication();
  }, []);

  if (checkingAuth) {
    return null; // could render a splash/loading screen here
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: '#ffffff' },
            tabBarShowLabel: false,
          }}
        >
          <Tab.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Ionicons name="home-outline" size={24} color={focused ? 'blue' : 'gray'} />
              ),
            }}
          />
          <Tab.Screen
            name="MapStack"
            component={MapStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Ionicons name="location-outline" size={24} color={focused ? 'blue' : 'gray'} />
              ),
            }}
          />
          {isRenter && (
            <Tab.Screen
              name="RenterStack"
              component={RenterStack}
              options={{
                headerShown: false,
                tabBarIcon: ({ focused }) => (
                  <Ionicons name="list-circle-outline" size={24} color={focused ? 'blue' : 'gray'} />
                ),
              }}
            />
          )}
          <Tab.Screen
            name="ChatStack"
            component={ChatStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Ionicons name="chatbubble-outline" size={24} color={focused ? 'blue' : 'gray'} />
              ),
            }}
          />
          <Tab.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              headerShown: false,
              tabBarIcon: ({ focused }) => (
                <Ionicons name="person-outline" size={24} color={focused ? 'blue' : 'gray'} />
              ),
            }}
          />
        </Tab.Navigator>
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'blue',
  },
});

export default App;
