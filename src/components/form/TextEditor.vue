<template>
  <div class="form-group">
    <label v-if="label" class="form-label">{{ label }}</label>
    <quill-editor
      toolbar="full"
      theme="snow"
      class="form-control"
      v-model:content="content"
      content-type="html"
      @update:content="handleContent"
    />
  </div>
</template>

<script>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
export default {
  name: "TextEditor",
  components: {
    QuillEditor,
  },
  props: {
    label: {
      required: true,
      type: String,
    },
  },
  data() {
    return { content: "" };
  },
  methods: {
    handleContent(data) {
      this.$emit("contentChanged", data);
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
</style>
