import React, { useRef, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useTheme } from "../../theme/theme-provider";
import { ChatMessage } from "../ui/chat-message";
import { Dish } from "../../domain/dish";
import { ChatMessage as ChatMessageType } from "../../types/assistant";

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  suggestedDish: Dish | null;
  addedToCart: boolean;
  onAddToCart: () => void;
}

export function ChatContainer({
  messages,
  isLoading,
  suggestedDish,
  addedToCart,
  onAddToCart,
}: ChatContainerProps) {
  const styles = useGlobalStyles();
  const { colors } = useTheme();
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Scroll para o final quando as mensagens mudarem
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, isLoading]);

  return (
    <View style={[localStyles.chatCard, { backgroundColor: colors.muted }]}>
      <ScrollView
        ref={scrollViewRef}
        style={[localStyles.scrollView, { backgroundColor: colors.muted }]}
        contentContainerStyle={[
          localStyles.scrollContent,
          { backgroundColor: colors.muted },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role}
            content={msg.content}
            suggestedDish={suggestedDish}
            onAddToCart={onAddToCart}
            addedToCart={addedToCart}
            isLastMessage={idx === messages.length - 1}
          />
        ))}

        {isLoading && (
          <View style={localStyles.loadingContainer}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={[styles.mutedText, localStyles.loadingText]}>
              Gerando sugestão...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const localStyles = StyleSheet.create({
  chatCard: {
    flex: 1,
    marginBottom: 16,
    padding: 0,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
  },
});
