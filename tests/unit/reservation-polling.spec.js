import { createStore } from "vuex";
import { apiClient } from "@/api/apiClient";
import {
  createReservationPolling,
  installReservationPolling,
  POLL_INTERVAL,
} from "@/helpers/reservationPolling";
import { fetchReservationSnapshot, fetchReservation } from "@/api/reservations";
import showAlert from "@/helpers/alert";

jest.mock("@/helpers/alert", () => jest.fn());
jest.mock("@/api/reservations", () => ({
  fetchReservationSnapshot: jest.fn(),
  fetchReservation: jest.fn(),
}));
const flush = async () => {
  for (let i = 0; i < 15; i++) await Promise.resolve();
};
const row = (id = 1, delay = 1000, status = "Activa") => ({
  id,
  paidUntil: new Date(Date.now() + delay).toISOString(),
  status,
  checkedOut: false,
});
let scheduler, fetchOne, fetchSnapshot, alert;
beforeEach(() => {
  jest.useFakeTimers("modern");
  jest.setSystemTime(new Date("2026-10-10T10:00:00Z"));
  fetchSnapshot = jest.fn().mockResolvedValue([]);
  fetchOne = jest.fn();
  alert = jest.fn();
  scheduler = createReservationPolling({ fetchSnapshot, fetchOne, alert });
  scheduler.start();
});
afterEach(() => {
  scheduler.stop();
  jest.useRealTimers();
  jest.clearAllMocks();
});
const advance = async (ms) => {
  jest.advanceTimersByTime(ms);
  await flush();
};

it("starts exactly at paidUntil, warns on both spellings and stops on another status", async () => {
  const reservation = row();
  fetchOne
    .mockResolvedValueOnce({ ...reservation, status: "Vencido" })
    .mockResolvedValueOnce({ ...reservation, status: "Vencida" })
    .mockResolvedValueOnce({ ...reservation, status: "Pago" });
  scheduler.register(reservation);
  await advance(999);
  expect(fetchOne).not.toHaveBeenCalled();
  await advance(1);
  expect(fetchOne).toHaveBeenCalledWith("1");
  expect(alert).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      duration: 100000,
      blink: true,
    })
  );
  await advance(POLL_INTERVAL);
  expect(alert).toHaveBeenCalledTimes(2);
  await advance(POLL_INTERVAL);
  scheduler.register(reservation);
  await advance(POLL_INTERVAL);
  expect(fetchOne).toHaveBeenCalledTimes(3);
});
it("recovers past deadlines immediately and deduplicates registrations", async () => {
  scheduler.stop();
  const reservation = row(1, -1000, "Vencida");
  fetchSnapshot.mockResolvedValue([reservation]);
  fetchOne.mockResolvedValue(reservation);
  scheduler.start();
  await flush();
  scheduler.register(reservation);
  await advance(0);
  expect(fetchOne).toHaveBeenCalledTimes(1);
});
it("reschedules deadlines and cancels checkout independently", async () => {
  scheduler.register(row(1));
  scheduler.register(row(2));
  scheduler.register(row(1, 10000));
  scheduler.register({ ...row(2), checkedOut: true });
  fetchOne.mockResolvedValue(row(1, 10000, "Vencida"));
  await advance(1000);
  expect(fetchOne).not.toHaveBeenCalled();
  await advance(9000);
  expect(fetchOne).toHaveBeenCalledTimes(1);
});
it("retries failures and never overlaps a slow request", async () => {
  let resolve;
  fetchOne
    .mockReturnValueOnce(
      new Promise((done) => {
        resolve = done;
      })
    )
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValue(row(1, -1, "Vencida"));
  scheduler.register(row());
  await advance(1000);
  await advance(POLL_INTERVAL * 2);
  expect(fetchOne).toHaveBeenCalledTimes(1);
  resolve(row(1, -1, "Vencida"));
  await flush();
  await advance(0);
  await advance(POLL_INTERVAL);
  expect(alert).toHaveBeenCalledWith(
    expect.objectContaining({ type: "error" })
  );
  expect(fetchOne.mock.calls.length).toBeGreaterThanOrEqual(3);
});
it("ignores a late response after logout and clears timers", async () => {
  let resolve;
  fetchOne.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  scheduler.register(row());
  await advance(1000);
  scheduler.stop();
  resolve(row(1, -1, "Vencida"));
  await flush();
  await advance(POLL_INTERVAL);
  expect(alert).not.toHaveBeenCalled();
  expect(fetchOne).toHaveBeenCalledTimes(1);
});
it("keeps global alerts working across screen changes and cleans up on logout", async () => {
  const reservation = row();
  fetchReservationSnapshot.mockResolvedValue([reservation]);
  fetchReservation.mockResolvedValue({
    data: { ...reservation, status: "Vencida" },
  });
  const store = createStore({
    state: {
      authenticationData: { jwtToken: "token" },
      screen: "reservations",
    },
    mutations: {
      navigate(state) {
        state.screen = "dashboard";
      },
      logout(state) {
        state.authenticationData.jwtToken = "";
      },
    },
  });
  const dispose = installReservationPolling(store);
  await flush();
  store.commit("navigate");
  await advance(1000);
  expect(showAlert).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      duration: 100000,
      blink: true,
    })
  );
  store.commit("logout");
  await advance(POLL_INTERVAL);
  expect(fetchReservation).toHaveBeenCalledTimes(1);
  dispose();
  expect(apiClient.interceptors.response.handlers.filter(Boolean)).toHaveLength(
    0
  );
});

