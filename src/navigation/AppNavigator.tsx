import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HomeScreen } from "../pages/home/HomeScreen";
import { MenuScreen } from "../pages/menu/MenuScreen";
import { AssistantScreen } from "../pages/AssistantScreen";
import { SurpriseMeScreen } from "../pages/surprise-me/SurpriseMeScreen";
import { CartScreen } from "../pages/cart/CartScreen";
import { useTheme } from "../theme/theme-provider";

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const { colors, isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: 64,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarIconStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="home"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
              style={{ textAlignVertical: "center" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={MenuScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <FontAwesome5
              name="utensils"
              size={22}
              color={focused ? colors.primary : colors.mutedForeground}
              style={{ textAlignVertical: "center" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Assistant"
        component={AssistantScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="robot"
              size={32}
              color={colors.primaryForeground}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 32,
                padding: 12,
                marginTop: -32,
                width: 56,
                height: 56,
                textAlign: "center",
                textAlignVertical: "center",
                shadowColor: isDark ? "#000" : "#222",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
                elevation: 5,
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Surprise"
        component={SurpriseMeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="dice-multiple"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
              style={{ textAlignVertical: "center" }}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name="shopping-cart"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
              style={{ textAlignVertical: "center" }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
