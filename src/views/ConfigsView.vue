<template>
  <ContentWrapper title="Configuraçoes">
    <template #body>
      <ContentCard title="Dados da empresa">
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Nome da empresa</span>
          <FormGroup label="" required v-model="this.tenant.name" />
        </div>
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Email da empresa</span>
          <FormGroup label="" required v-model="this.tenant.email" />
        </div>
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Telefone da empresa</span>
          <FormGroup label="" required v-model="this.tenant.phoneNumber" />
        </div>
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Nome do Proprietário</span>
          <FormGroup label="" required v-model="this.tenant.adminUsername" />
        </div>
        <div class="grid grid-cols-2 items-center gap-4 text-sm">
          <span>Telefone do Proprierário</span>
          <FormGroup label="" required v-model="this.tenant.phoneNumber" />
        </div>
        <div class="flex justify-end gap-4">
          <ActionBtn
            text="Actualizar acesso"
            icon="key"
            @click="refreshToken"
          />
          <ActionBtn text="Actualizar dados" icon="retweet" />
        </div>
      </ContentCard>
    </template>
  </ContentWrapper>
</template>

<script>
import ContentWrapper from "@/components/ContentWrapper.vue";
import ContentCard from "@/components/shared/ContentCard.vue";
import FormGroup from "@/components/form/FormGroup.vue";
import { mapActions, mapState } from "vuex";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import { FETCH_TENANT, UPDATE_REFRESH_TOKEN } from "@/store/constants";
import store from "@/store";

export default {
  name: "ConfigsView",
  components: { ActionBtn, FormGroup, ContentCard, ContentWrapper },
  computed: {
    ...mapState(["tenant", "systemConfig"]),
  },
  methods: {
    ...mapActions([FETCH_TENANT, UPDATE_REFRESH_TOKEN]),
    refreshToken() {
      this.UPDATE_REFRESH_TOKEN(this.tenant.id);
    },
  },
  async beforeRouteEnter(to, from, next) {
    try {
      await store.dispatch(FETCH_TENANT);
      next();
    } catch (e) {
      next(e);
    }
  },
};
</script>

<style scoped></style>
