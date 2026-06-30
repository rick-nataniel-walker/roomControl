import { mount } from "@vue/test-utils";
import StatisticCard from "@/components/shared/StatisticCard.vue";

describe("StatisticCard", () => {
  const mountCard = (number = 12) =>
    mount(StatisticCard, {
      props: {
        icon: "fa-bed",
        number,
        label: "Quartos Totais",
        bgColor: "bg-secondary-light",
        color: "text-secondary",
      },
      global: {
        stubs: {
          FontAwesomeIcon: true,
        },
      },
    });

  it("renders the icon and value together above the label", () => {
    const wrapper = mountCard();

    expect(wrapper.get(".stat-value-row .stat-icon").exists()).toBe(true);
    expect(wrapper.get(".stat-number").text()).toBe("12");
    expect(wrapper.get(".stat-label").text()).toBe("Quartos Totais");
  });

  it("accepts formatted currency values", () => {
    const wrapper = mountCard("1.200,00 MZN");

    expect(wrapper.get(".stat-number").text()).toBe("1.200,00 MZN");
  });
});
