import { LOGIN } from "@/store/constants";
import { FETCH_ROOM } from "@/store/constants";

export const mutations = {
  [LOGIN](state, payload) {
    state.authenticationData.username = payload.username;
    let saltedToken = payload.jwtToken.split(";")[0];
    state.authenticationData.jwtToken = saltedToken.split("=")[1];
    state.authenticationData.roles = payload.roles;
  },

  [FETCH_ROOM](state, payload) {
    state.rooms = payload;
  },
};
