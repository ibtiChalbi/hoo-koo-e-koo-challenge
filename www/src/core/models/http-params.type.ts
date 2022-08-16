/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface HttpParamsType<T = unknown> {
  queryParams?: { [key: string]: string | string[] };
  body?: T;
  authenticationRequired?: boolean;
  multiPart?: boolean;
}

export interface RequestOptions {
  params?: any;
  body?: any;
}

export interface ErrorResponseData {
  status: number | undefined;
  code: number | undefined;
  message: string;
  title: string;
  type: string;
}

export namespace ErrorResponseData {
  export function mapFromApiValue(httpError: AxiosResponse): ErrorResponseData {
    return {
      status: httpError?.status,
      code: httpError?.data?.code,
      message: httpError?.data?.message || "Erreur Http",
      title: httpError?.data?.name || "Une erreur s'est produite !",
      type: httpError?.data?.type,
    };
  }
}
