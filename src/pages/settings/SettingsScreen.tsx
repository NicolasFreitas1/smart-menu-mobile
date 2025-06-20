import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useUserPreferences } from "../../hooks/use-user-preferences";
import { storageService } from "../../services/storage";
import { SafeContainer } from "../../components/ui/safe-container";
import { IPConfig } from "../../components/ui/ip-config";
import { RestaurantConfig } from "../../components/ui/restaurant-config";
import { populateSampleData, clearAllData } from "../../utils/sample-data";

export function SettingsScreen() {
  const { theme, setTheme, colors } = useTheme();
  const {
    preferences,
    isLoading,
    updateNotificationSettings,
    setLanguage,
    resetPreferences,
  } = useUserPreferences();
  const [storageInfo, setStorageInfo] = useState<{
    used: number;
    total: number;
  } | null>(null);

  // Carrega informações do storage
  React.useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    const info = await storageService.getStorageInfo();
    setStorageInfo(info);
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
  };

  const handleNotificationChange = (
    key: keyof typeof preferences.notifications,
    value: boolean
  ) => {
    updateNotificationSettings({ [key]: value });
  };

  const handleLanguageChange = (language: string) => {
    setLanguage(language);
  };

  const handleResetPreferences = () => {
    Alert.alert(
      "Resetar Preferências",
      "Tem certeza que deseja resetar todas as suas preferências? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetar",
          style: "destructive",
          onPress: resetPreferences,
        },
      ]
    );
  };

  const handleClearStorage = () => {
    Alert.alert(
      "Limpar Dados",
      "Tem certeza que deseja limpar todos os dados salvos localmente? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          style: "destructive",
          onPress: async () => {
            try {
              await storageService.clear();
              Alert.alert("Sucesso", "Todos os dados foram limpos.");
              loadStorageInfo();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar os dados.");
            }
          },
        },
      ]
    );
  };

  const handlePopulateSampleData = () => {
    Alert.alert(
      "Popular Dados de Exemplo",
      "Isso irá adicionar pedidos, avaliações e notificações de exemplo ao banco de dados. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Popular",
          onPress: async () => {
            try {
              const success = await populateSampleData();
              if (success) {
                Alert.alert(
                  "Sucesso",
                  "Dados de exemplo adicionados com sucesso!"
                );
                loadStorageInfo();
              } else {
                Alert.alert(
                  "Erro",
                  "Não foi possível adicionar os dados de exemplo."
                );
              }
            } catch (error) {
              Alert.alert(
                "Erro",
                "Ocorreu um erro ao adicionar dados de exemplo."
              );
            }
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      "Limpar Todos os Dados",
      "Isso irá limpar TODOS os dados do banco de dados SQLite e AsyncStorage. Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar Tudo",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAllData();
              await storageService.clear();
              Alert.alert("Sucesso", "Todos os dados foram limpos.");
              loadStorageInfo();
            } catch (error) {
              Alert.alert("Erro", "Não foi possível limpar todos os dados.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeContainer>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Carregando configurações...
          </Text>
        </View>
      </SafeContainer>
    );
  }

  return (
    <SafeContainer>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <Text style={[styles.title, { color: colors.text }]}>
          Configurações
        </Text>

        {/* Seção de Tema */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Aparência
          </Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Tema
            </Text>
            <View style={styles.themeButtons}>
              {(["light", "dark", "system"] as const).map((themeOption) => (
                <TouchableOpacity
                  key={themeOption}
                  style={[
                    styles.themeButton,
                    {
                      backgroundColor:
                        theme === themeOption ? colors.primary : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleThemeChange(themeOption)}
                >
                  <Text
                    style={[
                      styles.themeButtonText,
                      {
                        color:
                          theme === themeOption
                            ? colors.onPrimary
                            : colors.text,
                      },
                    ]}
                  >
                    {themeOption === "light" && "Claro"}
                    {themeOption === "dark" && "Escuro"}
                    {themeOption === "system" && "Sistema"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Seção de Idioma */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Idioma
          </Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Idioma do App
            </Text>
            <View style={styles.languageButtons}>
              {[
                { code: "pt-BR", name: "Português" },
                { code: "en", name: "English" },
                { code: "es", name: "Español" },
              ].map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[
                    styles.languageButton,
                    {
                      backgroundColor:
                        preferences.language === lang.code
                          ? colors.primary
                          : colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => handleLanguageChange(lang.code)}
                >
                  <Text
                    style={[
                      styles.languageButtonText,
                      {
                        color:
                          preferences.language === lang.code
                            ? colors.onPrimary
                            : colors.text,
                      },
                    ]}
                  >
                    {lang.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Seção de Notificações */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notificações
          </Text>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Atualizações de Pedidos
            </Text>
            <Switch
              value={preferences.notifications?.orderUpdates ?? true}
              onValueChange={(value) =>
                handleNotificationChange("orderUpdates", value)
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Promoções
            </Text>
            <Switch
              value={preferences.notifications?.promotions ?? true}
              onValueChange={(value) =>
                handleNotificationChange("promotions", value)
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              Novos Itens
            </Text>
            <Switch
              value={preferences.notifications?.newItems ?? true}
              onValueChange={(value) =>
                handleNotificationChange("newItems", value)
              }
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Seção de API */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Configuração da API
          </Text>
          <IPConfig />
        </View>

        {/* Seção de Restaurante */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Restaurante
          </Text>
          <RestaurantConfig />
        </View>

        {/* Seção de Dados */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Dados
          </Text>

          {storageInfo && (
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                Uso de Armazenamento
              </Text>
              <Text
                style={[styles.settingValue, { color: colors.textSecondary }]}
              >
                {Math.round((storageInfo.used / 1024 / 1024) * 100) / 100} MB /{" "}
                {Math.round(storageInfo.total / 1024 / 1024)} MB
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.actionButton, { borderColor: colors.primary }]}
            onPress={handlePopulateSampleData}
          >
            <Text style={[styles.actionButtonText, { color: colors.primary }]}>
              Popular Dados de Exemplo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.error }]}
            onPress={handleResetPreferences}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>
              Resetar Preferências
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.error }]}
            onPress={handleClearStorage}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>
              Limpar Dados do AsyncStorage
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.dangerButton, { borderColor: colors.error }]}
            onPress={handleClearAllData}
          >
            <Text style={[styles.dangerButtonText, { color: colors.error }]}>
              Limpar TODOS os Dados
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  settingLabel: {
    fontSize: 16,
    flex: 1,
  },
  settingValue: {
    fontSize: 14,
  },
  themeButtons: {
    flexDirection: "row",
    gap: 8,
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  languageButtons: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  languageButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dangerButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 12,
    alignItems: "center",
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 50,
  },
});
