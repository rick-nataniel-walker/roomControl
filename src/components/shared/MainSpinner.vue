<template>
  <div
    v-if="active"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30"
  >
    <div class="relative">
      <!-- Spinner -->
      <div
        class="w-16 h-16 border-4 border-primary-light rounded-full border-t-primary border-r-secondary border-b-accent animate-spin"
      ></div>

      <!-- Optional loading text -->
      <p v-if="text" class="mt-4 text-center text-dark font-medium">
        {{ text }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "MainSpinner",
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      default: "",
    },
  },
};
</script>

<style scoped></style>
