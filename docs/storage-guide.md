# Guia de Armazenamento Local - Smart Menu Mobile

Este guia explica como usar o sistema de armazenamento local implementado na aplicação Smart Menu Mobile.

## Visão Geral

O sistema de storage local utiliza o `AsyncStorage` do React Native para persistir dados no dispositivo do usuário. Foi criado um serviço centralizado (`StorageService`) que facilita o gerenciamento de todos os dados locais.

## Estrutura do Sistema

### 1. Serviço de Storage (`src/services/storage.ts`)

O `StorageService` é a classe principal que gerencia todo o armazenamento local. Ela oferece:

- **Métodos genéricos**: `getItem`, `setItem`, `removeItem`, `clear`
- **Métodos específicos**: Para cada tipo de dado (tema, carrinho, autenticação, etc.)
- **Tratamento de erros**: Logs automáticos e tratamento de exceções
- **Tipagem TypeScript**: Suporte completo a tipos

### 2. Chaves de Armazenamento

Todas as chaves estão centralizadas no objeto `STORAGE_KEYS`:

```typescript
export const STORAGE_KEYS = {
  THEME: "@smart-menu:theme",
  CART: "@smart-menu:cart",
  AUTH_TOKEN: "@smart-menu:auth:token",
  USER: "@smart-menu:auth:user",
  RESTAURANT_HISTORY: "@smart-menu:restaurant:history",
  USER_PREFERENCES: "@smart-menu:user:preferences",
  LAST_VISITED_RESTAURANT: "@smart-menu:restaurant:last-visited",
} as const;
```

## Como Usar

### 1. Importando o Serviço

```typescript
import { storageService } from "../services/storage";
```

### 2. Operações Básicas

#### Salvar Dados

```typescript
// Salvar um valor simples
await storageService.setItem("minha-chave", "meu-valor");

// Salvar um objeto
await storageService.setItem("usuario", { id: 1, nome: "João" });
```

#### Ler Dados

```typescript
// Ler um valor simples
const valor = await storageService.getItem<string>("minha-chave");

// Ler um objeto
const usuario = await storageService.getItem<Usuario>("usuario");
```

#### Remover Dados

```typescript
await storageService.removeItem("minha-chave");
```

#### Limpar Tudo

```typescript
await storageService.clear();
```

### 3. Usando Métodos Específicos

#### Tema

```typescript
// Salvar tema
await storageService.setTheme("dark");

// Carregar tema
const tema = await storageService.getTheme();
```

#### Carrinho

```typescript
// Salvar carrinho
await storageService.setCart(items);r

// Carregar carrinho
const carrinho = await storageService.getCart();
```

#### Autenticação

```typescript
// Salvar token e usuário
await storageService.setAuthToken("token-jwt");
await storageService.setUser({ id: 1, nome: "João" });

// Limpar dados de autenticação
await storageService.clearAuth();
```

#### Preferências do Usuário

```typescript
// Salvar preferências
await storageService.setUserPreferences({
  favoriteCategories: ["pizza", "hamburger"],
  dietaryRestrictions: ["vegetariano"],
  language: "pt-BR",
  notifications: {
    orderUpdates: true,
    promotions: false,
    newItems: true,
  },
});

// Atualizar preferências
await storageService.updateUserPreferences({
  language: "en",
});
```

#### Histórico de Restaurantes

```typescript
// Adicionar restaurante ao histórico
await storageService.addRestaurantToHistory({
  id: "rest-123",
  name: "Restaurante Exemplo",
});

// Carregar histórico
const historico = await storageService.getRestaurantHistory();
```

### 4. Usando Hooks

#### Hook de Preferências do Usuário

```typescript
import { useUserPreferences } from "../hooks/use-user-preferences";

function MeuComponente() {
  const {
    preferences,
    isLoading,
    updatePreferences,
    addFavoriteCategory,
    removeFavoriteCategory,
    setLanguage,
  } = useUserPreferences();

  // Usar as preferências
  if (isLoading) return <Loading />;

  return (
    <View>
      <Text>Idioma: {preferences.language}</Text>
      <Button onPress={() => setLanguage("en")} title="Mudar para Inglês" />
    </View>
  );
}
```