it("waits safely for deadlines beyond the browser timer limit", async () => {
  const reservation = row(1, 40 * 24 * 60 * 60 * 1000);
  scheduler.register(reservation);
  await advance(2147483647);
  expect(fetchOne).not.toHaveBeenCalled();
  fetchOne.mockResolvedValue({ ...reservation, status: "Vencida" });
  await advance(40 * 24 * 60 * 60 * 1000 - 2147483647);
  expect(fetchOne).toHaveBeenCalledTimes(1);
});

it("cancels when an observed overdue status changes", async () => {
  const reservation = row(1, 0, "Vencida");
  fetchOne.mockResolvedValue(reservation);
  scheduler.register(reservation);
  await advance(0);
  scheduler.register({ ...reservation, status: "Activa" });
  await advance(POLL_INTERVAL);
  expect(fetchOne).toHaveBeenCalledTimes(1);
});

it("does not overwrite a checkout with a stale discovery response", async () => {
  scheduler.stop();
  let resolve;
  fetchSnapshot.mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  scheduler.start();
  await flush();
  scheduler.register({ ...row(), checkedOut: true });
  resolve([row()]);
  await flush();
  await advance(1000);
  expect(fetchOne).not.toHaveBeenCalled();
});

it("retries discovery after a transient failure", async () => {
  scheduler.stop();
  fetchSnapshot
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce([row(1, 0, "Vencida")]);
  fetchOne.mockResolvedValue(row(1, 0, "Vencida"));
  scheduler.start();
  await flush();
  expect(alert).toHaveBeenCalledWith(
    expect.objectContaining({ type: "error" })
  );
  await advance(POLL_INTERVAL);
  await advance(0);
  expect(fetchOne).toHaveBeenCalledTimes(1);
});

it.each(["checkout", "status", "stop"])(
  "closes an alert episode on %s",
  async (event) => {
    const close = jest.fn();
    alert.mockReturnValue(close);
    const reservation = row(1, 0, "Vencida");
    fetchOne.mockResolvedValue(reservation);
    scheduler.register(reservation);
    await advance(0);
    if (event === "stop") scheduler.stop();
    else
      scheduler.register({
        ...reservation,
        ...(event === "checkout" ? { checkedOut: true } : { status: "Activa" }),
      });
    expect(close).toHaveBeenCalled();
  }
);
