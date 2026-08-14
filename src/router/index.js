import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import store from "@/store";
import RoomsListingView from "@/views/rooms/RoomsListingView.vue";
import RoomsActionView from "@/views/rooms/RoomsActionView.vue";
import ReservationView from "@/views/reservations/ReservationView.vue";
import ReservationsActionView from "@/views/reservations/ReservationsActionView.vue";
import ReservationsPaymentConfrimationView from "@/views/reservations/ReservationsPaymentConfrimationView.vue";

const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardView,
    meta: {
      requiresAuth: true,
      activeMenu: "dashboard",
      breadcrumb: "Dashboard",
    },
  },
  {
    path: "/rooms",
    meta: {
      requiresAuth: true,
      activeMenu: "rooms",
      breadcrumb: { label: "Quartos", to: { name: "rooms" } },
    },
    children: [
      {
        path: "",
        name: "rooms",
        component: RoomsListingView,
      },
      {
        path: "new",
        name: "addRoom",
        component: RoomsActionView,
        meta: { breadcrumb: "Novo quarto" },
      },
      {
        path: ":id",
        name: "editRoom",
        component: RoomsActionView,
        props: true,
        meta: { breadcrumb: "Editar quarto" },
      },
    ],
  },
  {
    path: "/reservations",
    meta: {
      requiresAuth: true,
      activeMenu: "reservations",
      breadcrumb: { label: "Reservas", to: { name: "reservations" } },
    },
    children: [
      {
        path: "",
        name: "reservations",
        component: ReservationView,
      },
      {
        path: "new",
        name: "newReservation",
        component: ReservationsActionView,
        meta: { breadcrumb: "Novo pedido" },
      },
      {
        path: ":id",
        name: "editReservation",
        component: ReservationsActionView,
        meta: { breadcrumb: "Editar pedido" },
      },
      {
        path: ":id/confirm-payment",
        name: "confirmReservation",
        component: ReservationsPaymentConfrimationView,
        meta: { breadcrumb: "Confirmar pagamento" },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = Boolean(store.state.authenticationData.jwtToken);

  if (to.meta.requiresAuth === true && !isAuthenticated)
    return {
      name: "login",
      query: { redirect: to.fullPath },
    };
});
export default router;
