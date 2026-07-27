<template>
  <ContentWrapper title="Reservas/pedidos">
    <template #header>
      <ActionBtn
        text="Novo Pedido"
        icon="plus"
        @click="goTo({ name: 'newReservation' })"
      />
    </template>
    <template #body>
      <div class="flex justify-between">
        <div>
          <FormGroup
            label=""
            placeholder="Pesquisar um pedido..."
            icon="magnifying-glass"
            v-model="roomName"
            @update:model-value="searchReservation"
          />
        </div>
        <div>
          <FormGroup
            label=""
            input-type="select"
            placeholder="Breve resumo do artigo..."
            v-model="reservationStatus"
            @update:model-value="handleStatusChange"
          >
            <option
              v-for="reservationStatus in Object.keys(
                systemConfig.reservationStatues
              )"
              :key="reservationStatus"
              :value="reservationStatus"
            >
              {{ systemConfig.reservationStatues[reservationStatus] }}
            </option>
          </FormGroup>
        </div>
      </div>
      <MainTable>
        <template #headers>
          <th class="p-4">codigo</th>
          <th class="p-4">Data</th>
          <th class="p-4">Quarto</th>
          <th class="p-4">Duração</th>
          <th class="p-4">Estado</th>
          <th class="p-4">Metodo de Pagamento</th>
          <th class="p-4">Checkout</th>
          <th class="p-4">Accões</th>
        </template>
        <template #body>
          <tr
            class="my-1 border-b border-gray-200 text-sm"
            v-for="(reservation, index) in reservations.data"
            :key="reservation.id"
          >
            <td class="p-4">{{ reservation.id }}</td>
            <td class="p-4">
              <div class="flex flex-col justify-start">
                <span>{{
                  reservationDatetime(reservation.checkinTime).date
                }}</span>
                <span>{{
                  reservationDatetime(reservation.checkinTime).time
                }}</span>
              </div>
            </td>
            <td class="p-4">{{ reservation.roomName }}</td>
            <td class="p-4">{{ reservation.durationHours }}hrs</td>
            <td class="p-4">
              <TextBadge
                :type="mapStatus(reservation.status)"
                :value="reservation.status"
              />
            </td>
            <td class="p-4">{{ reservation.paymentMethod }}</td>
            <td class="p-4">
              <FontAwesomeIcon
                :class="
                  reservation.checkedOut ? 'text-emerald' : 'text-red-600'
                "
                :icon="reservation.checkedOut ? 'square-check' : 'square-xmark'"
              />
            </td>
            <td>
              <div class="relative inline-flex items-center gap-4">
                <FontAwesomeIcon
                  icon="pen-to-square"
                  class="cursor-pointer"
                  @click="
                    goTo({ name: 'editReservation', params: { id: index } })
                  "
                />
                <button
                  type="button"
                  class="mx-1 cursor-pointer"
                  aria-label="Abrir ações do quarto"
                  @mousedown.stop
                  @click="toggleMenu(reservation.id)"
                >
                  <FontAwesomeIcon icon="ellipsis-vertical" />
                </button>
                <DropdownMenu
                  v-if="openReservationMenuId === reservation.id"
                  :dropdown-list="configureDropdownList(reservation)"
                  placement="bottom-end"
                  @select="handleMenuSelect($event, reservation, index)"
                  @dismiss="openReservationMenuId = null"
                />
              </div>
            </td>
          </tr>
        </template>
      </MainTable>
      <TablePagination
        v-if="reservations.data.length > 0"
        :pagination="paginationControls"
        @change="handlePaginationChange"
      />

      <PopUp
        ref="checkoutPopup"
        v-model="isCheckoutPopupOpen"
        title="Fazer checkout"
        width="small"
        type="interact"
        action-msg="Confirmar checkout"
        @confirm="confirmCheckout"
        @cancel="clearPendingCheckout"
        @close="clearPendingCheckout"
      >
        <template #body>
          <p v-if="pendingCheckoutReservation">
            Deseja mesmo fazer o checkout da reserva
            <strong>#{{ pendingCheckoutReservation.id }}</strong>
            do quarto
            {{ pendingCheckoutReservation.roomName }}?
          </p>
        </template>
      </PopUp>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import MainTable from "@/components/tables/MainTable.vue";
