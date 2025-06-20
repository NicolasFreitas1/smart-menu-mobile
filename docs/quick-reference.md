# 🚀 Guia de Referência Rápida - Smart Menu Mobile

Este guia contém os comandos e métodos mais utilizados para consulta rápida.

## 📋 Índice Rápido

- [AsyncStorage](#asyncstorage)
- [SQLite](#sqlite)
- [Hooks](#hooks)
- [Componentes](#componentes)
- [Debug](#debug)

## 🔄 AsyncStorage

### Importação

```typescript
import { storageService } from "../services/storage";
```

### Métodos Principais

#### Tema

```typescript
// Salvar tema
await storageService.setTheme("dark" | "light" | "system");

// Carregar tema
const theme = await storageService.getTheme();
```

#### Carrinho

```typescript
// Salvar carrinho
await storageService.setCart(cartItems);

// Carregar carrinho
const cart = await storageService.getCart();

// Limpar carrinho
await storageService.clearCart();
```

#### Autenticação

```typescript
// Salvar dados de auth
await storageService.setAuthData({ token, user });

// Carregar dados de auth
const authData = await storageService.getAuthData();

// Limpar auth
await storageService.clearAuthData();
```

#### Preferências

```typescript
// Salvar preferências
await storageService.setUserPreferences(preferences);

// Carregar preferências
const prefs = await storageService.getUserPreferences();
```

#### Favoritos

```typescript
// Adicionar favorito
await storageService.addFavorite(itemId, itemType);

// Remover favorito
await storageService.removeFavorite(itemId, itemType);

// Verificar se é favorito
const isFavorite = await storageService.isFavorite(itemId, itemType);

// Listar favoritos
const favorites = await storageService.getFavorites(itemType);
```

## 🗄️ SQLite

### Importação

```typescript
import { databaseService } from "../services/database";
```

### Inicialização

```typescript
await databaseService.init();
```

### Pedidos

```typescript
// Salvar pedido completo
await databaseService.saveOrder(order, orderItems);

// Buscar todos os pedidos
const orders = await databaseService.getOrders(limit?, offset?);

// Buscar pedido com itens
const orderWithItems = await databaseService.getOrderWithItems(orderId);

// Atualizar status
await databaseService.updateOrderStatus(orderId, status);

// Buscar por restaurante
const restaurantOrders = await databaseService.getOrdersByRestaurant(restaurantId);

// Estatísticas
const stats = await databaseService.getOrderStatistics();
const monthly = await databaseService.getMonthlySpending(months);
```

### Avaliações

```typescript
// Salvar avaliação
await databaseService.saveReview(review);

// Buscar avaliações
const orderReviews = await databaseService.getReviewsByOrder(orderId);
const dishReviews = await databaseService.getReviewsByDish(dishId);

// Média de avaliações
const averageRating = await databaseService.getAverageRating(dishId);
```

### Notificações

```typescript
// Salvar notificação
await databaseService.saveNotification(notification);

// Buscar notificações
const notifications = await databaseService.getNotifications(limit?, offset?);

// Marcar como lida
await databaseService.markNotificationAsRead(notificationId);

// Marcar todas como lidas
await databaseService.markAllNotificationsAsRead();

// Contar não lidas
const unreadCount = await databaseService.getUnreadNotificationsCount();
```

## 🎣 Hooks

### useOrders

```typescript
import { useOrders } from "../hooks/use-orders";

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
```

### useNotifications

```typescript
import { useNotifications } from "../hooks/use-notifications";

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
} = useNotifications();
```

### useUserPreferences

```typescript
import { useUserPreferences } from "../hooks/use-user-preferences";

const { preferences, updatePreferences, resetPreferences } =
  useUserPreferences();
```

### useMenuFilters

```typescript
import { useMenuFilters } from "../hooks/use-menu-filters";

const { filters, updateFilters, resetFilters } = useMenuFilters();
```

## 🧩 Componentes

### FavoriteButton

```typescript
import { FavoriteButton } from "../components/favorite-button";

<FavoriteButton
  itemId="dish-123"
  itemType="dish"
  onToggle={(isFavorite) => console.log(isFavorite)}
/>;
```

### OrderSummary

```typescript
import { OrderSummary } from "../components/order-summary";

<OrderSummary
  cartItems={cartItems}
  totalPrice={totalPrice}
  onOrderComplete={(orderId) => console.log(orderId)}
/>;
```

## 🔧 Debug

### Verificar Dados AsyncStorage

```typescript
// Tema
const theme = await storageService.getTheme();
console.log("Tema:", theme);

// Carrinho
const cart = await storageService.getCart();
console.log("Carrinho:", cart);

// Preferências
const prefs = await storageService.getUserPreferences();
console.log("Preferências:", prefs);
```

### Verificar Dados SQLite

```typescript
// Pedidos
const orders = await databaseService.getOrders();
console.log("Total de pedidos:", orders.length);

// Notificações
const notifications = await databaseService.getNotifications();
console.log("Total de notificações:", notifications.length);

// Estatísticas
const stats = await databaseService.getOrderStatistics();
console.log("Estatísticas:", stats);
```

### Dados de Exemplo

```typescript
import {
  populateSampleData,
  clearAllData,
  exportAllData,
} from "../utils/sample-data";

// Popular dados
await populateSampleData();

// Limpar tudo
await clearAllData();

// Exportar dados
const data = await exportAllData();
console.log(data);
```

## 📱 Exemplos Práticos

### Finalizar Pedido

```typescript
const handleFinishOrder = async () => {
  const order = {
    id: generateOrderId(),
    restaurantId: "rest-123",
    restaurantName: "Restaurante",
    totalAmount: 45.9,
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
  }));

  const success = await saveOrder(order, orderItems);

  if (success) {
    await createOrderUpdateNotification(
      order.id,
      "confirmed",
      order.restaurantName
    );
    await storageService.clearCart();
  }
};
```

### Adicionar aos Favoritos

```typescript
const handleToggleFavorite = async (dishId: string) => {
  const isFavorite = await storageService.isFavorite(dishId, "dish");

  if (isFavorite) {
    await storageService.removeFavorite(dishId, "dish");
  } else {
    await storageService.addFavorite(dishId, "dish");
  }
};
```

### Mudar Tema

```typescript
const handleThemeChange = async (newTheme: "dark" | "light" | "system") => {
  await storageService.setTheme(newTheme);
  // O ThemeProvider vai detectar a mudança automaticamente
};
```

## ⚡ Comandos Rápidos

### Verificar Status do Sistema

```typescript
// Verificar se tudo está funcionando
const checkSystem = async () => {
  try {
    // AsyncStorage
    const theme = await storageService.getTheme();
    const cart = await storageService.getCart();

    // SQLite
    const orders = await databaseService.getOrders(1);
    const notifications = await databaseService.getNotifications(1);

    console.log("✅ Sistema funcionando:", {
      theme,
      cartItems: cart.length,
      ordersCount: orders.length,
      notificationsCount: notifications.length,
    });
  } catch (error) {
    console.error("❌ Erro no sistema:", error);
  }
};
```

### Limpar Tudo

```typescript
const clearEverything = async () => {
  // AsyncStorage
  await storageService.clearAll();

  // SQLite
  await databaseService.clearAllData();

  console.log("🧹 Todos os dados foram limpos");
};
```

### Backup Rápido

```typescript
const quickBackup = async () => {
  // AsyncStorage
  const storageData = await storageService.exportData();

  // SQLite
  const dbData = await databaseService.exportData();

  const backup = {
    timestamp: new Date().toISOString(),
    storage: storageData,
    database: dbData,
  };

  console.log("💾 Backup criado:", backup);
  return backup;
};
```

---

## 🎯 Dicas Rápidas

1. **Sempre inicialize o SQLite** no `App.tsx`
2. **Use try/catch** para operações de banco
3. **Prefira hooks** sobre chamadas diretas aos serviços
4. **Teste com dados de exemplo** antes de usar dados reais
5. **Verifique logs** no console para debug

## 📞 Suporte Rápido

- **Erro de inicialização**: Verifique se `expo-sqlite` está instalado
- **Dados não salvos**: Confirme se o banco foi inicializado
- **Performance lenta**: Use LIMIT/OFFSET para paginação
- **Dados corrompidos**: Use `clearAllData()` e recomece

---

**🚀 Sistema pronto para uso!**
