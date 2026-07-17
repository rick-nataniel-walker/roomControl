<template>
  <ContentWrapper title="Dashboard">
    <template #body>
      <div class="flex flex-row flex-wrap tablet:flex-nowrap gap-4 py-4 pt-0">
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
          <DoughnutChart />
        </ContentCard>

        <ContentCard title="Reservas de hoje" class="gap-4">
          <div
            class="flex items-center justify-between p-4 w-full gap-4 my-2 border border-gray-200 rounded-lg"
          >
            <span class="text-base font-semibold">Room1</span>
            <div class="text-sm">
              <div class="flex flex-wrap">10:45 até 12:45</div>
              <div class="flex flex-wrap">10:45 até 12:45</div>
            </div>
            <TextBadge type="warning" value="Em limpeza" />
          </div>
          <div
            class="flex items-center justify-between p-4 w-full gap-4 my-2 border border-gray-200 rounded-lg"
          >
            <span class="text-base font-semibold">Room2</span>
            <div class="text-sm">
              <div class="flex flex-wrap">10:45 até 12:45</div>
              <div class="flex flex-wrap">10:45 até 12:45</div>
            </div>
            <TextBadge type="danger" value="Em limpeza" />
          </div>
          <div
            class="flex items-center justify-between p-4 w-full gap-4 my-2 border border-gray-200 rounded-lg"
          >
            <span class="text-base font-semibold">Room3</span>
            <div class="text-sm">
              <div class="flex flex-wrap">10:45 até 12:45</div>
              <div class="flex flex-wrap">10:45 até 12:45</div>
            </div>
            <TextBadge type="normal" value="Em limpeza" />
          </div>
          <div
            class="flex items-center justify-between p-4 w-full gap-4 my-2 border border-gray-200 rounded-lg"
          >
            <span class="text-base font-semibold">Room3</span>
            <div class="text-sm">
              <div class="flex flex-wrap">10:45 até 12:45</div>
              <div class="flex flex-wrap">10:45 até 12:45</div>
            </div>
            <TextBadge type="success" value="Em limpeza" />
          </div>
        </ContentCard>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import StatisticCard from "@/components/shared/StatisticCard.vue";
import ContentCard from "@/components/shared/ContentCard.vue";
import TextBadge from "@/components/shared/TextBadge.vue";
import DoughnutChart from "@/components/charts/doughnut/DoughnutChart.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";

export default {
  name: "DashboardView",
  components: {
    ContentWrapper,
    DoughnutChart,
    StatisticCard,
    ContentCard,
    TextBadge,
  },
};
</script>

<style scoped></style>
