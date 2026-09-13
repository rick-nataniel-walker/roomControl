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
          <DoughnutChart
            :chartParts="makeChartParts"
            :total="statistics.allReservationsCount"
            total-legend="Reservas efectuadas"
          />
        </ContentCard>

        <ContentCard title="Reservas recentes" class="gap-4">
          <div
            v-for="reservation in reservations.data"
            :key="reservation.id"
            class="flex items-center justify-between p-4 w-full gap-4 my-2 border border-gray-200 rounded-lg"
          >
            <span class="text-base font-semibold">{{
              reservation.roomName
            }}</span>
            <div class="text-sm">
              <div class="flex flex-wrap">
                Entrada:
                {{ formatTime(reservation.checkinTime) }}
              </div>
              <div class="flex flex-wrap">
                Saída:
                {{ formatTime(reservation.checkoutTime) }}
              </div>
            </div>
            <TextBadge
              :type="mapStatus(reservation.status)"
              :value="reservation.status"
            />
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
import { DASHBOARD_STATISTICS, FETCH_RESERVATIONS } from "@/store/constants";
import store from "@/store";
import { javaDateTimeFormatter } from "@/helpers/DateHelper";

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
      chartParts: [],
    };
  },
  computed: {
    ...mapState(["statistics", "reservations"]),
    makeChartParts() {
      return [
        {
          legend: "Confirmadas",
          type: "secondary",
          value: this.statistics.confirmedReservationsCount,
        },
        {
          legend: "Finalizada",
          type: "success",
          value: this.statistics.checkedOutReservations,
        },
        {
          legend: "Pendentes",
          type: "warning",
          value: this.statistics.pendingReservations,
        },
      ];
    },
    statisticCards() {
      return [
        {
          id: 1,
          color: "text-royalBlue",
          bgColor: "bg-lightVariants-royalBlue",
          label: "Todos Quartos",
          number: this.statistics.roomsCount,
          icon: "fa-bed",
        },
        {
          id: 2,
          color: "text-goldAccent",
          bgColor: "bg-lightVariants-goldAccent",
          label: "Quartos Ocupados",
          number: this.statistics.busyRoomsCount,
          icon: "fa-bed",
        },
        {
          id: 3,
          color: "text-emerald",
          bgColor: "bg-lightVariants-emerald",
          label: "Quartos livres",
          number: this.statistics.freeRoomsCount,
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
      ];
    },
  },
  methods: {
    ...mapActions([DASHBOARD_STATISTICS, FETCH_RESERVATIONS]),
    formatTime(datetime) {
      const { time } = javaDateTimeFormatter(datetime);
      return time ? time.slice(0, 5) : "—";
    },
    mapStatus(status) {
      switch (status?.toLowerCase()) {
        case "pago":
          return "success";
        case "falhado":
          return "danger";
        case "pendente":
          return "warning";
        default:
          return "basic";
      }
    },
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(DASHBOARD_STATISTICS);
      await store.dispatch(FETCH_RESERVATIONS);
      next();
    } catch (e) {
      next(e);
    }
  },
};
</script>

<style scoped></style>
