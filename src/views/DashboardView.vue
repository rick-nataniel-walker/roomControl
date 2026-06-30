<script>
import StatisticCard from "@/components/shared/StatisticCard.vue";

export default {
  name: "DashboardView",
  components: {
    StatisticCard,
  },
};
</script>

<template>
  <div class="dashboard bg-gray-100">
    <div class="flex py-4">
      <h1 class="text-4xl font-semibold">Dashboard</h1>
    </div>
    <div class="flex flex-row gap-4 py-4 pt-0">
      <StatisticCard
        color="text-goldAccent"
        bg-color="bg-lightVariants-goldAccent"
        label="Quartos"
        number="14"
        icon="fa-bed"
      />
      <StatisticCard
        color="text-royalBlue"
        bg-color="bg-lightVariants-royalBlue"
        label="Quartos"
        number="14"
        icon="fa-bed"
      />
      <StatisticCard
        color="text-gray-100"
        bg-color="rgba(30, 58, 186, 0.5)"
        label="Quartos"
        number="14"
        icon="fa-bed"
      />
      <StatisticCard
        color="text-gray-100"
        bg-color="rgba(30, 58, 186, 0.5)"
        label="Quartos"
        number="14"
        icon="fa-bed"
      />
    </div>
  </div>
</template>

<style scoped></style>
