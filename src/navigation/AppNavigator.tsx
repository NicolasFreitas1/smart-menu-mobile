import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HomeScreen } from "../pages/home/HomeScreen";
import { MenuScreen } from "../pages/menu/MenuScreen";
import { AssistantScreen } from "../pages/AssistantScreen";
import { SuggestionScreen } from "../pages/SuggestionScreen";
import { CartScreen } from "../pages/CartScreen";
import { useGlobalStyles } from "../theme/hooks";
import { useTheme } from "../theme/theme-provider";

const Tab = createBottomTabNavigator();

export function AppNavigator() {
  const styles = useGlobalStyles();
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
        component={SuggestionScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={24}
              color={focused ? colors.primary : colors.mutedForeground}
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
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
