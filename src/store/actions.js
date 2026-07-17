import { LOGIN } from "@/store/constants";
import { login } from "@/api/auth";
import showAlert from "@/helpers/alert";

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
};
