import { useState, useCallback } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { useCart } from "../context/CartContext";
import { aiService } from "../services/ai";
import { Dish } from "../domain/dish";
import { Option, Step, ChatMessage } from "../types/assistant";

const conversationFlow: Record<string, Step> = {
  start: {
    id: "start",
    question: "O que você quer pedir?",
    options: [
      { label: "Entrada", value: "entrada" },
      { label: "Bebida", value: "bebida" },
      { label: "Salada", value: "salada" },
      { label: "Prato Principal", value: "prato_principal" },
      { label: "Sobremesa", value: "sobremesa" },
    ],
  },
  entrada: {
    id: "entrada",
    question: "Porções ou saladas?",
    options: [
      { label: "Porções", value: "entrada_porcoes" },
      { label: "Saladas", value: "entrada_saladas" },
    ],
  },
  entrada_porcoes: {
    id: "entrada_porcoes",
    question: "Porções fritas ou não fritas?",
    options: [
      { label: "Fritas", value: "entrada_porcoes_fritas" },
      { label: "Não fritas", value: "entrada_porcoes_nao_fritas" },
    ],
    end: true,
  },
  entrada_saladas: {
    id: "entrada_saladas",
    question: "Com parmesão ou sem?",
    options: [
      { label: "Com parmesão", value: "entrada_saladas_com_parmesao" },
      { label: "Sem parmesão", value: "entrada_saladas_sem_parmesao" },
    ],
    end: true,
  },
  bebida: {
    id: "bebida",
    question: "Bebida com gás ou sem?",
    options: [
      { label: "Com gás", value: "bebida_com_gas" },
      { label: "Sem gás", value: "bebida_sem_gas" },
    ],
  },
  bebida_com_gas: {
    id: "bebida_com_gas",
    question: "Refrigerante ou energético?",
    options: [
      { label: "Refrigerante", value: "bebida_com_gas_refrigerante" },
      { label: "Energético", value: "bebida_com_gas_energetico" },
    ],
    end: true,
  },
  bebida_sem_gas: {
    id: "bebida_sem_gas",
    question: "Suco ou água?",
    options: [
      { label: "Suco", value: "bebida_sem_gas_suco" },
      { label: "Água", value: "bebida_sem_gas_agua" },
    ],
    end: true,
  },
  salada: {
    id: "salada",
    question: "Com queijo parmesão ou sem?",
    options: [
      { label: "Com parmesão", value: "salada_com_parmesao" },
      { label: "Sem parmesão", value: "salada_sem_parmesao" },
    ],
    end: true,
  },
  prato_principal: {
    id: "prato_principal",
    question: "Para quantas pessoas?",
    options: [
      { label: "Individual", value: "prato_individual" },
      { label: "2 pessoas", value: "prato_duas_pessoas" },
    ],
  },
  prato_individual: {
    id: "prato_individual",
    question: "Escolha o tipo:",
    options: [
      { label: "Grill", value: "prato_individual_grill" },
      { label: "Pastas", value: "prato_individual_pastas" },
      { label: "Peixes", value: "prato_individual_peixes" },
      { label: "Risotos", value: "prato_individual_risotos" },
      { label: "Pratos Fitness", value: "prato_individual_fitness" },
    ],
  },
  prato_individual_grill: {
    id: "prato_individual_grill",
    question: "Escolha a carne:",
    options: [
      { label: "Frango", value: "prato_individual_grill_frango" },
      { label: "Costela suína", value: "prato_individual_grill_costela_suina" },
      { label: "Pernil de cordeiro", value: "prato_individual_grill_pernil_cordeiro" },
      { label: "Filé", value: "prato_individual_grill_file" },
      { label: "Picanha", value: "prato_individual_grill_picanha" },
      { label: "Iscas de carne", value: "prato_individual_grill_iscas_carne" },
    ],
    end: true,
  },
  prato_individual_pastas: {
    id: "prato_individual_pastas",
    question: "Escolha o molho:",
    options: [
      { label: "Molho branco", value: "prato_individual_pastas_molho_branco" },
      { label: "Molho misto", value: "prato_individual_pastas_molho_misto" },
      { label: "Molho sugo", value: "prato_individual_pastas_molho_sugo" },
      { label: "Molho de tomate", value: "prato_individual_pastas_molho_tomate" },
    ],
    end: true,
  },
  prato_individual_peixes: {
    id: "prato_individual_peixes",
    question: "Escolha o peixe:",
    options: [
      { label: "Camarão", value: "prato_individual_peixes_camarao" },
      { label: "Congrio", value: "prato_individual_peixes_congrio" },
      { label: "Paella", value: "prato_individual_peixes_paella" },
      { label: "Salmão", value: "prato_individual_peixes_salmao" },
      { label: "Siri", value: "prato_individual_peixes_siri" },
    ],
    end: true,
  },
  prato_individual_risotos: {
    id: "prato_individual_risotos",
    question: "Com algum tipo de carne ou sem?",
    options: [
      { label: "Com carne", value: "prato_individual_risotos_com_carne" },
      { label: "Sem carne", value: "prato_individual_risotos_sem_carne" },
    ],
    end: true,
  },
  prato_individual_fitness: {
    id: "prato_individual_fitness",
    question: "Escolha o prato:",
    options: [
      { label: "Escondidinho", value: "prato_individual_fitness_escondidinho" },
      { label: "Nhoque", value: "prato_individual_fitness_nhoque" },
      { label: "Bolinho de carne", value: "prato_individual_fitness_bolinho_carne" },
      { label: "Omelete", value: "prato_individual_fitness_omelete" },
    ],
    end: true,
  },
  prato_duas_pessoas: {
    id: "prato_duas_pessoas",
    question: "Escolha o tipo:",
    options: [
      { label: "Escalopes e pastas", value: "prato_duas_pessoas_escalopes_pastas" },
      { label: "Peixes", value: "prato_duas_pessoas_peixes" },
    ],
  },
  prato_duas_pessoas_escalopes_pastas: {
    id: "prato_duas_pessoas_escalopes_pastas",
    question: "Escolha:",
    options: [
      { label: "Filé", value: "prato_duas_pessoas_escalopes_pastas_file" },
      { label: "Frango", value: "prato_duas_pessoas_escalopes_pastas_frango" },
      { label: "Talharim", value: "prato_duas_pessoas_escalopes_pastas_talharim" },
    ],
    end: true,
  },
  prato_duas_pessoas_peixes: {
    id: "prato_duas_pessoas_peixes",
    question: "Escolha o peixe:",
    options: [
      { label: "Camarão", value: "prato_duas_pessoas_peixes_camarao" },
      { label: "Congrio", value: "prato_duas_pessoas_peixes_congrio" },
      { label: "Paella", value: "prato_duas_pessoas_peixes_paella" },
      { label: "Salmão", value: "prato_duas_pessoas_peixes_salmao" },
      { label: "Siri", value: "prato_duas_pessoas_peixes_siri" },
    ],
    end: true,
  },
  sobremesa: {
    id: "sobremesa",
    question: "Escolha a sobremesa:",
    options: [{ label: "Panqueca", value: "sobremesa_panqueca" }],
    end: true,
  },
};

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

  const [currentStepId, setCurrentStepId] = useState("start");
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [chatEnded, setChatEnded] = useState(false);
  const [suggestedDish, setSuggestedDish] = useState<Dish | null>(null);
  const [addedToCart, setAddedToCart] = useState(false);
  const [userChoices, setUserChoices] = useState<string[]>([]);

  const currentStep = conversationFlow[currentStepId];

  const generateSuggestion = useCallback(async (context: string) => {
    if (!restaurantId) {
      throw new Error("Restaurante não selecionado");
    }

    console.log("🤖 Gerando sugestão para contexto:", context);
    console.log("🏪 Restaurant ID:", restaurantId);

    const { text, dish } = await aiService.generateAISuggestion({
      restaurantId: String(restaurantId),
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
          restaurantId: String(restaurantId),
        };
        setSuggestedDish(fallbackDish);
      }
    }

    return finalMessage;
  }, [restaurantId]);

  const handleOptionClick = useCallback(async (option: Option) => {
    console.log("🎯 Opção selecionada:", option.label, "Valor:", option.value);
    console.log("🏪 Restaurant ID atual:", restaurantId);
    
    // Adiciona a escolha do usuário às mensagens
    setMessages((prev) => [...prev, { role: "user", content: option.label }]);
    
    // Adiciona o valor da opção ao histórico de escolhas
    const updatedChoices = [...userChoices, option.value];
    setUserChoices(updatedChoices);

    if (currentStep?.end) {
      setIsLoading(true);
      setChatEnded(true);

      try {
        // Constrói o contexto com todas as escolhas do usuário
        const context = updatedChoices.join(", ");
        console.log("📝 Contexto final enviado para IA:", context);
        console.log("📊 Total de escolhas:", updatedChoices.length);
        
        if (!restaurantId) {
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
      setCurrentStepId(nextStepId);

      const nextStep = conversationFlow[nextStepId];
      if (nextStep) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: nextStep.question },
        ]);
      }
    }
  }, [currentStep, userChoices, generateSuggestion, restaurantId]);

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
    setCurrentStepId("start");
    setMessages(initialMessages);
    setIsLoading(false);
    setChatEnded(false);
    setSuggestedDish(null);
    setAddedToCart(false);
    setUserChoices([]);
  }, []);

  return {
    // State
    currentStep,
    messages,
    isLoading,
    chatEnded,
    suggestedDish,
    addedToCart,
    
    // Actions
    handleOptionClick,
    handleAddToCart,
    handleNewSuggestion,
  };
} 