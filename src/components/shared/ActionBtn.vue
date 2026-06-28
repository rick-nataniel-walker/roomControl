<template>
  <button class="btn-primary"><i :class="icon"></i> {{ text }}</button>
</template>

<script>
export default {
  name: "ActionBtn",
  props: {
    text: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.action-btn {
  padding: 8px 15px;
  border-radius: 8px;
  border: none;
  background: var(--light);
  color: var(--primary);
  font-family: inherit;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.action-btn:hover {
  background: var(--secondary);
  color: white;
}

.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 25px;
  border-radius: 8px;
  border: none;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.btn-primary:hover {
  background: var(--secondary);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 161, 78, 0.3);
}
</style>
