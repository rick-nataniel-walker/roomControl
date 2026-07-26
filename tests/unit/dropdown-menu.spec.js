import { mount } from "@vue/test-utils";
import DropdownMenu from "@/components/shared/DropdownMenu.vue";

describe("DropdownMenu", () => {
  it("emits the selected item and its click event", async () => {
    const wrapper = mount(DropdownMenu, {
      props: {
        dropdownList: [{ menuItems: ["Pagamento", "Checkout"] }],
      },
    });

    await wrapper.findAll("button")[1].trigger("click");

    const selection = wrapper.emitted("select")[0][0];
    expect(selection.index).toBe(1);
    expect(selection.item).toBe("Checkout");
    expect(selection.event).toBeInstanceOf(MouseEvent);
  });
});
