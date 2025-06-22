import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { HomeScreen } from "../pages/home/HomeScreen";
import { MenuScreen } from "../pages/menu/MenuScreen";
import { AssistantScreen } from "../pages/assistant/AssistantScreen";
import { SurpriseMeScreen } from "../pages/surprise-me/SurpriseMeScreen";
import { CartScreen } from "../pages/cart/CartScreen";
import { SettingsScreen } from "../pages/settings/SettingsScreen";
import { ReservationScreen } from "../pages/reservations/ReservationScreen";
import { OrderHistoryScreen } from "../pages/orders/OrderHistoryScreen";
import { useTheme } from "../theme/theme-provider";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator para Home (permite navegar para Settings e Reservations)
function HomeStack() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: "Configurações",
          headerBackTitle: "",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationScreen}
        options={{
          headerShown: true,
          title: "Minhas Reservas",
          headerBackTitle: "",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScreen}
        options={{
          headerShown: true,
          title: "Histórico de Pedidos",
          headerBackTitle: "",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.foreground,
          headerTitleStyle: {
            fontWeight: "600",
          },
        }}
      />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  // Calcular altura do tab bar considerando a navigation bar
  const tabBarHeight =
    Platform.OS === "android"
      ? 64 + (insets.bottom > 0 ? insets.bottom : 16)
      : 64;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          height: tabBarHeight,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          paddingBottom:
            Platform.OS === "android"
              ? insets.bottom > 0
                ? insets.bottom
                : 16
              : 8,
          paddingTop: 8,
          // Adicionar sombra para destacar do conteúdo
          elevation: 8,
          shadowColor: isDark ? "#000" : "#222",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarIconStyle: {
          justifyContent: "center",
          alignItems: "center",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
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
