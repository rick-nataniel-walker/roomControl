import { mount } from "@vue/test-utils";
import LoginView from "@/views/LoginView.vue";

describe("LoginView", () => {
  it("renders the motel login form", () => {
    const wrapper = mount(LoginView);

    expect(wrapper.get("h1").text()).toBe("Bem-vindo de volta!");
    expect(wrapper.get("#identifier").attributes("placeholder")).toBeTruthy();
    expect(wrapper.get("button[type='submit']").text()).toBe("Iniciar Sessão");
  });

  it("toggles password visibility", async () => {
    const wrapper = mount(LoginView);

    expect(wrapper.get("#password").attributes("type")).toBe("password");
    await wrapper.get(".password-toggle").trigger("click");
    expect(wrapper.get("#password").attributes("type")).toBe("text");
  });
});
