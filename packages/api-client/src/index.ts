import { hc, parseResponse } from 'hono/client';

import type { APIClientRouter } from '@workspace/api/routes';
import type {
  InferRequestType as HonoInferRequestType,
  InferResponseType as HonoInferResponseType,
  ClientResponse as HonoClientResponse,
} from 'hono/client';

export { DetailedError } from 'hono/client';

const createClient = (...args: Parameters<typeof hc>) => {
  const [baseURL, options] = args;

  return hc<APIClientRouter>(baseURL, {
    fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
      return fetch(`${input}`, {
        method: requestInit?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...requestInit?.headers,
        },
        credentials: 'include',
        body: requestInit?.body,
        ...requestInit,
      });
    },
    ...options,
  });
};

export type Client = ReturnType<typeof createClient>;

export type InferRequestType<T> = HonoInferRequestType<T>;

export type InferResponseType<T> = HonoInferResponseType<T>;

export type ClientResponse<T> = HonoClientResponse<T>;

export { parseResponse };

export default createClient;
