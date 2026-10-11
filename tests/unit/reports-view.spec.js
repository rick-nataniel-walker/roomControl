import { mount, flushPromises } from "@vue/test-utils";
import ReportsView from "@/views/ReportsView.vue";
import {
  fetchAuditReservations,
  fetchAuditSummary,
  fetchAuditChartReservations,
} from "@/api/reports";
jest.mock("@/api/reports", () => ({
  fetchAuditReservations: jest.fn(),
  fetchAuditSummary: jest.fn(),
  fetchAuditChartReservations: jest.fn(),
}));
const record = {
  id: 1,
  roomName: "Quarto A",
  status: "Vencida",
  gain: "1500.00",
  loss: "25.50",
  overdueSeconds: 3661,
  checkinTime: "2026-10-10T12:00:00",
  paymentConfirm: true,
};
const create = () =>
  mount(ReportsView, {
    global: {
      stubs: {
        ContentWrapper: { template: '<div><slot name="body" /></div>' },
        StatisticCard: {
          props: ["number", "label"],
          template: "<div>{{ label }} {{ number }}</div>",
        },
        ActionBtn: true,
        RouterLink: true,
        ReportCharts: true,
        TablePagination: true,
        FontAwesomeIcon: true,
      },
    },
  });
beforeEach(() => {
  jest.clearAllMocks();
  fetchAuditChartReservations.mockResolvedValue([record]);
  fetchAuditReservations.mockResolvedValue({
    data: { data: [record], totalElements: 21 },
  });
  fetchAuditSummary.mockResolvedValue({
    data: {
      revenue: 5000,
      overdue: { loss: 70, seconds: 3661 },
      allReservationsCount: 21,
    },
  });
});
it("renders authoritative row financial values and separately scoped summary", async () => {
  const wrapper = create();
  await flushPromises();
  expect(wrapper.text()).toContain("Quarto A");
  expect(wrapper.text()).toContain(wrapper.vm.money("1500.00"));
  expect(wrapper.text()).toContain(wrapper.vm.money("25.50"));
  expect(wrapper.text()).toContain("1h 1min 1s");
  expect(wrapper.text()).toContain("independentemente do quarto");
  expect(wrapper.vm.money(undefined)).toBe("—");
  expect(wrapper.vm.money(0)).not.toBe("—");
  wrapper.unmount();
});
it("paginates with applied filters, not unsaved form edits", async () => {
  const wrapper = create();
  await flushPromises();
  wrapper.vm.filters.mode = "room";
  wrapper.vm.filters.roomName = "A";
  await wrapper.vm.search();
  wrapper.vm.filters.roomName = "B";
  await wrapper.vm.changePage({ page: 2, pageSize: 20 });
  expect(fetchAuditReservations).toHaveBeenLastCalledWith(
    expect.objectContaining({ mode: "room", roomName: "A" }),
    1,
    20
  );
  expect(fetchAuditSummary).toHaveBeenCalledTimes(2);
  wrapper.unmount();
});
it("rejects invalid ranges without issuing requests", async () => {
  const wrapper = create();
  await flushPromises();
  wrapper.vm.filters.startDate = "2026-10-11";
  wrapper.vm.filters.endDate = "2026-10-10";
  await wrapper.vm.search();
  expect(wrapper.vm.validationError).toBeTruthy();
  expect(fetchAuditReservations).toHaveBeenCalledTimes(1);
  wrapper.unmount();
});
it("shows independent errors and permits retry", async () => {
  fetchAuditReservations.mockRejectedValueOnce(new Error("offline"));
  const wrapper = create();
  await flushPromises();
  expect(wrapper.text()).toContain("Erro ao carregar as reservas");
  expect(wrapper.vm.summary.revenue).toBe(5000);
  await wrapper.vm.search();
  expect(wrapper.vm.tableError).toBe("");
  expect(wrapper.vm.rows).toHaveLength(1);
  wrapper.unmount();
});
it("ignores late responses after a newer search", async () => {
  let resolve;
  fetchAuditReservations.mockReturnValueOnce(
    new Promise((done) => {
      resolve = done;
    })
  );
  const wrapper = create();
  await wrapper.vm.search();
  resolve({ data: { data: [], totalElements: 0 } });
  await flushPromises();
  expect(wrapper.vm.rows).toHaveLength(1);
  wrapper.unmount();
});
it("shows an empty state", async () => {
  fetchAuditReservations.mockResolvedValue({
    data: { data: [], totalElements: 0 },
  });
  const wrapper = create();
  await flushPromises();
  expect(wrapper.text()).toContain("Nenhuma reserva encontrada");
  wrapper.unmount();
});

