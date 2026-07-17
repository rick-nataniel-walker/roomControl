<template>
  <div
    class="form-group"
    :class="{ 'form-row': row, 'has-error': showRequiredError }"
  >
    <label v-if="label" :for="$attrs.id" class="form-label">
      {{ label }}
      <span v-if="isRequired" class="required-marker" aria-hidden="true"
        >*</span
      >
      <span v-if="isRequired" class="sr-only">(obrigatório)</span>
    </label>
    <div class="control-wrapper">
      <component
        :is="controlTag"
        :value="modelValue"
        v-bind="$attrs"
        :type="controlType"
        class="form-control"
        :class="{ 'has-inner-icon': showsIcon }"
        :aria-invalid="showRequiredError ? 'true' : undefined"
        :aria-describedby="describedBy"
        @input="handleInput"
        @change="handleChange"
        @blur="handleBlur"
        @invalid="handleInvalid"
      >
        <slot></slot>
      </component>

      <button
        v-if="showsIcon && iconClickable"
        class="inner-icon inner-icon-button"
        type="button"
        :aria-label="iconLabel"
        @click="$emit('icon-click')"
      >
        <FontAwesomeIcon :icon="icon" />
      </button>
      <span v-else-if="showsIcon" class="inner-icon" aria-hidden="true">
        <FontAwesomeIcon :icon="icon" />
      </span>
    </div>
    <p v-if="showRequiredError" :id="errorId" class="form-error" role="alert">
      {{ requiredMessage }}
    </p>
    <slot name="misc"></slot>
  </div>
</template>

<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "FormGroup",
  components: { FontAwesomeIcon },
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
    icon: {
      type: [String, Array, Object],
      default: "",
    },
    iconClickable: Boolean,
    iconLabel: {
      type: String,
      default: "Ação do campo",
    },
    requiredMessage: {
      type: String,
      default: "Este campo é obrigatório.",
    },
    row: Boolean,
  },
  emits: ["update:modelValue", "icon-click"],
  data() {
    return {
      touched: false,
    };
  },
  computed: {
    controlTag() {
      return this.inputType === "file" ? "input" : this.inputType;
    },
    controlType() {
      if (this.inputType === "file") {
        return "file";
      }

      return this.inputType === "input" ? this.type : undefined;
    },
    showsIcon() {
      return Boolean(this.icon) && this.inputType !== "select";
    },
    isRequired() {
      return (
        this.$attrs.required !== undefined && this.$attrs.required !== false
      );
    },
    isEmpty() {
      if (Array.isArray(this.modelValue)) {
        return this.modelValue.length === 0;
      }

      return (
        this.modelValue === null ||
        this.modelValue === undefined ||
        (typeof this.modelValue === "string" && this.modelValue.trim() === "")
      );
    },
    showRequiredError() {
      return this.isRequired && this.touched && this.isEmpty;
    },
    errorId() {
      return this.$attrs.id ? `${this.$attrs.id}-error` : undefined;
    },
    describedBy() {
      const existingDescription = this.$attrs["aria-describedby"];

      return (
        [existingDescription, this.showRequiredError ? this.errorId : null]
          .filter(Boolean)
          .join(" ") || undefined
      );
    },
  },
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
    handleBlur() {
      this.touched = true;
    },
    handleInvalid(event) {
      event.preventDefault();
      this.touched = true;
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
  @apply block text-sm text-primary mb-1;
}

.required-marker {
  @apply ml-0.5 text-red-600;
}

.form-control {
  @apply w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-primary shadow-sm outline-none transition placeholder:text-slate-400 focus:border-secondary focus:ring-2 focus:ring-secondary/20;
}

.control-wrapper {
  @apply relative;
}

.form-control.has-inner-icon {
  @apply pr-12;
}

.inner-icon {
  @apply absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center text-slate-500;
}

.inner-icon-button {
  @apply rounded transition hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30;
}

select.form-control {
  padding-right: 5px;
}

.has-error .form-control {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500/20;
}

.form-error {
  @apply mt-1.5 text-sm font-medium text-red-600;
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
