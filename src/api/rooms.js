import { apiClient } from "@/api/apiClient";
const uri = "/api/admin/rooms/";

export const fetchRooms = ({ currentPage, itemsPerPage }) => {
  return apiClient.get(uri, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
  });
};
export const saveRoom = (formData) => {
  return formData.id
    ? apiClient.put(`${uri}${formData.id}`, formData)
    : apiClient.post(uri, formData);
};

export const fetchRoomsByStatus = (status, { currentPage, itemsPerPage }) => {
  return apiClient.get(`${uri}status/${status}`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
  });
};

export const fetchRoomsByName = (name, { currentPage, itemsPerPage }) => {
  return apiClient.get(`${uri}name/${name}`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
  });
};

export const desecupyRoom = (roomId) => {
  return apiClient.put(`${uri}${roomId}/status/free`, {
    headers: { "Content-Type": "application/json" },
  });
};
