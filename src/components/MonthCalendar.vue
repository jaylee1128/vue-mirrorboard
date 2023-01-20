<script setup lang="ts">
//import { ref } from "vue";

defineProps<{
  text?: string;
}>();
</script>

<template>
  <div id="calendar"></div>
</template>

<style scoped>
#calendar {
  background: #ff0000;
  width: 100%;
  height: 100%;
}
</style>
