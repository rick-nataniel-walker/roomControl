<script>
import FormGroup from "@/components/form/FormGroup.vue";
import ContentWrapper from "@/components/ContentWrapper.vue";
import ContentCard from "@/components/shared/ContentCard.vue";
import FileInput from "@/components/form/FileInput.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import { mapActions, mapMutations, mapState } from "vuex";
import { SAVE_ROOM } from "@/store/constants";

export default {
  name: "RoomsActionView",
  components: { ActionBtn, FileInput, ContentCard, ContentWrapper, FormGroup },
  computed: {
    ...mapState(["room", "rooms"]),
  },
  data() {
    return {
      roomCopy: null,
    };
  },
  methods: {
    ...mapActions([SAVE_ROOM]),
    ...mapMutations(["resetRoom"]),
    async saveRoom() {
      this.roomCopy = await this.SAVE_ROOM(this.room);
      if (this.roomCopy) {
        this.roomCopy = null;
        this.resetRoom();
        this.goTo({ name: "rooms" });
      }
    },
    goTo(route) {
      this.$router.push(route);
    },
  },
  beforeMount() {
    this.roomCopy = null;
    if (this.$route.params.id) {
      this.$store.state.room = { ...this.rooms.data[this.$route.params.id] };
      if (!this.room.id) this.goTo({ name: "rooms" });
    }
  },
};
</script>

<template>
  <ContentWrapper title="Novo Quarto">
    <template #body>
      <content-card title="adicionar um quarto" :styled="false">
        <div class="grid grid-cols-2 gap-4 text-sm">
          <span>Designação do quarto</span>
          <FormGroup label="" required v-model="this.room.name" />
        </div>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <span>Código da fechadura</span>
          <FormGroup label="" required v-model="this.room.lockId" />
        </div>
        <FileInput
          name="roomImg"
          label="Fotografia do quarto"
          formats="image/*"
          v-model="this.room.image"
          preview
        />
        <div class="flex justify-end gap-4">
          <ActionBtn text="Cancelar" v-if="this.room.id" variant="cancel" />
          <ActionBtn text="Guardar o quarto" icon="save" @click="saveRoom" />
        </div>
      </content-card>
    </template>
  </ContentWrapper>
</template>

<style scoped></style>
