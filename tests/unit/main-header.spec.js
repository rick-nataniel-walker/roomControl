import { mount } from "@vue/test-utils";
import MainHeader from "@/components/nav/MainHeader.vue";

const mountHeader = (props = {}) =>
  mount(MainHeader, {
    props,
    global: {
      stubs: {
        FontAwesomeIcon: true,
      },
    },
  });

describe("MainHeader", () => {
  it("renders the dashboard user and search controls", () => {
    const wrapper = mountHeader({
      userName: "Walker",
      userRole: "Admin",
    });

    expect(wrapper.get(".user-copy strong").text()).toBe("Walker");
    expect(wrapper.get(".user-copy small").text()).toBe("Admin");
    expect(wrapper.get("input[type='search']").attributes("placeholder")).toBe(
      "Pesquisar..."
    );
  });

  it("emits header actions", async () => {
    const wrapper = mountHeader();

    await wrapper.get(".menu-button").trigger("click");
    await wrapper.get(".notification-button").trigger("click");
    await wrapper.get(".profile-button").trigger("click");

    expect(wrapper.emitted("menu-toggle")).toHaveLength(1);
    expect(wrapper.emitted("notification-click")).toHaveLength(1);
    expect(wrapper.emitted("profile-click")).toHaveLength(1);
  });
});
