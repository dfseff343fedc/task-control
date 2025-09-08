import { IncomingMessage } from 'node:http';
import { ListTasksRequest } from '../../application/dtos/ListTasksDTO.js';

export interface QueryParams {
  [key: string]: string | string[] | undefined;
}

export class QueryParamsUtils {
  /**
   * Extrai query parameters de uma URL
   */
  public static extractFromRequest(req: IncomingMessage): QueryParams {
    if (!req.url) {
      return {};
    }

    const url = new URL(req.url, `http://localhost:3333`);
    const params: QueryParams = {};

    url.searchParams.forEach((value, key) => {
      // Se o parâmetro já existe, converte para array
      if (params[key]) {
        if (Array.isArray(params[key])) {
          (params[key] as string[]).push(value);
        } else {
          params[key] = [params[key] as string, value];
        }
      } else {
        params[key] = value;
      }
    });

    return params;
  }

  /**
   * Converte string para número (opcional)
   */
  public static toNumber(value: string | string[] | undefined): number | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const num = parseInt(value, 10);
    return isNaN(num) ? undefined : num;
  }

  /**
   * Converte string para boolean (opcional)
   */
  public static toBoolean(value: string | string[] | undefined): boolean | undefined {
    if (typeof value !== 'string') {
      return undefined;
    }

    const lowerValue = value.toLowerCase();
    if (lowerValue === 'true' || lowerValue === '1') {
      return true;
    }
    if (lowerValue === 'false' || lowerValue === '0') {
      return false;
    }

    return undefined;
  }

  /**
   * Converte string para string (com fallback)
   */
  public static toString(value: string | string[] | undefined, fallback?: string): string | undefined {
    if (typeof value === 'string' && value.trim() !== '') {
      return value.trim();
    }
    
    return fallback;
  }

  /**
   * Valida se um número está dentro de um range
   */
  public static validateNumberRange(
    value: number | undefined, 
    min: number = 1, 
    max: number = 100,
    defaultValue?: number
  ): number | undefined {
    if (value === undefined) {
      return defaultValue;
    }

    if (value < min || value > max) {
      return defaultValue;
    }

    return value;
  }

  /**
   * Utilitário específico para paginação
   */
  public static extractPaginationParams(req: IncomingMessage) {
    const params = this.extractFromRequest(req);
    
    return {
      page: this.validateNumberRange(this.toNumber(params['page']), 1, 1000, 1),
      limit: this.validateNumberRange(this.toNumber(params['limit']), 1, 100, 10)
    };
  }

  /**
   * Utilitário específico para filtros de busca
   */
  public static extractSearchParams(req: IncomingMessage) {
    const params = this.extractFromRequest(req);
    
    return {
      search: this.toString(params['search']),
      completed: this.toBoolean(params['completed'])
    };
  }

  /**
   * Utilitário completo para ListTasks
   */
  public static extractListTasksParams(req: IncomingMessage): ListTasksRequest {
    const pagination = this.extractPaginationParams(req);
    const search = this.extractSearchParams(req);

    // Filtra valores undefined para compatibilidade com exactOptionalPropertyTypes
    const result: ListTasksRequest = {};

    if (pagination.page !== undefined) result.page = pagination.page;
    if (pagination.limit !== undefined) result.limit = pagination.limit;
    if (search.search !== undefined) result.search = search.search;
    if (search.completed !== undefined) result.completed = search.completed;

    return result;
  }
}
