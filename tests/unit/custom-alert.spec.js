import { mount } from "@vue/test-utils";
import CustomAlert from "@/components/shared/CustomAlert.vue";

describe("overdue error popup", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("uses existing error styling for two minutes", async () => {
    const wrapper = mount(CustomAlert, {
      props: { type: "error", title: "Reserva vencida", duration: 120000 },
    });
    expect(wrapper.find(".border-red-500").exists()).toBe(true);
    expect(wrapper.find("h3").classes()).toContain("text-red-800");
    expect(wrapper.find("svg").exists()).toBe(true);
    jest.advanceTimersByTime(119999);
    expect(wrapper.emitted("dismiss")).toBeUndefined();
    jest.advanceTimersByTime(1);
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    expect(wrapper.find(".border-red-500").exists()).toBe(false);
    wrapper.unmount();
  });

  it("preserves warning styling and the default 15-second duration", () => {
    const wrapper = mount(CustomAlert, {
      props: { type: "warning", title: "Aviso" },
    });
    expect(wrapper.find(".border-yellow-500").exists()).toBe(true);
    expect(wrapper.props("duration")).toBe(15000);
    jest.advanceTimersByTime(15000);
    expect(wrapper.emitted("dismiss")).toBeTruthy();
    wrapper.unmount();
  });
});
