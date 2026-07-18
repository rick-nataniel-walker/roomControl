<template>
  <button
    class="action-btn"
    :class="`action-btn--${variant}`"
    :type="type"
    :disabled="disabled || loading"
  >
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
    variant: {
      type: String,
      default: "action",
      validator: (value) => ["action", "cancel", "delete"].includes(value),
    },
  },
};
</script>

<style scoped>
.action-btn {
  @apply inline-flex items-center justify-center gap-2 rounded-lg border-0 px-6 py-3 font-semibold transition duration-200;
}

.action-btn--action {
  @apply bg-secondary text-white;
}

.action-btn--action:hover:not(:disabled) {
  @apply -translate-y-0.5 bg-primary shadow-lg;
  box-shadow: 0 8px 20px rgba(13, 27, 61, 0.22);
}

.action-btn--cancel {
  @apply bg-white text-primary;
}

.action-btn--cancel:hover:not(:disabled) {
  @apply -translate-y-0.5 bg-lightgray shadow-md;
}

.action-btn--delete {
  @apply bg-red-500 text-white;
}

.action-btn--delete:hover:not(:disabled) {
  @apply -translate-y-0.5 bg-red-600 shadow-md;
}

.action-btn:focus-visible {
  @apply outline-none ring-2 ring-secondary ring-offset-2;
}

.action-btn:disabled {
  @apply cursor-not-allowed opacity-60;
}
</style>
