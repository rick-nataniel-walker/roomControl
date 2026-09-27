import ReservationsActionView from "@/views/reservations/ReservationsActionView.vue";

jest.mock("@/store", () => ({}));

const context = (roomUnit, stayUnit) => ({
  selectedRoom: { price: "10", pricingUnit: roomUnit },
  reservation: { pricingUnit: stayUnit, durationHours: "2" },
  reservationDetails: {
    entryDate: "2026-01-01 12:00",
    totalPrice: 999,
    exitDate: "stale",
  },
});

describe("reservation pricing conversion", () => {
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
    ReservationsActionView.methods.calculateReservation.call(vm, "2");
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
    ReservationsActionView.methods.calculateReservation.call(vm, 2);
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
    ReservationsActionView.methods.calculateReservation.call(vm, 2);
    expect(vm.reservationDetails.exitDate).toBe(expected);
  });

  it("clears stale totals when no room is selected", () => {
    const vm = context(1, 1);
    vm.selectedRoom = null;
    ReservationsActionView.methods.calculateReservation.call(vm, 2);
    expect(vm.reservationDetails.totalPrice).toBe(0);
    expect(vm.reservationDetails.exitDate).toBe("");
  });

  it("raises the stay unit and recalculates when switching rooms", () => {
    const vm = context(1, 1);
    vm.rooms = { data: [{ id: 2, name: "Daily", price: 30, pricingUnit: 2 }] };
    vm.calculateReservation =
      ReservationsActionView.methods.calculateReservation.bind(vm);
    ReservationsActionView.methods.getRoom.call(vm, "2");
    expect(vm.reservation.pricingUnit).toBe(2);
    expect(vm.reservationDetails.totalPrice).toBe(60);
  });
});
