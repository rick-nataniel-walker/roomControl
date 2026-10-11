<template>
  <p v-if="loading" class="chart-empty" role="status">A carregar...</p>
  <p v-else-if="!items.length" class="chart-empty">Sem dados no período.</p>
  <div v-else class="bar-chart">
    <svg viewBox="0 0 600 210" role="img" :aria-label="label">
      <g v-for="tick in [0, 1, 2, 3, 4]" :key="tick">
        <line
          x1="55"
          x2="590"
          :y1="175 - tick * 38"
          :y2="175 - tick * 38"
          stroke="#e5edf8"
        />
        <text x="48" :y="179 - tick * 38" text-anchor="end">
          {{ Math.round((maximum * tick) / 4).toLocaleString("pt-MZ") }}
        </text>
      </g>
      <g v-for="(item, index) in items" :key="item.label">
        <rect
          :x="58 + (index * 532) / items.length"
          :y="175 - (item.value / maximum) * 152"
          :width="Math.max(1, 532 / items.length - 5)"
          :height="(item.value / maximum) * 152"
          fill="#387cff"
          rx="2"
        >
          <title>
            {{ item.label }}: {{ item.value.toLocaleString("pt-MZ") }}
          </title>
        </rect>
        <text
          v-if="index % Math.max(1, Math.ceil(items.length / 6)) === 0"
          :x="58 + ((index + 0.5) * 532) / items.length"
          y="195"
          text-anchor="middle"
        >
          {{
            item.label.length === 10 && item.label.includes("-")
              ? item.label.slice(5)
              : item.label
          }}
        </text>
      </g>
    </svg>
    <details>
      <summary>Ver valores</summary>
      <ul>
        <li v-for="item in items" :key="item.label">
          {{ item.label }}: {{ item.value.toLocaleString("pt-MZ") }}
        </li>
      </ul>
    </details>
  </div>
</template>
<script>
export default {
  props: {
    items: { type: Array, default: () => [] },
    loading: Boolean,
    label: String,
  },
  computed: {
    maximum() {
      return Math.max(1, ...this.items.map((item) => item.value));
    },
  },
};
</script>
<style scoped>
.bar-chart svg {
  @apply w-full min-h-[170px] max-h-[230px];
}
.bar-chart text {
  @apply fill-[#526785] text-[11px];
}
.bar-chart details {
  @apply text-[11px] text-slate-500 max-h-[100px] overflow-auto;
}
.chart-empty {
  @apply min-h-[180px] grid place-items-center text-slate-500 text-[13px];
}
</style>
