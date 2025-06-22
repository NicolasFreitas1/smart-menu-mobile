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
        Alert.alert("Sucesso", "Reserva criada com sucesso!");

        // Forçar recarregamento após criar
        console.log("🔄 Forçando recarregamento após criação...");
        await loadReservations();
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
          style={[styles.buttonSecondary, { flex: 1 }]}
        >
          <Text style={styles.buttonTextSecondary}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCreateReservation}
          style={[styles.buttonPrimary, { flex: 1 }]}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primaryForeground} />
          ) : (
            <Text style={styles.buttonText}>Criar Reserva</Text>
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
                  { marginLeft: showCreateForm ? 0 : 8 },
                ]}
              >
                {showCreateForm ? "Cancelar" : "Nova Reserva"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showCreateForm && renderCreateForm()}

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
  },
  headerButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    minWidth: 120,
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
});
