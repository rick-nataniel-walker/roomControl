<script>
export default {
  name: "DoughnutChartPart",
  props: {
    value: {
      type: Number,
      required: true,
    },
    offset: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    normalizedValue() {
      return Math.min(100, Math.max(0, this.value));
    },
    strokeColor() {
      const colors = {
        danger: "#dc2626",
        warning: "#d4af37",
        success: "#10b981",
        secondary: "#1e3aba",
      };

      return colors[this.type] || "#94a3b8";
    },
  },
};
</script>

<template>
  <circle
    class="doughnut-chart-part"
    cx="60"
    cy="60"
    r="48"
    pathLength="100"
    fill="none"
    :stroke="strokeColor"
    stroke-width="14"
    :stroke-dasharray="`${normalizedValue} ${100 - normalizedValue}`"
    :stroke-dashoffset="-offset"
  />
</template>

<style scoped>
.doughnut-chart-part {
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dasharray 300ms ease;
}
</style>
