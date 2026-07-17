import { mount } from "@vue/test-utils";
import LoginView from "@/views/LoginView.vue";

describe("LoginView", () => {
  const mountLogin = () =>
    mount(LoginView, {
      global: {
        stubs: {
          FontAwesomeIcon: true,
        },
      },
    });

  it("renders the motel login form", () => {
    const wrapper = mountLogin();

    expect(wrapper.get("h1").text()).toBe("Bem-vindo de volta!");
    expect(wrapper.get("#identifier").attributes("placeholder")).toBeTruthy();
    expect(wrapper.get("button[type='submit']").text()).toBe("Iniciar Sessão");
  });

  it("toggles password visibility", async () => {
    const wrapper = mountLogin();

    expect(wrapper.get("#password").attributes("type")).toBe("password");
    await wrapper.get(".inner-icon-button").trigger("click");
    expect(wrapper.get("#password").attributes("type")).toBe("text");
  });
});
