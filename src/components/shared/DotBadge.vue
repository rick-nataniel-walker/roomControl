<script>
export default {
  name: "DotBadge",
  computed: {
    badgeBgColor() {
      switch (this.type) {
        case "danger":
          return "bg-red-600";
        case "warning":
          return "bg-goldAccent";
        case "success":
          return "bg-emerald";
        case "secondary":
          return "bg-secondary";
        default:
          return "bg-mediumGray";
      }
    },
    badgeFormat() {
      switch (this.format) {
        case "circle":
          return "rounded-full";
        case "rectangle":
          return "w-6 h-2 rounded-sm";
        default:
          return "rounded-none";
      }
    },
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    format: String,
    legend: {
      type: String,
      required: true,
    },
    statistic: String,
  },
};
</script>

<template>
  <div class="flex items-center gap-4">
    <div :class="['dot', badgeFormat, badgeBgColor]"></div>
    <div>
      <span class="text-sm">{{ legend }}</span>
    </div>
    <div>
      <span class="text-sm">{{ statistic }}</span>
    </div>
  </div>
</template>

<style scoped>
.dot {
  @apply h-3 w-3;
}
</style>
