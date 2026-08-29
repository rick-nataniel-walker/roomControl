import {
  CHECKOUT_RESERVATION,
  CONFIRM_RESERVATION,
  DESECUPY_ROOM,
  FETCH_RESERVATIONS_BY_ROOM_NAME,
  FETCH_RESERVATIONS,
  FETCH_ROOM_BY_NAME,
  FETCH_ROOM_BY_STATUS,
  LOGIN,
  SAVE_RESERVATION,
  SAVE_ROOM,
  DASHBOARD_STATISTICS,
} from "@/store/constants";
import { login } from "@/api/auth";
import showAlert from "@/helpers/alert";
import { FETCH_ROOM } from "@/store/constants";
import {
  desecupyRoom,
  fetchAllRoomsByStatus,
  fetchRooms,
  fetchRoomsByName,
  fetchRoomsByStatus,
  saveRoom,
} from "@/api/rooms";
import {
  checkoutReservation,
  confirmReservation,
  fetchReservations,
  fetchReservationsByRoomName,
  saveReservation,
} from "@/api/reservations";
import { dashboardStatistics } from "@/api/statistics";

export const actions = {
  [LOGIN](context, formdata) {
    return login(formdata)
      .then((response) => {
        context.commit(LOGIN, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Login falhou!!!",
          message: error.response.data.message,
        });
        throw error;
      });
  },

  [FETCH_ROOM](
    context,
    pagination = {
      currentPage: 0,
      itemsPerPage: 5,
    }
  ) {
    return fetchRooms(pagination)
      .then((response) => {
        context.commit(FETCH_ROOM, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Não foi possível busca quartos!",
          message: error.response.data.message,
        });

        throw error;
      });
  },
  [FETCH_ROOM_BY_STATUS](context, status, pagination) {
    if (!pagination)
      return fetchAllRoomsByStatus(status)
        .then((response) => {
          context.commit(FETCH_ROOM, response.data);
          return response;
        })
        .catch((error) => {
          showAlert({
            type: "error",
            title: "Não foi possível busca quartos!",
            message: error.response.data.message,
          });
        });
    return fetchRoomsByStatus(status, pagination)
      .then((response) => {
        context.commit(FETCH_ROOM, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Não foi possível busca quartos!",
          message: error.response.data.message,
        });
      });
  },
  [FETCH_ROOM_BY_NAME](
    context,
    name,
    pagination = {
      currentPage: 0,
      itemsPerPage: 5,
    }
  ) {
    return fetchRoomsByName(name, pagination)
      .then((response) => {
        context.commit(FETCH_ROOM, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Não foi possível busca quartos!",
          message: error.response.data.message,
        });
      });
  },

  [SAVE_ROOM](context, formdata) {
    return saveRoom(formdata)
      .then((response) => {
        showAlert({
          type: "success",
          title: "Sucesso",
          message: "Efectuado com sucesso",
        });
        return response.data;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao guardar o quarto!",
          message: error.response.data.message,
        });
      });
  },
  [DESECUPY_ROOM](context, roomId) {
    return desecupyRoom(roomId)
      .then((response) => {
        showAlert({
          type: "success",
          title: "Sucesso",
          message: "Efectuado com sucesso",
        });
        return response.data;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao actualizar o quarto!",
          message: error.response.data.message,
        });
      });
  },

  [FETCH_RESERVATIONS](
    context,
    pagination = {
      currentPage: 0,
      itemsPerPage: 5,
    }
  ) {
    return fetchReservations(pagination)
      .then((response) => {
        context.commit(FETCH_RESERVATIONS, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Não foi possível buscar reservas!",
          message: error.response.data.message,
        });

        throw error;
      });
  },
  [FETCH_RESERVATIONS_BY_ROOM_NAME](
    context,
    roomName,
    pagination = {
      currentPage: 0,
      itemsPerPage: 5,
    }
  ) {
    return fetchReservationsByRoomName(roomName, pagination)
      .then((response) => {
        context.commit(FETCH_RESERVATIONS, response.data);
        return response;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Não foi possível buscar reservas!",
          message: error.response.data.message,
        });

        throw error;
      });
  },

  [SAVE_RESERVATION](context, formdata) {
    return saveReservation(formdata)
      .then((response) => {
        let localReservations =
          JSON.parse(localStorage.getItem("reservations")) ?? [];
        formdata.id = response.data.id;
        formdata.status = response.data.status;
        localReservations.push(formdata);
        localStorage.setItem("reservations", JSON.stringify(localReservations));
        showAlert({
          type: "success",
          title: "Sucesso",
          message: "Efectuado com sucesso",
        });
        return response.data;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao criar pedido!",
          message: error.response.data.message,
        });
      });
  },
  [CONFIRM_RESERVATION](context, { id, formdata }) {
    return confirmReservation(id, formdata)
      .then((response) => {
        showAlert({
          type: "success",
          title: "Sucesso",
          message: "Efectuado com sucesso",
        });
        return response.data;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao criar pedido!",
          message: error.response.data.message,
        });
      });
  },
  [CHECKOUT_RESERVATION](context, id) {
    return checkoutReservation(id)
      .then((response) => {
        showAlert({
          type: "success",
          title: "Sucesso",
          message: "Efectuado com sucesso!",
        });
        return response.data;
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao criar pedido!",
          message: error.response.data.message,
        });
      });
  },
  [DASHBOARD_STATISTICS](context) {
    return dashboardStatistics()
      .then((response) => {
        let payload = response.data;
        context.commit(DASHBOARD_STATISTICS, payload);
      })
      .catch((error) => {
        showAlert({
          type: "error",
          title: "Erro ao buscar estatistícas",
          message: error.response.data.message,
        });
      });
  },
};
