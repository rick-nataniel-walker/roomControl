<template>
  <main class="login-page">
    <div class="login-shell">
      <aside class="room-photo" aria-hidden="true"></aside>

      <section class="login-area">
        <div class="mobile-photo" aria-hidden="true"></div>
        <div class="mobile-shade" aria-hidden="true"></div>

        <form class="login-card" novalidate @submit.prevent="submitStep">
          <img
            :src="navyLogo"
            class="brand-logo"
            alt="RoomControl, powered by TrueControl"
          />

          <header class="welcome-copy">
            <h1>Crie a sua conta</h1>
            <p>Preencha os dados em cada etapa para começar</p>
          </header>

          <div class="fields">
            <div v-show="currentStep === 1" class="step step-1">
              <h3>Dados do Estabelecimento</h3>
              <FormGroup
                id="name"
                v-model="tenant.name"
                type="text"
                autocomplete="organization"
                placeholder="Introduza o nome do estabelecimento"
                aria-label="Nome do estabelecimento"
                required
              />
              <FormGroup
                id="email"
                v-model="tenant.email"
                type="email"
                autocomplete="organization"
                placeholder="Introduza o email do estabelecimento"
                aria-label="Email do estabelecimento"
                required
              />
              <FormGroup
                id="phoneNumber"
                v-model="tenant.phoneNumber"
                type="tel"
                autocomplete="tel"
                placeholder="Introduza o telefone do estabelecimento"
                aria-label="Telefone do estabelecimento"
                required
              />
            </div>

            <div v-show="currentStep === 2" class="step step-2">
              <h3>Dados Pessoais</h3>
              <FormGroup
                id="adminFirstname"
                v-model="tenant.adminFirstname"
                type="text"
                autocomplete="given-name"
                placeholder="Primeiro Nome"
                aria-label="Primeiro Nome"
                required
              />
              <FormGroup
                id="adminLastname"
                v-model="tenant.adminLastname"
                type="text"
                autocomplete="family-name"
                placeholder="Último Nome"
                aria-label="Último Nome"
                required
              />
              <FormGroup
                id="adminTelephone"
                v-model="tenant.adminTelephone"
                type="tel"
                autocomplete="tel"
                placeholder="Introduza o Número de Telefone Pessoal"
                aria-label="Introduza o Número de Telefone do Pessoal"
                required
              />
            </div>

            <div v-show="currentStep === 3" class="step step-3">
              <h3>Dados da Fechadura Inteligente (TTLock)</h3>
              <FormGroup
                id="identifier"
                v-model="tenant.ttlockUsername"
                type="text"
                autocomplete="username"
                placeholder="Introduza o utilizador do TTLock"
                aria-label="Utilizador do TTLock"
                required
              />

              <FormGroup
                id="password"
                v-model="tenant.ttlockPassword"
                :type="showPassword ? 'text' : 'password'"
                :icon="showPassword ? 'fa-eye-slash' : 'fa-eye'"
                :icon-label="
                  showPassword
                    ? 'Ocultar palavra-passe'
                    : 'Mostrar palavra-passe'
                "
                icon-clickable
                autocomplete="current-password"
                placeholder="Palavra-passe"
                aria-label="Palavra-passe"
                required
                @icon-click="togglePasswordVisibility"
              />
            </div>
            <div class="controls flex justify-between gap-4 right-0">
              <ActionBtn
                v-if="currentStep > 1"
                variant="cancel"
                text="Anterior"
                icon="arrow-left"
                @click="navigateLeft"
              />
              <ActionBtn
                v-if="currentStep < totalSteps"
                text="Próximo"
                icon="arrow-right"
                @click="navigateRight"
              />
              <ActionBtn
                v-else
                text="Criar conta"
                icon="check"
                type="submit"
                :loading="isSubmitting"
                :disabled="isSubmitting"
              />
            </div>
          </div>

          <p class="register-copy">
            Já tem conta?
            <router-link :to="{ name: 'login' }">Entre</router-link>
          </p>
        </form>
      </section>
    </div>
  </main>
</template>

<script>
import FormGroup from "@/components/form/FormGroup.vue";
import ActionBtn from "@/components/shared/ActionBtn.vue";
import navyLogo from "@/assets/navy-logo.png";
import { mapActions, mapState } from "vuex";
import { CREATE_TENANT } from "@/store/constants";

