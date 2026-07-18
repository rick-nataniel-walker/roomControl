import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import store from "@/store";
import RoomsListingView from "@/views/RoomsListingView.vue";
import RoomsActionView from "@/views/RoomsActionView.vue";

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
    meta: { requiresAuth: true },
  },
  {
    path: "/rooms",
    meta: { requiresAuth: true },
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
      },
      {
        path: ":id",
        name: "editRoom",
        component: RoomsActionView,
        props: true,
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
