import { mount } from "@vue/test-utils";
import FormGroup from "@/components/form/FormGroup.vue";

describe("FormGroup", () => {
  it("marks required fields with an asterisk", () => {
    const wrapper = mount(FormGroup, {
      props: {
        label: "Email",
        modelValue: "",
      },
      attrs: {
        id: "email",
        required: true,
      },
    });

    expect(wrapper.get(".required-marker").text()).toBe("*");
  });

  it("shows and clears the required message", async () => {
    const wrapper = mount(FormGroup, {
      props: {
        label: "Email",
        modelValue: "",
      },
      attrs: {
        id: "email",
        required: true,
      },
    });

    await wrapper.get("input").trigger("blur");
    expect(wrapper.get(".form-error").text()).toBe("Este campo é obrigatório.");
    expect(wrapper.get("input").attributes("aria-invalid")).toBe("true");

    await wrapper.setProps({ modelValue: "guest@example.com" });
    expect(wrapper.find(".form-error").exists()).toBe(false);
    expect(wrapper.get("input").attributes("aria-invalid")).toBeUndefined();
  });
});
