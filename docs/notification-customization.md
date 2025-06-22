# 🎨 Personalização de Notificações

Este guia explica como personalizar completamente as notificações do Smart Menu Mobile, **removendo a aparência padrão do Expo Go**.

## 🚀 **Diferenças do Expo Go**

### **❌ Expo Go (Padrão)**

- Notificações genéricas
- Som padrão do sistema
- Sem personalização visual
- Comportamento básico

### **✅ Smart Menu (Personalizado)**

- **Ícones específicos** por tipo
- **Cores personalizadas**
- **Sons customizados**
- **Prioridades diferentes**
- **Badges inteligentes**
- **Vibração configurável**

## 🎯 **Tipos de Notificação Personalizados**

### **1. Reserva Criada** 🎉

```typescript
{
  icon: '🎉',
  color: '#10b981', // Verde
  sound: 'notification_success.wav',
  priority: 'high',
  badge: true,
  vibration: true,
}
```

### **2. Lembrete de Reserva** ⏰

```typescript
{
  icon: '⏰',
  color: '#f59e0b', // Âmbar
  sound: 'notification_reminder.wav',
  priority: 'high',
  badge: true,
  vibration: true,
}
```

### **3. Proximidade** 📍

```typescript
{
  icon: '📍',
  color: '#3b82f6', // Azul
  sound: 'notification_proximity.wav',
  priority: 'normal',
  badge: false,
  vibration: true,
}
```

### **4. Atualização de Pedido** 📋

```typescript
{
  icon: '📋',
  color: '#8b5cf6', // Violeta
  sound: 'notification_update.wav',
  priority: 'normal',
  badge: true,
  vibration: false,
}
```

### **5. Promoção** 🎊

```typescript
{
  icon: '🎊',
  color: '#ec4899', // Rosa
  sound: 'notification_promotion.wav',
  priority: 'normal',
  badge: false,
  vibration: true,
}
```

## 🔧 **Como Personalizar**

### **1. Configuração de Estilos**

Edite `src/config/notification-config.ts`:

```typescript
export const NOTIFICATION_STYLES = {
  reservation_created: {
    icon: "🎉",
    color: "#10b981",
    sound: "notification_success.wav",
    priority: "high",
    badge: true,
    vibration: true,
  },
  // Adicione mais estilos...
};
```

### **2. Sons Personalizados**

Adicione arquivos de som em `assets/sounds/`:

```typescript
export const NOTIFICATION_SOUNDS = {
  success: "notification_success.wav",
  reminder: "notification_reminder.wav",
  proximity: "notification_proximity.wav",
  // Mais sons...
};
```

### **3. Padrões de Vibração**

```typescript
export const VIBRATION_PATTERNS = {
  short: [0, 100],
  medium: [0, 200, 100, 200],
  long: [0, 300, 100, 300, 100, 300],
  urgent: [0, 100, 50, 100, 50, 100, 50, 100],
};
```

## 🎨 **Personalizações Visuais**

### **Cores por Tipo**

