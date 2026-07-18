import { apiClient } from "@/api/apiClient";

export const login = async (formData) => {
  let uri = "/api/auth/signin";
  return await apiClient.post(uri, formData);
};
