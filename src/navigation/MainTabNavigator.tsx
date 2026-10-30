import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import { VeryfyBottomNav, NavTabName } from '../components/VeryfyBottomNav';
import { HomeScreen } from '../screens/home/HomeScreen';
import { InventoryScreen } from '../screens/inventory/InventoryScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';
import { MyReportsScreen } from '../screens/reports/MyReportsScreen';
import { ScanScreen } from '../screens/scan/ScanScreen';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const VeryfyBottomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  navigation,
}) => {
  const activeRouteName = state.routes[state.index].name as NavTabName;
  return <VeryfyBottomNav activeTab={activeRouteName} navigation={navigation} />;
};

export const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBar={(props) => <VeryfyBottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />

      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          tabBarLabel: 'Inventory',
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabel: 'Scan',
        }}
      />

      <Tab.Screen
        name="Reports"
        component={MyReportsScreen}
        options={{
          tabBarLabel: 'Reports',
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};
