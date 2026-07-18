<template>
  <div
    class="pagination flex items-center justify-between px-4 py-3 bg-white border-t border-slate-200 rounded"
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
        aria-label="Página anterior"
      >
        <FontAwesomeIcon icon="chevron-left" />
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
            'pagination-page-button--active': page === pagination.currentPage,
          }"
          :aria-current="page === pagination.currentPage ? 'page' : undefined"
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
        aria-label="Próxima página"
      >
        <FontAwesomeIcon icon="chevron-right" />
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
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "TablePagination",
  components: { FontAwesomeIcon },
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
  @apply w-8 h-8 flex items-center justify-center rounded-md border border-secondary bg-lightVariants-royalBlue text-secondary transition duration-200;
}

.pagination-button:hover:not(:disabled) {
  @apply bg-secondary text-white;
}

.pagination-button:focus-visible,
.pagination-page-button:focus-visible,
.items-per-page-select:focus-visible {
  @apply outline-none ring-2 ring-secondary ring-offset-2;
}

.pagination-button:disabled {
  @apply cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300;
}

.pagination-page-button {
  @apply w-8 h-8 flex items-center justify-center rounded-md border border-slate-200 bg-white text-sm font-medium text-slate-600 transition duration-200;
}

.pagination-page-button:hover:not(:disabled):not(
    .pagination-page-button--active
  ) {
  @apply border-secondary bg-lightVariants-royalBlue text-secondary;
}

.pagination-page-button--active {
  @apply border-secondary bg-secondary text-white shadow-sm;
}

.items-per-page-select {
  @apply border-slate-300 text-primary focus:border-secondary;
}
</style>
