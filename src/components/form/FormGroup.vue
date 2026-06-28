<template>
  <div class="form-group" :class="{ 'form-row': row }">
    <label v-if="label" class="form-label">{{ label }}</label>
    <component
      :is="inputType"
      :value="modelValue"
      v-bind="$attrs"
      :type="type"
      @input="handleInput"
      @change="handleChange"
      class="form-control"
    >
      <slot></slot>
    </component>
    <slot name="misc"> </slot>
  </div>
</template>

<script>
export default {
  name: "FormGroup",
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
      required: false,
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
  @apply mb-6; /* margin-bottom: 25px → approx. 6 */
}

.form-group.form-row {
  @apply grid gap-5 grid-cols-1;

  /* Media query for lg+ screens */
}
@media (min-width: 992px) {
  .form-group.form-row {
    @apply grid-cols-2;
  }
}

.form-label {
  @apply block mb-2 font-semibold text-primary;
}

.form-control {
  @apply w-full px-8 py-3 border border-[rgba(0,0,0,0.1)] rounded-lg text-base focus:outline-none focus:border-secondary active:border-secondary;
}

textarea.form-control {
  @apply min-h-32 resize-y;
}
</style>
