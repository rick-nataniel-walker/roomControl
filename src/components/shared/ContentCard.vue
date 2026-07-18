<script>
export default {
  name: "ContentCard",
  props: {
    title: { type: String, required: true },
    styled: { type: Boolean, required: false, default: true },
  },
};
</script>

<template>
  <div :class="[styled, 'card']">
    <h2 class="text-lg font-bold mb-4">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  @apply min-h-96 w-full rounded-lg border-slate-200/80 p-4 transition duration-200 shadow-card text-left tablet:w-1/2;
}
.card {
  @apply border-slate-300 shadow-card-hover;
}
.styled {
  @apply bg-white;
}
</style>
