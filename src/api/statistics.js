import { apiClient } from "@/api/apiClient";
const uri = "/api/statistics/by/";

export const dashboardStatistics = () => {
  return apiClient.get(`${uri}date`, {
    headers: { "Content-Type": "application/json" },
    params: {
      date: new Date().toISOString().slice(0, 10),
    },
  });
};
