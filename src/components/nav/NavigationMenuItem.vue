<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "NavigationMenuItem",
  components: { FontAwesomeIcon },
  props: {
    icon: { type: String, required: true },
    label: { type: String, required: true },
    active: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
};
</script>

<template>
  <button
    class="navigation-item"
    :class="{ 'navigation-item-active': active }"
    type="button"
    :aria-current="active ? 'page' : undefined"
    @click="$emit('click')"
  >
    <FontAwesomeIcon :icon="icon" class="navigation-icon" />
    <span class="navigation-label">{{ label }}</span>
  </button>
</template>

<style scoped>
.navigation-item {
  @apply flex w-full flex-col items-center justify-center gap-1.5 rounded-lg border-0 bg-transparent px-2 py-3 text-mediumGray transition duration-200 hover:bg-slate-100 hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary/30 tablet:min-h-[42px] tablet:flex-row tablet:justify-start tablet:gap-3 tablet:px-3 tablet:py-2.5 tablet:text-slate-300 tablet:hover:bg-white/10 tablet:hover:text-white;
}

.navigation-item-active {
  @apply bg-secondary/10 text-secondary shadow-none hover:bg-secondary/15 hover:text-secondary tablet:bg-gradient-to-r tablet:from-secondary tablet:to-indigo-500 tablet:text-white tablet:shadow-md tablet:shadow-secondary/20 tablet:hover:from-secondary tablet:hover:to-indigo-500 tablet:hover:text-white;
}

.navigation-icon {
  @apply h-5 w-5 shrink-0 text-base tablet:h-4 tablet:w-4 tablet:text-sm;
}

.navigation-label {
  @apply text-[10px] font-medium leading-none tablet:text-[13px] tablet:leading-normal;
}
</style>
