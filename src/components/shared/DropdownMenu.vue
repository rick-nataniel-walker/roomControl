<template>
  <div
    class="dropdown border border-gray-200 rounded-lg"
    :class="`dropdown--${placement}`"
    role="menu"
  >
    <ul
      class="list-none border-b border-gray-200"
      v-for="(dropdownChildren, groupIndex) in dropdownList"
      :key="groupIndex"
    >
      <li
        v-for="(item, itemIndex) in dropdownChildren.menuItems"
        :key="`${groupIndex}-${itemIndex}`"
        class="dropdown-item"
      >
        <button
          type="button"
          role="menuitem"
          :disabled="item.disabled"
          @click="handleClick(item, itemIndex, $event)"
        >
          {{ item.name }}
        </button>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "DropdownMenu",
  emits: ["select", "dismiss"],
  props: {
    dropdownList: {
      type: Array,
      required: true,
    },
    placement: {
      type: String,
      default: "bottom-start",
      validator: (value) =>
        ["bottom-start", "bottom-end", "top-start", "top-end"].includes(value),
    },
  },
  mounted() {
    document.addEventListener("mousedown", this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener("mousedown", this.handleOutsideClick);
  },
  methods: {
    handleClick(item, index, event) {
      this.$emit("select", { ...item, index, event });
    },
    handleOutsideClick(event) {
      if (!this.$el.contains(event.target)) {
        this.$emit("dismiss");
      }
    },
  },
};
</script>
<style scoped>
.dropdown {
  @apply absolute min-w-max gap-4 text-sm bg-white shadow-dropdown z-50;
}
.dropdown--bottom-start {
  @apply left-0 top-full mt-2;
}
.dropdown--bottom-end {
  @apply right-0 top-full mt-2;
}
.dropdown--top-start {
  @apply bottom-full left-0 mb-2;
}
.dropdown--top-end {
  @apply bottom-full right-0 mb-2;
}
.dropdown-item {
  @apply bg-white;
}
.dropdown-item button {
  @apply block w-full whitespace-nowrap px-4 py-2 text-left;
}
.dropdown-item button:not(:disabled):hover {
  @apply bg-accent text-light;
}
.dropdown-item button:disabled {
  @apply cursor-not-allowed bg-slate-50 text-slate-400 opacity-60;
}
</style>
