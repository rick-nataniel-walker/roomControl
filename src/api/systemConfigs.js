import { apiClient } from "@/api/apiClient";
const url = "api/systemconfigs";

export const globalConfigs = (group, subGroup) => {
  return apiClient.get(`${url}/global`, {
    headers: { "Content-Type": "application/json" },
    params: {
      mainGroup: group,
      subGroup: subGroup,
    },
  });
};
