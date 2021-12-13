import { AxiosRequestConfig, Method } from "axios";

export const getNextAxiosConfig = (path: string, method: Method, query: string) => {
  const config: AxiosRequestConfig = {
    url: process.env.NEXT_PUBLIC_SITE_URL + `/api${path}?q=${query}`,
    method: method,
  };

  return config;
};

export const getApiAxiosConfig = (path: string, method: Method, token: string, query: string) => {
  const config: AxiosRequestConfig = {
    url: `${process.env.API_BASE_URL}${path}?q=${query}`,
    method: method,
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  return config;
};
