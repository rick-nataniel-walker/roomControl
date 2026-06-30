<template>
  <div class="stat-card">
    <div class="stat-value-row">
      <div :class="[bgColor, color, 'stat-icon']">
        <font-awesome-icon :icon="icon" />
      </div>
      <div class="stat-number">{{ number }}</div>
    </div>
    <div class="stat-label">{{ label }}</div>
  </div>
</template>

<script>
export default {
  name: "StatisticCard",
  props: {
    icon: { type: String, required: true },
    number: { type: [String, Number], required: true },
    label: { type: String, required: true },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
  },
};
</script>

<style scoped>
.stat-card {
  @apply flex min-h-[76px] w-full flex-col items-start justify-center rounded-lg border border-slate-200/80 bg-white p-3 text-left transition duration-200;
  box-shadow: 0 2px 8px rgba(13, 27, 61, 0.04);
}

.stat-card:hover {
  @apply border-slate-300;
  box-shadow: 0 5px 14px rgba(13, 27, 61, 0.08);
}

.stat-value-row {
  @apply flex min-w-0 items-center gap-2;
}

.stat-icon {
  @apply flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs;
}

.stat-number {
  @apply min-w-0 text-sm font-bold leading-none text-primary;
}

.stat-label {
  @apply mt-2 w-full truncate text-[11px] font-medium leading-tight text-slate-600;
}

@media (min-width: 768px) {
  .stat-card {
    @apply min-h-[92px] p-4;
  }

  .stat-value-row {
    @apply gap-2.5;
  }

  .stat-icon {
    @apply h-8 w-8 text-sm;
  }

  .stat-number {
    @apply text-base;
  }

  .stat-label {
    @apply mt-2.5 text-xs;
  }
}
</style>
