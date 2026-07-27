export const rooms = [
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
];

export const roomsListingsDropdownlist = [
  {
    menuItems: [
      { id: "occupy", name: "Ocupar o quarto", disabled: false },
      { id: "fee", name: "Desocupar o quarto", disabled: false },
    ],
  },
];
export const reservationsListingsDropdownlist = [
  {
    menuItems: [
      { id: "payment", name: "Efectuar o Pagamento", disabled: false },
      { id: "checkout", name: "Checkout", disabled: false },
      { id: "extend", name: "Extender o período", disabled: false },
    ],
  },
];
