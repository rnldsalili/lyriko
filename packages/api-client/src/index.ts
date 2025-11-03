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
      const headers = new Headers(requestInit?.headers);

      const hasBody =
        requestInit?.body !== undefined && requestInit?.body !== null;
      const isFormData = requestInit?.body instanceof FormData;

      if (hasBody && !isFormData && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
      }

      return fetch(`${input}`, {
        ...requestInit,
        method: requestInit?.method || 'GET',
        headers,
        credentials: 'include',
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
