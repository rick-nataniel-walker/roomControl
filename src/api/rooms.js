import { apiClient } from "@/api/apiClient";
const uri = "/api/admin/rooms/";

export const fetchRooms = () => {
  return apiClient.get(uri, {
    headers: { "Content-Type": "application/json" },
  });
};
export const saveRoom = (formData) => {
  return apiClient.post(uri, formData);
};
