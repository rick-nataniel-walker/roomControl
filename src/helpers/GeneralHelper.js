export const getItemByField = (items, value, field = "id") => {
  if (!Array.isArray(items)) return null;

  return items.find((item) => String(item?.[field]) === String(value)) ?? null;
};
