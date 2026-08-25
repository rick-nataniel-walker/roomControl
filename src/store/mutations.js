import {
  LOGIN,
  SAVE_ROOM,
  START_LOADING,
  STOP_LOADING,
} from "@/store/constants";
import { FETCH_ROOM } from "@/store/constants";

export const mutations = {
  [START_LOADING](state) {
    state.pendingRequests += 1;
  },

  [STOP_LOADING](state) {
    state.pendingRequests = Math.max(0, state.pendingRequests - 1);
  },

  [LOGIN](state, payload) {
    state.authenticationData.username = payload.username;
    let saltedToken = payload.jwtToken.split(";")[0];
    state.authenticationData.jwtToken = saltedToken.split("=")[1];
    state.authenticationData.roles = payload.roles;
  },

  [FETCH_ROOM](state, payload) {
    //payload.data.map(item => item.id = payload.id);
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

  setReservation(state, payload) {
    state.reservation = { ...payload };
  },

  resetReservation(state) {
    state.reservation = {
      id: null,
      checkinTime: "",
      checkoutTime: "",
      durationHours: null,
      paymentMethod: "",
      paymentConfirm: null,
      checkedOut: null,
      status: "",
      roomName: "",
      roomId: "",
      cardNumber: "",
    };
  },
};
