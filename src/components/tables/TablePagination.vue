<template>
  <div
    class="pagination flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200"
  >
    <div class="pagination-info text-sm text-gray-600">
      Mostrando {{ pagination.startItem }} a {{ pagination.endItem }} de
      {{ pagination.totalItems }} itens
    </div>

    <div class="pagination-controls flex items-center space-x-2">
      <button
        @click="$emit('page-changed', pagination.currentPage - 1)"
        :disabled="!pagination.hasPreviousPage"
        class="pagination-button"
        :class="{
          'cursor-not-allowed opacity-50': !pagination.hasPreviousPage,
          'hover:bg-gray-50': pagination.hasPreviousPage,
        }"
      >
        <i class="fas fa-chevron-left"></i>
      </button>

      <div class="flex space-x-1">
        <button
          v-if="pagination.showStartEllipsis"
          class="pagination-page-button"
          disabled
        >
          ...
        </button>

        <button
          v-for="page in pagination.pages"
          :key="page"
          @click="$emit('page-changed', page)"
          class="pagination-page-button"
          :class="{
            'bg-primary-600 text-white': page === pagination.currentPage,
            'hover:bg-gray-50': page !== pagination.currentPage,
          }"
        >
          {{ page }}
        </button>

        <button
          v-if="pagination.showEndEllipsis"
          class="pagination-page-button"
          disabled
        >
          ...
        </button>
      </div>

      <button
        @click="$emit('page-changed', pagination.currentPage + 1)"
        :disabled="!pagination.hasNextPage"
        class="pagination-button"
        :class="{
          'cursor-not-allowed opacity-50': !pagination.hasNextPage,
          'hover:bg-gray-50': pagination.hasNextPage,
        }"
      >
        <i class="fas fa-chevron-right"></i>
      </button>

      <div class="ml-4 text-sm text-gray-600">
        <select
          v-model="localItemsPerPage"
          @change="handleItemsPerPageChange"
          class="items-per-page-select border rounded px-2 py-1 text-sm"
        >
          <option value="5">5 por página</option>
          <option value="10">10 por página</option>
          <option value="20">20 por página</option>
          <option value="50">50 por página</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TablePagination",
  props: {
    pagination: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localItemsPerPage: this.pagination.itemsPerPage,
    };
  },
  methods: {
    handleItemsPerPageChange() {
      this.$emit("items-per-page-changed", parseInt(this.localItemsPerPage));
    },
  },
  watch: {
    "pagination.itemsPerPage"(newVal) {
      this.localItemsPerPage = newVal;
    },
  },
};
</script>

<style scoped>
.pagination-button {
  @apply w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-700;
}

.pagination-page-button {
  @apply w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-sm font-medium text-gray-700;
}

.items-per-page-select {
  @apply border-gray-300 focus:border-green-600 focus:ring-1 focus:ring-green-600;
}
</style>
