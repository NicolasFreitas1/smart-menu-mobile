# 🍽️ Smart Menu Mobile

> **Cardápio Digital Inteligente para Restaurantes** - Uma aplicação React Native completa que revoluciona a experiência de pedidos e reservas em restaurantes.

![Smart Menu](https://img.shields.io/badge/React%20Native-0.79.2-blue)
![Expo](https://img.shields.io/badge/Expo-53.0.11-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue)

## 🎯 Visão Geral

O **Smart Menu Mobile** é uma aplicação completa de cardápio digital que oferece uma experiência moderna e intuitiva para clientes de restaurantes. Com funcionalidades avançadas como chatbot IA, geolocalização, notificações push e integração com calendário, o app proporciona uma solução completa para o setor gastronômico.

### ✨ Principais Diferenciais

- 🤖 **Chatbot IA Inteligente** - Sugestões personalizadas baseadas em preferências
- 📍 **Geolocalização Avançada** - Geofencing e promoções por proximidade
- 📅 **Integração com Calendário** - Reservas automáticas no calendário do dispositivo
- 🔔 **Notificações Push Personalizadas** - Sistema completo de notificações
- 📱 **Modo Offline Inteligente** - Funcionamento completo sem internet
- 🎨 **Interface Moderna** - Design responsivo com tema claro/escuro
- 🎲 **Surprise Me** - Descoberta aleatória de pratos

## 🚀 Funcionalidades Principais

### 🏠 **Tela Inicial**

- Navegação intuitiva para todas as funcionalidades
- Acesso rápido ao cardápio, assistente e reservas
- Interface responsiva e moderna

### 🤖 **Chatbot Inteligente**

- Assistente de IA para sugestões personalizadas
- Fluxo de conversação estruturado e natural
- Integração com dados do restaurante
- Fallback para dados mock quando offline

### 📋 **Cardápio Digital**

- Lista completa de pratos com imagens, descrições e preços
- Sistema de categorias e filtros avançados
- Busca e navegação intuitiva
- Modo offline com cache local inteligente

### 🛒 **Sistema de Pedidos**

- Carrinho de compras completo
- Gestão de quantidades e observações
- Finalização de pedidos
- Histórico de pedidos detalhado

### 🎲 **Surprise Me**

- Descoberta aleatória de pratos
- Filtros por categoria
- Experiência gamificada

### 📅 **Sistema de Reservas**

- **Criação de Reservas**: Interface intuitiva para agendar mesas
- **Integração com Calendário**: Adiciona automaticamente ao calendário do dispositivo
- **Lembretes Automáticos**: Notificações 1 dia e 1 hora antes da reserva
- **Gestão Completa**: Visualizar, editar e cancelar reservas
- **Permissões Inteligentes**: Solicita permissão apenas quando necessário

### 📱 **Modo Offline**

- **Cache Inteligente**: Armazena cardápio localmente no primeiro acesso
- **Sincronização Automática**: Atualiza dados quando há conexão
- **Funcionamento Completo**: Acesso total ao cardápio sem internet
- **Ações Pendentes**: Salva ações para sincronizar quando online

### 📍 **Geolocalização e Geofencing**

- **Busca por Proximidade**: Encontra restaurantes próximos
- **Geofencing**: Notificações quando próximo ao restaurante
- **Promoções por Localização**: Ofertas baseadas na proximidade
- **Cálculo de Distâncias**: Informações precisas de localização

### 🔔 **Sistema de Notificações**

- **Notificações Push Personalizadas**: Ícones, cores e sons customizados
- **Lembretes de Reserva**: Notificações automáticas antes da reserva
- **Atualizações de Pedido**: Status em tempo real
- **Promoções por Proximidade**: Ofertas baseadas na localização

## 🛠️ Tecnologias Utilizadas

### **Frontend**

- **React Native 0.79.2** - Framework principal
- **Expo 53.0.11** - Plataforma de desenvolvimento
- **TypeScript 5.8.3** - Tipagem estática
- **React Navigation 7.x** - Navegação entre telas
- **React Native Vector Icons** - Ícones personalizados

### **Backend & APIs**

- **Axios** - Cliente HTTP para APIs
- **REST API** - Backend completo para dados
- **ChatGPT/IA** - Integração para sugestões inteligentes

### **Armazenamento**

- **Expo SQLite** - Banco de dados local
- **AsyncStorage** - Cache e configurações
- **Offline Sync** - Sincronização inteligente

### **Funcionalidades Avançadas**

- **Expo Location** - Geolocalização e geofencing
- **Expo Calendar** - Integração com calendário
- **Expo Notifications** - Sistema de notificações push
- **Expo Device** - Informações do dispositivo

### **UI/UX**

- **React Native Safe Area Context** - Áreas seguras
- **React Native Reanimated** - Animações fluidas
- **Theme System** - Tema claro/escuro
- **Responsive Design** - Interface adaptativa

## 📱 Telas e Navegação

### **Navegação Principal**

```
🏠 Home
├── 📋 Cardápio
├── 🤖 Assistente IA
├── 🎲 Surprise Me
├── 🛒 Carrinho
└── ⚙️ Configurações
    ├── 📅 Reservas
    ├── 📊 Histórico de Pedidos
    └── 🏪 Configuração de Restaurante
```

### **Fluxo de Usuário**

1. **Seleção de Restaurante** - Escolha o restaurante desejado
2. **Exploração** - Navegue pelo cardápio ou use o assistente
3. **Pedido/Reserva** - Faça pedidos ou agende reservas
4. **Acompanhamento** - Receba notificações e atualizações

## 🔧 Instalação e Configuração

### **Pré-requisitos**

- Node.js 18+
- npm ou yarn
- Expo CLI
- Android Studio (para builds nativos)
- Dispositivo Android ou emulador

### **Instalação**

```bash
# Clone o repositório
git clone https://github.com/NicolasFreitas1/smart-menu-mobile.git
cd smart-menu-mobile

# Instale as dependências
npm install

# Inicie o projeto
npx expo start
```

### **Configuração do Ambiente**

1. **Configurar API Backend**

   ```typescript
   // src/lib/axios.ts
   const DEV_IP = "192.168.1.100"; // IP da sua máquina
   ```

2. **Configurar Notificações**
   ```json
   // app.json
   "notification": {
     "icon": "./assets/notification-icon.png",
     "color": "#10b981"
   }
   ```

### **Scripts Disponíveis**

```bash
# Desenvolvimento
npm start              # Inicia o servidor de desenvolvimento
npm run android        # Executa no Android
npm run ios           # Executa no iOS
npm run web           # Executa na web

# Build
npx expo build:android    # Build para Android
npx expo build:ios        # Build para iOS
```

## 🏗️ Arquitetura do Projeto

### **Estrutura de Pastas**

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes de interface
│   ├── cart/           # Componentes do carrinho
│   ├── menu/           # Componentes do cardápio
│   └── assistant/      # Componentes do assistente
├── pages/              # Telas da aplicação
├── services/           # Serviços e APIs
├── hooks/              # Custom hooks
├── context/            # Context API
├── config/             # Configurações
├── utils/              # Utilitários
├── types/              # Definições de tipos
└── theme/              # Sistema de temas
```

### **Padrões de Desenvolvimento**

- **TypeScript** - Tipagem estática completa
- **Context API** - Gerenciamento de estado global
- **Custom Hooks** - Lógica reutilizável
- **Service Layer** - Separação de responsabilidades
- **Component Composition** - Componentes modulares

## 📊 Funcionalidades por Status

| Funcionalidade        | Status      | Implementação          |
| --------------------- | ----------- | ---------------------- |
| Tela Inicial          | ✅ Completa | Navegação intuitiva    |
| Chatbot IA            | ✅ Completa | Assistente inteligente |
| Cardápio              | ✅ Completa | Lista com filtros      |
| Pedidos               | ✅ Completa | Carrinho completo      |
| Surprise Me           | ✅ Completa | Descoberta aleatória   |
| Reservas + Calendário | ✅ Completa | Sistema integrado      |
| Modo Offline          | ✅ Completa | Cache inteligente      |
| Geolocalização        | ✅ Completa | Geofencing             |
| Notificações Push     | ✅ Completa | Sistema personalizado  |
| Tema Claro/Escuro     | ✅ Completa | Interface adaptativa   |

## 🚀 Funcionalidades Avançadas

### **🤖 Sistema de IA**

- Integração com ChatGPT para sugestões
- Fluxo de conversação estruturado
- Contexto baseado no restaurante
- Fallback para dados mock

### **📍 Geolocalização**

- Busca de restaurantes por proximidade
- Geofencing para promoções
- Cálculo de distâncias
- Permissões inteligentes

### **📅 Integração com Calendário**

- Adição automática de reservas
- Lembretes configuráveis
- Sincronização bidirecional
- Permissões granulares

### **🔔 Notificações Push**

- Ícones personalizados
- Cores e sons customizados
- Agendamento inteligente
- Categorização por tipo

### **📱 Modo Offline**

- Cache inteligente de dados
- Sincronização automática
- Funcionamento completo offline
- Ações pendentes

## 🧪 Testes e Qualidade

### **Sistema de Logging**

- Logs estruturados por nível
- Configuração por ambiente
- Debug em desenvolvimento
- Logs limpos em produção

### **Tratamento de Erros**

- Try-catch em operações críticas
- Fallbacks para dados mock
- Mensagens de erro amigáveis
- Recuperação automática

### **Validação de Dados**

- Validação de UUIDs
- Verificação de tipos
- Sanitização de inputs
- Validação de configurações

## 📱 Compatibilidade

### **Plataformas Suportadas**

- ✅ Android 8.0+ (API 26+)
- ✅ iOS 13.0+
- ✅ Web (React Native Web)

## 🔒 Segurança

### **Práticas Implementadas**

- Validação de inputs
- Sanitização de dados
- Permissões granulares
- Armazenamento seguro

### **Permissões Necessárias**

- Localização (para geofencing)
- Calendário (para reservas)
- Notificações (para push)
- Internet (para sincronização)

---

**Desenvolvido com ❤️ para revolucionar a experiência gastronômica**

_Smart Menu Mobile - Transformando a forma como você pede comida_
