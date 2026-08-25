import { apiClient } from "@/api/apiClient";
const uri = "/api/admin/rooms/";

export const fetchRooms = ({ currentPage, itemsPerPage }) => {
  return apiClient.get(uri, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      size: itemsPerPage,
    },
  });
};

export const fetchAllRooms = () => {
  return apiClient.get(uri, {
    headers: { "Content-Type": "application/json" },
  });
};

export const saveRoom = (formData) => {
  const headers = { "Content-Type": "multipart/form-data" };
  let id = formData.get("id");
  return id !== undefined && id !== ""
    ? apiClient.put(`${uri}${id}`, formData, {
        headers,
      })
    : apiClient.post(uri, formData, {
        headers,
      });
};

export const fetchRoomsByStatus = (status, { currentPage, itemsPerPage }) => {
  return apiClient.get(`${uri}status/${status}`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      size: itemsPerPage,
    },
  });
};

export const fetchAllRoomsByStatus = (status) => {
  return apiClient.get(`${uri}status/${status}`, {
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchRoomsByName = (name, { currentPage, itemsPerPage }) => {
  return apiClient.get(`${uri}name/${name}`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      size: itemsPerPage,
    },
  });
};

export const desecupyRoom = (roomId) => {
  return apiClient.put(`${uri}${roomId}/status/free`, {
    headers: { "Content-Type": "application/json" },
  });
};
