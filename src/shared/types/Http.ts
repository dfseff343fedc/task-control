import { ServerResponse } from 'node:http';
import { ExtendedRequest } from '../../infrastructure/http/middlewares/index.js';

export interface Route {
  method: string;
  path: RegExp;
  handler: RouteHandler;
}

export type RouteHandler = (
  req: ExtendedRequest, 
  res: ServerResponse, 
  params?: RouteParams
) => Promise<void> | void;

export interface RouteParams {
  [key: string]: string;
}

export interface RouteDefinition {
  method: HttpMethod;
  path: string;
  handler: RouteHandler;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
