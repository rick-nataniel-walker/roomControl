<template>
  <ContentWrapper title="Novo Pedido">
    <template #body>
      <div class="flex flex-col gap-4 tablet:flex-row pb-12">
        <content-card title="Adicionar nova reserva" styled="none">
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

        <content-card title="Resumo" :styled="false">
          <div class="flex flex-col gap-8">
            <div class="flex flex-col">
              <span>Quarto</span>
              <span>{{ reservation.roomName }}</span>
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
        <ActionBtn text="Criar o Pedido" @click="saveReservation" />
      </div>
    </template>
  </ContentWrapper>
</template>
<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ContentCard from "@/components/shared/ContentCard.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { formatDateTime } from "@/helpers/DateHelper";
import { getItemByField } from "@/helpers/GeneralHelper";
import { FETCH_ROOM_BY_STATUS, SAVE_RESERVATION } from "@/store/constants";
import store from "@/store";
//import store from "@/store";
//import { FETCH_ROOM_BY_STATUS } from "@/store/constants";

export default {
  name: "ReservationsActionView",
  components: {
    ActionBtn,
    ContentWrapper,
    ContentCard,
    FormGroup,
  },
  computed: {
    ...mapState(["reservation", "systemConfig", "rooms"]),
  },
  data() {
    return {
      reservationDetails: {
        totalPrice: 0,
        entryDate: formatDateTime(new Date(), false),
        exitDate: 0,
      },
      savedReservation: null,
    };
  },
  methods: {
    ...mapMutations(["resetReservation"]),
    ...mapActions([FETCH_ROOM_BY_STATUS, SAVE_RESERVATION]),
    async saveReservation() {
      this.savedReservation = await this.SAVE_RESERVATION(this.reservation);
      if (this.savedReservation) {
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

      this.reservation.roomName = room?.name ?? "";
      return room ?? null;
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      store.commit("resetReservation");
      await store.dispatch(FETCH_ROOM_BY_STATUS, "free");
      next();
    } catch (error) {
      next(error);
    }
  },
};
</script>
<style scoped></style>
