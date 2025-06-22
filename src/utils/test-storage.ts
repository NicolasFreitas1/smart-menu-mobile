import { storageService } from '../services/storage';
import { offlineSyncService } from '../services/offline-sync';
import { StorageCleanup } from './storage-cleanup';

/**
 * Script de teste para verificar o funcionamento do storage
 */
export class StorageTester {
  
  /**
   * Testar operações básicas do storage
   */
  static async testBasicOperations(): Promise<void> {
    console.log('🧪 Testando operações básicas do storage...');
    
    try {
      // Teste 1: Salvar e recuperar string
      await storageService.setItem('test_string', 'Hello World');
      const stringResult = await storageService.getItem('test_string');
      console.log('✅ String test:', stringResult === 'Hello World' ? 'PASS' : 'FAIL');
      
      // Teste 2: Salvar e recuperar objeto
      const testObject = { name: 'Test', value: 123 };
      await storageService.setItem('test_object', testObject);
      const objectResult = await storageService.getItem('test_object');
      console.log('✅ Object test:', JSON.stringify(objectResult) === JSON.stringify(testObject) ? 'PASS' : 'FAIL');
      
      // Teste 3: Salvar e recuperar array
      const testArray = [1, 2, 3, 'test'];
      await storageService.setItem('test_array', testArray);
      const arrayResult = await storageService.getItem('test_array');
      console.log('✅ Array test:', JSON.stringify(arrayResult) === JSON.stringify(testArray) ? 'PASS' : 'FAIL');
      
      // Limpar dados de teste
      await storageService.removeItem('test_string');
      await storageService.removeItem('test_object');
      await storageService.removeItem('test_array');
      
      console.log('✅ Operações básicas testadas com sucesso');
    } catch (error) {
      console.error('❌ Erro no teste básico:', error);
    }
  }

  /**
   * Testar sincronização offline
   */
  static async testOfflineSync(): Promise<void> {
    console.log('🧪 Testando sincronização offline...');
    
    try {
      // Teste 1: Inicializar serviço
      await offlineSyncService.initialize();
      console.log('✅ Inicialização: PASS');
      
      // Teste 2: Verificar status
      const status = offlineSyncService.getSyncStatus();
      console.log('✅ Status:', status);
      
      // Teste 3: Verificar se dados estão obsoletos
      const isStale = await offlineSyncService.isDataStale(1); // 1 minuto
      console.log('✅ Dados obsoletos:', isStale);
      
      // Teste 4: Adicionar ação pendente
      await offlineSyncService.addPendingAction('test_action', { test: true });
      console.log('✅ Ação pendente adicionada');
      
      console.log('✅ Sincronização offline testada com sucesso');
    } catch (error) {
      console.error('❌ Erro no teste de sincronização:', error);
    }
  }

  /**
   * Testar limpeza do storage
   */
  static async testCleanup(): Promise<void> {
    console.log('🧪 Testando limpeza do storage...');
    
    try {
      // Teste 1: Verificar tamanho antes
      await StorageCleanup.checkStorageSize();
      
      // Teste 2: Fazer backup
      const backup = await StorageCleanup.backupImportantData();
      console.log('✅ Backup criado:', backup ? 'PASS' : 'FAIL');
      
      // Teste 3: Limpeza completa
      await StorageCleanup.fullCleanup();
      console.log('✅ Limpeza completa: PASS');
      
      // Teste 4: Verificar tamanho depois
      await StorageCleanup.checkStorageSize();
      
      // Teste 5: Restaurar backup
      if (backup) {
        await StorageCleanup.restoreFromBackup(backup);
        console.log('✅ Restauração: PASS');
      }
      
      console.log('✅ Limpeza testada com sucesso');
    } catch (error) {
      console.error('❌ Erro no teste de limpeza:', error);
    }
  }

  /**
   * Testar cenários de erro
   */
  static async testErrorScenarios(): Promise<void> {
    console.log('🧪 Testando cenários de erro...');
    
    try {
      // Teste 1: Tentar recuperar item inexistente
      const nonExistent = await storageService.getItem('non_existent_key');
      console.log('✅ Item inexistente:', nonExistent === null ? 'PASS' : 'FAIL');
      
      // Teste 2: Tentar salvar valor null
      await storageService.setItem('test_null', null as any);
      const nullResult = await storageService.getItem('test_null');
      console.log('✅ Valor null:', nullResult === null ? 'PASS' : 'FAIL');
      
      // Teste 3: Tentar salvar valor undefined
      await storageService.setItem('test_undefined', undefined as any);
      const undefinedResult = await storageService.getItem('test_undefined');
      console.log('✅ Valor undefined:', undefinedResult === null ? 'PASS' : 'FAIL');
      
      // Limpar dados de teste
      await storageService.removeItem('test_null');
      await storageService.removeItem('test_undefined');
      
      console.log('✅ Cenários de erro testados com sucesso');
    } catch (error) {
      console.error('❌ Erro no teste de cenários:', error);
    }
  }

  /**
   * Executar todos os testes
   */
  static async runAllTests(): Promise<void> {
    console.log('🚀 Iniciando testes do storage...');
    console.log('=' .repeat(50));
    
    await this.testBasicOperations();
    console.log('-'.repeat(30));
    
    await this.testOfflineSync();
    console.log('-'.repeat(30));
    
    await this.testCleanup();
    console.log('-'.repeat(30));
    
    await this.testErrorScenarios();
    console.log('-'.repeat(30));
    
    console.log('🎉 Todos os testes concluídos!');
    console.log('=' .repeat(50));
  }
}

/**
 * Função de conveniência para executar testes
 */
export const testStorage = async (): Promise<void> => {
  await StorageTester.runAllTests();
}; 