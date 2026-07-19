<template>
  <ContentWrapper title="Quartos">
    <template #header>
      <ActionBtn
        text="Novo Quarto"
        icon="plus"
        @click="goTo({ name: 'addRoom' })"
      />
    </template>
    <template #body>
      <div class="flex justify-between">
        <div>
          <FormGroup
            label=""
            placeholder="Pesquisar um quarto..."
            icon="magnifying-glass"
            v-model="roomName"
            @update:model-value="searchRoom"
          />
        </div>
        <div>
          <FormGroup
            label=""
            input-type="select"
            placeholder="Breve resumo do artigo..."
            v-model="roomStatus"
            @update:model-value="handleStatusChange"
          >
            <option
              v-for="roomStatus in Object.keys(systemConfig.roomStatues)"
              :key="roomStatus"
              :value="roomStatus"
            >
              {{ systemConfig.roomStatues[roomStatus] }}
            </option>
          </FormGroup>
        </div>
      </div>

      <MainTable>
        <template #headers>
          <th class="p-4">codigo</th>
          <th class="p-4">Designição</th>
          <th class="p-4">Estado</th>
          <th class="p-4">Remanescente</th>
          <th class="p-4">Acções</th>
        </template>
        <template #body>
          <tr
            class="my-1 border-b border-gray-200"
            v-for="(room, index) in rooms.data"
            :key="room.id"
          >
            <td class="p-4">{{ room.id }}</td>
            <td class="p-4">{{ room.name }}</td>
            <td class="p-4">
              <TextBadge
                :type="mapStatus(room.status.toLowerCase())"
                :value="room.status"
              />
            </td>
            <td class="p-4">{{ room.remaining }}</td>
            <td class="p-4">
              <div class="relative inline-flex items-center gap-4">
                <FontAwesomeIcon
                  icon="pen-to-square"
                  class="cursor-pointer"
                  @click="goTo({ name: 'editRoom', params: { id: index } })"
                />
                <button
                  type="button"
                  class="mx-1 cursor-pointer"
                  aria-label="Abrir ações do quarto"
                  @mousedown.stop
                  @click="toggleRoomMenu(room.id)"
                >
                  <FontAwesomeIcon icon="ellipsis-vertical" />
                </button>
                <DropdownMenu
                  v-if="openRoomMenuId === room.id"
                  :dropdown-list="roomsListingsDropdownlist"
                  placement="bottom-end"
                  @select="handleRoomMenuSelect($event, room)"
                  @dismiss="openRoomMenuId = null"
                />
              </div>
            </td>
          </tr>
        </template>
      </MainTable>
      <TablePagination
        v-if="rooms.data.length > 0"
        :pagination="paginationControls"
        @change="handlePaginationChange"
      />
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import MainTable from "@/components/tables/MainTable.vue";
import TextBadge from "@/components/shared/TextBadge.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapActions, mapMutations, mapState } from "vuex";
import {
  DESECUPY_ROOM,
  FETCH_ROOM,
  FETCH_ROOM_BY_NAME,
  FETCH_ROOM_BY_STATUS,
  SAVE_ROOM,
} from "@/store/constants";
import { getPaginationControls, paginate } from "@/helpers/Paginator";
import TablePagination from "@/components/tables/TablePagination.vue";
import store from "@/store";
import DropdownMenu from "@/components/shared/DropdownMenu.vue";
import { roomsListingsDropdownlist } from "@/datasources/datasourcess";

export default {
  name: "RoomsListingView",
  emits: ["room-menu-select"],
  components: {
    DropdownMenu,
    TablePagination,
    FontAwesomeIcon,
    TextBadge,
    MainTable,
    FormGroup,
    ContentWrapper,
    ActionBtn,
  },
  computed: {
    ...mapState(["rooms", "systemConfig"]),

    paginationResult() {
      return paginate(
        {
          length: this.rooms.totalElements,
          currentPage: this.rooms.pageNumber + 1,
          itemsPerPage: this.rooms.pageSize,
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
      roomStatus: "",
      roomName: "",
      openRoomMenuId: null,
      roomsListingsDropdownlist,
    };
  },
  methods: {
    ...mapActions([
      FETCH_ROOM,
      FETCH_ROOM_BY_STATUS,
      FETCH_ROOM_BY_NAME,
      DESECUPY_ROOM,
    ]),
    ...mapMutations([SAVE_ROOM]),
    goTo(route) {
      return this.$router.push(route);
    },
    mapStatus(status) {
      switch (status) {
        case "free":
          return "success";
        case "busy":
          return "danger";
        case "maintenance":
          return "basic";
        case "cleaning":
          return "warning";
      }
    },
    async handlePaginationChange({ page, pageSize }) {
      await this.FETCH_ROOM({
        currentPage: page - 1,
        itemsPerPage: pageSize,
      });
    },
    async handleStatusChange(status) {
      await this.FETCH_ROOM_BY_STATUS(status);
    },
    async searchRoom(roomName) {
      if (roomName === "") return await this.FETCH_ROOM();
      await this.FETCH_ROOM_BY_NAME(roomName);
    },
    toggleRoomMenu(roomId) {
      this.openRoomMenuId = this.openRoomMenuId === roomId ? null : roomId;
    },
    handleRoomMenuSelect(selection, room) {
      this.openRoomMenuId = null;
      if (selection.index === 1) this.DESECUPY_ROOM(room.id);
      this.$emit("room-menu-select", { ...selection, room });
    },
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_ROOM);
      next();
    } catch (error) {
      next(error);
    }
  },
};
</script>

<style scoped></style>
