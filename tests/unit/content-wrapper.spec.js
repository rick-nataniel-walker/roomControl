import { mount } from "@vue/test-utils";
import ContentWrapper from "@/components/ContentWrapper.vue";

const mountWrapper = (route) =>
  mount(ContentWrapper, {
    props: { title: "Editar quarto" },
    global: {
      mocks: { $route: route },
      stubs: {
        MainHeader: true,
        NavigationMenu: true,
        RouterLink: {
          props: ["to"],
          template: '<a href="#"><slot /></a>',
        },
      },
    },
  });

describe("ContentWrapper breadcrumbs", () => {
  it("builds breadcrumbs from matched route metadata", () => {
    const wrapper = mountWrapper({
      name: "editRoom",
      params: { id: "3" },
      matched: [
        {
          meta: {
            breadcrumb: { label: "Quartos", to: { name: "rooms" } },
          },
        },
        {
          name: "editRoom",
          meta: { breadcrumb: "Editar quarto" },
        },
      ],
    });

    expect(
      wrapper.findAll(".breadcrumbs li").map((item) => item.text())
    ).toEqual(["Dashboard ›", "Quartos ›", "Editar quarto"]);
    expect(wrapper.get("[aria-current='page']").text()).toBe("Editar quarto");
  });

  it("does not duplicate Dashboard on the dashboard route", () => {
    const wrapper = mountWrapper({
      name: "dashboard",
      params: {},
      matched: [
        {
          name: "dashboard",
          meta: { breadcrumb: "Dashboard" },
        },
      ],
    });

    expect(wrapper.findAll(".breadcrumbs li")).toHaveLength(1);
    expect(wrapper.get(".active-breadcrumb").text()).toBe("Dashboard");
  });
});
