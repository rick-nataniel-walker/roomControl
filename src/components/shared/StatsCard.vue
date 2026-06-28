<template>
  <div class="stat-card">
    <div :class="[bgColor, color, iconClass]">
      <i :class="icon"></i>
    </div>
    <div class="stat-content">
      <div class="stat-number">{{ number }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatsCard",
  props: {
    icon: { type: String, required: true },
    number: { type: String, required: true },
    label: { type: String, required: true },
    bgColor: { type: String, required: true },
    color: { type: String, required: true },
  },
  computed: {
    iconClass() {
      return {
        statIcon: true,
      };
    },
  },
};
</script>

<style scoped>
.stat-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 161, 78, 0.15);
}

.statIcon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}

.stat-label {
  font-size: 1rem;
  color: var(--gray);
}
</style>
