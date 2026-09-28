import { apiClient } from "@/api/apiClient";

export const login = async (formData) => {
  let uri = "/api/auth/signin";
  return await apiClient.post(uri, formData);
};
export const logout = async () => {
  let uri = "/api/auth/logout";
  return await apiClient.post(uri);
};

export const fetchUserTenant = async () => {
  let uri = "/api/auth/user/tenant";
  return apiClient.get(`${uri}`, {
    headers: { "Content-Type": "application/json" },
  });
};
