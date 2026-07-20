import {
  DESECUPY_ROOM,
  FETCH_RESERVATIONS,
  FETCH_ROOM_BY_NAME,
  FETCH_ROOM_BY_STATUS,
  LOGIN,
  SAVE_ROOM,
} from "@/store/constants";
import { login } from "@/api/auth";
import showAlert from "@/helpers/alert";
import { FETCH_ROOM } from "@/store/constants";
import {
  desecupyRoom,
  fetchRooms,
  fetchRoomsByName,
  fetchRoomsByStatus,
  saveRoom,
} from "@/api/rooms";
import { fetchReservations } from "@/api/reservations";

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
  [FETCH_ROOM_BY_STATUS](
    context,
    status,
    pagination = {
      currentPage: 0,
      itemsPerPage: 5,
    }
  ) {
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
          title: "Não foi possível reservas!",
          message: error.response.data.message,
        });

        throw error;
      });
  },
};
