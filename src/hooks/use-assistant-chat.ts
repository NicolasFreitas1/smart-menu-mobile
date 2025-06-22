import { useState, useCallback } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { useCart } from "../context/CartContext";
import { aiService } from "../services/ai";
import { Dish } from "../domain/dish";
import { Option, Step, ChatMessage } from "../types/assistant";
import { 
  conversationFlow, 
  getStep, 
  getInitialStep, 
  isStepEnd,
  getSuggestions,
  isValidStep 
} from "../config/conversation-flow";

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "Olá! Vamos encontrar o prato ideal para você 🍽️",
  },
  { role: "assistant", content: "Do que você precisa de sugestão?" },
];

export function useAssistantChat() {
  const { restaurantId } = useRestaurant();
  const { addToCart } = useCart();

  // Validar se restaurantId está disponível
  const validatedRestaurantId = restaurantId || undefined;

  const [currentStep, setCurrentStep] = useState<Step>(getInitialStep());
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [suggestedDish, setSuggestedDish] = useState<Dish | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);

  const generateSuggestion = useCallback(async (context: string) => {
    if (!validatedRestaurantId) {
      throw new Error("Restaurante não selecionado");
    }

    console.log("🤖 Gerando sugestão para contexto:", context);
    console.log("🏪 Restaurant ID:", validatedRestaurantId);

    const { text, dish } = await aiService.generateAISuggestion({
      restaurantId: String(validatedRestaurantId),
      messages: [{ role: "user", content: context }],
    });

    let finalMessage = text;

    if (dish) {
      finalMessage += `\n\n🍽️ *${dish.name}*\n${dish.description}`;

      try {
        const fullDish = await aiService.getDishById({ dishId: dish.id });
        setSuggestedDish(fullDish);
      } catch (error) {
        console.log("Erro ao buscar prato completo:", error);
        const fallbackDish: Dish = {
          id: dish.id,
          name: dish.name,
          description: dish.description,
          price: 0,
          restaurantId: String(validatedRestaurantId),
        };
        setSuggestedDish(fallbackDish);
      }
    }

    return finalMessage;
  }, [validatedRestaurantId]);

  const selectOption = useCallback((optionValue: string) => {
    const nextStep = getStep(optionValue);
    
    if (!nextStep) {
      console.warn(`Step não encontrado: ${optionValue}`);
      return;
    }

    // Adicionar à história da conversa
    setConversationHistory(prev => [...prev, optionValue]);
    
    // Atualizar step atual
    setCurrentStep(nextStep);
    
    // Verificar se chegou ao final
    if (isStepEnd(optionValue)) {
      setIsComplete(true);
    }
  }, []);

  const resetConversation = useCallback(() => {
    setCurrentStep(getInitialStep());
    setConversationHistory([]);
    setIsComplete(false);
  }, []);

  const goBack = useCallback(() => {
    if (conversationHistory.length === 0) {
      return;
    }

    const newHistory = conversationHistory.slice(0, -1);
    setConversationHistory(newHistory);
    
    if (newHistory.length === 0) {
      setCurrentStep(getInitialStep());
    } else {
      const previousStepId = newHistory[newHistory.length - 1];
      const previousStep = getStep(previousStepId);
      if (previousStep) {
        setCurrentStep(previousStep);
      }
    }
    
    setIsComplete(false);
  }, [conversationHistory]);

  const getCurrentSuggestions = useCallback(() => {
    return getSuggestions(conversationHistory);
  }, [conversationHistory]);

  const canGoBack = conversationHistory.length > 0;

  const getProgress = useCallback(() => {
    if (conversationHistory.length === 0) return 0;
    
    const totalSteps = Object.keys(conversationFlow).length;
    const currentProgress = conversationHistory.length;
    
    return Math.min((currentProgress / totalSteps) * 100, 100);
  }, [conversationHistory]);

  const getCurrentPath = useCallback(() => {
    return conversationHistory.map(stepId => {
      const step = getStep(stepId);
      return step ? step.question : stepId;
    });
  }, [conversationHistory]);

  const validateStep = useCallback((stepId: string) => {
    return isValidStep(stepId);
  }, []);

  const handleOptionClick = useCallback(async (option: Option) => {
    console.log("🎯 Opção selecionada:", option.label, "Valor:", option.value);
    console.log("🏪 Restaurant ID atual:", validatedRestaurantId);
    
    // Adiciona a escolha do usuário às mensagens
    setMessages((prev) => [...prev, { role: "user", content: option.label }]);
    
    // Adiciona o valor da opção ao histórico de escolhas
    const updatedChoices = [...conversationHistory, option.value];
    setConversationHistory(updatedChoices);

    if (currentStep?.end) {
      setIsLoading(true);
      setChatEnded(true);

      try {
        // Constrói o contexto com todas as escolhas do usuário
        const context = updatedChoices.join(", ");
        console.log("📝 Contexto final enviado para IA:", context);
        console.log("📊 Total de escolhas:", updatedChoices.length);
        
        if (!validatedRestaurantId) {
          throw new Error("Restaurante não selecionado. Verifique se um restaurante está configurado.");
        }

        const finalMessage = await generateSuggestion(context);

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: finalMessage },
        ]);
      } catch (error) {
        console.error("❌ Erro ao gerar sugestão:", error);
        
        let errorMessage = "Ocorreu um erro ao buscar a sugestão. Tente novamente.";
        
        if (error instanceof Error) {
          if (error.message.includes("Restaurante não selecionado")) {
            errorMessage = "Restaurante não configurado. Configure um restaurante primeiro.";
          } else if (error.message.includes("network")) {
            errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
          }
        }
        
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMessage,
          },
        ]);
      }

      setIsLoading(false);
    } else {
      const nextStepId = option.value;
      const nextStep = getStep(nextStepId);
      
      if (nextStep) {
        setCurrentStep(nextStep);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: nextStep.question },
        ]);
      }
    }
  }, [currentStep, conversationHistory, generateSuggestion, validatedRestaurantId]);

  const handleAddToCart = useCallback(() => {
    if (suggestedDish) {
      addToCart(suggestedDish);
      setAddedToCart(true);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "✅ Prato adicionado ao carrinho com sucesso!",
        },
      ]);
    }
  }, [suggestedDish, addToCart]);

  const handleNewSuggestion = useCallback(() => {
    resetConversation();
    setIsLoading(false);
    setChatEnded(false);
    setSuggestedDish(null);
    setAddedToCart(false);
  }, [resetConversation]);

  return {
    currentStep,
    conversationHistory,
    isComplete,
    canGoBack,
    selectOption,
    resetConversation,
    goBack,
    getCurrentSuggestions,
    getProgress,
    getCurrentPath,
    validateStep,
    messages,
    isLoading,
    chatEnded,
    suggestedDish,
    addedToCart,
    handleOptionClick,
    handleAddToCart,
    handleNewSuggestion,
  };
} 