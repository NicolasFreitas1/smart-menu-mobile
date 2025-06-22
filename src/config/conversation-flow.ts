import { Step } from '../types/assistant';

/**
 * Configuração do fluxo de conversa do assistente
 * Cada step representa uma etapa da conversa com opções para o usuário
 */
export const conversationFlow: Record<string, Step> = {
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

/**
 * Função para obter um step específico do fluxo
 */
export function getStep(stepId: string): Step | null {
  return conversationFlow[stepId] || null;
}

/**
 * Função para obter o step inicial
 */
export function getInitialStep(): Step {
  return conversationFlow.start;
}

/**
 * Função para verificar se um step é final
 */
export function isStepEnd(stepId: string): boolean {
  const step = getStep(stepId);
  return step?.end || false;
}

/**
 * Função para obter todos os steps disponíveis
 */
export function getAllSteps(): Record<string, Step> {
  return conversationFlow;
}

/**
 * Função para obter apenas os steps finais (que terminam a conversa)
 */
export function getEndSteps(): Step[] {
  return Object.values(conversationFlow).filter(step => step.end);
}

/**
 * Função para obter o caminho completo de um step (hierarquia)
 */
export function getStepPath(stepId: string): string[] {
  const path: string[] = [];
  let currentStep = stepId;
  
  while (currentStep && currentStep !== 'start') {
    path.unshift(currentStep);
    // Encontrar o step pai (removendo o último segmento)
    const segments = currentStep.split('_');
    segments.pop();
    currentStep = segments.join('_');
  }
  
  return path;
}

/**
 * Função para obter sugestões baseadas no histórico de conversa
 */
export function getSuggestions(conversationHistory: string[]): Step[] {
  const suggestions: Step[] = [];
  
  // Se não há histórico, sugerir o step inicial
  if (conversationHistory.length === 0) {
    suggestions.push(getInitialStep());
    return suggestions;
  }
  
  // Obter o último step da conversa
  const lastStepId = conversationHistory[conversationHistory.length - 1];
  const lastStep = getStep(lastStepId);
  
  if (lastStep && !lastStep.end) {
    // Se o último step não é final, sugerir suas opções
    return [lastStep];
  }
  
  // Se chegou ao final, sugerir começar novamente
  suggestions.push(getInitialStep());
  
  return suggestions;
}

/**
 * Função para validar se um step existe
 */
export function isValidStep(stepId: string): boolean {
  return stepId in conversationFlow;
}

/**
 * Função para obter estatísticas do fluxo
 */
export function getFlowStats() {
  const steps = Object.values(conversationFlow);
  const endSteps = steps.filter(step => step.end);
  
  return {
    totalSteps: steps.length,
    endSteps: endSteps.length,
    maxOptions: Math.max(...steps.map(step => step.options.length)),
    averageOptions: steps.reduce((sum, step) => sum + step.options.length, 0) / steps.length,
  };
} 