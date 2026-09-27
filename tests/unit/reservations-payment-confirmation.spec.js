import ReservationsPaymentConfrimationView from "@/views/reservations/ReservationsPaymentConfrimationView.vue";

jest.mock("@/store", () => ({}));

const context = (roomUnit, stayUnit) => ({
  selectedRoom: { price: "10", pricingUnit: roomUnit },
  reservation: { durationUnit: stayUnit, stayDuration: "2" },
  reservationDetails: {
    entryDate: "2026-01-01 12:00",
    totalPrice: 999,
    exitDate: "stale",
  },
});

describe("reservation pricing conversion", () => {
  it("initializes pricing from the saved reservation and its room", () => {
    localStorage.removeItem("reservations");
    const vm = context(1, 1);
    vm.reservations = {
      data: [{ id: 7, roomId: 2, stayDuration: "3", durationUnit: "2" }],
    };
    vm.rooms = { data: [{ id: 2, name: "Hourly", price: 10, pricingUnit: 1 }] };
    vm.$route = { params: { id: "0" } };
    vm.setReservation = (reservation) => (vm.reservation = reservation);
    vm.calculateReservation =
      ReservationsPaymentConfrimationView.methods.calculateReservation.bind(vm);
    vm.getRoom = ReservationsPaymentConfrimationView.methods.getRoom.bind(vm);

    ReservationsPaymentConfrimationView.beforeMount.call(vm);

    expect(vm.selectedRoom.id).toBe(2);
    expect(vm.reservation.durationUnit).toBe("2");
    expect(vm.reservationDetails.totalPrice).toBe(720);
    expect(vm.reservationDetails.exitDate).toBe("2026-01-04 12:00");
  });

  it("returns to reservations when the saved reservation is missing", () => {
    localStorage.removeItem("reservations");
    const vm = {
      reservations: { data: [] },
      $route: { params: { id: "0" } },
      goTo: jest.fn(),
    };
    ReservationsPaymentConfrimationView.beforeMount.call(vm);
    expect(vm.goTo).toHaveBeenCalledWith({ name: "reservations" });
  });

  it.each([
    [1, 1, 20],
    [1, 2, 480],
    [1, 3, 3360],
    [1, 4, 14400],
    [2, 2, 20],
    [2, 3, 140],
    [2, 4, 600],
    [3, 3, 20],
    [3, 4, (60 / 7) * 10],
    [4, 4, 20],
  ])("converts unit %s to %s", (roomUnit, stayUnit, expected) => {
    const vm = context(String(roomUnit), String(stayUnit));
    ReservationsPaymentConfrimationView.methods.calculateReservation.call(
      vm,
      "2"
    );
    expect(vm.reservationDetails.totalPrice).toBeCloseTo(expected);
  });

  it.each([
    [2, 1],
    [3, 1],
    [3, 2],
    [4, 1],
    [4, 2],
    [4, 3],
    [0, 1],
    [1, 5],
  ])("rejects conversion from %s to %s", (roomUnit, stayUnit) => {
    const vm = context(roomUnit, stayUnit);
    ReservationsPaymentConfrimationView.methods.calculateReservation.call(
      vm,
      2
    );
    expect(vm.reservationDetails.totalPrice).toBe(0);
    expect(vm.reservationDetails.exitDate).toBe("");
  });

  it.each([
    [1, "2026-01-01 14:00"],
    [2, "2026-01-03 12:00"],
    [3, "2026-01-15 12:00"],
    [4, "2026-03-02 12:00"],
  ])("uses stay unit %s for checkout", (unit, expected) => {
    const vm = context(1, unit);
    ReservationsPaymentConfrimationView.methods.calculateReservation.call(
      vm,
      2
    );
    expect(vm.reservationDetails.exitDate).toBe(expected);
  });

  it("clears stale totals when no room is selected", () => {
    const vm = context(1, 1);
    vm.selectedRoom = null;
    ReservationsPaymentConfrimationView.methods.calculateReservation.call(
      vm,
      2
    );
    expect(vm.reservationDetails.totalPrice).toBe(0);
    expect(vm.reservationDetails.exitDate).toBe("");
  });

  it("raises the stay unit and recalculates when switching rooms", () => {
    const vm = context(1, 1);
    vm.rooms = { data: [{ id: 2, name: "Daily", price: 30, pricingUnit: 2 }] };
    vm.calculateReservation =
      ReservationsPaymentConfrimationView.methods.calculateReservation.bind(vm);
    ReservationsPaymentConfrimationView.methods.getRoom.call(vm, "2");
    expect(vm.reservation.durationUnit).toBe(2);
    expect(vm.reservationDetails.totalPrice).toBe(60);
  });
});
