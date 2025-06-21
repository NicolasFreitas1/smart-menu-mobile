import { api } from "../lib/axios";
import { Dish } from "../domain/dish";

interface MessageSent {
  role: string;
  content: string;
}

interface GenerateAISuggestionRequest {
  restaurantId: string;
  messages: MessageSent[];
}

interface GenerateAISuggestionResponse {
  text: string;
  dish: { id: string; name: string; description: string } | null;
}

// Função para verificar se a API está disponível
const isApiAvailable = async (): Promise<boolean> => {
  try {
    await api.get("/health", { timeout: 3000 });
    return true;
  } catch (error) {
    console.log("🌐 API não disponível, usando dados mock");
    return false;
  }
};

// Função para simular delay de rede
const simulateNetworkDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// Dados mock para quando a API não estiver disponível
const mockDishes: Dish[] = [
  {
    id: "1",
    name: "Pizza Margherita",
    description: "Molho de tomate, mussarela, manjericão fresco",
    price: 25.9,
    restaurantId: "restaurant-1",
    categories: ["Pizza"],
  },
  {
    id: "2",
    name: "Pizza Pepperoni",
    description: "Molho de tomate, mussarela, pepperoni",
    price: 28.9,
    restaurantId: "restaurant-1",
    categories: ["Pizza"],
  },
  {
    id: "3",
    name: "Hambúrguer Clássico",
    description: "Pão, carne, alface, tomate, cebola, queijo",
    price: 18.9,
    restaurantId: "restaurant-1",
    categories: ["Hambúrguer"],
  },
  {
    id: "4",
    name: "Hambúrguer Bacon",
    description: "Pão, carne, bacon, queijo, alface, tomate",
    price: 22.9,
    restaurantId: "restaurant-1",
    categories: ["Hambúrguer"],
  },
  {
    id: "5",
    name: "Tiramisu",
    description: "Sobremesa italiana tradicional",
    price: 12.9,
    restaurantId: "restaurant-1",
    categories: ["Sobremesa"],
  },
  {
    id: "6",
    name: "Brownie",
    description: "Brownie de chocolate com nozes",
    price: 10.9,
    restaurantId: "restaurant-1",
    categories: ["Sobremesa"],
  },
  {
    id: "7",
    name: "Refrigerante",
    description: "Refrigerante 350ml",
    price: 6.9,
    restaurantId: "restaurant-1",
    categories: ["Bebida"],
  },
  {
    id: "8",
    name: "Suco Natural",
    description: "Suco natural de laranja 300ml",
    price: 8.9,
    restaurantId: "restaurant-1",
    categories: ["Bebida"],
  },
];

