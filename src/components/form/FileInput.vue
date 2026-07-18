<template>
  <div class="relative w-full form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <div
      v-if="preview"
      class="file-preview"
      aria-label="Pré-visualização do ficheiro"
    >
      <img
        :id="previewId"
        class="file-preview__image"
        :alt="`Pré-visualização de ${label}`"
      />
    </div>
    <input
      :type="type"
      :name="name"
      :id="name"
      hidden
      @change="checkError"
      :accept="formats"
    />
    <input
      type="text"
      name="filename_holder"
      :id="id"
      class="form-control"
      placeholder=" "
      :data-required="required"
      disabled
      :value="val"
      @focusout="checkError"
    />
    <span class="text-red-700 text-sm ps-4" v-if="required && hasError"
      >{{ label }} não pode ser vazio</span
    >
    <button
      type="button"
      class="flex items-center absolute bottom-0 end-0 p-2.5 py-3.5 text-sm font-medium text-white bg-primary rounded-e-lg border border-primary hover:border-secondary hover:bg-secondary focus:ring-offset-secondary focus:outline-none focus:ring-offset-p-color"
      @click="upload"
      :disabled="disabled"
    >
      Carregar o ficheiro
    </button>
  </div>
  <div v-if="hasError" class="text-red-700 text-xs ps-2">
    <ul>
      <li v-for="error in validationErrors" :key="error">{{ error }}</li>
    </ul>
  </div>
</template>

<script>
import { uploadFile } from "@/helpers/FileUploader";
export default {
  name: "FileInput",
  props: {
    type: {
      type: String,
      default: "file",
      required: false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    label: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
      default: "filenamer",
    },
    required: {
      type: Boolean,
      required: false,
      default: false,
    },
    formats: {
      type: String,
      required: false,
      default: "application/pdf",
    },
    val: {
      type: String,
      required: false,
      default: "",
    },
    returnAsBase64: {
      type: Boolean,
      required: false,
      default: true,
    },
    preview: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      validationErrors: [],
    };
  },
  computed: {
    hasError() {
      return this.validationErrors.length > 0;
    },
    previewId() {
      return `${this.name}-preview`;
    },
  },
  methods: {
    upload() {
      uploadFile(
        this.name,
        this.id,
        this.returnAsBase64,
        this.preview ? this.previewId : null
      ).then((r) => {
        this.base64 = r;
        this.$emit("base64Img", this.base64);
      });
    },
    checkError() {
      this.validationErrors = [];
      if (this.required && this.modelValue === "")
        this.validationErrors.push(`${this.label} não pode ser vazio`);
      this.$emit("update-validations", {
        name: this.name,
        errors: this.validationErrors,
      });
      return this.validationErrors;
    },
  },
  mounted() {
    this.checkError();
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
  @apply block mb-2 text-primary;
}

.form-control {
  @apply w-full px-8 py-3 border border-[rgba(0,0,0,0.1)] rounded-lg text-base focus:outline-none focus:border-secondary active:border-secondary;
}

.file-preview {
  @apply flex items-center justify-center w-full min-h-[17rem] mb-1 overflow-hidden border border-dashed border-[rgba(0,0,0,0.1)] rounded-lg;
}

.file-preview__image {
  @apply block max-w-full max-h-80 object-contain;
}
</style>
