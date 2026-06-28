<template>
  <span class="status status-published">{{ word }}</span>
</template>

<script>
export default {
  name: "WordBadge",
  props: {
    word: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.status {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-published {
  background: rgba(0, 161, 78, 0.15);
  color: var(--secondary);
}

.status-draft {
  background: rgba(255, 165, 0, 0.15);
  color: var(--accent);
}
</style>
