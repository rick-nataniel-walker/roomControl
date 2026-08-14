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
    ...mapState(["room", "rooms", "systemConfig"]),
  },
  data() {
    return {
      roomCopy: null,
      image: null,
    };
  },
  methods: {
    ...mapActions([SAVE_ROOM]),
    ...mapMutations(["resetRoom"]),
    async saveRoom() {
      const formData = new FormData();
      formData.append("id", this.room.id);
      formData.append("name", this.room.name);
      formData.append("lockId", this.room.lockId);
      if (this.image !== null) formData.append("imageFile", this.image);
      formData.append("status", this.room.status);
      this.roomCopy = await this.SAVE_ROOM(formData);
      if (this.roomCopy) {
        this.roomCopy = null;
        this.goTo({ name: "rooms" });
      }
    },
    goTo(route) {
      this.$router.push(route);
      this.resetRoom();
    },
    getImage(data) {
      this.image = data;
    },
  },
  beforeMount() {
    this.roomCopy = null;
    this.resetRoom();
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
      <content-card title="adicionar um quarto" styled="none">
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Designação do quarto</span>
          <FormGroup label="" required v-model="this.room.name" />
        </div>
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Código da fechadura</span>
          <FormGroup label="" required v-model="this.room.lockId" />
        </div>
        <div
          class="grid grid-cols-2 items-center gap-4 text-sm"
          v-if="this.$route.params.id"
        >
          <span>Status</span>
          <FormGroup
            label=""
            required
            v-model="this.room.status"
            input-type="select"
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
        <FileInput
          name="roomImg"
          label="Fotografia do quarto"
          formats="image/*"
          @base64Img="getImage"
          :return-as-base64="false"
          :src="this.room.image"
          preview
        />
        <div class="flex justify-end gap-4">
          <ActionBtn
            text="Cancelar"
            v-if="this.room.id"
            variant="cancel"
            @click="goTo({ name: 'rooms' })"
          />
          <ActionBtn text="Guardar o quarto" icon="save" @click="saveRoom" />
        </div>
      </content-card>
    </template>
  </ContentWrapper>
</template>

<style scoped></style>
