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
    ...mapState(["room"]),
  },
  methods: {
    ...mapActions([SAVE_ROOM]),
    ...mapMutations(["resetRoom"]),
    saveRoom() {
      this.SAVE_ROOM(this.room);
      this.resetRoom();
      this.goTo({ name: "rooms" });
    },
    goTo(route) {
      this.$router.push(route);
    },
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
        <div class="flex justify-end">
          <ActionBtn text="Guardar o quarto" icon="save" @click="saveRoom" />
          <ActionBtn text="Cancelar" icon="arrow-left" v-if="this.room.id" />
        </div>
      </content-card>
    </template>
  </ContentWrapper>
</template>

<style scoped></style>
