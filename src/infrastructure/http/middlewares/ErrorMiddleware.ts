import { ServerResponse } from 'node:http';
import { ExtendedRequest } from './JsonMiddleware.js';

export interface ErrorWithStatus extends Error {
  statusCode?: number;
  code?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path?: string | undefined;
}


export const errorMiddleware = (error: ErrorWithStatus, req: ExtendedRequest, res: ServerResponse): void => {
  console.error('❌ Error caught by middleware:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  let statusCode = error.statusCode || 500;
  let errorType = 'Internal Server Error';

  switch (error.name) {
    case 'ValidationError':
      statusCode = 400;
      errorType = 'Validation Error';
      break;
    case 'NotFoundError':
      statusCode = 404;
      errorType = 'Not Found';
      break;
    case 'UnauthorizedError':
      statusCode = 401;
      errorType = 'Unauthorized';
      break;
    case 'ForbiddenError':
      statusCode = 403;
      errorType = 'Forbidden';
      break;
    case 'ConflictError':
      statusCode = 409;
      errorType = 'Conflict';
      break;
  }

  const errorResponse: ErrorResponse = {
    error: errorType,
    message: error.message || 'An unexpected error occurred',
    statusCode,
    timestamp: new Date().toISOString(),
    path: req.url
  };

  if (process.env['NODE_ENV'] === 'development') {
    (errorResponse as any).stack = error.stack;
  }

  try {
    if (!res.headersSent) {
      res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    }
    
    res.end(JSON.stringify(errorResponse, null, 2));
  } catch (responseError) {
    console.error('❌ Failed to send error response:', responseError);
    
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
    }
    
    res.end(JSON.stringify({
      error: 'Internal Server Error',
      message: 'Failed to process error response',
      statusCode: 500,
      timestamp: new Date().toISOString()
    }));
  }
};


export const asyncErrorHandler = (
  handler: (req: ExtendedRequest, res: ServerResponse, params?: any) => Promise<void>
) => {
  return async (req: ExtendedRequest, res: ServerResponse, params?: any): Promise<void> => {
    try {
      await handler(req, res, params);
    } catch (error) {
      errorMiddleware(error as ErrorWithStatus, req, res);
    }
  };
};
