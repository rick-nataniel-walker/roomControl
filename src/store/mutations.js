import { LOGIN, SAVE_ROOM } from "@/store/constants";
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

  [SAVE_ROOM](state, payload) {
    state.room = { ...payload };
  },
  resetRoom(state) {
    state.room = {
      id: "",
      name: "",
      lockId: "",
      status: "",
      reservations: [],
      ttLockAccesses: [],
      tenant: "",
      image: "",
      remaining: "00h:00min",
    };
  },

  FETCH_RESERVATIONS(state, payload) {
    state.reservations = payload;
  },
};
