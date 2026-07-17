<template>
  <main class="login-page">
    <div class="login-shell">
      <aside class="room-photo" aria-hidden="true"></aside>

      <section class="login-area">
        <div class="mobile-photo" aria-hidden="true"></div>
        <div class="mobile-shade" aria-hidden="true"></div>

        <form class="login-card" @submit.prevent="submitLogin">
          <img
            :src="navyLogo"
            class="brand-logo"
            alt="RoomControl, powered by TrueControl"
          />

          <header class="welcome-copy">
            <h1>Bem-vindo de volta!</h1>
            <p>Inicie sessão para continuar</p>
          </header>

          <div class="fields">
            <FormGroup
              id="identifier"
              v-model="identifier"
              type="text"
              autocomplete="username"
              placeholder="Intriduza o username"
              aria-label="Email ou nome de utilizador"
              required
            />

            <div class="password-field">
              <FormGroup
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Palavra-passe"
                aria-label="Palavra-passe"
                required
              />
              <button
                class="password-toggle"
                type="button"
                :aria-label="
                  showPassword
                    ? 'Ocultar palavra-passe'
                    : 'Mostrar palavra-passe'
                "
                :aria-pressed="showPassword"
                @click="togglePasswordVisibility"
              >
                <svg
                  v-if="!showPassword"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M2.25 12s3.5-6 9.75-6 9.75 6 9.75 6-3.5 6-9.75 6-9.75-6-9.75-6Z"
                  />
                  <circle cx="12" cy="12" r="2.75" />
                </svg>
                <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="m3 3 18 18M10.6 6.1c.46-.07.93-.1 1.4-.1 6.25 0 9.75 6 9.75 6a16.3 16.3 0 0 1-2.3 3.1M6.5 6.7C3.75 8.5 2.25 12 2.25 12s3.5 6 9.75 6c1.2 0 2.3-.22 3.28-.58M9.9 9.9a3 3 0 0 0 4.2 4.2"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div class="login-options">
            <label class="remember-option">
              <input v-model="rememberMe" type="checkbox" />
              <span>Lembrar-me</span>
            </label>
            <a href="#forgot-password">Esqueceu a palavra-passe?</a>
          </div>

          <ActionBtn class="login-button" text="Iniciar Sessão" type="submit" />

          <p class="register-copy">
            Não tem conta?
            <a href="#register">Registe-se</a>
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
import { mapActions } from "vuex";
import { LOGIN } from "@/store/constants";

export default {
  name: "LoginView",
  components: {
    ActionBtn,
    FormGroup,
  },
  data() {
    return {
      identifier: "",
      password: "",
      rememberMe: false,
      showPassword: false,
      navyLogo,
    };
  },
  methods: {
    ...mapActions([LOGIN]),
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async submitLogin() {
      let formdata = {
        username: this.identifier,
        password: this.password,
      };

      try {
        await this.LOGIN(formdata);

        const redirect = this.$route.query.redirect;
        const isInternalRoute =
          typeof redirect === "string" &&
          redirect.startsWith("/") &&
          !redirect.startsWith("//");

        return this.$router.replace(
          isInternalRoute ? redirect : { name: "dashboard" }
        );
      } catch {
        // The login action displays the authentication error.
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

.password-field {
  @apply relative;
}

.password-toggle {
  @apply absolute right-4 top-3 flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:text-secondary focus:outline-none focus:ring-2 focus:ring-secondary/30;
}

.password-toggle svg {
  @apply h-5 w-5 fill-none stroke-current;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.password-field :deep(.form-control) {
  @apply pr-12;
}

.login-options {
  @apply -mt-1 mb-5 flex items-center justify-between gap-3 text-xs;
}

.remember-option {
  @apply flex cursor-pointer items-center gap-2 text-slate-600;
}

.remember-option input {
  @apply h-4 w-4 rounded border-slate-300 text-secondary accent-secondary focus:ring-secondary;
}

.login-options a,
.register-copy a {
  @apply font-semibold text-secondary transition hover:text-primary hover:underline;
}

.login-button {
  @apply w-full;
}

.register-copy {
  @apply mt-5 text-xs text-slate-600;
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