it.each([
  ["Vencida", true, 250, 125, 43200, "12h 0min 0s"],
  ["Pagamento Pendente", false, 0, 0, 0, "0h 0min 0s"],
  ["Completa", true, "250.00", "125.00", 43200, "12h 0min 0s"],
])(
  "renders confirmed financial contract for %s",
  async (status, paymentConfirm, gain, loss, overdueSeconds, duration) => {
    fetchAuditReservations.mockResolvedValue({
      data: {
        data: [
          {
            ...record,
            status,
            paymentConfirm,
            gain,
            loss,
            overdueSeconds,
            finalPrice: null,
            basePrice: 999,
          },
        ],
        totalElements: 1,
      },
    });
    const wrapper = create();
    await flushPromises();
    const cells = wrapper.findAll("tbody tr td");
    expect(cells[8].text()).toBe(wrapper.vm.money(gain));
    expect(cells[9].text()).toBe(wrapper.vm.money(loss));
    expect(cells[10].text()).toBe(duration);
    wrapper.unmount();
  }
);

it("sets inclusive quick periods without changing table search mode", () => {
  const vm = { filters: { mode: "room" }, queueSearch: jest.fn() };
  ReportsView.methods.setPeriod.call(vm, 7);
  const start = new Date(vm.filters.startDate + "T12:00:00");
  const end = new Date(vm.filters.endDate + "T12:00:00");
  expect(Math.round((end - start) / 86400000)).toBe(6);
  expect(vm.filters.mode).toBe("room");
  expect(vm.selectedPreset).toBe(7);
});

it("automatically loads the selected period", async () => {
  const wrapper = create();
  await flushPromises();
  await wrapper.vm.setPeriod(7);
  expect(fetchAuditSummary).toHaveBeenLastCalledWith(
    expect.objectContaining({
      startDate: wrapper.vm.filters.startDate,
      endDate: wrapper.vm.filters.endDate,
    })
  );
  await wrapper.vm.setPeriod(1);
  expect(wrapper.vm.applied.startDate).toBe(wrapper.vm.applied.endDate);
  expect(fetchAuditSummary).toHaveBeenCalledTimes(3);
  wrapper.unmount();
});

it("searches on status changes without a submit button", async () => {
  const wrapper = create();
  await flushPromises();
  const status = wrapper
    .findAllComponents({ name: "FormGroup" })
    .find((group) => group.props("label") === "Estado");
  status.vm.$emit("update:modelValue", "Vencida");
  await flushPromises();
  expect(fetchAuditReservations).toHaveBeenLastCalledWith(
    expect.objectContaining({ status: "Vencida" }),
    0,
    10
  );
  expect(
    wrapper
      .findAll("button")
      .some((button) => ["Aplicar", "Pesquisar"].includes(button.text()))
  ).toBe(false);
  wrapper.unmount();
});

it("debounces room typing and clears pending work on unmount", async () => {
  jest.useFakeTimers();
  const wrapper = create();
  await Promise.resolve();
  wrapper.vm.filters.mode = "room";
  wrapper.vm.filters.roomName = "A";
  wrapper.vm.queueSearch(300);
  wrapper.vm.filters.roomName = "AB";
  wrapper.vm.queueSearch(300);
  expect(fetchAuditReservations).toHaveBeenCalledTimes(1);
  jest.advanceTimersByTime(300);
  expect(fetchAuditReservations).toHaveBeenCalledTimes(2);
  expect(fetchAuditReservations).toHaveBeenLastCalledWith(
    expect.objectContaining({ roomName: "AB" }),
    0,
    10
  );
  wrapper.vm.queueSearch(300);
  wrapper.unmount();
  jest.advanceTimersByTime(300);
  expect(fetchAuditReservations).toHaveBeenCalledTimes(2);
  jest.useRealTimers();
});

it("formats backend date strings and handles missing checkout dates", () => {
  const format = ReportsView.methods.formatDateTime;
  expect(format("2026-10-10T12:34:56")).toBe("2026-10-10 12:34");
  expect(format(null)).toBe("—");
  expect(format("")).toBe("—");
  expect(format("invalid")).toBe("—");
});
