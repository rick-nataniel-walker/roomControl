<script>
import NavigationMenuItem from "@/components/nav/NavigationMenuItem.vue";
import navyLogo from "@/assets/navy-logo.png";

export default {
  name: "NavigationMenu",
  components: {
    NavigationMenuItem,
  },
  data() {
    return {
      navyLogo,
      menuItems: [
        { label: "Dashboard", icon: "home", route: { name: "dashboard" } },
        { label: "Quartos", icon: "bed", route: { name: "rooms" } },
        {
          label: "Reservas",
          icon: "money-check",
          route: { name: "reservations" },
        },
        {
          label: "Relatórios",
          icon: "chart-line",
          route: { name: "reports" },
        },
      ],
    };
  },
  methods: {
    isActive(route) {
      return this.$route.name === route;
    },
    navigateTo(route) {
      this.$router.push(route);
    },
  },
};
</script>

<template>
  <div
    class="flex flex-row py-4 px-8 gap-y-4 tablet:min-h-screen tablet:bg-primary tablet:text-white tablet:w-48 tablet:px-1 tablet:flex-col"
  >
    <img
      :src="navyLogo"
      class="brand-logo px-2 pb-3 gap-12"
      alt="RoomControl, powered by TrueControl"
    />
    <NavigationMenuItem
      v-for="menuItem in menuItems"
      :key="menuItem.label"
      @click="navigateTo(menuItem.route)"
      :label="menuItem.label"
      :icon="menuItem.icon"
      class="my-2"
      :active="isActive(menuItem.route.name)"
    />
  </div>
</template>

<style scoped>
.brand-logo {
  @apply mx-auto block w-full max-w-[245px];
  mix-blend-mode: multiply;
}
</style>
