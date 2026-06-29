import { LOGIN } from "@/store/constants";

export const mutations = {
  [LOGIN](state, payload) {
    state.authenticationData.username = payload.username;
    let saltedToken = payload.jwtToken.split(";")[0];
    state.authenticationData.jwtToken = saltedToken.split("=")[1];
    state.authenticationData.roles = payload.roles;
  },
};
