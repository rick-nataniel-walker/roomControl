import { mount } from "@vue/test-utils";
import DoughnutChartPart from "@/components/charts/doughnut/DoughnutChartPart.vue";

describe("DoughnutChartPart", () => {
  const mountPart = (value, offset = 0) =>
    mount(DoughnutChartPart, {
      props: {
        value,
        offset,
        type: "success",
      },
    });

  it("renders 50 as half of the circle", () => {
    const wrapper = mountPart(50);

    expect(wrapper.get("circle").attributes("stroke-dasharray")).toBe("50 50");
  });

  it("renders 100 as the complete circle", () => {
    const wrapper = mountPart(100);

    expect(wrapper.get("circle").attributes("stroke-dasharray")).toBe("100 0");
  });

  it("positions and clamps a chart part", () => {
    const wrapper = mountPart(120, 45);
    const circle = wrapper.get("circle");

    expect(circle.attributes("stroke-dasharray")).toBe("100 0");
    expect(circle.attributes("stroke-dashoffset")).toBe("-45");
  });
});
