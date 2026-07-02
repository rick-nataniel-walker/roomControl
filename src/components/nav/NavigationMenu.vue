<script>
import NavigationMenuItem from "@/components/nav/NavigationMenuItem.vue";

export default {
  name: "NavigationMenu",
  components: {
    NavigationMenuItem,
  },
};
</script>

<template>
  <div
    class="flex flex-row py-4 px-8 gap-y-4 tablet:h-screen tablet:bg-primary tablet:text-white tablet:w-48 tablet:px-1 tablet:flex-col"
  >
    <NavigationMenuItem label="Dashboard" icon="home" active class="my-2" />
    <NavigationMenuItem label="Quartos" icon="bed" class="my-2" />
    <NavigationMenuItem label="Reservas" icon="money-check" class="my-2" />
    <NavigationMenuItem label="Relatórios" icon="chart-line" class="my-2" />
  </div>
</template>

<style scoped></style>
