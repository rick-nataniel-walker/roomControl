<template>
  <button class="btn-primary" :type="type" :disabled="disabled || loading">
    <FontAwesomeIcon v-if="icon" :icon="icon" />
    <span>{{ loading ? loadingText : text }}</span>
  </button>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "ActionBtn",
  components: { FontAwesomeIcon },
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "button",
    },
    disabled: Boolean,
    loading: Boolean,
    loadingText: {
      type: String,
      default: "Aguarde...",
    },
  },
};
</script>

<style scoped>
.btn-primary {
  @apply inline-flex items-center justify-center gap-2 rounded-lg border-0 bg-secondary px-6 py-3 font-semibold text-white transition duration-200;
}

.btn-primary:hover:not(:disabled) {
  @apply -translate-y-0.5 bg-primary shadow-lg;
  box-shadow: 0 8px 20px rgba(13, 27, 61, 0.22);
}

.btn-primary:focus-visible {
  @apply outline-none ring-2 ring-secondary ring-offset-2;
}

.btn-primary:disabled {
  @apply cursor-not-allowed opacity-60;
}
</style>
