import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/index.js';

export class DatabaseController {
  /**
   * Retorna informações do banco de dados
   * GET /database/info
   */
  public async getDatabaseInfo(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    // Acessar database através do contexto da requisição
    const database = (req as any).database;
    
    if (!database) {
      res.writeHead(500);
      res.end(JSON.stringify({ 
        error: 'Database not available',
        message: 'Database instance not found in request context'
      }));
      return;
    }

    const dbInfo = database.getInfo();
    
    res.writeHead(200);
    res.end(JSON.stringify({
      message: '🗄️ Database Information',
      database: {
        path: dbInfo.path,
        initialized: dbInfo.initialized,
        tables: dbInfo.tables,
        totalRecords: dbInfo.totalRecords,
        tablesDetail: dbInfo.tables.reduce((detail: any, tableName: string) => {
          const records = database.select(tableName);
          detail[tableName] = {
            count: records.length,
            sample: records.slice(0, 2) // Mostrar apenas 2 registros como exemplo
          };
          return detail;
        }, {})
      },
      timestamp: new Date().toISOString()
    }, null, 2));
  }

  /**
   * Testa operações CRUD no banco
   * POST /database/test
   */
  public async testDatabaseOperations(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const database = (req as any).database;
    
    if (!database) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database not available' }));
      return;
    }

    try {
      const testTable = 'test_records';
      const testRecord = {
        id: `test-${Date.now()}`,
        name: 'Test Record',
        description: 'This is a test record for database validation',
        created_at: new Date().toISOString(),
        metadata: {
          source: 'database-controller',
          test: true
        }
      };

      // Teste de INSERT
      await database.insert(testTable, testRecord);
      
      // Teste de SELECT
      const allRecords = database.select(testTable);
      const specificRecord = database.select(testTable, { id: testRecord.id });
      
      // Teste de UPDATE
      await database.update(testTable, testRecord.id, {
        description: 'Updated test record',
        updated_at: new Date().toISOString()
      });
      
      const updatedRecord = database.select(testTable, { id: testRecord.id });

      res.writeHead(200);
      res.end(JSON.stringify({
        message: '✅ Database CRUD operations test successful',
        operations: {
          insert: { success: true, record: testRecord },
          selectAll: { success: true, count: allRecords.length },
          selectSpecific: { success: true, found: specificRecord.length > 0 },
          update: { success: true, updated: updatedRecord[0] }
        },
        database: database.getInfo(),
        timestamp: new Date().toISOString()
      }, null, 2));

    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Database test failed',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      }));
    }
  }

  /**
   * Limpa dados de teste
   * DELETE /database/test
   */
  public async cleanTestData(req: ExtendedRequest, res: ServerResponse): Promise<void> {
    const database = (req as any).database;
    
    if (!database) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Database not available' }));
      return;
    }

    try {
      const testTable = 'test_records';
      const recordsBefore = database.select(testTable);
      
      await database.clear(testTable);
      
      const recordsAfter = database.select(testTable);

      res.writeHead(200);
      res.end(JSON.stringify({
        message: '🗑️ Test data cleaned successfully',
        cleaned: {
          table: testTable,
          recordsBefore: recordsBefore.length,
          recordsAfter: recordsAfter.length
        },
        database: database.getInfo(),
        timestamp: new Date().toISOString()
      }, null, 2));

    } catch (error) {
      res.writeHead(500);
      res.end(JSON.stringify({
        error: 'Failed to clean test data',
        message: (error as Error).message,
        timestamp: new Date().toISOString()
      }));
    }
  }
}