#### Hook de Filtros de Menu

```typescript
import { useMenuFilters } from "../hooks/use-menu-filters";

function MenuScreen() {
  const {
    filters,
    addCategory,
    removeCategory,
    updatePriceRange,
    applyFilters,
  } = useMenuFilters();

  // Aplicar filtros aos pratos
  const pratosFiltrados = applyFilters(pratos);

  return (
    <View>
      {pratosFiltrados.map((prato) => (
        <PratoItem key={prato.id} prato={prato} />
      ))}
    </View>
  );
}
```

## Contextos Atualizados

### 1. ThemeProvider

- Usa `storageService.getTheme()` e `storageService.setTheme()`
- Persiste automaticamente as mudanças de tema

### 2. CartContext

- Usa `storageService.getCart()` e `storageService.setCart()`
- Salva automaticamente o carrinho quando há mudanças

### 3. AuthContext

- Usa métodos específicos para token e usuário
- Limpa dados automaticamente no logout

### 4. RestaurantContext

- Adiciona restaurantes ao histórico automaticamente
- Mantém registro do último restaurante visitado

## Exemplo Prático: Tela de Configurações

A tela `SettingsScreen` demonstra o uso completo do sistema:

```typescript
export function SettingsScreen() {
  const { theme, setTheme } = useTheme();
  const { preferences, updateNotificationSettings } = useUserPreferences();
  const [storageInfo, setStorageInfo] = useState(null);

  // Carregar informações do storage
  useEffect(() => {
    storageService.getStorageInfo().then(setStorageInfo);
  }, []);

  // Mudar tema
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme); // Salva automaticamente
  };

  // Mudar configurações de notificação
  const handleNotificationChange = (key, value) => {
    updateNotificationSettings({ [key]: value });
  };

  return <ScrollView>{/* Interface de configurações */}</ScrollView>;
}
```

## Boas Práticas

### 1. Tratamento de Erros

Sempre use try-catch ao trabalhar com storage:

```typescript
try {
  await storageService.setItem("chave", valor);
} catch (error) {
  console.error("Erro ao salvar:", error);
  // Tratar erro adequadamente
}
```

### 2. Carregamento Assíncrono

Dados do storage são carregados de forma assíncrona. Sempre verifique se os dados foram carregados:

```typescript
const [isLoading, setIsLoading] = useState(true);
const [data, setData] = useState(null);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const savedData = await storageService.getItem("chave");
    setData(savedData);
  } catch (error) {
    console.error("Erro ao carregar:", error);
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Validação de Dados

Sempre valide os dados carregados do storage:

```typescript
const savedData = await storageService.getItem("chave");
if (savedData && typeof savedData === "object") {
  // Usar dados
}
```

### 4. Limpeza de Dados

Implemente funcionalidade para limpar dados quando necessário:

```typescript
const handleClearData = async () => {
  try {
    await storageService.clear();
    Alert.alert("Sucesso", "Dados limpos com sucesso");
  } catch (error) {
    Alert.alert("Erro", "Não foi possível limpar os dados");
  }
};
```

## Monitoramento e Debug

### 1. Informações de Storage

```typescript
const info = await storageService.getStorageInfo();
console.log(`Uso: ${info.used} bytes de ${info.total} bytes`);
```

### 2. Logs Automáticos

O sistema já inclui logs automáticos para erros. Verifique o console para debug.

### 3. Migração de Dados

Para futuras atualizações, use o método de migração:

```typescript
await storageService.migrateData();
```

## Considerações de Performance

1. **Evite operações síncronas**: AsyncStorage é assíncrono por design
2. **Cache dados em memória**: Use state local para dados frequentemente acessados
3. **Limpe dados antigos**: Implemente limpeza periódica de dados não utilizados
4. **Monitore uso**: Verifique regularmente o uso de storage

## Conclusão

O sistema de storage local fornece uma base sólida para persistir dados no dispositivo do usuário. Com o `StorageService` centralizado, é fácil gerenciar diferentes tipos de dados de forma consistente e segura.

Para dúvidas ou sugestões de melhorias, consulte a documentação do AsyncStorage ou entre em contato com a equipe de desenvolvimento.
