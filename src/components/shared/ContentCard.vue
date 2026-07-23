<script>
export default {
  name: "ContentCard",
  props: {
    title: { type: String, required: true },
    styled: {
      type: String,
      required: false,
      default: "styled",
      validator: (value) => {
        return ["styled", "none"].includes(value);
      },
    },
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
  @apply min-h-96 w-full rounded-lg border border-gray-300 p-4 text-left tablet:w-1/2;
}
.styled {
  @apply bg-light transition duration-200 shadow-card-hover;
}
</style>
