import type { AxiosResponse, AxiosRequestConfig } from "axios";
import { ApiRequestOptions } from "./ApiRequestOptions";

type Headers = Record<string, string>;
type Middleware<T> = (value: T) => T | Promise<T>;
type Resolver<T> = (options: ApiRequestOptions<T>) => Promise<T>;

/**
 * 
 * This code defines a simple middleware system and a configuration object for working with an OpenAPI-based API in a TypeScript React project.

The Interceptors<T> class manages a list of middleware functions (of type Middleware<T>) that can process or modify data, such as HTTP requests or responses. The class provides two main methods: use, which adds a middleware function to the list, and eject, which removes a specific middleware function if it exists. Internally, the middleware functions are stored in the _fns array, and both methods use array spreading to create new arrays, ensuring immutability.

The OpenAPIConfig type describes the shape of the configuration object for API requests. It includes properties for the API base URL, credentials policy, optional path encoding, headers, token handling, versioning, and a flag for sending credentials. Notably, it also contains an interceptors object, which holds separate Interceptors instances for request and response processing. These allow you to register custom logic to run before a request is sent or after a response is received.

Finally, the OpenAPI constant provides a concrete configuration object that matches the OpenAPIConfig type. It sets default values for all required fields and initializes the request and response interceptors as new, empty Interceptors instances. This setup makes it easy to customize API behavior and add cross-cutting concerns like logging, authentication, or error handling through middleware.
 */
export class Interceptors<T> {
  _fns: Middleware<T>[];

  constructor() {
    this._fns = [];
  }

  eject(fn: Middleware<T>): void {
    const index = this._fns.indexOf(fn);
    if (index !== -1) {
      this._fns = [...this._fns.slice(0, index), ...this._fns.slice(index + 1)];
    }
  }

  use(fn: Middleware<T>): void {
    this._fns = [...this._fns, fn];
  }
}

export type OpenAPIConfig = {
  BASE: string;
  CREDENTIALS: "include" | "omit" | "same-origin";
  ENCODE_PATH?: ((path: string) => string) | undefined;
  HEADERS?: Headers | Resolver<Headers> | undefined;
  TOKEN?: string | Resolver<string> | undefined;
  VERSION: string;
  WITH_CREDENTIALS: boolean;
  interceptors: {
    request: Interceptors<AxiosRequestConfig>;
    response: Interceptors<AxiosResponse>;
  };
};

export const OpenAPI: OpenAPIConfig = {
  BASE: process.env.NEXT_PUBLIC_API_URL,
  CREDENTIALS: "include",
  ENCODE_PATH: undefined,
  HEADERS: undefined,
  TOKEN: undefined,
  VERSION: "0.1.0",
  WITH_CREDENTIALS: false,
  interceptors: {
    request: new Interceptors(),
    response: new Interceptors(),
  },
};
