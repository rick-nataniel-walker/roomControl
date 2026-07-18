import { createRouter, createWebHistory } from "vue-router";
import LoginView from "@/views/LoginView.vue";
import DashboardView from "@/views/DashboardView.vue";
import store from "@/store";
import RoomsListingView from "@/views/RoomsListingView.vue";

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
    meta: { requiresAuth: false },
  },
  {
    path: "/rooms",
    name: "rooms",
    component: RoomsListingView,
    meta: { requiresAuth: false },
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
