import axios from "axios";
import { START_LOADING, STOP_LOADING } from "@/store/constants";

export const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const installLoadingInterceptors = (store) => {
  const requestInterceptor = apiClient.interceptors.request.use(
    (config) => {
      if (config.showSpinner !== false) {
        config.tracksGlobalLoading = true;
        store.commit(START_LOADING);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  const stopTrackedRequest = (config) => {
    if (config?.tracksGlobalLoading) {
      store.commit(STOP_LOADING);
    }
  };

  const responseInterceptor = apiClient.interceptors.response.use(
    (response) => {
      stopTrackedRequest(response.config);
      return response;
    },
    (error) => {
      stopTrackedRequest(error.config);
      return Promise.reject(error);
    }
  );

  return () => {
    apiClient.interceptors.request.eject(requestInterceptor);
    apiClient.interceptors.response.eject(responseInterceptor);
  };
};
