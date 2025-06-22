import { useState, useEffect } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import { storageService } from "../services/storage";
import { databaseService } from "../services/database";

export function useAppInitialization() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasSelectedRestaurant, setHasSelectedRestaurant] = useState(false);
  const { selectedRestaurant, saveSelectedRestaurant, clearSelectedRestaurant } = useRestaurant();

  useEffect(() => {
    initializeApp();
  }, []);

  // Reagir às mudanças no restaurante selecionado
  useEffect(() => {
    if (isInitialized) {
      setHasSelectedRestaurant(!!selectedRestaurant);
    }
  }, [selectedRestaurant, isInitialized]);

  const initializeApp = async () => {
    try {
      console.log("🚀 Inicializando aplicação...");
      
      // Inicializar banco de dados
      console.log("🗄️ Inicializando banco de dados...");
      await databaseService.init();
      console.log("✅ Banco de dados inicializado");

      // Verificar se há um restaurante salvo no storage
      const savedRestaurant = await storageService.getSelectedRestaurant();
      
      if (savedRestaurant) {
        // Se há um restaurante salvo, definir no contexto
        await saveSelectedRestaurant(savedRestaurant);
        setHasSelectedRestaurant(true);
      } else {
        // Se não há restaurante salvo, mostrar tela de seleção
        setHasSelectedRestaurant(false);
      }
      
      console.log("✅ Aplicação inicializada com sucesso");
    } catch (error) {
      console.error("❌ Erro na inicialização do app:", error);
      // Em caso de erro, mostrar tela de seleção
      setHasSelectedRestaurant(false);
    } finally {
      setIsInitialized(true);
    }
  };

  const resetRestaurantSelection = async () => {
    try {
      await clearSelectedRestaurant();
      setHasSelectedRestaurant(false);
    } catch (error) {
      console.error("Erro ao resetar seleção de restaurante:", error);
    }
  };

  return {
    isInitialized,
    hasSelectedRestaurant,
    resetRestaurantSelection,
  };
} 