export default {
  name: "TenantSignup",
  components: {
    ActionBtn,
    FormGroup,
  },
  data() {
    return {
      showPassword: false,
      currentStep: 1,
      totalSteps: 3,
      isSubmitting: false,
      navyLogo,
    };
  },
  computed: {
    ...mapState(["tenant"]),
  },
  methods: {
    ...mapActions([CREATE_TENANT]),
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    getCurrentStepFields() {
      const step = this.$el.querySelector(`.step-${this.currentStep}`);
      return step
        ? Array.from(step.querySelectorAll("input, select, textarea"))
        : [];
    },
    validateCurrentStep() {
      const fields = this.getCurrentStepFields();
      const invalidField = fields.find((field) => !field.checkValidity());
      if (invalidField) {
        invalidField.reportValidity();
        invalidField.focus();
        return false;
      }
      return true;
    },
    navigateLeft() {
      if (this.currentStep > 1) this.currentStep -= 1;
    },
    navigateRight() {
      if (this.currentStep < this.totalSteps && this.validateCurrentStep()) {
        this.currentStep += 1;
      }
    },
    async submitStep() {
      if (this.currentStep < this.totalSteps) {
        this.navigateRight();
        return;
      }
      if (!this.validateCurrentStep() || this.isSubmitting) return;

      this.isSubmitting = true;
      // eslint-disable-next-line no-unused-vars
      const { id, ...tenant } = this.tenant;

      try {
        await this.CREATE_TENANT(tenant);
        this.$router.replace({ name: "login" });
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.login-page {
  @apply min-h-screen bg-slate-100 text-primary;
}

.login-shell {
  @apply min-h-screen;
}

.room-photo {
  @apply hidden;
}

.login-area {
  @apply relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8;
}

.mobile-photo,
.mobile-shade {
  @apply absolute inset-0;
}

.mobile-photo {
  background: url("@/assets/motel-room-bg.jpg") center / cover no-repeat;
}

.mobile-shade {
  background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.96) 0%,
      rgba(255, 255, 255, 0.72) 34%,
      rgba(255, 255, 255, 0.28) 100%
    ),
    linear-gradient(0deg, rgba(13, 27, 61, 0.13), transparent 48%);
}

.login-card {
  @apply relative z-10 w-full max-w-md rounded-3xl border border-white/70 bg-white/80 px-5 py-7 text-center shadow-2xl backdrop-blur-md;
  box-shadow: 0 24px 60px rgba(13, 27, 61, 0.18);
}

.brand-logo {
  @apply mx-auto block w-full max-w-[280px];
  mix-blend-mode: multiply;
}

.welcome-copy {
  @apply -mt-2 mb-7;
}

.welcome-copy h1 {
  @apply text-xl font-bold tracking-tight text-primary;
}

.welcome-copy p {
  @apply mt-1 text-sm text-slate-500;
}

.fields {
  @apply text-left;
}

.register-copy a {
  @apply font-semibold text-secondary transition hover:text-primary hover:underline;
}

.register-copy {
  @apply mt-5 text-xs text-slate-600;
}

.controls {
  @apply mt-5;
}

.step h3 {
  @apply mb-5 text-sm text-slate-500 font-bold;
}

@media (min-width: 768px) {
  .login-page {
    @apply flex items-center justify-center p-5;
  }

  .login-shell {
    @apply grid min-h-0 w-full max-w-6xl grid-cols-[42%_58%] overflow-hidden rounded-3xl bg-white shadow-2xl;
    height: min(760px, calc(100vh - 40px));
  }

  .room-photo {
    @apply block;
    background: linear-gradient(rgba(13, 27, 61, 0.16), rgba(13, 27, 61, 0.16)),
      url("@/assets/motel-room-bg.jpg") center / cover no-repeat;
  }

  .login-area {
    @apply min-h-0 bg-white px-12 py-10;
  }

  .mobile-photo,
  .mobile-shade {
    @apply hidden;
  }

  .login-card {
    @apply max-w-md border-0 bg-transparent px-0 py-0 shadow-none backdrop-blur-none;
  }

  .brand-logo {
    @apply max-w-[320px];
  }

  .welcome-copy {
    @apply mb-8;
  }
}

@media (max-width: 360px) {
  .login-area {
    @apply px-3 py-4;
  }

  .login-card {
    @apply px-4 py-5;
  }

  .brand-logo {
    @apply max-w-[245px];
  }
}
</style>
