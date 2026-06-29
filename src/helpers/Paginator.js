/**
 * Paginates an array of items
 *
 * @param {Array} items - The full array of items to paginate
 * @param {Object} options - Pagination options
 * @param {number} options.currentPage - Current page number (1-based)
 * @param {number} options.itemsPerPage - Number of items per page
 * @returns {Object} - Pagination result containing paginated items and metadata
 */
export function paginate(items, { currentPage = 1, itemsPerPage = 10 }) {
  // Validate inputs
  if (!Array.isArray(items)) {
    throw new Error("Items must be an array");
  }

  currentPage = parseInt(currentPage);
  itemsPerPage = parseInt(itemsPerPage);

  if (isNaN(currentPage)) currentPage = 1;
  if (isNaN(itemsPerPage)) itemsPerPage = 10;

  // Calculate pagination values
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ensure currentPage is within valid range
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages && totalPages > 0) currentPage = totalPages;

  // Calculate start and end indexes
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  // Get paginated items
  const paginatedItems = items.slice(startIndex, endIndex);

  // Return pagination result
  return {
    items: paginatedItems,
    currentPage,
    itemsPerPage,
    totalItems,
    totalPages,
    startItem: totalItems > 0 ? startIndex + 1 : 0,
    endItem: totalItems > 0 ? endIndex : 0,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

/**
 * Generates pagination controls metadata
 *
 * @param {Object} pagination - Pagination result from paginate()
 * @param {number} maxVisiblePages - Maximum number of page buttons to show
 * @returns {Object} - Pagination controls metadata
 */
export function getPaginationControls(pagination, maxVisiblePages = 5) {
  const { currentPage, totalPages } = pagination;

  // Calculate visible page numbers
  let startPage, endPage;

  if (totalPages <= maxVisiblePages) {
    startPage = 1;
    endPage = totalPages;
  } else {
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (currentPage <= halfVisible + 1) {
      startPage = 1;
      endPage = maxVisiblePages;
    } else if (currentPage >= totalPages - halfVisible) {
      startPage = totalPages - maxVisiblePages + 1;
      endPage = totalPages;
    } else {
      startPage = currentPage - halfVisible;
      endPage = currentPage + halfVisible;
    }
  }

  // Create page array
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return {
    ...pagination,
    pages,
    showStartEllipsis: startPage > 1,
    showEndEllipsis: endPage < totalPages,
  };
}
