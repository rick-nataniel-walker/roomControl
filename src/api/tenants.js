import { apiClient } from "@/api/apiClient";
const uri = "/api/tenants/";

export const updateRefreshToken = (id) => {
  return apiClient.put(`${uri}${id}/ttlock-access`, {
    headers: { "Content-Type": "application/json" },
  });
};