import DropdownMenu from "@/components/shared/DropdownMenu.vue";
import { mapActions, mapState } from "vuex";
import {
  CHECKOUT_RESERVATION,
  FETCH_RESERVATIONS_BY_ROOM_NAME,
  FETCH_RESERVATIONS,
} from "@/store/constants";
import store from "@/store";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { reservationsListingsDropdownlist } from "@/datasources/datasourcess";
import FormGroup from "@/components/form/FormGroup.vue";
import { javaDateTimeFormatter } from "@/helpers/DateHelper";
import TablePagination from "@/components/tables/TablePagination.vue";
import { getPaginationControls, paginate } from "@/helpers/Paginator";
import TextBadge from "@/components/shared/TextBadge.vue";
import PopUp from "@/components/shared/PopUp.vue";

export default {
  name: "ReservationView",
  components: {
    PopUp,
    TextBadge,
    TablePagination,
    FormGroup,
    FontAwesomeIcon,
    DropdownMenu,
    MainTable,
    ActionBtn,
    ContentWrapper,
  },
  computed: {
    ...mapState(["reservations", "systemConfig"]),
    paginationResult() {
      return paginate(
        {
          length: this.reservations.totalElements,
          currentPage: this.reservations.pageNumber + 1,
          itemsPerPage: this.reservations.pageSize,
        },
        []
      );
    },

    paginationControls() {
      return getPaginationControls(this.paginationResult);
    },
  },
  data() {
    return {
      reservationsListingsDropdownlist,
      openReservationMenuId: null,
      isCheckoutPopupOpen: false,
      pendingCheckoutReservation: null,
      roomName: null,
      reservationStatus: null,
    };
  },
  methods: {
    ...mapActions([
      FETCH_RESERVATIONS,
      FETCH_RESERVATIONS_BY_ROOM_NAME,
      CHECKOUT_RESERVATION,
    ]),
    goTo(route) {
      this.$router.push(route);
    },
    reservationDatetime(datetime) {
      return javaDateTimeFormatter(datetime);
    },

    async searchReservation() {
      if (this.roomName && this.roomName !== "")
        await this.FETCH_RESERVATIONS_BY_ROOM_NAME(this.roomName);
      else await this.FETCH_RESERVATIONS();
    },

    mapStatus(status) {
      switch (status.toLowerCase()) {
        case "pago":
          return "success";
        case "falhado":
          return "danger";
        case "cancelado":
          return "basic";
        case "pendente":
          return "warning";
      }
    },

    configureDropdownList(reservation) {
      return this.reservationsListingsDropdownlist.map((group) => ({
        ...group,
        menuItems: group.menuItems.map((item) => {
          let disabled = item.disabled;

          if (item.id === "payment") {
            disabled = reservation.paymentConfirm;
          }

          if (item.id === "checkout") {
            disabled =
              reservation.checkedOut === true ||
              reservation.paymentConfirm === false;
          }

          if (item.id === "extend") {
            disabled = reservation.checkedOut;
          }

          return {
            ...item,
            disabled: Boolean(disabled),
          };
        }),
      }));
    },

    handleStatusChange() {
      console.log("changes");
    },
    toggleMenu(reservationId) {
      this.openReservationMenuId =
        this.openReservationMenuId === reservationId ? null : reservationId;
    },
    handleMenuSelect(selection, reservation, reservationIndex) {
      this.openReservationMenuId = null;
      if (selection.id === "payment") {
        this.goTo({
          name: "confirmReservation",
          params: { id: reservationIndex },
        });
      }

      if (selection.id === "checkout") {
        this.pendingCheckoutReservation = reservation;
        this.$refs.checkoutPopup.openPopup(selection.event);
        return;
      }

      this.$emit("reservation-menu-select", { ...selection, reservation });
    },
    async confirmCheckout() {
      if (!this.pendingCheckoutReservation) return;

      await this.CHECKOUT_RESERVATION(this.pendingCheckoutReservation.id);
      this.isCheckoutPopupOpen = false;
      this.pendingCheckoutReservation = null;
      await this.FETCH_RESERVATIONS();
    },
    clearPendingCheckout() {
      this.pendingCheckoutReservation = null;
    },
    async handlePaginationChange({ page, pageSize }) {
      await this.FETCH_RESERVATIONS({
        currentPage: page - 1,
        itemsPerPage: pageSize,
      });
    },
  },

  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_RESERVATIONS);
      next();
    } catch (error) {
      next(error);
    }
  },
};
</script>

<style scoped></style>
