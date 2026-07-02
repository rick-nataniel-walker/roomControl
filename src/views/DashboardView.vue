<template>
  <div class="dashboard bg-gray-100">
    <div class="flex flex-col-reverse py-4 pt-0 tablet:flex-row">
      <NavigationMenu />
      <div class="w-full gap-14">
        <MainHeader />
        <div class="px-8">
          <div class="flex py-8">
            <h1 class="text-2xl font-semibold">Dashboard</h1>
          </div>
          <div
            class="flex flex-row flex-wrap tablet:flex-nowrap gap-4 py-4 pt-0"
          >
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
          <div class="flex flex-col gap-4 tablet:flex-row">
            <ContentCard title="Estatística dos Quartos">
              Aqui vai o meu content
            </ContentCard>
            <ContentCard title="Reservas de hoje">
              Aqui vai o meu content
            </ContentCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StatisticCard from "@/components/shared/StatisticCard.vue";
import MainHeader from "@/components/nav/MainHeader.vue";
import NavigationMenu from "@/components/nav/NavigationMenu.vue";
import ContentCard from "@/components/shared/ContentCard.vue";

export default {
  name: "DashboardView",
  components: {
    StatisticCard,
    MainHeader,
    NavigationMenu,
    ContentCard,
  },
};
</script>

<style scoped></style>
