import { mount } from "@vue/test-utils";
import DropdownMenu from "@/components/shared/DropdownMenu.vue";

describe("DropdownMenu", () => {
  it("emits the selected item and its click event", async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        dropdownList: [
          {
            menuItems: [
              { id: "payment", name: "Pagamento", disabled: false },
              { id: "checkout", name: "Checkout", disabled: false },
            ],
          },
        ],
      },
    });

    await wrapper.findAll("button")[1].trigger("click");

    const selection = wrapper.emitted("select")[0][0];
    expect(selection.index).toBe(1);
    expect(selection.id).toBe("checkout");
    expect(selection.name).toBe("Checkout");
    expect(selection.event).toBeInstanceOf(MouseEvent);
  });

  it("does not emit a selection for a disabled item", async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        dropdownList: [
          {
            menuItems: [{ id: "checkout", name: "Checkout", disabled: true }],
          },
        ],
      },
    });

    const button = wrapper.get("button");
    expect(button.attributes("disabled")).toBeDefined();

    await button.trigger("click");
    expect(wrapper.emitted("select")).toBeUndefined();
  });
});
