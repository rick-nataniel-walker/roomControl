<template>
  <MainSpinner :active="isLoading" text="A carregar..." />
  <router-view />
</template>

<script>
import MainSpinner from "@/components/shared/MainSpinner.vue";

export default {
  name: "App",
  components: { MainSpinner },
  computed: {
    isLoading() {
      return this.$store.state.pendingRequests > 0;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
