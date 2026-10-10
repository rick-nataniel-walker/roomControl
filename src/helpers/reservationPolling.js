import { apiClient } from "@/api/apiClient";
import { fetchReservation, fetchReservationSnapshot } from "@/api/reservations";
import showAlert from "@/helpers/alert";

export const POLL_INTERVAL = 5 * 60 * 1000;
const overdue = (status) => ["Vencido", "Vencida"].includes(status);
const eligible = (reservation) =>
  !reservation.checkedOut &&
  !reservation.checkoutTime &&
  (overdue(reservation.status) ||
    ["Activa", "Pago"].includes(reservation.status));

export function createReservationPolling({ fetchSnapshot, fetchOne, alert }) {
  const tasks = new Map();
  const requests = new Map();
  const stopped = new Map();
  const observed = new Set();
  const episodes = new Map();
  let enabled = false;
  let generation = 0;
  let recoveryTimer;
  let snapshot;
  const read = () => {
    if (!snapshot) {
      const pending = Promise.resolve().then(fetchSnapshot);
      snapshot = pending;
      pending
        .finally(() => {
          if (snapshot === pending) snapshot = null;
        })
        .catch(() => {});
    }
    return snapshot;
  };
  const reportError = (error) =>
    alert({
      type: "error",
      title: "Não foi possível buscar reservas!",
      message:
        error.response?.data?.message ||
        "Tente novamente dentro de cinco minutos.",
    });
  function cancel(id) {
    episodes.get(String(id))?.();
    episodes.delete(String(id));
    const task = tasks.get(String(id));
    if (task) clearTimeout(task.timer);
    tasks.delete(String(id));
  }
  function schedule(task, at) {
    clearTimeout(task.timer);
    task.timer = setTimeout(() => {
      if (at > Date.now()) schedule(task, at);
      else poll(task);
    }, Math.min(Math.max(0, at - Date.now()), 2147483647));
  }
  function register(reservation) {
    if (!enabled || reservation?.id == null) return;
    const id = String(reservation.id);
    observed.add(id);
    // LocalDateTime is interpreted in the browser's local timezone, like existing dates.
    const deadline =
      typeof reservation.paidUntil === "string"
        ? new Date(reservation.paidUntil.replace(" ", "T")).getTime()
        : NaN;
    if (!eligible(reservation) || !Number.isFinite(deadline)) {
      cancel(id);
      return;
    }
    const current = tasks.get(id);
    if (current?.deadline === deadline) {
      if (overdue(current.status) && !overdue(reservation.status)) {
        cancel(id);
        stopped.set(id, deadline);
      } else current.status = reservation.status;
      return;
    }
    if (stopped.get(id) === deadline) return;
    cancel(id);
    stopped.delete(id);
    const task = { id, deadline, status: reservation.status, timer: null };
    tasks.set(id, task);
    schedule(task, deadline);
  }
  async function poll(task) {
    if (tasks.get(task.id) !== task) return;
    try {
      // A changed deadline waits for the previous request for this ID to finish.
      if (requests.has(task.id)) await requests.get(task.id).catch(() => {});
      if (!enabled || tasks.get(task.id) !== task) return;
      const request = Promise.resolve().then(() => fetchOne(task.id));
      requests.set(task.id, request);
      let reservation;
      try {
        reservation = await request;
      } finally {
        if (requests.get(task.id) === request) requests.delete(task.id);
      }
      if (!enabled || tasks.get(task.id) !== task) return;
      if (
        !reservation ||
        !overdue(reservation.status) ||
        !eligible(reservation)
      ) {
        cancel(task.id);
        stopped.set(task.id, task.deadline);
        // A renewed stay gets a new deadline even if its status is now Activa.
        if (reservation) register(reservation);
        return;
      }
      register(reservation);
      episodes.get(task.id)?.();
      const closeAlert = alert({
        type: "error",
        duration: 100000,
        blink: true,
        title: "Reserva vencida",
        position: "bottom-right",
        message: `A reserva ${reservation.id}${
          reservation.roomName ? ` do quarto ${reservation.roomName}` : ""
        } ultrapassou o período pago.`,
      });
      episodes.set(task.id, closeAlert);
    } catch (error) {
      if (!enabled || tasks.get(task.id) !== task) return;
      reportError(error);
    }
    if (tasks.get(task.id) === task) schedule(task, Date.now() + POLL_INTERVAL);
  }
  async function recover(epoch) {
    try {
      const rows = await read();
      if (enabled && epoch === generation) {
        rows.filter((row) => !observed.has(String(row.id))).forEach(register);
      }
    } catch (error) {
      if (!enabled || epoch !== generation) return;
      reportError(error);
      recoveryTimer = setTimeout(() => recover(epoch), POLL_INTERVAL);
    }
  }
  function stop() {
    enabled = false;
    generation += 1;
    clearTimeout(recoveryTimer);
    tasks.forEach((task) => clearTimeout(task.timer));
    tasks.clear();
    episodes.forEach((close) => close?.());
    episodes.clear();
    stopped.clear();
    observed.clear();
    snapshot = null;
  }
  return {
    register,
    cancel,
    start() {
      if (enabled) return;
      enabled = true;
      recover(++generation);
    },
    stop,
  };
}

export function installReservationPolling(store) {
  const scheduler = createReservationPolling({
    fetchSnapshot: fetchReservationSnapshot,
    fetchOne: async (id) => (await fetchReservation(id)).data,
    alert: showAlert,
  });
  const interceptor = apiClient.interceptors.response.use((response) => {
    if (
      !response.config.reservationPolling &&
      response.config.url?.startsWith("/api/admin/reservations/")
    ) {
      const payload = response.data;
      (Array.isArray(payload?.data) ? payload.data : [payload]).forEach(
        scheduler.register
      );
    }
    return response;
  });
  const unwatch = store.watch(
    (state) => state.authenticationData.jwtToken,
    (token) => {
      scheduler.stop();
      if (token) scheduler.start();
    },
    { immediate: true, flush: "sync" }
  );
  return () => {
    unwatch();
    apiClient.interceptors.response.eject(interceptor);
    scheduler.stop();
  };
}
