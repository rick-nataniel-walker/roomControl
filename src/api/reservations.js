import { apiClient } from "@/api/apiClient";
const uri = "/api/admin/reservations/";

export const fetchReservation = (id) =>
  apiClient.get(`${uri}${encodeURIComponent(id)}`, {
    showSpinner: false,
    reservationPolling: true,
  });

// Discover older active stays as well as today's reservations.
export const fetchReservationSnapshot = async () => {
  const reservations = [];
  for (let pageNumber = 0; ; pageNumber += 1) {
    const { data } = await apiClient.get(uri, {
      params: { pageNumber, size: 100 },
      showSpinner: false,
      reservationPolling: true,
    });
    reservations.push(...data.data);
    if (data.lastPage || data.data.length === 0) return reservations;
  }
};

export const fetchReservations = ({ currentPage, itemsPerPage }) => {
  return apiClient.get(`${uri}search/checkin`, {
    headers: { "Content-Type": "application/json" },
    params: {
      pageNumber: currentPage,
      pageSize: itemsPerPage,
    },
  });
};

export const fetchReservationsByStatus = ({
  status,
  currentPage,
  itemsPerPage,
}) => {
  return apiClient.get(`${uri}search/checkin`, {
    headers: { "Content-Type": "application/json" },
    params: {
      status: status,
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
