<template>
  <div class="main-table-shell">
    <div class="main-table-scroll">
      <table class="main-table">
        <thead>
          <tr>
            <slot name="headers"></slot>
          </tr>
        </thead>
        <tbody>
          <slot name="body"></slot>
        </tbody>
      </table>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {
  name: "MainTable",
};
</script>

<style scoped>
.main-table-shell {
  @apply w-full overflow-hidden rounded-lg border border-slate-200/80 bg-white shadow-card;
}

.main-table-scroll {
  @apply w-full overflow-x-auto;
}

.main-table {
  @apply w-full min-w-[640px] border-collapse text-left;
}

.main-table thead {
  @apply bg-slate-50;
}

.main-table th {
  @apply border-b border-slate-200 px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-slate-500;
}

.main-table td {
  @apply border-b border-slate-100 px-5 py-4 text-sm text-primary;
}

.main-table tbody tr {
  @apply transition duration-200 hover:bg-slate-50;
}

.main-table tbody tr:last-child td {
  @apply border-b-0;
}

@media (min-width: 768px) {
  .main-table th,
  .main-table td {
    @apply px-6;
  }
}
</style>
