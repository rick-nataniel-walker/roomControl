<template>
  <ContentWrapper title="Confirmar pagamento de um Pedido">
    <template #body>
      <div class="flex flex-col gap-4 tablet:flex-row pb-12">
        <content-card title="Pagemnto do pedido" styled="none">
          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <span>Método de pagamento</span>
            <FormGroup
              label=""
              required
              v-model="reservation.paymentMethod"
              input-type="select"
            >
              <option
                v-for="paymentMethod in Object.keys(
                  systemConfig.paymentMethods
                )"
                :key="paymentMethod"
                :value="paymentMethod"
              >
                {{ systemConfig.paymentMethods[paymentMethod] }}
              </option>
            </FormGroup>
          </div>
          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <span>Quarto</span>
            <FormGroup
              label=""
              required
              v-model="reservation.roomId"
              input-type="select"
              @update:model-value="getRoom"
            >
              <option
                v-for="room in rooms.data"
                :key="room.id"
                :value="room.id"
              >
                {{ room.name }}
              </option>
            </FormGroup>
          </div>
          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <span>Duração</span>
            <FormGroup
              input-type="select"
              label=""
              required
              v-model="reservation.stayDuration"
              @update:model-value="calculateReservation"
            >
              <option
                v-for="duration in systemConfig.durationHours"
                :key="duration"
                :value="duration"
              >
                {{ duration }}
              </option>
            </FormGroup>
          </div>

          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <span>Unidade de duração</span>
            <FormGroup
              label=""
              required
              v-model="this.reservation.durationUnit"
              input-type="select"
              @update:model-value="
                calculateReservation(reservation.stayDuration)
              "
            >
              <option
                v-for="durationUnit in systemConfig.durationUnits"
                :key="durationUnit.lookupKey"
                :value="durationUnit.lookupKey"
                :disabled="
                  Number(durationUnit.lookupKey) <
                  Number(selectedRoom?.pricingUnit)
                "
              >
                {{ durationUnit.lookupValue }}
              </option>
            </FormGroup>
          </div>
          <div class="grid grid-cols-2 items-center gap-4 text-sm">
            <span>Código do Cartão</span>
            <FormGroup
              label=""
              required
              v-model="reservation.cardNumber"
              @change="convertCardNumberToCapitalLetters"
            />
          </div>
        </content-card>

        <content-card title="Resumo" styled="none">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col">
              <span>Quarto</span>
              <span>{{ reservation.roomName }}</span>
            </div>
            <div class="flex flex-col">
              <span>Metodo de pagamento</span>
              <span>{{ reservation.paymentMethod }}</span>
            </div>
            <div class="flex flex-col">
              <span>Entrada</span>
              <span>{{ reservationDetails.entryDate }}</span>
            </div>
            <div class="flex flex-col">
              <span>Saída</span>
              <span>{{ reservationDetails.exitDate }}</span>
            </div>
            <div class="flex flex-col">
              <span>Duração</span>
              <span>
                {{ reservation.stayDuration }} {{ durationUnitLabel }}
              </span>
            </div>
          </div>
          <div class="flex justify-end gap-4">
            <span class="font-semibold">
              {{ formatPrice(reservationDetails.totalPrice) }}
            </span>
          </div>
        </content-card>
      </div>

      <div class="flex justify-end gap-4">
        <ActionBtn text="Confirmar a reserva" @click="confirmReservation" />
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import ContentCard from "@/components/shared/ContentCard.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { formatDateTime } from "@/helpers/DateHelper";
import { getItemByField } from "@/helpers/GeneralHelper";
import {
  CONFIRM_RESERVATION,
  FETCH_ROOM_BY_STATUS,
  FETCH_SYS_CONFIG,
} from "@/store/constants";
import store from "@/store";

