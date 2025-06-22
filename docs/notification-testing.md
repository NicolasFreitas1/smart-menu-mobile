# 🧪 Guia de Teste de Notificações

Este guia explica como testar o sistema de notificações do Smart Menu Mobile.

## 📱 Como Testar

### 1. **Acesse a Tela de Reservas**

- Navegue para a tela "Reservas" no app
- Role para baixo até encontrar a seção "Teste de Notificações"

### 2. **Tipos de Teste Disponíveis**

#### **🔔 Notificação Imediata**

- **Botão**: "Imediata"
- **O que faz**: Envia uma notificação instantânea
- **Útil para**: Testar se as notificações estão funcionando

#### **⏰ Notificação Agendada**

- **Botão**: "Agendada (5s)"
- **O que faz**: Agenda uma notificação para 5 segundos
- **Útil para**: Testar notificações agendadas

#### **🎉 Reserva Criada**

- **Botão**: "Reserva Criada"
- **O que faz**: Simula notificação de reserva criada
- **Útil para**: Testar notificações de sucesso

#### **📅 Lembrete**

- **Botão**: "Lembrete"
- **O que faz**: Envia lembrete de reserva
- **Útil para**: Testar lembretes

#### **🚀 Reserva Completa**

- **Botão**: "Reserva Completa"
- **O que faz**: Testa todo o fluxo de notificações de reserva
- **Inclui**: Notificação imediata + lembretes agendados

#### **📍 Proximidade**

- **Botão**: "Proximidade"
- **O que faz**: Simula notificação de geofencing
- **Útil para**: Testar notificações por proximidade

#### **🧪 Todos os Testes**

- **Botão**: "Todos os Testes"
- **O que faz**: Executa todos os tipos de teste
- **Útil para**: Teste completo do sistema

#### **🗑️ Limpar Todas**

- **Botão**: "Limpar Todas"
- **O que faz**: Remove todas as notificações agendadas
- **Útil para**: Limpar notificações de teste

## 🔧 Configuração Necessária

### **Permissões**

1. **Notificações**: O app solicita permissão automaticamente
2. **Calendário**: Necessário para adicionar reservas ao calendário
3. **Localização**: Para notificações de proximidade

### **Configuração do Expo**

```json
{
  "expo": {
    "plugins": [["expo-notifications"], ["expo-calendar"], ["expo-location"]]
  }
}
```

## 📋 Fluxo de Notificações de Reserva

### **1. Criação de Reserva**

```typescript
// Notificação imediata
await pushNotificationService.sendLocalNotification({
  title: "Reserva Criada com Sucesso! 🎉",
  body: "Sua reserva foi confirmada e adicionada ao seu calendário.",
  data: { type: "reservation_created" },
});
```

### **2. Lembretes Automáticos**

- **1 dia antes**: "Lembrete de Reserva - Amanhã 📅"
- **1 hora antes**: "Lembrete de Reserva - 1 hora ⏰"
- **15 minutos antes**: "Sua reserva está chegando! 🚀"

### **3. Notificações de Status**

- **Confirmada**: "Reserva Confirmada! ✅"
- **Cancelada**: "Reserva Cancelada ❌"

## 🐛 Solução de Problemas

### **Notificações não aparecem**

1. Verifique se as permissões foram concedidas
2. Teste com "Notificação Imediata" primeiro
3. Verifique se o app está em primeiro plano

### **Notificações agendadas não funcionam**

1. Verifique se o dispositivo não está em modo de economia de bateria
2. Teste com intervalos maiores (ex: 1 minuto)
3. Verifique logs do console

### **Erro de permissão**

1. Vá em Configurações > Apps > Smart Menu > Notificações
2. Ative todas as permissões
3. Reinicie o app

## 📊 Logs de Debug

### **Console Logs**

```javascript
// Logs úteis para debug
console.log("🔔 Notificação enviada:", notificationData);
console.log("⏰ Notificação agendada para:", scheduledDate);
console.log("❌ Erro ao enviar notificação:", error);
```

### **Verificar Status**

```javascript
// Verificar se o serviço está inicializado
const token = pushNotificationService.getExpoPushToken();
console.log("Token de notificação:", token);
```

## 🎯 Casos de Uso Reais

### **Criar uma Reserva Real**

1. Preencha o formulário de reserva
2. Clique em "Criar Reserva"
3. Observe as notificações automáticas:
   - Notificação de sucesso imediata
   - Lembretes agendados automaticamente

### **Testar Geofencing**

1. Configure localização de restaurante
2. Ative monitoramento de localização
3. Aproxime-se do restaurante
4. Observe notificação de proximidade

## 🔄 Atualizações Futuras

### **Próximas Funcionalidades**

- [ ] Notificações push via servidor
- [ ] Personalização de horários de lembrete
- [ ] Notificações de promoções
- [ ] Integração com WhatsApp/Email

### **Melhorias Planejadas**

- [ ] Interface para gerenciar notificações
- [ ] Estatísticas de notificações
- [ ] Configurações de som/vibração
- [ ] Modo "Não perturbe"

---

**💡 Dica**: Use o botão "Todos os Testes" para verificar rapidamente se todo o sistema está funcionando corretamente!
