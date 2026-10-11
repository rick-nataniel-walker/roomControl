import { apiClient } from "@/api/apiClient";

export function fetchAuditReservations(filters, pageNumber = 0, size = 10) {
  const base = "/api/admin/reservations/";
  const params = { pageNumber, size, sortField: "id", sortDir: "desc" };
  let path = base;
  if (filters.mode === "room")
    path += `search/roomname/${encodeURIComponent(filters.roomName.trim())}`;
  if (filters.mode === "status")
    path += `search/status/${encodeURIComponent(filters.status)}`;
  if (filters.mode === "dates") {
    path += "search/checkin";
    Object.assign(params, {
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
    if (filters.status) params.status = filters.status;
  }
  return apiClient.get(path, { params });
}

export function fetchAuditSummary({ startDate, endDate }) {
  return startDate === endDate
    ? apiClient.get("/api/statistics/by/date", { params: { date: startDate } })
    : apiClient.get("/api/statistics/by/dates", {
        params: { initDate: startDate, finDate: endDate },
      });
}

export async function fetchAuditChartReservations({ startDate, endDate }) {
  const rows = [];
  for (let page = 0; ; page += 1) {
    const { data } = await fetchAuditReservations(
      { mode: "dates", startDate, endDate },
      page,
      100
    );
    rows.push(...data.data);
    if (
      data.lastPage ||
      data.data.length === 0 ||
      rows.length >= data.totalElements
    )
      return rows;
  }
}
