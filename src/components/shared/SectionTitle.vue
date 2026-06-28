<template>
  <h2 class="section-title">{{ title }}</h2>
</template>

<script>
export default {
  name: "SectionTitle",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.section-title {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  color: var(--primary);
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid rgba(0, 161, 78, 0.2);
}
</style>
