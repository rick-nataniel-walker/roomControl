<template>
  <div class="tag-selector-component">
    <form-group :label="label" type="hidden">
      <template #misc>
        <div class="flex flex-wrap gap-2 mt-2">
          <div
            v-for="tag in tags"
            :key="tag.id"
            class="px-4 py-1 rounded-full text-sm cursor-pointer transition-all duration-200"
            :class="[
              modelValue.includes(tag.id)
                ? 'bg-primary text-white'
                : 'bg-white text-primary-800 hover:bg-primary hover:text-white',
            ]"
            @click="toggleTag(tag.id)"
          >
            {{ tag.name }}
          </div>
        </div>
      </template>
    </form-group>
  </div>
</template>

<script>
import FormGroup from "@/components/form/FormGroup";
export default {
  name: "TagSelector",
  components: { FormGroup },
  props: {
    label: {
      type: String,
      default: "Palavras-chave",
    },
    modelValue: {
      type: Array,
      default: () => [],
    },
    tags: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  methods: {
    toggleTag(tagId) {
      const newValue = [...this.modelValue];
      const index = newValue.indexOf(tagId);

      if (index > -1) {
        newValue.splice(index, 1);
      } else {
        newValue.push(tagId);
      }

      this.$emit("update:modelValue", newValue);
    },
  },
};
</script>

<style scoped></style>
