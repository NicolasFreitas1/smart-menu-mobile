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

---
