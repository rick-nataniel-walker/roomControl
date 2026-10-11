import { fetchAuditReservations, fetchAuditSummary } from "@/api/reports";
import { apiClient } from "@/api/apiClient";
jest.mock("@/api/apiClient", () => ({ apiClient: { get: jest.fn() } }));
beforeEach(() => jest.clearAllMocks());
it.each([
  [{ mode: "all" }, "/api/admin/reservations/", {}],
  [
    { mode: "room", roomName: " A/B " },
    "/api/admin/reservations/search/roomname/A%2FB",
    {},
  ],
  [
    { mode: "status", status: "Pagamento Pendente" },
    "/api/admin/reservations/search/status/Pagamento%20Pendente",
    {},
  ],
  [
    {
      mode: "dates",
      status: "Activa",
      startDate: "2026-10-01",
      endDate: "2026-10-10",
    },
    "/api/admin/reservations/search/checkin",
    { status: "Activa", startDate: "2026-10-01", endDate: "2026-10-10" },
  ],
])("uses supported search endpoint %#", (filters, path, params) => {
  fetchAuditReservations(filters, 2, 20);
  expect(apiClient.get).toHaveBeenCalledWith(path, {
    params: {
      pageNumber: 2,
      size: 20,
      sortField: "id",
      sortDir: "desc",
      ...params,
    },
  });
});
it("uses inclusive summary dates and excludes row filters", () => {
  fetchAuditSummary({
    startDate: "2026-10-01",
    endDate: "2026-10-10",
    status: "Activa",
    roomName: "A",
  });
  expect(apiClient.get).toHaveBeenCalledWith("/api/statistics/by/dates", {
    params: { initDate: "2026-10-01", finDate: "2026-10-10" },
  });
  fetchAuditSummary({ startDate: "2026-10-10", endDate: "2026-10-10" });
  expect(apiClient.get).toHaveBeenLastCalledWith("/api/statistics/by/date", {
    params: { date: "2026-10-10" },
  });
});

it("loads every chart page without table room or status filters", async () => {
  const { fetchAuditChartReservations } = await import("@/api/reports");
  apiClient.get
    .mockResolvedValueOnce({
      data: { data: [{ id: 1 }], totalElements: 2, lastPage: false },
    })
    .mockResolvedValueOnce({
      data: { data: [{ id: 2 }], totalElements: 2, lastPage: true },
    });
  const rows = await fetchAuditChartReservations({
    startDate: "2026-10-01",
    endDate: "2026-10-10",
    roomName: "A",
    status: "Activa",
  });
  expect(rows).toEqual([{ id: 1 }, { id: 2 }]);
  expect(apiClient.get).toHaveBeenLastCalledWith(
    "/api/admin/reservations/search/checkin",
    {
      params: {
        pageNumber: 1,
        size: 100,
        sortField: "id",
        sortDir: "desc",
        startDate: "2026-10-01",
        endDate: "2026-10-10",
      },
    }
  );
});
