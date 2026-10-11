import { shallowMount } from "@vue/test-utils";
import ReportCharts from "@/components/reports/ReportCharts.vue";
it("aggregates backend revenue and disjoint reservation statuses", () => {
  const wrapper = shallowMount(ReportCharts, {
    props: {
      reservations: [
        {
          roomName: "A",
          checkinTime: "2026-10-01T10:00:00",
          gain: "250.00",
          status: "Completa",
        },
        {
          roomName: "A",
          checkinTime: "2026-10-01T12:00:00",
          gain: "100.00",
          status: "Activa",
        },
        {
          roomName: "B",
          checkinTime: "2026-10-02T10:00:00",
          gain: 0,
          status: "Pagamento Pendente",
        },
      ],
    },
  });
  expect(wrapper.vm.dailyRevenue).toEqual([
    { label: "2026-10-01", value: 350 },
    { label: "2026-10-02", value: 0 },
  ]);
  expect(wrapper.vm.topRooms[0]).toEqual({ label: "A", value: 2 });
  expect(
    wrapper.vm.statusParts.reduce((sum, part) => sum + part.value, 0)
  ).toBe(3);
  expect(wrapper.vm.roomRevenue[0].value).toBe(350);
  wrapper.unmount();
});
