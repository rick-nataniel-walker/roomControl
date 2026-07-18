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
};
