<template>
  <ContentWrapper title="Dashboard">
    <template #body>
      <div class="flex flex-row flex-wrap tablet:flex-nowrap gap-4 py-4 pt-0">
        <StatisticCard
          v-for="card in statisticCards"
          :key="card.id"
          :color="card.color"
          :bg-color="card.bgColor"
          :label="card.label"
          :number="card.number"
          :icon="card.icon"
        />
      </div>
      <div class="flex flex-col gap-4 tablet:flex-row">
        <ContentCard title="Estado das reservas">
          <DoughnutChart :chartParts="makeChartParts" />
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
import { mapActions, mapState } from "vuex";
import { DASHBOARD_STATISTICS } from "@/store/constants";
import store from "@/store";

export default {
  name: "DashboardView",
  components: {
    ContentWrapper,
    DoughnutChart,
    StatisticCard,
    ContentCard,
    TextBadge,
  },
  data() {
    return {
      statisticCards: [
        {
          id: 1,
          color: "text-goldAccent",
          bgColor: "bg-lightVariants-goldAccent",
          label: "Quartos",
          number: 14,
          icon: "fa-bed",
        },
        {
          id: 2,
          color: "text-royalBlue",
          bgColor: "bg-lightVariants-royalBlue",
          label: "Quartos",
          number: 14,
          icon: "fa-bed",
        },
        {
          id: 3,
          color: "text-gray-100",
          bgColor: "rgba(30, 58, 186, 0.5)",
          label: "Quartos",
          number: 14,
          icon: "fa-bed",
        },
        {
          id: 4,
          color: "text-gray-100",
          bgColor: "rgba(30, 58, 186, 0.5)",
          label: "Quartos",
          number: 14,
          icon: "fa-bed",
        },
      ],

      chartParts: [],
    };
  },
  computed: {
    ...mapState(["statistics"]),
    makeChartParts() {
      return [
        {
          legend: "Confirmadas",
          type: "success",
          value: this.statistics.confirmedReservationsCount,
        },
        {
          legend: "Pagas",
          type: "warning",
          value: this.statistics.checkedOutReservations,
        },
        {
          legend: "Activas",
          type: "danger",
          value: this.statistics.activeReservationsCount,
        },
      ];
    },
  },
  methods: {
    ...mapActions([DASHBOARD_STATISTICS]),
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(DASHBOARD_STATISTICS);
      next();
    } catch (e) {
      next(e);
    }
  },
};
</script>

<style scoped></style>
