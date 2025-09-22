import { hc } from 'hono/client';

import type { APIClientRouter } from '@workspace/api/routes';
import type {
  InferRequestType as HonoInferRequestType,
  InferResponseType as HonoInferResponseType,
  ClientResponse as HonoClientResponse,
} from 'hono/client';

const createClient = (...args: Parameters<typeof hc>) => {
  const [baseURL, options] = args;

  return hc<APIClientRouter>(baseURL, {
    // fetch: (input: RequestInfo | URL, requestInit?: RequestInit) => {
    //   return kyApi(`${input}`, {
    //     method: requestInit?.method,
    //     headers: {
    //       ...requestInit?.headers,
    //       'Content-Type': 'application/json',
    //     },
    //     credentials: 'include',
    //     body: requestInit?.body,
    //   });
    // },
    ...options,
  });
};

export type Client = ReturnType<typeof createClient>;

export type InferRequestType<T> = HonoInferRequestType<T>;

export type InferResponseType<T> = HonoInferResponseType<T>;

export type ClientResponse<T> = HonoClientResponse<T>;

export type ApiError = {
  error:
    | string
    | {
        issues: {
          code: string;
          expected: string;
          message: string;
          path: string[];
          received: string;
        }[];
        name: string;
      };
  status: number;
};

export default createClient;
