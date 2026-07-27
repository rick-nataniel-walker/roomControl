import { apiClient } from "@/api/apiClient";
const uri = "/api/admin/reservations/";

export const fetchReservations = ({ currentPage, itemsPerPage }) => {
  return apiClient.get(uri, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
  });
};

export const fetchReservationsByRoomName = (roomName, pagination) => {
  return apiClient.get(`${uri}search/roomname/${roomName}`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: pagination.currentPage,
      pageSize: pagination.pageSize,
    },
  });
};

export const saveReservation = (formdata) => {
  return apiClient.post(`${uri}new`, formdata);
};

export const confirmReservation = (id, formdata) => {
  return apiClient.put(`${uri}${id}/confirm-payment/manual`, formdata);
};

export const checkoutReservation = (id) => {
  return apiClient.put(`${uri}${id}/checkout`);
};