export default {
  name: "ReservationsPaymentConfrimationView",
  components: { ActionBtn, ContentCard, FormGroup, ContentWrapper },
  computed: {
    ...mapState(["reservation", "reservations", "systemConfig", "rooms"]),
    durationUnitLabel() {
      return (
        getItemByField(
          this.systemConfig.durationUnits,
          this.reservation.durationUnit,
          "lookupKey"
        )?.lookupValue ?? ""
      );
    },
  },
  data() {
    return {
      reservationDetails: {
        totalPrice: 0,
        entryDate: formatDateTime(new Date(), false),
        exitDate: 0,
      },
      savedReservation: null,
      selectedRoom: null,
      localReservations: [],
    };
  },
  methods: {
    ...mapMutations(["resetReservation", "setReservation"]),
    ...mapActions([FETCH_ROOM_BY_STATUS, CONFIRM_RESERVATION]),
    async confirmReservation() {
      this.savedReservation = await this.CONFIRM_RESERVATION({
        id: this.reservation.id,
        formdata: { ...this.reservation },
      });
      if (this.savedReservation) {
        this.localReservations.splice(
          this.localReservations.indexOf(
            getItemByField(this.localReservations, this.savedReservation.id)
          ),
          1
        );
        this.savedReservation = null;
        this.resetReservation();
        this.goTo({ name: "reservations" });
      }
    },
    formatPrice(value) {
      const amount = Number(value);

      if (!Number.isFinite(amount)) return "0. 00MZN";

      const [integerPart, decimalPart] = amount.toFixed(2).split(".");
      const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

      return `${groupedInteger}. ${decimalPart}MZN`;
    },
    convertCardNumberToCapitalLetters() {
      this.reservation.cardNumber = this.reservation.cardNumber
        .toUpperCase()
        .replace(/\s/g, "");
    },
    calculateReservation(stayDuration) {
      // Months use a fixed 30-day duration for both pricing and checkout.
      const hoursPerUnit = { 1: 1, 2: 24, 3: 168, 4: 720 };
      const roomPrice = Number(this.selectedRoom?.price);
      const roomUnit = Number(this.selectedRoom?.pricingUnit);
      const stayUnit = Number(this.reservation.durationUnit);
      const duration = Number(stayDuration);

      if (
        !this.selectedRoom ||
        !Number.isFinite(roomPrice) ||
        roomPrice < 0 ||
        !Number.isFinite(duration) ||
        duration < 0 ||
        !hoursPerUnit[roomUnit] ||
        !hoursPerUnit[stayUnit] ||
        stayUnit < roomUnit
      ) {
        this.reservationDetails.totalPrice = 0;
        this.reservationDetails.exitDate = "";
        return;
      }

      const entryDate = new Date(
        this.reservationDetails.entryDate.replace(" ", "T")
      );
      const exitDate = new Date(entryDate);
      const hours = duration * hoursPerUnit[stayUnit];

      exitDate.setTime(exitDate.getTime() + hours * 60 * 60 * 1000);

      this.reservationDetails.totalPrice =
        (hours / hoursPerUnit[roomUnit]) * roomPrice;
      this.reservationDetails.exitDate = formatDateTime(exitDate, false);
    },
    goTo(route) {
      this.$router.push(route);
    },
    getRoom(roomId) {
      this.selectedRoom = getItemByField(this.rooms.data, roomId);
      this.reservation.roomName = this.selectedRoom?.name ?? "";
      if (
        this.selectedRoom &&
        (!this.reservation.durationUnit ||
          Number(this.reservation.durationUnit) <
            Number(this.selectedRoom.pricingUnit))
      ) {
        this.reservation.durationUnit = this.selectedRoom.pricingUnit;
      }
      this.calculateReservation(this.reservation.stayDuration);
      return this.selectedRoom ?? null;
    },
  },

  beforeMount() {
    this.localReservations =
      JSON.parse(localStorage.getItem("reservations")) ?? [];
    let dbReservation = this.reservations.data[this.$route.params.id];
    if (!dbReservation) return this.goTo({ name: "reservations" });

    let localReservation = getItemByField(
      this.localReservations,
      dbReservation.id
    );

    this.setReservation(localReservation ?? dbReservation);
    this.getRoom(this.reservation.roomId);
  },

  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_ROOM_BY_STATUS, "free");
      await store.dispatch(FETCH_SYS_CONFIG, {
        group: 1,
        subgroup: 1,
      });
      next();
    } catch (error) {
      next(error);
    }
  },
};
</script>

<style scoped></style>
