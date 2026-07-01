<template>
  <header class="main-header">
    <button
      class="header-action menu-button"
      type="button"
      aria-label="Abrir menu"
      @click="$emit('menu-toggle')"
    >
      <font-awesome-icon icon="fa-bars" />
    </button>

    <div class="desktop-tools">
      <label class="search-box">
        <font-awesome-icon class="search-icon" icon="fa-search" />
        <input
          :value="search"
          type="search"
          :placeholder="searchPlaceholder"
          aria-label="Pesquisar"
          @input="$emit('update:search', $event.target.value)"
        />
      </label>

      <button
        class="profile-button"
        type="button"
        aria-label="Abrir perfil"
        @click="$emit('profile-click')"
      >
        <span class="user-avatar">
          <img v-if="avatar" :src="avatar" :alt="userName" />
          <span v-else>{{ initials }}</span>
        </span>
        <span class="user-copy">
          <strong>{{ userName }}</strong>
          <small>{{ userRole }}</small>
        </span>
        <font-awesome-icon class="profile-chevron" icon="fa-chevron-down" />
      </button>
    </div>

    <button
      class="header-action notification-button"
      type="button"
      aria-label="Notificações"
      @click="$emit('notification-click')"
    >
      <font-awesome-icon icon="fa-bell" />
      <span v-if="hasNotifications" class="notification-dot"></span>
    </button>
  </header>
</template>

<script>
export default {
  name: "MainHeader",
  props: {
    search: {
      type: String,
      default: "",
    },
    searchPlaceholder: {
      type: String,
      default: "Pesquisar...",
    },
    userName: {
      type: String,
      default: "Walker",
    },
    userRole: {
      type: String,
      default: "Admin",
    },
    avatar: {
      type: String,
      default: "",
    },
    hasNotifications: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    "menu-toggle",
    "notification-click",
    "profile-click",
    "update:search",
  ],
  computed: {
    initials() {
      return this.userName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => name.charAt(0).toUpperCase())
        .join("");
    },
  },
};
</script>

<style scoped>
.main-header {
  @apply flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4;
}

.header-action {
  @apply relative flex h-10 w-10 items-center justify-center rounded-lg border-0 bg-transparent text-lg text-primary transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-secondary/20;
}

.desktop-tools {
  @apply hidden;
}

.notification-dot {
  @apply absolute right-[9px] top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500;
}

.search-box {
  @apply relative block w-full max-w-[340px];
}

.search-icon {
  @apply pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400;
}

.search-box input {
  @apply h-10 w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-primary outline-none transition placeholder:text-slate-400 focus:border-secondary focus:bg-white focus:ring-2 focus:ring-secondary/10;
}

.profile-button {
  @apply flex items-center gap-2.5 rounded-lg border-0 bg-transparent p-1.5 text-left text-primary transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-secondary/20;
}

.user-avatar {
  @apply flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-secondary to-primary text-xs font-bold text-white;
}

.user-avatar img {
  @apply h-full w-full object-cover;
}

.user-copy {
  @apply flex min-w-[72px] flex-col;
}

.user-copy strong {
  @apply text-xs font-semibold leading-tight;
}

.user-copy small {
  @apply mt-0.5 text-[10px] leading-tight text-slate-500;
}

.profile-chevron {
  @apply text-[10px] text-slate-400;
}

@media (min-width: 768px) {
  .main-header {
    @apply h-[72px] gap-6 px-6;
  }

  .desktop-tools {
    @apply ml-auto flex flex-1 items-center justify-end gap-6;
  }

  .notification-button {
    @apply hidden;
  }
}
</style>
