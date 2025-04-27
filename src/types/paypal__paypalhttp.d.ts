declare module '@paypal/paypalhttp' {
  export class HttpClient {
    constructor();
    execute<T>(request: any): Promise<T>;
  }

  export class HttpError extends Error {
    constructor(message: string, statusCode: number);
    statusCode: number;
  }
} 