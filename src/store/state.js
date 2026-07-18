export const state = {
  authenticationData: {
    username: "",
    jwtToken: "",
    roles: "",
  },

  rooms: [
    {
      id: "",
      name: "",
      lockId: "",
      status: "",
      reservations: [],
      ttLockAccesses: [],
      tenant: "",
      remaining: "0h:30min",
    },
  ],
  room: {
    id: "",
    name: "",
    lockId: "",
    status: "",
    reservations: [],
    ttLockAccesses: [],
    tenant: "",
    image: "",
    remaining: "00h:00min",
  },
};
