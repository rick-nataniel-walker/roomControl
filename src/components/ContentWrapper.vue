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
};
</script>

<template>
  <div class="dashboard bg-gray-100">
    <div class="flex flex-col-reverse py-4 pt-0 tablet:flex-row">
      <NavigationMenu />
      <div class="w-full gap-14">
        <MainHeader />
        <div class="px-8">
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

<style scoped></style>
