<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden">
    <table>
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
</template>

<script>
export default {
  name: "MainTable",
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: rgba(0, 53, 26, 0.05);
}

th {
  @apply py-4 px-8 font-black text-primary text-left border-b border-gray-200;
}

td {
  @apply py-4 px-8 border-b border-gray-100;
}
tbody tr {
  @apply hover:bg-secondary-light;
}

tr:last-child td {
  border-bottom: none;
}
@media (min-width: 992px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
