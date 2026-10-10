import { nextTick } from "vue";
import showAlert from "@/helpers/alert";

const options = {
  type: "error",
  title: "Reserva vencida",
  message: "Reserva 1",
  duration: 100000,
  blink: true,
};
let close;
beforeEach(() => {
  jest.useFakeTimers("modern");
});
afterEach(() => {
  close?.();
  document.body.innerHTML = "";
  jest.useRealTimers();
});

it("keeps the same blinking popup until the absolute 100-second deadline", async () => {
  const onDismiss = jest.fn();
  close = showAlert({ ...options, onDismiss });
  const first = document.body.firstElementChild;
  expect(document.querySelector(".alert-blink")).not.toBeNull();
  jest.advanceTimersByTime(999);
  expect(document.body.firstElementChild).toBe(first);
  jest.advanceTimersByTime(1);
  await nextTick();
  expect(document.body.firstElementChild).toBe(first);
  expect(document.body.children).toHaveLength(1);
  expect(onDismiss).not.toHaveBeenCalled();
  jest.advanceTimersByTime(98999);
  expect(document.body.children).toHaveLength(1);
  jest.advanceTimersByTime(1);
  await nextTick();
  expect(document.body.children).toHaveLength(0);
  expect(jest.getTimerCount()).toBe(0);
});

it("manual dismissal closes the blinking popup", async () => {
  const onDismiss = jest.fn();
  close = showAlert({ ...options, onDismiss });
  jest.advanceTimersByTime(2000);
  document.querySelector("button").click();
  await nextTick();
  jest.advanceTimersByTime(100000);
  expect(document.body.children).toHaveLength(0);
  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(jest.getTimerCount()).toBe(0);
});

it("replacement and programmatic cleanup never count as manual dismissal", () => {
  const onDismiss = jest.fn();
  const firstClose = showAlert({ ...options, onDismiss });
  close = showAlert({ ...options, message: "Reserva 2" });
  firstClose();
  expect(document.body.children).toHaveLength(1);
  expect(document.body.textContent).toContain("Reserva 2");
  expect(onDismiss).not.toHaveBeenCalled();
  close();
  jest.advanceTimersByTime(100000);
  expect(document.body.children).toHaveLength(0);
  expect(jest.getTimerCount()).toBe(0);
});

it("ordinary error popups do not blink", () => {
  close = showAlert({ type: "error", title: "Erro" });
  expect(document.querySelector(".alert-blink")).toBeNull();
  expect(document.body.children).toHaveLength(1);
});