export const aiService = {
  // Gerar sugestão de IA
  async generateAISuggestion({
    restaurantId,
    messages,
  }: GenerateAISuggestionRequest): Promise<GenerateAISuggestionResponse> {
    try {
      console.log("🚀 Iniciando geração de sugestão de IA");
      console.log("🏪 Restaurant ID:", restaurantId);
      console.log("💬 Mensagens:", JSON.stringify(messages, null, 2));

      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        console.log("🌐 API disponível, fazendo requisição...");
        
        const requestData = { messages };
        console.log("📤 Dados enviados para API:", JSON.stringify(requestData, null, 2));

        const { data } = await api.post(`ai/suggestion/${restaurantId}`, requestData);
        
        console.log("📥 Resposta da API:", JSON.stringify(data, null, 2));

        const raw = data.message?.message || data.text || "";

        // Extrai JSON embutido (entre crases ou markdown)
        const jsonMatch = raw.match(/```json([\s\S]*?)```/);
        let dish = null;

        if (jsonMatch) {
          try {
            dish = JSON.parse(jsonMatch[1].trim());
            console.log("🍽️ Prato extraído:", dish);
          } catch (err) {
            console.error("❌ Erro ao fazer parse do JSON da IA:", err);
          }
        }

        const cleanedText = raw.replace(/```json[\s\S]*?```/, "").trim();
        console.log("📝 Texto limpo:", cleanedText);

        return { text: cleanedText, dish };
      } else {
        console.log("🔄 Usando dados mock...");
        // Usar dados mock
        await simulateNetworkDelay();
        
        const context = messages[messages.length - 1]?.content || "";
        console.log("🎭 Contexto para mock:", context);
        const mockResponse = generateMockSuggestion(context);
        
        console.log("🎭 Resposta mock:", mockResponse);
        return mockResponse;
      }
    } catch (error) {
      console.error("❌ Erro ao gerar sugestão:", error);
      
      // Fallback para dados mock
      await simulateNetworkDelay();
      const context = messages[messages.length - 1]?.content || "";
      const mockResponse = generateMockSuggestion(context);
      
      return mockResponse;
    }
  },

  // Buscar prato por ID
  async getDishById({ dishId }: { dishId: string }): Promise<Dish> {
    try {
      console.log("🔍 Buscando prato por ID:", dishId);
      
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        const response = await api.get(`/dishes/${dishId}`);
        const dish = response.data.dish || response.data;
        console.log("🍽️ Prato encontrado:", dish);
        return dish;
      } else {
        // Usar dados mock
        await simulateNetworkDelay();
        const dish = mockDishes.find(d => d.id === dishId);
        
        if (!dish) {
          throw new Error("Prato não encontrado");
        }
        
        return dish;
      }
    } catch (error) {
      console.error("❌ Erro ao buscar prato:", error);
      
      // Fallback para dados mock
      await simulateNetworkDelay();
      const dish = mockDishes.find(d => d.id === dishId);
      
      if (!dish) {
        throw new Error("Prato não encontrado");
      }
      
      return dish;
    }
  },
};

// Função para gerar sugestões mock baseadas no contexto
function generateMockSuggestion(context: string): GenerateAISuggestionResponse {
  console.log("🎭 Gerando sugestão mock para contexto:", context);
  
  const lowerContext = context.toLowerCase();
  
  // Mapeamento de contexto para sugestões
  if (lowerContext.includes("entrada") || lowerContext.includes("porção")) {
    const dish = mockDishes.find(d => d.name.toLowerCase().includes("pizza"));
    return {
      text: "Baseado na sua preferência por entradas, recomendo uma pizza como entrada! 🍕\n\nNossa pizza é perfeita para compartilhar e abrir o apetite.",
      dish: dish ? { id: dish.id, name: dish.name, description: dish.description } : null
    };
  }
  
  if (lowerContext.includes("bebida") || lowerContext.includes("refrigerante")) {
    const dish = mockDishes.find(d => d.name.toLowerCase().includes("refrigerante"));
    return {
      text: "Para acompanhar sua refeição, que tal um refrigerante refrescante? 🥤\n\nPerfeito para equilibrar os sabores!",
      dish: dish ? { id: dish.id, name: dish.name, description: dish.description } : null
    };
  }
  
  if (lowerContext.includes("sobremesa") || lowerContext.includes("doce")) {
    const dish = mockDishes.find(d => d.name.toLowerCase().includes("tiramisu"));
    return {
      text: "Para finalizar com chave de ouro, que tal uma sobremesa italiana? 🍰\n\nNossa sobremesa é a escolha perfeita!",
      dish: dish ? { id: dish.id, name: dish.name, description: dish.description } : null
    };
  }
  
  if (lowerContext.includes("principal") || lowerContext.includes("hambúrguer")) {
    const dish = mockDishes.find(d => d.name.toLowerCase().includes("hambúrguer"));
    return {
      text: "Para o prato principal, recomendo um hambúrguer saboroso! 🍔\n\nUma opção clássica e deliciosa!",
      dish: dish ? { id: dish.id, name: dish.name, description: dish.description } : null
    };
  }
  
  // Sugestão padrão
  const randomDish = mockDishes[Math.floor(Math.random() * mockDishes.length)];
  return {
    text: "Baseado nas suas preferências, tenho uma sugestão especial para você! 🍽️\n\nEspero que goste da nossa recomendação!",
    dish: randomDish ? { id: randomDish.id, name: randomDish.name, description: randomDish.description } : null
  };
} 