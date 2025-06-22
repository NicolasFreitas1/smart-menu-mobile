import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../../theme/theme-provider";
import { useGlobalStyles } from "../../theme/hooks";
import { useReservations } from "../../hooks/use-reservations";
import { useRestaurant } from "../../context/RestaurantContext";
import { SafeContainer } from "../../components/ui/safe-container";
import { Button } from "../../components/ui/button";
import { MaskedInput } from "../../components/ui/masked-input";
import Feather from "react-native-vector-icons/Feather";
import { reservationService } from "../../services/reservation";
import { pushNotificationService } from "../../services/push-notifications";
import { NotificationTester } from "../../utils/test-notifications";

export function ReservationScreen({ navigation }: any) {
  const { colors } = useTheme();
  const styles = useGlobalStyles();
  const { restaurant } = useRestaurant();
  const {
    reservations,
    isLoading,
    createReservation,
    cancelReservation,
    requestCalendarPermission,
    confirmedReservations,
    pendingReservations,
    loadReservations,
  } = useReservations();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    partySize: "",
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    specialRequests: "",
  });

  // Debug: Log das reservas
  useEffect(() => {
    console.log("🔍 Reservas carregadas:", reservations.length);
    console.log("📋 Reservas:", reservations);
  }, [reservations]);

  const handleCreateReservation = async () => {
    if (!restaurant) {
      Alert.alert("Erro", "Restaurante não selecionado");
      return;
    }

    // Validação básica
    if (
      !formData.date ||
      !formData.time ||
      !formData.partySize ||
      !formData.customerName ||
      !formData.customerPhone
    ) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      console.log("🔄 Iniciando criação de reserva...");
      console.log("📋 Dados do formulário:", formData);
      console.log("🏪 Restaurante:", restaurant);

      // Solicitar permissão do calendário
      await requestCalendarPermission();

      const reservationData = {
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        date: formData.date,
        time: formData.time,
        partySize: parseInt(formData.partySize),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || undefined,
        specialRequests: formData.specialRequests || undefined,
        status: "pending" as const,
      };

      console.log("📋 Dados da reserva a serem criados:", reservationData);

      const newReservation = await createReservation(reservationData);

      console.log("✅ Resultado da criação:", newReservation);

      if (newReservation) {
        setShowCreateForm(false);
        setFormData({
          date: "",
          time: "",
          partySize: "",
          customerName: "",
          customerPhone: "",
          customerEmail: "",
          specialRequests: "",
        });

        // Enviar notificação de sucesso
        await pushNotificationService.sendLocalNotification({
          title: "Reserva Criada com Sucesso! 🎉",
          body: `Sua reserva no ${newReservation.restaurantName} foi criada e adicionada ao seu calendário.`,
          data: {
            type: "reservation_created",
            reservationId: newReservation.id,
            restaurantName: newReservation.restaurantName,
          },
        });

        // Agendar lembretes automáticos
        await scheduleReservationReminders(newReservation);

        Alert.alert("Sucesso", "Reserva criada com sucesso!");
      }
    } catch (error: any) {
      console.error("❌ Erro ao criar reserva:", error);
      Alert.alert("Erro", error.message || "Não foi possível criar a reserva");
    }
  };

  const handleCancelReservation = (reservationId: string) => {
    Alert.alert(
      "Cancelar Reserva",
      "Tem certeza que deseja cancelar esta reserva?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => cancelReservation(reservationId),
        },
      ]
    );
  };

  // Funções de teste para notificações
  const testNotification = async (type: string) => {
    try {
      switch (type) {
        case "reservation_created":
          await pushNotificationService.sendLocalNotification({
            title: "Reserva Criada com Sucesso! 🎉",
            body: "Sua reserva foi confirmada e adicionada ao seu calendário.",
            data: { type: "reservation_created" },
          });
          break;
        case "reservation_reminder":
          await pushNotificationService.sendReservationReminder(
            "Restaurante Teste",
            "19:00",
            "test-reservation-id"
          );
          break;
        case "reservation_confirmed":
          await pushNotificationService.sendLocalNotification({
            title: "Reserva Confirmada! ✅",
            body: "O restaurante confirmou sua reserva. Veja os detalhes.",
            data: { type: "reservation_confirmed" },
          });
          break;
        case "reservation_cancelled":
          await pushNotificationService.sendLocalNotification({
            title: "Reserva Cancelada ❌",
            body: "Sua reserva foi cancelada com sucesso.",
            data: { type: "reservation_cancelled" },
          });
          break;
        case "proximity":
          await pushNotificationService.sendProximityNotification(
            "Restaurante Teste",
            "Você está próximo! Que tal fazer uma reserva ou pedir delivery?"
          );
          break;
        case "immediate":
          await NotificationTester.testImmediateNotification();
          break;
        case "scheduled":
          await NotificationTester.testScheduledNotification();
          break;
        case "reservation_complete":
          await NotificationTester.testReservationNotification();
          break;
        case "all_tests":
          await NotificationTester.testAllNotifications();
          break;
        case "test_styles":
          await NotificationTester.testNotificationStyles();
          break;
        case "test_order":
          await NotificationTester.testOrderNotification();
          break;
        case "test_promotion":
          await NotificationTester.testPromotionNotification();
          break;
        case "clear_all":
          await NotificationTester.clearAllScheduledNotifications();
          break;
        default:
          await pushNotificationService.sendLocalNotification({
            title: "Notificação de Teste",
            body: "Esta é uma notificação de teste do Smart Menu.",
            data: { type: "test" },
          });
      }
      Alert.alert("Sucesso", `Notificação de teste "${type}" enviada!`);
    } catch (error) {
      console.error("Erro ao enviar notificação de teste:", error);
      Alert.alert("Erro", "Não foi possível enviar a notificação de teste.");
    }
  };

  const scheduleReservationReminders = async (reservation: any) => {
    try {
      // Calcular datas para lembretes
      const [day, month, year] = reservation.date.split("/").map(Number);
      const [hour, minute] = reservation.time.split(":").map(Number);
      const reservationDate = new Date(year, month - 1, day, hour, minute);

      // Lembrete 1 dia antes
      const oneDayBefore = new Date(
        reservationDate.getTime() - 24 * 60 * 60 * 1000
      );
      if (oneDayBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: "Lembrete de Reserva - Amanhã 📅",
          body: `Sua reserva no ${reservation.restaurantName} está marcada para amanhã às ${reservation.time}.`,
          data: {
            type: "reservation_reminder",
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time,
          },
          trigger: { date: oneDayBefore },
        });
      }

      // Lembrete 1 hora antes
      const oneHourBefore = new Date(
        reservationDate.getTime() - 60 * 60 * 1000
      );
      if (oneHourBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: "Lembrete de Reserva - 1 hora ⏰",
          body: `Sua reserva no ${reservation.restaurantName} está marcada para ${reservation.time}. Não se esqueça!`,
          data: {
            type: "reservation_reminder",
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time,
          },
          trigger: { date: oneHourBefore },
        });
      }

      // Lembrete 15 minutos antes
      const fifteenMinutesBefore = new Date(
        reservationDate.getTime() - 15 * 60 * 1000
      );
      if (fifteenMinutesBefore > new Date()) {
        await pushNotificationService.scheduleNotification({
          title: "Sua reserva está chegando! 🚀",
          body: `Reserva no ${reservation.restaurantName} em 15 minutos. Hora de sair!`,
          data: {
            type: "reservation_reminder",
            reservationId: reservation.id,
            restaurantName: reservation.restaurantName,
            time: reservation.time,
          },
          trigger: { date: fifteenMinutesBefore },
        });
      }

      console.log("✅ Lembretes de reserva agendados com sucesso");
    } catch (error) {
      console.error("❌ Erro ao agendar lembretes:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return colors.primary;
      case "pending":
        return colors.mutedForeground;
      case "cancelled":
        return colors.destructive;
      case "completed":
        return colors.primary;
      default:
        return colors.mutedForeground;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "pending":
        return "Pendente";
      case "cancelled":
        return "Cancelada";
      case "completed":
        return "Concluída";
      default:
        return status;
    }
  };

  const renderReservationItem = (reservation: any) => (
    <View
      key={reservation.id}
      style={[
        styles.card,
        localStyles.reservationCard,
        { borderLeftColor: getStatusColor(reservation.status) },
      ]}
    >
      <View style={localStyles.reservationHeader}>
        <Text style={[styles.title, { fontSize: 16 }]}>
          {reservation.restaurantName}
        </Text>
        <View
          style={[
            localStyles.statusBadge,
            { backgroundColor: getStatusColor(reservation.status) },
          ]}
        >
          <Text
            style={[
              localStyles.statusText,
              { color: colors.primaryForeground },
            ]}
          >
            {getStatusText(reservation.status)}
          </Text>
        </View>
      </View>

      <View style={localStyles.reservationDetails}>
        <View style={localStyles.detailRow}>
          <Feather name="calendar" size={16} color={colors.mutedForeground} />
          <Text style={[styles.text, localStyles.detailText]}>
            {reservation.date} às {reservation.time}
          </Text>
        </View>

        <View style={localStyles.detailRow}>
          <Feather name="users" size={16} color={colors.mutedForeground} />
          <Text style={[styles.text, localStyles.detailText]}>
            {reservation.partySize}{" "}
            {reservation.partySize === 1 ? "pessoa" : "pessoas"}
          </Text>
        </View>

        <View style={localStyles.detailRow}>
          <Feather name="user" size={16} color={colors.mutedForeground} />
          <Text style={[styles.text, localStyles.detailText]}>
            {reservation.customerName}
          </Text>
        </View>

        {reservation.specialRequests && (
          <View style={localStyles.detailRow}>
            <Feather
              name="message-circle"
              size={16}
              color={colors.mutedForeground}
            />
            <Text style={[styles.text, localStyles.detailText]}>
              {reservation.specialRequests}
            </Text>
          </View>
        )}
      </View>

      {reservation.status === "confirmed" && (
        <View style={localStyles.reservationActions}>
          <TouchableOpacity
            onPress={() => handleCancelReservation(reservation.id)}
            style={[styles.buttonSecondary, localStyles.cancelButton]}
          >
            <Text style={styles.buttonTextSecondary}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderCreateForm = () => (
    <View style={[styles.card, localStyles.createForm]}>
      <Text style={[styles.title, { marginBottom: 16 }]}>Nova Reserva</Text>

      <View style={localStyles.formRow}>
        <MaskedInput
          value={formData.date}
          onChange={(value) => setFormData({ ...formData, date: value })}
          placeholder="Data (DD/MM/AAAA)"
          mode="date"
          minimumDate={new Date()}
        />
      </View>

      <View style={localStyles.formRow}>
        <MaskedInput
          value={formData.time}
          onChange={(value) => setFormData({ ...formData, time: value })}
          placeholder="Horário (HH:MM)"
          mode="time"
        />
      </View>

      <View style={localStyles.formRow}>
        <TextInput
          style={[styles.input, localStyles.formInput]}
          placeholder="Número de pessoas"
          placeholderTextColor={colors.mutedForeground}
          value={formData.partySize}
          onChangeText={(text) => setFormData({ ...formData, partySize: text })}
          keyboardType="numeric"
        />
      </View>

      <View style={localStyles.formRow}>
        <TextInput
          style={[styles.input, localStyles.formInput]}
          placeholder="Nome completo *"
          placeholderTextColor={colors.mutedForeground}
          value={formData.customerName}
          onChangeText={(text) =>
            setFormData({ ...formData, customerName: text })
          }
        />
      </View>

      <View style={localStyles.formRow}>
        <MaskedInput
          value={formData.customerPhone}
          onChange={(value) =>
            setFormData({ ...formData, customerPhone: value })
          }
          placeholder="Telefone ((XX) XXXXX-XXXX)"
          mode="phone"
        />
      </View>

      <View style={localStyles.formRow}>
        <TextInput
          style={[styles.input, localStyles.formInput]}
          placeholder="Email (opcional)"
          placeholderTextColor={colors.mutedForeground}
          value={formData.customerEmail}
          onChangeText={(text) =>
            setFormData({ ...formData, customerEmail: text })
          }
          keyboardType="email-address"
        />
      </View>

      <View style={localStyles.formRow}>
        <TextInput
          style={[styles.input, localStyles.formInput]}
          placeholder="Pedidos especiais (opcional)"
          placeholderTextColor={colors.mutedForeground}
          value={formData.specialRequests}
          onChangeText={(text) =>
            setFormData({ ...formData, specialRequests: text })
          }
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={localStyles.formActions}>
        <TouchableOpacity
          onPress={() => setShowCreateForm(false)}
          style={[styles.buttonSecondary, localStyles.formButton]}
        >
          <Text
            style={[styles.buttonTextSecondary, localStyles.formButtonText]}
          >
            Cancelar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCreateReservation}
          style={[styles.buttonPrimary, localStyles.formButton]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text style={[styles.buttonText, localStyles.formButtonText]}>
              Criar Reserva
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeContainer>
      <ScrollView
        style={localStyles.scrollView}
        contentContainerStyle={localStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={localStyles.header}>
          <Text style={[styles.title, { fontSize: 24 }]}>Minhas Reservas</Text>
          <View style={localStyles.headerButtons}>
            <TouchableOpacity
              onPress={() => setShowCreateForm(!showCreateForm)}
              style={[
                showCreateForm ? styles.buttonSecondary : styles.buttonPrimary,
                localStyles.createButton,
              ]}
            >
              {!showCreateForm && (
                <Feather
                  name="plus"
                  size={20}
                  color={
                    showCreateForm
                      ? colors.secondaryForeground
                      : colors.primaryForeground
                  }
                />
              )}
              <Text
                style={[
                  showCreateForm
                    ? styles.buttonTextSecondary
                    : styles.buttonText,
                  localStyles.createButtonText,
                  { marginLeft: showCreateForm ? 0 : 8 },
                ]}
              >
                {showCreateForm ? "Cancelar" : "Nova Reserva"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showCreateForm && renderCreateForm()}

        {/* Seção de Teste de Notificações - COMENTADA PARA PRODUÇÃO */}
        {/*
        <View style={localStyles.section}>
          <Text style={[styles.subtitle, { marginBottom: 12 }]}>
            Teste de Notificações
          </Text>
          <View style={localStyles.testButtonsContainer}>
            <TouchableOpacity
              onPress={() => testNotification("immediate")}
              style={[styles.buttonPrimary, localStyles.testButton]}
            >
              <Text style={styles.buttonText}>Imediata</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("scheduled")}
              style={[styles.buttonSecondary, localStyles.testButton]}
            >
              <Text style={styles.buttonTextSecondary}>Agendada (5s)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("reservation_created")}
              style={[styles.buttonPrimary, localStyles.testButton]}
            >
              <Text style={styles.buttonText}>Reserva Criada</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("reservation_reminder")}
              style={[styles.buttonSecondary, localStyles.testButton]}
            >
              <Text style={styles.buttonTextSecondary}>Lembrete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("reservation_complete")}
              style={[styles.buttonPrimary, localStyles.testButton]}
            >
              <Text style={styles.buttonText}>Reserva Completa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("proximity")}
              style={[styles.buttonSecondary, localStyles.testButton]}
            >
              <Text style={styles.buttonTextSecondary}>Proximidade</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("all_tests")}
              style={[
                styles.buttonPrimary,
                localStyles.testButton,
                { flexBasis: "100%" },
              ]}
            >
              <Text style={styles.buttonText}>Todos os Testes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("test_styles")}
              style={[
                styles.buttonSecondary,
                localStyles.testButton,
                { flexBasis: "100%" },
              ]}
            >
              <Text style={styles.buttonTextSecondary}>Teste de Estilos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("test_order")}
              style={[
                styles.buttonPrimary,
                localStyles.testButton,
                { flexBasis: "100%" },
              ]}
            >
              <Text style={styles.buttonText}>Teste de Pedido</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("test_promotion")}
              style={[
                styles.buttonSecondary,
                localStyles.testButton,
                { flexBasis: "100%" },
              ]}
            >
              <Text style={styles.buttonTextSecondary}>Teste de Promoção</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => testNotification("clear_all")}
              style={[
                styles.buttonSecondary,
                localStyles.testButton,
                { flexBasis: "100%" },
              ]}
            >
              <Text style={styles.buttonTextSecondary}>Limpar Todas</Text>
            </TouchableOpacity>
          </View>
        </View>
        */}

        {confirmedReservations.length > 0 && (
          <View style={localStyles.section}>
            <Text style={[styles.subtitle, { marginBottom: 12 }]}>
              Reservas Confirmadas
            </Text>
            {confirmedReservations.map(renderReservationItem)}
          </View>
        )}

        {pendingReservations.length > 0 && (
          <View style={localStyles.section}>
            <Text style={[styles.subtitle, { marginBottom: 12 }]}>
              Reservas Pendentes
            </Text>
            {pendingReservations.map(renderReservationItem)}
          </View>
        )}

        {reservations.length === 0 && !showCreateForm && (
          <View style={localStyles.emptyState}>
            <Feather name="calendar" size={48} color={colors.mutedForeground} />
            <Text style={[styles.title, { fontSize: 18, marginTop: 16 }]}>
              Nenhuma reserva encontrada
            </Text>
            <Text
              style={[styles.mutedText, { textAlign: "center", marginTop: 8 }]}
            >
              Faça sua primeira reserva para começar
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    flexWrap: "wrap",
    gap: 16,
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 140,
    minHeight: 40,
  },
  createForm: {
    marginBottom: 24,
    padding: 24,
  },
  formRow: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  formInput: {
    flex: 1,
  },
  formActions: {
    flexDirection: "row",
    marginTop: 24,
    gap: 12,
  },
  section: {
    marginBottom: 24,
  },
  reservationCard: {
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  reservationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  reservationDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    flex: 1,
  },
  reservationActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  formButton: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
    paddingVertical: 12,
  },
  formButtonText: {
    textAlign: "center",
    textAlignVertical: "center",
  },
  createButtonText: {
    marginLeft: 8,
    textAlign: "center",
    textAlignVertical: "center",
  },
  testButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "space-between",
  },
  testButton: {
    flex: 1,
    minWidth: "45%",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
