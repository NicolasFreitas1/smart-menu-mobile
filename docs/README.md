# 📱 Sistema de Armazenamento Local - Smart Menu Mobile

Este repositório contém a documentação completa do sistema de armazenamento local implementado na aplicação Smart Menu Mobile, incluindo AsyncStorage e SQLite.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Guias de Uso](#guias-de-uso)
4. [Funcionalidades](#funcionalidades)
5. [Exemplos Práticos](#exemplos-práticos)
6. [Estrutura de Arquivos](#estrutura-de-arquivos)
7. [Instalação e Configuração](#instalação-e-configuração)

## 🎯 Visão Geral

O sistema de armazenamento local foi projetado para fornecer uma experiência rica e personalizada ao usuário, mesmo offline. Utilizamos duas tecnologias complementares:

### 🔄 **AsyncStorage**

- **Propósito**: Dados simples e configurações
- **Casos de uso**: Tema, carrinho, autenticação, preferências
- **Performance**: Rápido para dados pequenos
- **Estrutura**: Chave-valor simples

### 🗄️ **SQLite**

- **Propósito**: Dados estruturados e relacionamentos
- **Casos de uso**: Histórico de pedidos, avaliações, notificações
- **Performance**: Otimizado para consultas complexas
- **Estrutura**: Banco relacional completo

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    Smart Menu Mobile                        │
├─────────────────────────────────────────────────────────────┤
│  📱 Interface do Usuário                                    │
│  ├── Telas e Componentes                                    │
│  └── Hooks Personalizados                                   │
├─────────────────────────────────────────────────────────────┤
│  🔧 Camada de Serviços                                      │
│  ├── StorageService (AsyncStorage)                          │
│  ├── DatabaseService (SQLite)                               │
│  └── Contexts (React Context)                               │
├─────────────────────────────────────────────────────────────┤
│  💾 Armazenamento Local                                     │
│  ├── AsyncStorage (Dados Simples)                           │
│  └── SQLite (Dados Estruturados)                            │
└─────────────────────────────────────────────────────────────┘
```

## 📚 Guias de Uso

### 1. [Guia do AsyncStorage](./storage-guide.md)

- Configuração e inicialização
- Operações básicas (CRUD)
- Hooks personalizados
- Contextos atualizados
- Boas práticas

### 2. [Guia do SQLite](./sqlite-guide.md)

- Estrutura do banco de dados
- Tabelas e relacionamentos
- Consultas SQL
- Estatísticas e relatórios
- Manutenção e debug

## 🚀 Funcionalidades

### ✅ **AsyncStorage - Implementado**

#### Dados Salvos:

- **Tema da aplicação** (claro/escuro/sistema)
- **Carrinho de compras** (itens, quantidades, observações)
- **Dados de autenticação** (token, usuário)
- **Preferências do usuário** (idioma, notificações, categorias favoritas)
- **Histórico de restaurantes** (últimos visitados)
- **Filtros de menu** (categorias, preço, ordenação)
- **Favoritos** (pratos, categorias, restaurantes)

#### Componentes:

- `StorageService` - Serviço centralizado
- `useUserPreferences` - Hook para preferências
- `useMenuFilters` - Hook para filtros
- `FavoriteButton` - Componente de favoritos
- `SettingsScreen` - Tela de configurações

### ✅ **SQLite - Implementado**

#### Dados Salvos:

- **Histórico completo de pedidos** com itens
- **Sistema de avaliações** e reviews
- **Notificações** com diferentes tipos
- **Estatísticas** de consumo e gastos
- **Relatórios** mensais e anuais

#### Componentes:

- `DatabaseService` - Serviço do banco de dados
- `useOrders` - Hook para pedidos
- `useNotifications` - Hook para notificações
- `OrderHistoryScreen` - Tela de histórico
- `OrderSummary` - Componente de finalização

## 💡 Exemplos Práticos

### 1. Salvar Tema do Usuário

```typescript
import { storageService } from "../services/storage";

// Salvar tema
await storageService.setTheme("dark");

// Carregar tema
const theme = await storageService.getTheme();
```

### 2. Finalizar Pedido com SQLite

```typescript
import { useOrders } from "../hooks/use-orders";
import { useNotifications } from "../hooks/use-notifications";

const { saveOrder } = useOrders();
const { createOrderUpdateNotification } = useNotifications();

const order = {
  /* dados do pedido */
};
const items = [
  /* itens do pedido */
];

// Salvar no SQLite
await saveOrder(order, items);

// Criar notificação
await createOrderUpdateNotification(order.id, "confirmed", restaurantName);
```

### 3. Gerenciar Favoritos

```typescript
import { FavoriteButton } from "../components/favorite-button";

<FavoriteButton
  itemId="dish-123"
  itemType="dish"
  onToggle={(isFavorite) => console.log(isFavorite)}
/>;
```

### 4. Estatísticas de Pedidos

```typescript
import { useOrders } from "../hooks/use-orders";

const { getOrderStatistics, getMonthlySpending } = useOrders();

const stats = await getOrderStatistics();
const monthly = await getMonthlySpending(6);

console.log("Total gasto:", stats.totalSpent);
console.log("Média por pedido:", stats.averageOrderValue);
```

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── storage.ts          # Serviço AsyncStorage
│   └── database.ts         # Serviço SQLite
├── hooks/
│   ├── use-user-preferences.ts
│   ├── use-menu-filters.ts
│   ├── use-orders.ts
│   └── use-notifications.ts
├── context/
│   ├── AuthContext.tsx     # Atualizado para AsyncStorage
│   ├── CartContext.tsx     # Atualizado para AsyncStorage
│   ├── RestaurantContext.tsx
│   └── ThemeProvider.tsx   # Atualizado para AsyncStorage
├── components/
│   ├── favorite-button.tsx
│   ├── order-summary.tsx
│   └── dish-item.tsx       # Atualizado com favoritos
├── pages/
│   ├── settings/
│   │   └── SettingsScreen.tsx
│   └── orders/
│       └── OrderHistoryScreen.tsx
├── utils/
│   └── sample-data.ts      # Dados de exemplo para SQLite
└── App.tsx                 # Inicialização do banco
```

## ⚙️ Instalação e Configuração

### 1. Dependências

```bash
# AsyncStorage (já instalado)
npm install @react-native-async-storage/async-storage

# SQLite
npm install expo-sqlite
```

### 2. Inicialização

```typescript
// App.tsx
import { databaseService } from "./services/database";

useEffect(() => {
  const initDatabase = async () => {
    try {
      await databaseService.init();
      console.log("Banco inicializado com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar banco:", error);
    }
  };

  initDatabase();
}, []);
```

### 3. Configuração dos Contextos

```typescript
// App.tsx
<ThemeProvider>
  <AuthProvider>
    <CartProvider>
      <RestaurantProvider restaurantId="restaurant-1">
        <AppNavigator />
      </RestaurantProvider>
    </CartProvider>
  </AuthProvider>
</ThemeProvider>
```

## 🧪 Testando o Sistema

### 1. Dados de Exemplo

```typescript
import { populateSampleData } from "../utils/sample-data";

// Na tela de configurações, clique em "Popular Dados de Exemplo"
await populateSampleData();
```

### 2. Verificar Funcionamento

1. **AsyncStorage**: Mude o tema e reinicie o app
2. **SQLite**: Adicione itens ao carrinho e finalize um pedido
3. **Favoritos**: Clique no coração dos pratos
4. **Notificações**: Finalize pedidos e veja as notificações

### 3. Debug

```typescript
// Verificar dados do AsyncStorage
const theme = await storageService.getTheme();
console.log("Tema atual:", theme);

// Verificar dados do SQLite
const orders = await databaseService.getOrders();
console.log("Pedidos salvos:", orders.length);
```

## 📊 Comparação: AsyncStorage vs SQLite

| Aspecto             | AsyncStorage               | SQLite                   |
| ------------------- | -------------------------- | ------------------------ |
| **Tipo de Dados**   | Simples (chave-valor)      | Estruturado (relacional) |
| **Performance**     | Rápido para dados pequenos | Otimizado para consultas |
| **Consultas**       | Busca por chave            | SQL completo             |
| **Relacionamentos** | Não suporta                | Suporta foreign keys     |
| **Uso Ideal**       | Configurações, cache       | Histórico, relatórios    |
| **Complexidade**    | Baixa                      | Média                    |

## 🎯 Casos de Uso Recomendados

### AsyncStorage:

- ✅ Configurações do usuário
- ✅ Carrinho de compras
- ✅ Dados de autenticação
- ✅ Preferências simples
- ✅ Cache temporário

### SQLite:

- ✅ Histórico de pedidos
- ✅ Sistema de avaliações
- ✅ Notificações persistentes
- ✅ Estatísticas e relatórios
- ✅ Dados que precisam de consultas complexas

## 🔮 Próximos Passos

### Funcionalidades Futuras:

1. **Sincronização com Servidor**

   - Backup automático
   - Sincronização bidirecional
   - Resolução de conflitos

2. **Melhorias de Performance**

   - Cache inteligente
   - Paginação otimizada
   - Índices adicionais

3. **Funcionalidades Avançadas**

   - Busca full-text
   - Relatórios gráficos
   - Exportação de dados

4. **Segurança**
   - Criptografia de dados sensíveis
   - Backup seguro
   - Validação de integridade

## 🤝 Contribuição

Para contribuir com o sistema de armazenamento local:

1. **Leia os guias** de AsyncStorage e SQLite
2. **Teste as funcionalidades** existentes
3. **Siga as boas práticas** documentadas
4. **Mantenha a compatibilidade** com dados existentes

## 📞 Suporte

Para dúvidas ou problemas:

1. **Consulte a documentação** específica
2. **Verifique os logs** no console
3. **Teste com dados de exemplo**
4. **Confirme a inicialização** dos serviços

---

## 🎉 Resumo

O sistema de armazenamento local fornece:

- ✅ **Persistência completa** de dados do usuário
- ✅ **Experiência offline** rica
- ✅ **Performance otimizada** para cada tipo de dado
- ✅ **Escalabilidade** para futuras funcionalidades
- ✅ **Documentação completa** para desenvolvedores

# Smart Menu Mobile

Um aplicativo de cardápio inteligente com Inteligência Artificial para restaurantes, desenvolvido em React Native com Expo.

## 🎯 Propósito

O Smart Menu Mobile foi desenvolvido para agilizar e personalizar a experiência de escolha de pratos pelos clientes, reduzindo a sobrecarga dos garçons e otimizando o atendimento. O app oferece uma solução completa de autoatendimento com recursos inteligentes de sugestão e personalização.

## ✨ Funcionalidades Principais

### 🏠 Tela Inicial

- Navegação simples e intuitiva
- Acesso rápido a todas as funcionalidades
- Interface responsiva e moderna

### 🤖 Chatbot Inteligente

- Assistente de IA para sugestões personalizadas
- Fluxo de conversação estruturado
- Integração com dados do restaurante
- Fallback para dados mock quando offline

### 📋 Cardápio Digital

- Lista completa de pratos com imagens, descrições e preços
- Sistema de categorias e filtros
- Busca e navegação intuitiva
- Modo offline com cache local

### 🛒 Sistema de Pedidos

- Carrinho de compras completo
- Gestão de quantidades e observações
- Finalização de pedidos
- Histórico de pedidos

### 🎲 Surprise Me

- Descoberta aleatória de pratos
- Filtros por categoria
- Experiência gamificada

## 🚀 Funcionalidades Diferenciais

### 📅 Integração com Calendário e Reservas

- **Sistema de Reservas Completo**: Criar, gerenciar e cancelar reservas
- **Integração com Calendário Nativo**: Adiciona automaticamente reservas ao calendário do dispositivo
- **Lembretes Automáticos**: Notificações de lembrete antes da reserva
- **Permissões Inteligentes**: Solicita permissão do calendário apenas quando necessário

**Como Funciona:**

1. Usuário cria uma reserva no app
2. Sistema solicita permissão do calendário
3. Reserva é adicionada automaticamente ao calendário
4. Lembretes são configurados (1 hora e 15 minutos antes)
5. Notificações push são enviadas nos horários programados

### 📱 Modo Offline para Consulta de Cardápio

- **Cache Inteligente**: Armazena cardápio localmente no primeiro acesso
- **Sincronização Automática**: Atualiza dados quando há conexão
- **Funcionamento Offline**: Acesso completo ao cardápio sem internet
- **Ações Pendentes**: Salva ações para sincronizar quando online

**Como Funciona:**

1. App verifica conectividade na inicialização
2. Se online: sincroniza dados do servidor
3. Se offline: usa dados em cache
4. Ações offline são salvas e processadas quando há conexão
5. Sincronização automática em background

### 📍 Geolocalização para Promoções por Proximidade

- **Geofencing Inteligente**: Detecta quando usuário está próximo do restaurante
- **Promoções Contextuais**: Envia ofertas baseadas na localização
- **Monitoramento em Background**: Funciona mesmo com app fechado
- **Controle de Privacidade**: Usuário pode ativar/desativar

**Como Funciona:**

1. Sistema configura geofences para restaurantes
2. Monitora localização do usuário em background
3. Detecta entrada/saída dos geofences
4. Envia notificações de promoção quando usuário entra
5. Registra eventos para análise

### 🔔 Notificações Push Personalizadas

- **Notificações Contextuais**: Baseadas no histórico e preferências
- **Tipos Diversificados**: Promoções, lembretes, atualizações de pedido
- **Personalização Inteligente**: Adapta conteúdo ao perfil do usuário
- **Gestão Completa**: Marcação como lida, histórico, configurações

**Como Funciona:**

1. Sistema registra token de notificação
2. Analisa histórico e preferências do usuário
3. Envia notificações personalizadas
4. Permite interação direta com notificações
5. Navegação automática para telas relevantes

## 🛠️ Tecnologias Utilizadas

- **React Native**: Framework principal
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **SQLite**: Banco de dados local
- **AsyncStorage**: Storage local
- **React Navigation**: Navegação
- **NativeWind**: Estilização com TailwindCSS
- **Expo Calendar**: Integração com calendário
- **Expo Location**: Geolocalização
- **Expo Notifications**: Notificações push

## 📱 Permissões Necessárias

### iOS

- **Calendário**: Para adicionar reservas automaticamente
- **Localização**: Para promoções por proximidade
- **Notificações**: Para notificações push

### Android

- **Calendário**: Para adicionar reservas automaticamente
- **Localização**: Para promoções por proximidade
- **Notificações**: Para notificações push
- **Background Location**: Para geofencing

## 🚀 Como Executar

1. **Instalar dependências:**

   ```bash
   npm install
   ```

2. **Instalar dependências das funcionalidades diferenciais:**

   ```bash
   npx expo install expo-calendar expo-location expo-notifications expo-device expo-constants
   ```

3. **Executar o projeto:**

   ```bash
   npm start
   ```

4. **Executar em dispositivo:**
   ```bash
   npm run android
   # ou
   npm run ios
   ```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
├── context/            # Contextos React
├── hooks/              # Hooks customizados
├── pages/              # Telas do aplicativo
├── services/           # Serviços e APIs
│   ├── reservation.ts  # Serviço de reservas
│   ├── location.ts     # Serviço de geolocalização
│   ├── push-notifications.ts # Serviço de notificações
│   └── offline-sync.ts # Serviço de sincronização
├── types/              # Definições de tipos
└── utils/              # Utilitários
```

## 🔧 Configuração

### Notificações Push

1. Configure o projeto no Expo
2. Atualize o `projectId` em `push-notifications.ts`
3. Configure as chaves de notificação

### Geolocalização

1. Configure as coordenadas dos restaurantes
2. Ajuste os raios de geofencing
3. Configure as mensagens de promoção

### Calendário

1. Teste as permissões em dispositivo físico
2. Configure os templates de evento
3. Ajuste os lembretes automáticos

## 📊 Funcionalidades por Status

| Funcionalidade            | Status           | Implementação                     |
| ------------------------- | ---------------- | --------------------------------- |
| Tela Inicial              | ✅ Completa      | Navegação simples e intuitiva     |
| Chatbot IA                | ✅ Completa      | Assistente com fluxo estruturado  |
| Cardápio                  | ✅ Completa      | Lista com filtros e cache         |
| Pedidos                   | ✅ Completa      | Carrinho e finalização            |
| Surprise Me               | ✅ Completa      | Descoberta aleatória              |
| **Reservas + Calendário** | ✅ **Nova**      | Sistema completo com integração   |
| **Modo Offline**          | ✅ **Melhorado** | Cache inteligente e sincronização |
| **Geolocalização**        | ✅ **Nova**      | Geofencing e promoções            |
| **Notificações Push**     | ✅ **Nova**      | Sistema personalizado             |

## 🎯 Próximos Passos

- [ ] Implementar backend para notificações push
- [ ] Adicionar mais opções de personalização
- [ ] Implementar sistema de avaliações
- [ ] Adicionar integração com pagamentos
- [ ] Implementar analytics e métricas

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia as diretrizes de contribuição antes de submeter um pull request.

## 🐛 Troubleshooting

### Erro de JSON Parse

Se você encontrar o erro `[SyntaxError: JSON Parse error: Unexpected character: o]`, isso indica dados corrompidos no storage. O app agora inclui limpeza automática na inicialização, mas você pode forçar a limpeza manualmente:

```typescript
import { cleanupStorage } from "./src/utils/storage-cleanup";

// Limpeza completa do storage
await cleanupStorage();
```

### Problemas de Permissões

Se as funcionalidades de localização, notificações ou calendário não funcionarem:

1. **Verifique as permissões no dispositivo**
2. **Reinicie o app após conceder permissões**
3. **Verifique se as permissões estão configuradas no app.json**

### Problemas de Sincronização

Se a sincronização offline não funcionar:

1. **Verifique a conectividade**
2. **Force uma sincronização manual**
3. **Limpe o cache se necessário**

```typescript
// Verificar conectividade
const isOnline = await offlineSyncService.checkConnectivity();

// Forçar sincronização
await offlineSyncService.forceSync();

// Limpar cache
await offlineSyncService.clearCache();
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── assistant/      # Componentes do chatbot
│   ├── cart/          # Componentes do carrinho
│   ├── home/          # Componentes da tela inicial
│   ├── menu/          # Componentes do cardápio
│   └── ui/            # Componentes de UI reutilizáveis
├── context/           # Contextos React
├── hooks/             # Hooks customizados
├── lib/               # Bibliotecas e configurações
├── navigation/        # Navegação do app
├── pages/             # Telas do app
├── services/          # Serviços (API, storage, etc.)
├── theme/             # Configuração de tema
├── types/             # Definições de tipos TypeScript
└── utils/             # Utilitários
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Suporte

Para suporte, envie um email para suporte@smartmenu.com ou abra uma issue no GitHub.

---

**Smart Menu Mobile** - Transformando a experiência de pedidos em restaurantes com IA e tecnologia móvel moderna.
