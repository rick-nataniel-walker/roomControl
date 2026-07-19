import { LOGIN, SAVE_ROOM } from "@/store/constants";
import { login } from "@/api/auth";
import showAlert from "@/helpers/alert";
import { FETCH_ROOM } from "@/store/constants";
import { fetchRooms, saveRoom } from "@/api/rooms";

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
};