- **Verde** (#10b981): Sucesso, confirmação
- **Âmbar** (#f59e0b): Lembretes, alertas
- **Azul** (#3b82f6): Informações, proximidade
- **Violeta** (#8b5cf6): Atualizações, pedidos
- **Rosa** (#ec4899): Promoções, ofertas
- **Vermelho** (#ef4444): Erros, cancelamentos

### **Ícones Contextuais**

- 🎉 **Sucesso**: Reserva criada, confirmação
- ⏰ **Tempo**: Lembretes, agendamentos
- 📍 **Localização**: Proximidade, geofencing
- 📋 **Pedidos**: Atualizações, status
- 🎊 **Promoções**: Ofertas, descontos
- ✅ **Confirmação**: Ações bem-sucedidas
- ❌ **Cancelamento**: Ações canceladas

## 🔊 **Sons Personalizados**

### **Como Adicionar Sons**

1. **Crie arquivos de som** em `assets/sounds/`
2. **Formatos suportados**: `.wav`, `.mp3`, `.aiff`
3. **Tamanho recomendado**: < 1MB
4. **Duração**: 1-3 segundos

### **Sons Recomendados**

- `notification_success.wav`: Som suave e positivo
- `notification_reminder.wav`: Som de alerta
- `notification_proximity.wav`: Som discreto
- `notification_update.wav`: Som informativo
- `notification_promotion.wav`: Som chamativo

## 📱 **Comportamento por Plataforma**

### **iOS**

- **Badges**: Suportados nativamente
- **Sons**: Arquivos personalizados
- **Vibração**: Padrões customizados
- **Prioridade**: Alta, normal, baixa

### **Android**

- **Badges**: Suportados via launcher
- **Sons**: Arquivos personalizados
- **Vibração**: Padrões customizados
- **Canais**: Configuração automática

## 🧪 **Testando Personalizações**

### **Botões de Teste Disponíveis**

1. **Imediata**: Notificação instantânea
2. **Agendada (5s)**: Notificação futura
3. **Reserva Criada**: Fluxo completo
4. **Lembrete**: Teste de lembretes
5. **Reserva Completa**: Todos os tipos
6. **Proximidade**: Geofencing
7. **Teste de Estilos**: Todos os estilos
8. **Teste de Pedido**: Atualizações
9. **Teste de Promoção**: Ofertas
10. **Todos os Testes**: Teste completo
11. **Limpar Todas**: Limpeza

### **Como Testar**

```typescript
// Teste específico
await NotificationTester.testNotificationStyles();

// Teste completo
await NotificationTester.testAllNotifications();

// Limpar notificações
await NotificationTester.clearAllScheduledNotifications();
```

## ⚙️ **Configurações Avançadas**

### **Prioridades**

```typescript
export const PRIORITY_CONFIG = {
  reservation_reminder: "high", // Lembretes importantes
  reservation_created: "high", // Confirmações importantes
  order_update: "normal", // Atualizações normais
  proximity: "normal", // Proximidade normal
  promotion: "normal", // Promoções normais
  test: "default", // Testes padrão
};
```

### **Agendamento Inteligente**

```typescript
export const SCHEDULING_CONFIG = {
  reminder_intervals: {
    one_day: 24 * 60 * 60 * 1000, // 1 dia
    one_hour: 60 * 60 * 1000, // 1 hora
    fifteen_minutes: 15 * 60 * 1000, // 15 minutos
  },
  max_scheduled_notifications: 10,
  auto_cleanup_old: true,
  cleanup_after_days: 7,
};
```

### **Geofencing**

```typescript
export const GEOFENCING_CONFIG = {
  default_radius: 500, // 500 metros
  min_radius: 100, // Mínimo 100m
  max_radius: 2000, // Máximo 2km
  check_interval: 30000, // 30 segundos
  notification_cooldown: 300000, // 5 minutos
};
```

## 🎯 **Casos de Uso Reais**

### **Fluxo de Reserva**

1. **Criação**: Notificação verde com ícone 🎉
2. **Lembrete 1 dia**: Notificação âmbar com ícone ⏰
3. **Lembrete 1 hora**: Notificação âmbar com ícone ⏰
4. **Lembrete 15 min**: Notificação âmbar com ícone 🚀

### **Fluxo de Pedido**

1. **Confirmação**: Notificação violeta com ícone 📋
2. **Preparação**: Notificação violeta com ícone 📋
3. **Pronto**: Notificação violeta com ícone 📋

### **Geofencing**

1. **Entrada na área**: Notificação azul com ícone 📍
2. **Promoção**: Notificação rosa com ícone 🎊

## 🔄 **Próximas Melhorias**

### **Funcionalidades Planejadas**

- [ ] **Notificações push** via servidor
- [ ] **Sons dinâmicos** baseados no contexto
- [ ] **Temas de notificação** (claro/escuro)
- [ ] **Configuração pelo usuário**
- [ ] **Integração com WhatsApp**
- [ ] **Notificações em lote**

### **Personalizações Futuras**

- [ ] **Animações** nas notificações
- [ ] **Imagens** nas notificações
- [ ] **Ações rápidas** (botões)
- [ ] **Respostas** por voz
- [ ] **Notificações silenciosas**

---

**💡 Dica**: As notificações agora são **completamente personalizadas** e **não parecem mais com o Expo Go**! Cada tipo tem sua própria identidade visual e sonora.
