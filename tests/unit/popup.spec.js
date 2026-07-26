import { mount } from "@vue/test-utils";
import { h } from "vue";
import PopUp from "@/components/shared/PopUp.vue";

const mountPopup = (props = {}) =>
  mount(PopUp, {
    attachTo: document.body,
    props: {
      title: "Eliminar reserva?",
      modelValue: true,
      ...props,
    },
    global: {
      stubs: {
        teleport: true,
        transition: false,
        FontAwesomeIcon: true,
      },
    },
  });

describe("PopUp", () => {
  afterEach(() => {
    document.body.innerHTML = "";
    document.body.classList.remove("popup-open");
  });

  it("uses the configured width and renders its title", () => {
    const wrapper = mountPopup({ width: "small" });

    expect(wrapper.get("h2").text()).toBe("Eliminar reserva?");
    expect(wrapper.get(".popup-content").attributes("style")).toContain(
      "width: 24rem"
    );
  });

  it("emits confirm without deciding when the parent should close", async () => {
    const wrapper = mountPopup();

    await wrapper.get(".action-btn--action").trigger("click");

    expect(wrapper.emitted("confirm")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")).toBeUndefined();
  });

  it("emits cancel and closes", async () => {
    const wrapper = mountPopup();

    await wrapper.get(".action-btn--cancel").trigger("click");

    expect(wrapper.emitted("cancel")).toHaveLength(1);
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([false]);
  });

  it("can be opened from an activator and records its origin", async () => {
    const wrapper = mount(PopUp, {
      props: { title: "Popup", modelValue: false },
      slots: {
        activator: ({ open }) =>
          h("button", { class: "trigger", onClick: open }, "Open"),
      },
      global: { stubs: { teleport: true } },
    });
    const trigger = wrapper.get(".trigger");
    await trigger.trigger("click");

    expect(wrapper.emitted("update:modelValue")[0]).toEqual([true]);
    expect(wrapper.vm.triggerElement).toBe(trigger.element);
  });
});
