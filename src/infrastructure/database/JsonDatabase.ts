import fs from 'node:fs/promises';
import path from 'node:path';

export interface DatabaseTable {
  [key: string]: any[];
}

export interface DatabaseOptions {
  filename?: string;
  directory?: string;
}

/**
 * Sistema de banco de dados em arquivo JSON
 * - Persistência automática em arquivo
 * - Carregamento inicial na inicialização
 * - Operações CRUD em memória com sync para arquivo
 * - Tratamento de erros e recuperação
 */
export class JsonDatabase {
  private database: DatabaseTable = {};
  private readonly databasePath: string;
  private isInitialized: boolean = false;
  private readonly options: Required<DatabaseOptions>;

  constructor(options: DatabaseOptions = {}) {
    this.options = {
      filename: options.filename || 'db.json',
      directory: options.directory || process.cwd()
    };
    
    this.databasePath = path.join(this.options.directory, this.options.filename);
  }

  /**
   * Inicializa o banco de dados
   * - Cria arquivo se não existir
   * - Carrega dados existentes
   */
  public async initialize(): Promise<void> {
    try {
      console.log('🗄️  Initializing JSON Database...');
      console.log(`   Path: ${this.databasePath}`);

      // Verificar se arquivo existe
      const fileExists = await this.fileExists();
      
      if (fileExists) {
        await this.loadFromFile();
        console.log(`✅ Database loaded from existing file`);
      } else {
        await this.createEmptyDatabase();
        console.log(`✅ Created new database file`);
      }

      this.isInitialized = true;
      console.log(`🗄️  Database ready with ${this.getTablesCount()} tables`);
      
    } catch (error) {
      console.error('❌ Failed to initialize database:', error);
      // Em caso de erro, inicializar com database vazio
      this.database = {};
      this.isInitialized = true;
      await this.persist();
    }
  }

  /**
   * Verifica se arquivo do banco existe
   */
  private async fileExists(): Promise<boolean> {
    try {
      await fs.access(this.databasePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Carrega dados do arquivo
   */
  private async loadFromFile(): Promise<void> {
    try {
      const data = await fs.readFile(this.databasePath, 'utf8');
      
      if (data.trim()) {
        this.database = JSON.parse(data);
      } else {
        this.database = {};
      }
    } catch (error) {
      console.warn('⚠️  Failed to parse database file, creating new:', error);
      this.database = {};
    }
  }

  /**
   * Cria arquivo vazio do banco
   */
  private async createEmptyDatabase(): Promise<void> {
    this.database = {};
    await this.persist();
  }

  /**
   * Persiste dados na memória para arquivo
   */
  private async persist(): Promise<void> {
    try {
      const data = JSON.stringify(this.database, null, 2);
      await fs.writeFile(this.databasePath, data, 'utf8');
    } catch (error) {
      console.error('❌ Failed to persist database:', error);
      throw error;
    }
  }

  /**
   * Seleciona dados de uma tabela
   */
  public select<T = any>(table: string, search?: Partial<T>): T[] {
    this.ensureInitialized();
    
    let data = this.database[table] || [];

    if (search) {
      data = data.filter(row => {
        return Object.entries(search).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          
          const rowValue = row[key];
          
          // Se o valor da busca é string, fazer busca parcial
          if (typeof value === 'string' && typeof rowValue === 'string') {
            return rowValue.toLowerCase().includes(value.toLowerCase());
          }
          
          // Comparação exata para outros tipos
          return rowValue === value;
        });
      });
    }

    return data as T[];
  }

  /**
   * Insere novo registro na tabela
   */
  public async insert<T = any>(table: string, data: T): Promise<T> {
    this.ensureInitialized();

    if (!Array.isArray(this.database[table])) {
      this.database[table] = [];
    }

    this.database[table].push(data);
    await this.persist();

    return data;
  }

  /**
   * Atualiza registro na tabela
   */
  public async update<T = any>(table: string, id: string, data: Partial<T>): Promise<boolean> {
    this.ensureInitialized();

    if (!this.database[table]) {
      return false;
    }

    const rowIndex = this.database[table].findIndex((row: any) => row.id === id);

    if (rowIndex === -1) {
      return false;
    }

    const currentRow = this.database[table][rowIndex];
    this.database[table][rowIndex] = { 
      ...currentRow, 
      ...data,
      id // Garantir que ID não seja sobrescrito
    };

    await this.persist();
    return true;
  }

  /**
   * Remove registro da tabela
   */
  public async delete(table: string, id: string): Promise<boolean> {
    this.ensureInitialized();

    if (!this.database[table]) {
      return false;
    }

    const rowIndex = this.database[table].findIndex((row: any) => row.id === id);

    if (rowIndex === -1) {
      return false;
    }

    this.database[table].splice(rowIndex, 1);
    await this.persist();
    return true;
  }

  /**
   * Limpa todos os dados de uma tabela
   */
  public async clear(table: string): Promise<void> {
    this.ensureInitialized();
    this.database[table] = [];
    await this.persist();
  }

  /**
   * Remove uma tabela completamente
   */
  public async dropTable(table: string): Promise<void> {
    this.ensureInitialized();
    delete this.database[table];
    await this.persist();
  }

  /**
   * Retorna informações do banco
   */
  public getInfo() {
    return {
      path: this.databasePath,
      tables: Object.keys(this.database),
      totalRecords: Object.values(this.database).reduce((sum, table) => sum + table.length, 0),
      initialized: this.isInitialized
    };
  }

  /**
   * Conta número de tabelas
   */
  private getTablesCount(): number {
    return Object.keys(this.database).length;
  }

  /**
   * Garante que o banco foi inicializado
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  /**
   * Força sincronização manual (útil para testes)
   */
  public async forceSync(): Promise<void> {
    await this.persist();
  }
}
