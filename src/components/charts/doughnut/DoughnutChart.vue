<script>
import DotBadge from "@/components/shared/DotBadge.vue";
import DoughnutChartPart from "@/components/charts/doughnut/DoughnutChartPart.vue";

export default {
  name: "DoughnutChart",
  components: {
    DoughnutChartPart,
    DotBadge,
  },
  data() {
    return {
      chartParts: [
        { legend: "Disponível", type: "success", value: 45 },
        { legend: "Em limpeza", type: "warning", value: 35 },
        { legend: "Ocupado", type: "danger", value: 10 },
        { legend: "Reservado", type: "secondary", value: 10 },
      ],
    };
  },
  computed: {
    partsWithOffsets() {
      let offset = 0;

      return this.chartParts.map((part) => {
        const chartPart = { ...part, offset };
        offset += part.value;
        return chartPart;
      });
    },
  },
};
</script>

<template>
  <div class="char-area">
    <div class="doughnut-chart-wrapper">
      <div class="doughnut-chart">
        <svg
          viewBox="0 0 120 120"
          role="img"
          aria-label="Estatística dos quartos"
        >
          <circle
            cx="60"
            cy="60"
            r="48"
            fill="none"
            stroke="#f2f4f7"
            stroke-width="14"
          />
          <DoughnutChartPart
            v-for="part in partsWithOffsets"
            :key="part.type"
            :value="part.value"
            :offset="part.offset"
            :type="part.type"
          />
        </svg>
      </div>
      <div class="legend">
        <DotBadge
          v-for="part in chartParts"
          :key="part.type"
          :legend="part.legend"
          :type="part.type"
          :statistic="`${part.value}%`"
          class="my-1"
        />
      </div>
    </div>
    <div class="border-t-2 border-gray-200 my-5"></div>
  </div>
</template>

<style scoped>
.doughnut-chart-wrapper {
  @apply flex items-center p-4 gap-8;
}

.doughnut-chart {
  @apply w-1/2;
}

.doughnut-chart svg {
  @apply w-[70%] mx-auto;
}

.legend {
  @apply w-1/2;
}
</style>
