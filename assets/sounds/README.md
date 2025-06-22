# Sons de Notificação - Smart Menu

## Como Adicionar Sons Personalizados

Para adicionar sons personalizados às notificações:

1. **Formato**: Use arquivos `.wav` ou `.mp3`
2. **Tamanho**: Mantenha os arquivos pequenos (< 1MB)
3. **Duração**: Sons curtos (1-3 segundos)

## Sons Recomendados

### notification_success.wav

- **Uso**: Confirmações de reserva
- **Duração**: 1-2 segundos
- **Tom**: Alegre e positivo

### notification_reminder.wav

- **Uso**: Lembretes de reserva
- **Duração**: 2-3 segundos
- **Tom**: Suave e atencioso

### notification_proximity.wav

- **Uso**: Notificações de proximidade
- **Duração**: 1-2 segundos
- **Tom**: Atraente e curioso

### notification_update.wav

- **Uso**: Atualizações de pedido
- **Duração**: 1-2 segundos
- **Tom**: Informativo

### notification_promotion.wav

- **Uso**: Promoções e ofertas
- **Duração**: 2-3 segundos
- **Tom**: Empolgante e chamativo

## Configuração

Os sons são referenciados em:

```typescript
// src/config/notification-config.ts
export const NOTIFICATION_SOUNDS = {
  success: "notification_success.wav",
  reminder: "notification_reminder.wav",
  proximity: "notification_proximity.wav",
  update: "notification_update.wav",
  promotion: "notification_promotion.wav",
};
```

## Teste

Para testar os sons:

1. Adicione os arquivos de som nesta pasta
2. Use os botões de teste na tela de reservas
3. Verifique se os sons tocam corretamente

## Recursos Gratuitos

Você pode encontrar sons gratuitos em:

- [Freesound.org](https://freesound.org/)
- [Zapsplat](https://www.zapsplat.com/)
- [SoundBible](http://soundbible.com/)

## Nota

Certifique-se de que os sons não infringem direitos autorais e são adequados para uso comercial.
