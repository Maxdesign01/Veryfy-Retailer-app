import React from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { CreateAccountScreen } from '../screens/auth/CreateAccountScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { OtpVerificationScreen } from '../screens/auth/OtpVerificationScreen';
import { PostRegistrationWelcomeScreen } from '../screens/auth/PostRegistrationWelcomeScreen';
import { RoleSelectionScreen } from '../screens/auth/RoleSelectionScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { NotificationsScreen } from '../screens/home/NotificationsScreen';
import { SafetyGuidanceScreen } from '../screens/home/SafetyGuidanceScreen';
import { AddStockScreen } from '../screens/inventory/AddStockScreen';
import { ReportDetailsScreen } from '../screens/reports/ReportDetailsScreen';
import { ReportProductScreen } from '../screens/reports/ReportProductScreen';
import { ReportSuccessScreen } from '../screens/reports/ReportSuccessScreen';
import { ConnectionLostScreen } from '../screens/scan/ConnectionLostScreen';
import { SuspiciousResultScreen } from '../screens/scan/SuspiciousResultScreen';
import { VerificationResultScreen } from '../screens/scan/VerificationResultScreen';
import { VerifyingProductScreen } from '../screens/scan/VerifyingProductScreen';
import { VerifySmsUssdScreen } from '../screens/scan/VerifySmsUssdScreen';
import { RootStackParamList } from '../types';
import { MainTabNavigator } from './MainTabNavigator';

const StackInventoryRedirect: React.FC<{ navigation: any }> = ({ navigation }) => {
  React.useEffect(() => {
    navigation.replace('Main', { screen: 'Inventory' });
  }, [navigation]);
  return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
};

const StackScanRedirect: React.FC<{ navigation: any }> = ({ navigation }) => {
  React.useEffect(() => {
    navigation.replace('Main', { screen: 'Scan' });
  }, [navigation]);
  return <View style={{ flex: 1, backgroundColor: '#FFFFFF' }} />;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        {/* Splash, Onboarding & Auth Stack */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: 'fade',
            animationDuration: 300,
          }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            animation: 'fade',
            animationDuration: 300,
          }}
        />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen as any} />
        <Stack.Screen name="PostRegistrationWelcome" component={PostRegistrationWelcomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* Main Tab App */}
        <Stack.Screen name="Main" component={MainTabNavigator} />

        {/* Modal / Secondary Detail Screens */}
        <Stack.Screen name="SafetyGuidance" component={SafetyGuidanceScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="AddStock" component={AddStockScreen as any} />
        <Stack.Screen name="VerifyingProduct" component={VerifyingProductScreen as any} />
        <Stack.Screen name="VerificationResult" component={VerificationResultScreen as any} />
        <Stack.Screen name="SuspiciousResult" component={SuspiciousResultScreen as any} />
        <Stack.Screen name="ReportProduct" component={ReportProductScreen as any} />
        <Stack.Screen name="ReportDetails" component={ReportDetailsScreen as any} />
        <Stack.Screen name="ReportSuccess" component={ReportSuccessScreen as any} />
        <Stack.Screen name="ConnectionLost" component={ConnectionLostScreen as any} />
        <Stack.Screen name="VerifySmsUssd" component={VerifySmsUssdScreen as any} />
        <Stack.Screen name="Scan" component={StackScanRedirect} />
        <Stack.Screen name="Inventory" component={StackInventoryRedirect} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
