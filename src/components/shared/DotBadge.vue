<script>
export default {
  name: "DotBadge",
  computed: {
    badgeBgColor() {
      switch (this.type) {
        case "danger":
          return "bg-red-50 border-red-400";
        case "warning":
          return "bg-lightVariants-goldAccent border-orange-400";
        case "success":
          return "bg-lightVariants-emerald border-green-400";
        default:
          return "bg-lightVariants-mediumGray border-gray-400 ";
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
    type: String,
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
  <div class="flex items-center justify-between">
    <div :class="['dot', badgeFormat]"></div>
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
  @apply h-6 w-6;
}
</style>
