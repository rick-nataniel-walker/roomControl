<script>
import MainHeader from "@/components/nav/MainHeader.vue";
import NavigationMenu from "@/components/nav/NavigationMenu.vue";

export default {
  name: "ContentWrapper",
  components: { NavigationMenu, MainHeader },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  computed: {
    breadcrumbs() {
      const matchedBreadcrumbs = this.$route.matched
        .filter((record) => record.meta.breadcrumb)
        .map((record) => this.createBreadcrumb(record));

      if (this.$route.name === "dashboard") return matchedBreadcrumbs;

      return [
        { label: "Dashboard", to: { name: "dashboard" } },
        ...matchedBreadcrumbs,
      ];
    },
  },
  methods: {
    createBreadcrumb(record) {
      const definition =
        typeof record.meta.breadcrumb === "function"
          ? record.meta.breadcrumb(this.$route)
          : record.meta.breadcrumb;

      if (typeof definition === "string") {
        return {
          label: definition,
          to: record.name
            ? { name: record.name, params: this.$route.params }
            : null,
        };
      }

      return definition;
    },
  },
};
</script>

<template>
  <div class="dashboard bg-gray-100">
    <div class="flex flex-col-reverse py-4 pt-0 tablet:flex-row">
      <NavigationMenu />
      <div class="w-full gap-14">
        <MainHeader />
        <div class="px-8">
          <nav class="breadcrumbs" aria-label="Navegação estrutural">
            <ol>
              <li
                v-for="(breadcrumb, index) in breadcrumbs"
                :key="`${breadcrumb.label}-${index}`"
              >
                <RouterLink
                  v-if="index < breadcrumbs.length - 1 && breadcrumb.to"
                  :to="breadcrumb.to"
                >
                  {{ breadcrumb.label }}
                </RouterLink>
                <span v-else class="active-breadcrumb" aria-current="page">
                  {{ breadcrumb.label }}
                </span>
                <span
                  v-if="index < breadcrumbs.length - 1"
                  class="breadcrumb-separator"
                  aria-hidden="true"
                >
                  &rsaquo;
                </span>
              </li>
            </ol>
          </nav>
          <div class="flex py-8 justify-between items-center">
            <h1 class="text-2xl font-semibold">{{ title }}</h1>
            <slot name="header"></slot>
          </div>
          <slot name="body"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
nav {
  @apply ms-0 ps-0 pb-6;
}
.breadcrumbs {
  @apply flex justify-start pt-8 text-sm;
}

.breadcrumbs ol,
.breadcrumbs li {
  @apply flex items-center;
}
.breadcrumbs a {
  @apply rounded text-slate-500 transition hover:text-secondary;
}

.breadcrumb-separator {
  @apply mx-2 text-slate-400;
}

.active-breadcrumb {
  @apply font-medium text-secondary;
}
</style>
