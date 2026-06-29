<template>
  <div class="form-group" :class="{ 'form-row': row }">
    <label v-if="label" :for="$attrs.id" class="form-label">{{ label }}</label>
    <component
      :is="inputType"
      :value="modelValue"
      v-bind="$attrs"
      :type="type"
      class="form-control"
      @input="handleInput"
      @change="handleChange"
    >
      <slot></slot>
    </component>
    <slot name="misc"></slot>
  </div>
</template>

<script>
export default {
  name: "FormGroup",
  inheritAttrs: false,
  props: {
    label: String,
    modelValue: [String, Number, Boolean, Date, Array, Object],
    inputType: {
      type: String,
      default: "input",
      validator: (value) =>
        ["input", "textarea", "select", "file"].includes(value),
    },
    type: {
      type: String,
      default: "text",
    },
    row: Boolean,
  },
  emits: ["update:modelValue"],
  methods: {
    handleInput(event) {
      if (this.inputType === "file" || this.type === "file") {
        this.$emit("update:modelValue", event.target.files[0]);
      } else {
        this.$emit("update:modelValue", event.target.value);
      }
    },
    handleChange(event) {
      if (this.inputType === "select") {
        this.$emit("update:modelValue", event.target.value);
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  @apply mb-4;
}

.form-group.form-row {
  @apply grid grid-cols-1 gap-5;
}

.form-label {
  @apply mb-2 block text-sm font-semibold text-primary;
}

.form-control {
  @apply w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-primary shadow-sm outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20;
}

textarea.form-control {
  @apply min-h-32 resize-y;
}

@media (min-width: 992px) {
  .form-group.form-row {
    @apply grid-cols-2;
  }
}
</style>
