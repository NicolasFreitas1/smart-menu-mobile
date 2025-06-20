# Guia do Sistema SQLite - Smart Menu Mobile

Este guia explica como usar o sistema de banco de dados SQLite implementado na aplicação Smart Menu Mobile.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura do Banco](#estrutura-do-banco)
3. [Serviço de Banco de Dados](#serviço-de-banco-de-dados)
4. [Hooks Personalizados](#hooks-personalizados)
5. [Casos de Uso](#casos-de-uso)
6. [Exemplos Práticos](#exemplos-práticos)
7. [Manutenção e Debug](#manutenção-e-debug)
8. [Boas Práticas](#boas-práticas)

## 🎯 Visão Geral

O sistema SQLite foi implementado para gerenciar dados estruturados que requerem consultas complexas e relacionamentos. Diferente do AsyncStorage (que é para dados simples), o SQLite é ideal para:

- **Histórico de pedidos** com múltiplos itens
- **Sistema de avaliações** e reviews
- **Notificações** com diferentes tipos
- **Estatísticas** e relatórios
- **Dados que precisam de consultas SQL**

### 📦 Dependências

```bash
npm install expo-sqlite
```

## 🗄️ Estrutura do Banco

### Tabelas Principais

#### 1. **orders** - Pedidos

```sql
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  restaurantId TEXT NOT NULL,
  restaurantName TEXT NOT NULL,
  totalAmount REAL NOT NULL,
  status TEXT NOT NULL,
  orderDate TEXT NOT NULL,
  deliveryAddress TEXT,
  paymentMethod TEXT NOT NULL,
  notes TEXT
);
```

**Campos:**

- `id`: Identificador único do pedido
- `restaurantId`: ID do restaurante
- `restaurantName`: Nome do restaurante
- `totalAmount`: Valor total do pedido
- `status`: Status atual (pending, confirmed, preparing, ready, delivered, cancelled)
- `orderDate`: Data/hora do pedido
- `deliveryAddress`: Endereço de entrega (opcional)
- `paymentMethod`: Método de pagamento (cash, card, pix)
- `notes`: Observações do pedido

#### 2. **order_items** - Itens dos Pedidos

```sql
CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL,
  dishId TEXT NOT NULL,
  dishName TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unitPrice REAL NOT NULL,
  totalPrice REAL NOT NULL,
  observations TEXT,
  FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
);
```

**Campos:**

- `id`: Identificador único do item
- `orderId`: Referência ao pedido (foreign key)
- `dishId`: ID do prato
- `dishName`: Nome do prato
- `quantity`: Quantidade
- `unitPrice`: Preço unitário
- `totalPrice`: Preço total (quantity × unitPrice)
- `observations`: Observações específicas do item

#### 3. **reviews** - Avaliações

```sql
CREATE TABLE reviews (
  id TEXT PRIMARY KEY,
  orderId TEXT NOT NULL,
  dishId TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  reviewDate TEXT NOT NULL,
  FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE
);
```

**Campos:**

- `id`: Identificador único da avaliação
- `orderId`: Referência ao pedido
- `dishId`: ID do prato (opcional - pode avaliar o pedido todo)
- `rating`: Nota de 1 a 5
- `comment`: Comentário da avaliação
- `reviewDate`: Data da avaliação

#### 4. **notifications** - Notificações

```sql
CREATE TABLE notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  isRead INTEGER NOT NULL DEFAULT 0,
  createdAt TEXT NOT NULL,
  data TEXT
);
```

**Campos:**

- `id`: Identificador único da notificação
- `title`: Título da notificação
- `message`: Mensagem da notificação
- `type`: Tipo (order_update, promotion, reminder, system)
- `isRead`: Se foi lida (0 ou 1)
- `createdAt`: Data de criação
- `data`: Dados extras em JSON

### Índices para Performance

```sql
CREATE INDEX idx_orders_restaurant ON orders (restaurantId);
CREATE INDEX idx_orders_date ON orders (orderDate);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_order_items_order ON order_items (orderId);
CREATE INDEX idx_reviews_order ON reviews (orderId);
CREATE INDEX idx_notifications_read ON notifications (isRead);
CREATE INDEX idx_notifications_created ON notifications (createdAt);
```

## 🔧 Serviço de Banco de Dados

### Importação

```typescript
import { databaseService } from "../services/database";
```

### Inicialização

```typescript
// No App.tsx ou onde for necessário
await databaseService.init();
```

### Métodos Principais

#### Pedidos

```typescript
// Salvar pedido completo
await databaseService.saveOrder(order, orderItems);

// Buscar todos os pedidos
const orders = await databaseService.getOrders(limit, offset);

// Buscar pedido com itens
const orderWithItems = await databaseService.getOrderWithItems(orderId);

// Atualizar status
await databaseService.updateOrderStatus(orderId, "confirmed");

// Buscar por restaurante
const restaurantOrders = await databaseService.getOrdersByRestaurant(
  restaurantId
);
```

#### Avaliações

```typescript
// Salvar avaliação
await databaseService.saveReview(review);

// Buscar avaliações de um pedido
const orderReviews = await databaseService.getReviewsByOrder(orderId);

// Buscar avaliações de um prato
const dishReviews = await databaseService.getReviewsByDish(dishId);

// Calcular média de avaliações
const averageRating = await databaseService.getAverageRating(dishId);
```

#### Notificações

```typescript
// Salvar notificação
await databaseService.saveNotification(notification);

// Buscar notificações
const notifications = await databaseService.getNotifications(limit, offset);

// Marcar como lida
await databaseService.markNotificationAsRead(notificationId);

// Marcar todas como lidas
await databaseService.markAllNotificationsAsRead();

// Contar não lidas
const unreadCount = await databaseService.getUnreadNotificationsCount();
```

#### Estatísticas

```typescript
// Estatísticas gerais
const stats = await databaseService.getOrderStatistics();
// stats.totalOrders, stats.totalSpent, stats.averageOrderValue, stats.favoriteRestaurant

// Gastos mensais
const monthlySpending = await databaseService.getMonthlySpending(6); // últimos 6 meses
```

## 🎣 Hooks Personalizados

### useOrders

```typescript
import { useOrders } from "../hooks/use-orders";

function MyComponent() {
  const {
    orders,
    isLoading,
    error,
    saveOrder,
    getOrderWithItems,
    updateOrderStatus,
    getOrderStatistics,
    getMonthlySpending,
  } = useOrders();

  // Usar os métodos...
}
```

**Métodos disponíveis:**

- `orders`: Lista de pedidos
- `isLoading`: Estado de carregamento
- `error`: Erro atual
- `saveOrder(order, items)`: Salvar pedido
- `getOrderWithItems(orderId)`: Buscar pedido com itens
- `updateOrderStatus(orderId, status)`: Atualizar status
- `getOrderStatistics()`: Estatísticas gerais
- `getMonthlySpending(months)`: Gastos mensais

### useNotifications

```typescript
import { useNotifications } from "../hooks/use-notifications";

function MyComponent() {
  const {
    notifications,
    unreadCount,
    isLoading,
    saveNotification,
    markAsRead,
    markAllAsRead,
    createOrderUpdateNotification,
    createPromotionNotification,
    createReminderNotification,
    createSystemNotification,
    getNotificationsByType,
    getUnreadNotifications,
  } = useNotifications();

  // Usar os métodos...
}
```

**Métodos disponíveis:**

- `notifications`: Lista de notificações
- `unreadCount`: Contagem de não lidas
- `saveNotification(notification)`: Salvar notificação
- `markAsRead(notificationId)`: Marcar como lida
- `markAllAsRead()`: Marcar todas como lidas
- `createOrderUpdateNotification(orderId, status, restaurantName)`: Notificação de pedido
- `createPromotionNotification(title, message, data)`: Notificação de promoção
- `createReminderNotification(title, message, data)`: Notificação de lembrete
- `createSystemNotification(title, message, data)`: Notificação do sistema
- `getNotificationsByType(type)`: Filtrar por tipo
- `getUnreadNotifications()`: Apenas não lidas

## 💼 Casos de Uso

### 1. Finalizar um Pedido

```typescript
import { useOrders } from "../hooks/use-orders";
import { useNotifications } from "../hooks/use-notifications";

function OrderSummary() {
  const { saveOrder } = useOrders();
  const { createOrderUpdateNotification } = useNotifications();

  const handleFinishOrder = async () => {
    // Criar pedido
    const order = {
      id: generateOrderId(),
      restaurantId: "rest-123",
      restaurantName: "Restaurante Exemplo",
      totalAmount: 45.9,
      status: "pending",
      orderDate: new Date().toISOString(),
      paymentMethod: "card",
      notes: "Entregar no portão",
    };

    // Criar itens
    const orderItems = [
      {
        id: "item-1",
        orderId: order.id,
        dishId: "dish-1",
        dishName: "Pizza Margherita",
        quantity: 2,
        unitPrice: 22.95,
        totalPrice: 45.9,
        observations: "Borda recheada",
      },
    ];

    // Salvar no banco
    const success = await saveOrder(order, orderItems);

    if (success) {
      // Criar notificação
      await createOrderUpdateNotification(
        order.id,
        "confirmed",
        order.restaurantName
      );
    }
  };
}
```

### 2. Sistema de Avaliações

```typescript
import { databaseService } from "../services/database";

const saveReview = async (
  orderId: string,
  dishId: string,
  rating: number,
  comment: string
) => {
  const review = {
    id: generateReviewId(),
    orderId,
    dishId,
    rating,
    comment,
    reviewDate: new Date().toISOString(),
  };

  await databaseService.saveReview(review);
};

const getDishRating = async (dishId: string) => {
  const averageRating = await databaseService.getAverageRating(dishId);
  const reviews = await databaseService.getReviewsByDish(dishId);

  return { averageRating, reviews };
};
```

### 3. Sistema de Notificações

```typescript
import { useNotifications } from "../hooks/use-notifications";

function NotificationSystem() {
  const {
    notifications,
    unreadCount,
    createOrderUpdateNotification,
    createPromotionNotification,
    markAsRead,
  } = useNotifications();

  // Notificação de atualização de pedido
  const notifyOrderUpdate = async (
    orderId: string,
    status: string,
    restaurantName: string
  ) => {
    await createOrderUpdateNotification(orderId, status, restaurantName);
  };

  // Notificação de promoção
  const notifyPromotion = async () => {
    await createPromotionNotification(
      "Promoção Especial",
      "20% de desconto em pizzas hoje!",
      { discount: 20, category: "pizza" }
    );
  };

  // Marcar notificação como lida
  const handleNotificationPress = async (notificationId: string) => {
    await markAsRead(notificationId);
    // Navegar para detalhes...
  };
}
```

### 4. Relatórios e Estatísticas

```typescript
import { useOrders } from "../hooks/use-orders";

function Dashboard() {
  const { getOrderStatistics, getMonthlySpending } = useOrders();

  const loadDashboard = async () => {
    const stats = await getOrderStatistics();
    const monthly = await getMonthlySpending(6);

    console.log("Total de pedidos:", stats.totalOrders);
    console.log("Total gasto:", stats.totalSpent);
    console.log("Média por pedido:", stats.averageOrderValue);
    console.log("Restaurante favorito:", stats.favoriteRestaurant);
    console.log("Gastos mensais:", monthly);
  };
}
```

## 📱 Exemplos Práticos

### Tela de Histórico de Pedidos

```typescript
import React from "react";
import { FlatList, View, Text } from "react-native";
import { useOrders } from "../hooks/use-orders";

export function OrderHistoryScreen() {
  const { orders, isLoading, getOrderStatistics } = useOrders();

  const renderOrderItem = ({ item }) => (
    <View>
      <Text>Pedido #{item.id.slice(-6)}</Text>
      <Text>{item.restaurantName}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Total: R$ {item.totalAmount}</Text>
    </View>
  );

  return (
    <FlatList
      data={orders}
      renderItem={renderOrderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
```

### Componente de Resumo do Pedido

```typescript
import React from "react";
import { useOrders } from "../hooks/use-orders";
import { useNotifications } from "../hooks/use-notifications";

export function OrderSummary({ cartItems, totalPrice }) {
  const { saveOrder } = useOrders();
  const { createOrderUpdateNotification } = useNotifications();

  const handleFinishOrder = async () => {
    const order = {
      id: generateOrderId(),
      restaurantId: "rest-123",
      restaurantName: "Restaurante Exemplo",
      totalAmount: totalPrice,
      status: "pending",
      orderDate: new Date().toISOString(),
      paymentMethod: "card",
    };

    const orderItems = cartItems.map((item, index) => ({
      id: `${order.id}-item-${index}`,
      orderId: order.id,
      dishId: item.id,
      dishName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: item.price * item.quantity,
      observations: item.observations,
    }));

    const success = await saveOrder(order, orderItems);

    if (success) {
      await createOrderUpdateNotification(
        order.id,
        "confirmed",
        order.restaurantName
      );
    }
  };

  return <Button onPress={handleFinishOrder} title="Finalizar Pedido" />;
}
```

## 🔧 Manutenção e Debug

### Dados de Exemplo

```typescript
import {
  populateSampleData,
  clearAllData,
  exportAllData,
} from "../utils/sample-data";

// Popular dados de exemplo
await populateSampleData();

// Limpar todos os dados
await clearAllData();

// Exportar dados
const data = await exportAllData();
console.log(data);
```

### Limpeza de Dados Antigos

```typescript
// Limpar dados com mais de 365 dias
await databaseService.cleanupOldData(365);
```

### Informações do Banco

```typescript
// Exportar todos os dados
const data = await databaseService.exportData();
console.log("Pedidos:", data.orders.length);
console.log("Avaliações:", data.reviews.length);
console.log("Notificações:", data.notifications.length);
```

### Debug e Logs

```typescript
// Verificar se o banco foi inicializado
try {
  await databaseService.init();
  console.log("Banco inicializado com sucesso");
} catch (error) {
  console.error("Erro ao inicializar banco:", error);
}
```

## ✅ Boas Práticas

### 1. Tratamento de Erros

```typescript
try {
  await databaseService.saveOrder(order, items);
} catch (error) {
  console.error("Erro ao salvar pedido:", error);
  // Tratar erro adequadamente
}
```

### 2. Inicialização

```typescript
// Sempre inicializar o banco no início da aplicação
useEffect(() => {
  const initDatabase = async () => {
    try {
      await databaseService.init();
    } catch (error) {
      console.error("Erro ao inicializar banco:", error);
    }
  };

  initDatabase();
}, []);
```

### 3. Performance

```typescript
// Usar LIMIT e OFFSET para paginação
const orders = await databaseService.getOrders(20, 0); // Primeiros 20
const moreOrders = await databaseService.getOrders(20, 20); // Próximos 20

// Usar índices criados automaticamente
const restaurantOrders = await databaseService.getOrdersByRestaurant(
  restaurantId
);
```

### 4. Transações

```typescript
// Para operações complexas, considere usar transações
// (Implementação futura)
```

### 5. Backup e Restore

```typescript
// Exportar dados para backup
const backup = await databaseService.exportData();
// Salvar backup em AsyncStorage ou enviar para servidor

// Restaurar dados (implementação futura)
```

## 🚀 Próximos Passos

### Funcionalidades Futuras

1. **Sincronização com Servidor**

   - Enviar dados para API
   - Receber atualizações
   - Resolver conflitos

2. **Busca Avançada**

   - Buscar por texto
   - Filtros complexos
   - Ordenação personalizada

3. **Relatórios Detalhados**

   - Gráficos de consumo
   - Análise de preferências
   - Relatórios por período

4. **Backup Automático**

   - Backup periódico
   - Restore de dados
   - Migração de versões

5. **Cache Inteligente**
   - Cache de consultas frequentes
   - Invalidação automática
   - Otimização de performance

## 📚 Recursos Adicionais

### Documentação do Expo SQLite

- [Expo SQLite Documentation](https://docs.expo.dev/versions/latest/sdk/sqlite/)

### SQLite Tutorial

- [SQLite Tutorial](https://www.sqlitetutorial.net/)

### Performance Tips

- [SQLite Performance](https://www.sqlite.org/optoverview.html)

## 🤝 Suporte

Para dúvidas ou problemas com o sistema SQLite:

1. Verifique os logs no console
2. Confirme se o banco foi inicializado
3. Verifique se as tabelas foram criadas
4. Teste com dados de exemplo
5. Consulte a documentação do Expo SQLite

---

**Sistema SQLite implementado com sucesso! 🎉**

O sistema fornece uma base sólida para gerenciar dados estruturados localmente, com suporte completo a consultas SQL, relacionamentos e estatísticas avançadas.
