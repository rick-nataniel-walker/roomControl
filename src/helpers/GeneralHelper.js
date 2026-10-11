export const getItemByField = (items, value, field = "id") => {
  if (!Array.isArray(items)) return null;

  return items.find((item) => String(item?.[field]) === String(value)) ?? null;
};

export const money = (value) => {
  if (value == null || value === "" || !Number.isFinite(Number(value)))
    return "—";
  return new Intl.NumberFormat("pt-MZ", {
    style: "currency",
    currency: "MZN",
  }).format(Number(value));
};

export const badge = (status) => {
  if (["Vencida", "Vencido"].includes(status)) return "danger";
  if (["Activa", "Pago", "Completa"].includes(status)) return "success";
  return status === "Pagamento Pendente" ? "warning" : "basic";
};
