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
            <span>Duração em horas</span>
            <FormGroup
              input-type="select"
              label=""
              required
              v-model="reservation.durationHours"
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
              <span>{{ reservation.durationHours }}</span>
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
import { CONFIRM_RESERVATION, FETCH_ROOM_BY_STATUS } from "@/store/constants";
import store from "@/store";

export default {
  name: "ReservationsPaymentConfrimationView",
  components: { ActionBtn, ContentCard, FormGroup, ContentWrapper },
  computed: {
    ...mapState(["reservation", "reservations", "systemConfig", "rooms"]),
  },
  data() {
    return {
      reservationDetails: {
        totalPrice: 0,
        entryDate: formatDateTime(new Date(), false),
        exitDate: 0,
      },
      savedReservation: null,
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
    calculateReservation(durationHours) {
      const roomPrice = 250;
      const hours = Number(durationHours);

      if (!Number.isFinite(hours) || hours < 0) {
        this.reservationDetails.totalPrice = 0;
        this.reservationDetails.exitDate = "";
        return;
      }

      const entryDate = new Date(
        this.reservationDetails.entryDate.replace(" ", "T")
      );
      const exitDate = new Date(entryDate);

      exitDate.setHours(exitDate.getHours() + hours);

      this.reservationDetails.totalPrice = hours * roomPrice;
      this.reservationDetails.exitDate = formatDateTime(exitDate, false);
    },
    goTo(route) {
      this.$router.push(route);
    },
    getRoom(roomId) {
      const room = getItemByField(this.rooms.data, roomId);

      this.$store.state.reservation.roomName = room?.name ?? "";
      return room ?? null;
    },
  },

  beforeMount() {
    this.localReservations =
      JSON.parse(localStorage.getItem("reservations")) ?? [];
    let dbReservation = this.reservations.data[this.$route.params.id];
    if (!dbReservation) this.goTo({ name: "reservations" });

    let localReservation = getItemByField(
      this.localReservations,
      dbReservation.id
    );

    this.setReservation(localReservation ?? dbReservation);
    this.calculateReservation(this.reservation.durationHours);
    this.formatPrice(this.reservationDetails.totalPrice);
  },

  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_ROOM_BY_STATUS, "free");
      next();
    } catch (error) {
      next(error);
    }
  },
};
</script>

<style scoped></style>
