<template>
  <div class="report-charts">
    <p v-if="error" role="alert" class="chart-notice">{{ error }}</p>
    <div class="chart-row primary-row">
      <ContentCard
        class="report-panel"
        title="Receita no Período"
        styled="none"
      >
        <p class="chart-caption">
          Receita por data de entrada (MZN). Histórico de ocupação indisponível.
        </p>
        <ReportBars
          :items="dailyRevenue"
          :loading="loading"
          label="Receita diária em MZN"
        />
      </ContentCard>
      <ContentCard
        class="report-panel"
        title="Estado dos Quartos"
        styled="none"
      >
        <p class="chart-caption">Situação atual dos quartos</p>
        <DoughnutChart
          v-if="summary"
          :chart-parts="roomParts"
          :total="Number(summary.roomsCount) || 0"
          total-legend="Total de quartos"
        />
        <p v-else class="empty-chart">Sem dados dos quartos.</p>
      </ContentCard>
    </div>
    <div class="chart-row secondary-row">
      <ContentCard
        class="report-panel"
        title="Receitas por Quarto"
        styled="none"
      >
        <p class="chart-caption">
          Top 5 por receita (MZN). Tipo de quarto não disponível.
        </p>
        <ReportBars
          :items="roomRevenue"
          :loading="loading"
          label="Receita por quarto em MZN"
        />
      </ContentCard>
      <ContentCard
        class="report-panel"
        title="Reservas por Estado"
        styled="none"
      >
        <p class="chart-caption">
          Estado atual das reservas com entrada no período
        </p>
        <p v-if="loading" class="empty-chart" role="status">A carregar...</p>
        <DoughnutChart
          v-else-if="reservations.length"
          :chart-parts="statusParts"
          :total="reservations.length"
          total-legend="Reservas"
        />
        <p v-else class="empty-chart">Sem reservas no período.</p>
      </ContentCard>
      <ContentCard
        class="report-panel"
        title="Top 5 Quartos Mais Reservados"
        styled="none"
      >
        <p class="chart-caption">Reservas com entrada no período</p>
        <p v-if="loading" class="empty-chart" role="status">A carregar...</p>
        <div v-else-if="topRooms.length" class="rankings">
          <div v-for="room in topRooms" :key="room.label" class="ranking">
            <span :title="room.label">{{ room.label }}</span>
            <div class="track">
              <div
                :style="{ width: `${(room.value / topRooms[0].value) * 100}%` }"
              ></div>
            </div>
            <strong>{{ room.value }}</strong>
          </div>
        </div>
        <p v-else class="empty-chart">Sem reservas no período.</p>
      </ContentCard>
    </div>
  </div>
</template>
<script>
import ContentCard from "@/components/shared/ContentCard.vue";
import DoughnutChart from "@/components/charts/doughnut/DoughnutChart.vue";
import ReportBars from "./ReportBars.vue";
const grouped = (rows, key, value) => {
  const totals = new Map();
  rows.forEach((row) => {
    const label = key(row);
    const amount = value(row);
    if (label && Number.isFinite(amount))
      totals.set(label, (totals.get(label) || 0) + amount);
  });
  return [...totals].map(([label, value]) => ({ label, value }));
};
export default {
  components: { ContentCard, DoughnutChart, ReportBars },
  props: {
    summary: Object,
    reservations: { type: Array, default: () => [] },
    loading: Boolean,
    error: String,
  },
  computed: {
    dailyRevenue() {
      return grouped(
        this.reservations,
        (row) => row.checkinTime?.slice(0, 10),
        (row) => (row.gain == null ? NaN : Number(row.gain))
      ).sort((a, b) => a.label.localeCompare(b.label));
    },
    roomRevenue() {
      return grouped(
        this.reservations,
        (row) => row.roomName || "Sem quarto",
        (row) => (row.gain == null ? NaN : Number(row.gain))
      )
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
    topRooms() {
      return grouped(
        this.reservations,
        (row) => row.roomName || "Sem quarto",
        () => 1
      )
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
    },
    roomParts() {
      return [
        ["Livres", "freeRoomsCount", "success"],
        ["Ocupados", "busyRoomsCount", "danger"],
        ["Manutenção", "maintenanceRoomsCount", "warning"],
        ["Limpeza", "cleaningRoomsCount", "secondary"],
      ].map(([legend, key, type]) => ({
        legend,
        type,
        value: Number(this.summary?.[key]) || 0,
      }));
    },
    statusParts() {
      const groups = [
        ["Activas / pagas", ["Activa", "Pago"], "secondary"],
        ["Pendentes", ["Pagamento Pendente"], "warning"],
        ["Concluídas", ["Completa"], "success"],
        ["Vencidas", ["Vencida", "Vencido"], "danger"],
        ["Canceladas / outros", [], "dark"],
      ];
      const known = groups.flatMap((group) => group[1]);
      return groups
        .map(([legend, statuses, type]) => ({
          legend,
          type,
          value: this.reservations.filter((row) =>
            statuses.length
              ? statuses.includes(row.status)
              : !known.includes(row.status)
          ).length,
        }))
        .filter((part) => part.value > 0);
    },
  },
};
</script>
<style scoped>
.report-charts {
  @apply grid gap-3.5;
}
.chart-row {
  @apply grid gap-3.5 min-w-0;
}
.primary-row {
  @apply grid-cols-[1.45fr_1fr];
}
.secondary-row {
  @apply grid-cols-[1.2fr_1fr_1fr];
}
.report-panel {
  @apply w-full min-h-0 p-4 bg-white border border-[#edf2fa] rounded-[10px] overflow-hidden;
}
.report-panel :deep(h2) {
  @apply text-base text-[#10194c] mb-1.5;
}
.chart-caption {
  @apply text-[11px] text-slate-500 mb-3;
}
.empty-chart {
  @apply grid place-items-center min-h-[150px] text-slate-500 text-[13px];
}
.report-panel :deep(.doughnut-chart-wrapper) {
  @apply py-1.5 px-0 gap-3;
}
.report-panel :deep(.doughnut-chart svg) {
  @apply w-full max-h-[190px];
}
.report-panel :deep(.legend) {
  @apply text-[11px];
}
.report-panel :deep(.border-t-2) {
  @apply hidden;
}
.rankings {
  @apply grid gap-4 pt-5;
}
.ranking {
  @apply grid grid-cols-[85px_1fr_24px] gap-2 items-center text-xs text-[#405679];
}
.ranking > span {
  @apply truncate;
}
.track {
  @apply h-3.5 bg-[#f3f6fb] rounded-sm;
}
.track > div {
  @apply h-full bg-gradient-to-r from-[#548eff] to-[#1559e9] rounded-sm;
}
.chart-notice {
  @apply text-red-700 text-[13px];
}
@media (max-width: 1200px) {
  .secondary-row {
    @apply grid-cols-2;
  }
  .secondary-row > :last-child {
    @apply col-span-full;
  }
}
@media (max-width: 800px) {
  .primary-row,
  .secondary-row {
    @apply grid-cols-1;
  }
}
</style>
