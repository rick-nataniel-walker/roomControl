<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import MainTable from "@/components/tables/MainTable.vue";
import TextBadge from "@/components/shared/TextBadge.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { mapActions, mapState } from "vuex";

export default {
  name: "RoomsListingView",
  components: {
    FontAwesomeIcon,
    TextBadge,
    MainTable,
    FormGroup,
    ContentWrapper,
    ActionBtn,
  },
  computed: {
    ...mapState(["rooms"]),
  },
  methods: {
    ...mapActions(["FETCH_ROOM"]),
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
  },
  beforeMount() {
    this.FETCH_ROOM();
  },
};
</script>

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
          />
        </div>
        <div>
          <FormGroup
            label=""
            input-type="select"
            placeholder="Breve resumo do artigo..."
          >
            <option value="valor 1" selected>Valor 1</option>
            <option value="valor 1">Valor 3</option>
            <option value="valor 1">Valor 4</option>
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
            v-for="room in this.rooms"
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
            <td class="p-4 gap-4">
              <FontAwesomeIcon icon="pen-to-square" class="cursor-pointer" />
              <FontAwesomeIcon
                icon="ellipsis-vertical"
                class="cursor-pointer mx-1"
                @click="goTo({ name: 'editRoom', params: { id: room.id } })"
              />
            </td>
          </tr>
        </template>
      </MainTable>
    </template>
  </ContentWrapper>
</template>

<style scoped></style>
