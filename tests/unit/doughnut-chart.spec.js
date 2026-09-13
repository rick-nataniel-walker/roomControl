import { mount } from "@vue/test-utils";
import DoughnutChart from "@/components/charts/doughnut/DoughnutChart.vue";
import DoughnutChartPart from "@/components/charts/doughnut/DoughnutChartPart.vue";

describe("DoughnutChart", () => {
  it("uses the supplied total and updates when statistics change", async () => {
    const wrapper = mount(DoughnutChart, {
      props: {
        total: 200,
        totalLegend: "All reservations",
        chartParts: [
          { legend: "Confirmed", type: "secondary", value: 50 },
          { legend: "Pending", type: "warning", value: 100 },
        ],
      },
    });
    const parts = () => wrapper.findAllComponents(DoughnutChartPart);
    expect(parts().map((part) => part.props("value"))).toEqual([25, 50]);
    expect(parts().map((part) => part.props("offset"))).toEqual([0, 25]);
    expect(wrapper.text()).toContain("200");
    expect(wrapper.text()).toContain("50");

    await wrapper.setProps({ total: 400 });
    expect(parts().map((part) => part.props("value"))).toEqual([12.5, 25]);

    await wrapper.setProps({ total: 0 });
    expect(parts().map((part) => part.props("value"))).toEqual([0, 0]);
    expect(parts().map((part) => part.props("offset"))).toEqual([0, 0]);
  });
});
