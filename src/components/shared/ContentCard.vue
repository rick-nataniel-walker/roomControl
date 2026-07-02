<script>
export default {
  name: "ContentCard",
  props: {
    title: { type: String, required: true },
  },
};
</script>

<template>
  <div class="card styled">
    <h2 class="text-xl">{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  @apply w-1/2 rounded border-gray-200 p-4 gap-4;
}
.styled {
  @apply bg-white;
}
</style>
