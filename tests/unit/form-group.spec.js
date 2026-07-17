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

  it("renders an optional clickable icon inside the input", async () => {
    const wrapper = mount(FormGroup, {
      props: {
        modelValue: "",
        icon: "fa-eye",
        iconClickable: true,
        iconLabel: "Mostrar palavra-passe",
      },
      global: {
        stubs: {
          FontAwesomeIcon: true,
        },
      },
    });

    expect(wrapper.get("input").classes()).toContain("has-inner-icon");
    expect(wrapper.get(".inner-icon-button").attributes("aria-label")).toBe(
      "Mostrar palavra-passe"
    );

    await wrapper.get(".inner-icon-button").trigger("click");
    expect(wrapper.emitted("icon-click")).toHaveLength(1);
  });

  it("keeps the select native arrow instead of rendering a custom icon", () => {
    const wrapper = mount(FormGroup, {
      props: {
        modelValue: "",
        inputType: "select",
        icon: "fa-chevron-down",
      },
      slots: {
        default: '<option value="one">One</option>',
      },
    });

    expect(wrapper.find(".inner-icon").exists()).toBe(false);
    expect(wrapper.get("select").classes()).not.toContain("has-inner-icon");
  });
});
