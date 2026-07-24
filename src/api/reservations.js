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

export const saveReservation = (formdata) => {
  return apiClient.post(`${uri}new`, formdata);
};

export const confirmReservation = (id, formdata) => {
  return apiClient.put(`${uri}${id}/confirm-payment/manual`, formdata);
};
