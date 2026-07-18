import { LOGIN } from "@/store/constants";
import { login } from "@/api/auth";
import showAlert from "@/helpers/alert";
import { FETCH_ROOM } from "@/store/constants";
import { fetchRooms } from "@/api/rooms";

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
  [FETCH_ROOM](context) {
    return fetchRooms()
      .then((response) => {
        context.commit(FETCH_ROOM, response.data.data);
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
};
