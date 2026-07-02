import { mount } from "@vue/test-utils";
import NavigationMenuItem from "@/components/nav/NavigationMenuItem.vue";

const mountItem = (props = {}) =>
  mount(NavigationMenuItem, {
    props: {
      icon: "home",
      label: "Dashboard",
      ...props,
    },
    global: {
      stubs: {
        FontAwesomeIcon: true,
      },
    },
  });

describe("NavigationMenuItem", () => {
  it("renders the navigation label and icon", () => {
    const wrapper = mountItem();

    expect(wrapper.get(".navigation-label").text()).toBe("Dashboard");
    expect(wrapper.get(".navigation-icon").exists()).toBe(true);
  });

  it("marks the active menu item", () => {
    const wrapper = mountItem({ active: true });

    expect(wrapper.classes()).toContain("navigation-item-active");
    expect(wrapper.attributes("aria-current")).toBe("page");
  });

  it("emits click events", async () => {
    const wrapper = mountItem();

    await wrapper.trigger("click");
    expect(wrapper.emitted("click")).toHaveLength(1);
  });
});
