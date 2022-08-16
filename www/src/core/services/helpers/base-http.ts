import axios, { AxiosResponse } from "axios";

import {
  ErrorResponseData,
  HttpParamsType,
  RequestOptions,
} from "../../models";

const baseHttpService = axios.create({
  baseURL: process.env.REACT_APP_APP_API_ENDPOINT || "http://localhost:3500/",
});

baseHttpService.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error && error.response)
);

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function get<T>(url: string, paramsData?: HttpParamsType): Promise<T> {
  try {
    const { data } = await baseHttpService.get<T>(url, {
      params: paramsData && paramsData.queryParams,
    });

    return data;
  } catch (error) {
    throw ErrorResponseData.mapFromApiValue(error as AxiosResponse);
  }
}

async function post<T>(url: string, paramsData?: HttpParamsType): Promise<T> {
  try {
    const options: RequestOptions = {
      params: paramsData && paramsData.queryParams,
      body: paramsData && paramsData.body,
    };

    const { data } = await baseHttpService.post<T>(url, options.body, {
      params: options && options.params,
    });

    return data;
  } catch (error) {
    throw ErrorResponseData.mapFromApiValue(error as AxiosResponse);
  }
}

async function put<T>(url: string, paramsData?: HttpParamsType): Promise<T> {
  const options: RequestOptions = {
    params: paramsData && paramsData.queryParams,
    body: paramsData && paramsData.body,
  };

  try {
    const { data } = await baseHttpService.put<T>(url, options.body, {
      params: options && options.params,
    });

    return data;
  } catch (error) {
    throw ErrorResponseData.mapFromApiValue(error as AxiosResponse);
  }
}

async function _delete<T>(
  url: string,
  paramsData?: HttpParamsType
): Promise<T> {
  try {
    const { data } = await baseHttpService.delete(url, {
      params: paramsData && paramsData.queryParams,
    });

    return data;
  } catch (error) {
    throw ErrorResponseData.mapFromApiValue(error as AxiosResponse);
  }
}

export { get, post, put, _delete };
