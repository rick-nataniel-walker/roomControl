<script>
export default {
  name: "TextBadge",
  props: {
    value: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    badgeType() {
      switch (this.type) {
        case "danger":
          return "text-red-500";
        case "warning":
          return "text-orange-400";
        case "success":
          return "text-green-600";
        default:
          return "text-gray-600";
      }
    },
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
  },
};
</script>

<template>
  <div :class="[badgeBgColor, 'badge']">
    <span :class="[badgeType]">{{ value }}</span>
  </div>
</template>

<style scoped>
.badge {
  @apply font-semibold w-fit py-1 px-4 rounded-lg text-sm border;
}
</style>
