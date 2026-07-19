export const state = {
  authenticationData: {
    username: "",
    jwtToken: "",
    roles: "",
  },

  rooms: {
    data: [],
    lastPage: true,
    pageNumber: 0,
    pageSize: 5,
    totalElements: 0,
    totalPages: 0,
  },
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
  systemConfig: {
    roomStatues: {
      free: "Desocupado",
      busy: "Ocupado",
      maintenance: "Em manutenção",
      cleaning: "Em limpeza",
    },
  },
};
