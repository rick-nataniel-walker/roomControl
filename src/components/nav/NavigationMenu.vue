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
    };
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
    <NavigationMenuItem label="Dashboard" icon="home" active class="my-2" />
    <NavigationMenuItem label="Quartos" icon="bed" class="my-2" />
    <NavigationMenuItem label="Reservas" icon="money-check" class="my-2" />
    <NavigationMenuItem label="Relatórios" icon="chart-line" class="my-2" />
  </div>
</template>

<style scoped>
.brand-logo {
  @apply mx-auto block w-full max-w-[245px];
  mix-blend-mode: multiply;
}
</style>
