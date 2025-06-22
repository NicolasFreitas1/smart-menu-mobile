import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "../../theme/hooks";
import { useAssistantChat } from "../../hooks/use-assistant-chat";
import { ChatContainer } from "../../components/assistant/chat-container";
import { OptionsContainer } from "../../components/assistant/options-container";
import { NewSuggestionButton } from "../../components/assistant/new-suggestion-button";
import { SafeContainer } from "../../components/ui/safe-container";

export function AssistantScreen() {
  const styles = useGlobalStyles();
  const {
    currentStep,
    messages,
    isLoading,
    chatEnded,
    suggestedDish,
    addedToCart,
    handleOptionClick,
    handleAddToCart,
    handleNewSuggestion,
  } = useAssistantChat();

  return (
    <SafeContainer style={localStyles.screenContainer}>
      <Text style={[styles.title, localStyles.screenTitle]}>
        Assistente de Sugestão
      </Text>

      <View style={localStyles.chatContainer}>
        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          suggestedDish={suggestedDish}
          addedToCart={addedToCart}
          onAddToCart={handleAddToCart}
        />

        {chatEnded && !isLoading && (
          <NewSuggestionButton onPress={handleNewSuggestion} />
        )}

        {!isLoading && !chatEnded && currentStep && currentStep.options && (
          <OptionsContainer
            options={currentStep.options}
            onOptionClick={handleOptionClick}
          />
        )}
      </View>
    </SafeContainer>
  );
}

const localStyles = StyleSheet.create({
  screenContainer: {
    paddingBottom: 80,
  },
  screenTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  chatContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
});
