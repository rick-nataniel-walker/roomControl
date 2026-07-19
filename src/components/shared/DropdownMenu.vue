<template>
  <div class="dropdown border border-gray-500">
    <ul
      class="list-none border-b border-gray-200"
      v-for="dropdownChildren in dropdownList"
      :key="dropdownChildren"
    >
      <li class="dropdown-item" v-for="item in dropdownChildren" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: "DropdownMenu",
  props: {
    dropdownList: {
      type: Array,
      required: true,
    },
  },
};
</script>
<style scoped>
.dropdown {
  @apply w-16 bg-white boxShadow z-50;
}
.dropdown-item {
  @apply bg-white hover:bg-accent hover:text-light;
}
</style>
