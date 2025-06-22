import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useTheme } from "../../theme/theme-provider";
import { AssistantButton } from "./assistant-button";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  suggestedDish?: {
    id: string;
    name: string;
    description: string;
  } | null;
  onAddToCart?: () => void;
  addedToCart?: boolean;
  isLastMessage?: boolean;
}

export function ChatMessage({
  role,
  content,
  suggestedDish,
  onAddToCart,
  addedToCart = false,
  isLastMessage = false,
}: ChatMessageProps) {
  const styles = useGlobalStyles();
  const { colors } = useTheme();

  const isAssistant = role === "assistant";
  const hasDishSuggestion = suggestedDish && content.includes("🍽️");
  const showAddToCartButton =
    hasDishSuggestion && isLastMessage && !addedToCart && onAddToCart;

  return (
    <View
      style={[
        localStyles.container,
        isAssistant
          ? localStyles.assistantContainer
          : localStyles.userContainer,
      ]}
    >
      <View
        style={[
          localStyles.messageBubble,
          isAssistant ? localStyles.assistantBubble : localStyles.userBubble,
          {
            backgroundColor: isAssistant ? colors.card : colors.primary,
            borderColor: colors.border,
          },
        ]}
      >
        <Text
          style={[
            localStyles.messageText,
            {
              color: isAssistant ? colors.foreground : colors.primaryForeground,
            },
          ]}
        >
          {content}
        </Text>

        {showAddToCartButton && (
          <View style={localStyles.addToCartContainer}>
            <AssistantButton
              label="🛒 Adicionar ao carrinho"
              onPress={onAddToCart}
            />
          </View>
        )}

        {addedToCart && isLastMessage && (
          <Text
            style={[localStyles.addedToCartText, { color: colors.primary }]}
          >
            ✅ Prato adicionado ao carrinho com sucesso!
          </Text>
        )}
      </View>
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: "75%",
  },
  assistantContainer: {
    alignSelf: "flex-start",
  },
  userContainer: {
    alignSelf: "flex-end",
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  assistantBubble: {
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userBubble: {
    borderBottomRightRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  addToCartContainer: {
    marginTop: 12,
  },
  addedToCartText: {
    marginTop: 8,
    fontSize: 12,
    fontStyle: "italic",
  },
});
