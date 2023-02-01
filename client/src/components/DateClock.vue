<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  text?: string;
}>();
var date = ref("");
var time = ref("");

setInterval(updateTime, 1000);
updateTime();

function updateTime() {
  var cd = new Date();
  time.value =
    zeroPadding(cd.getHours()) +
    ":" +
    zeroPadding(cd.getMinutes()) +
    ":" +
    zeroPadding(cd.getSeconds());
  date.value =
    cd.getFullYear() +
    ". " +
    zeroPadding(cd.getMonth() + 1) +
    ". " +
    zeroPadding(cd.getDate()) +
    ". " +
    cd.toLocaleString("default", { weekday: "short" });
}

function zeroPadding(num: number, digit = 2) {
  return num.toString().padStart(digit, "0");
}
</script>

<template>
  <div class="clock">
    <p class="date">{{ date }}</p>
    <p class="time">{{ time }}</p>
    <p class="text" v-if="text?.length">{{ text }}</p>
  </div>
</template>

<style scoped>
p {
  margin: 0;
  padding: 0;
}
.clock {
  display: flex;
  justify-items: center;
  flex-direction: column;
  align-items: center;
  /* background: radial-gradient(ellipse at center, #0a2e38 0%, #00000000 70%); */
  color: #daf6ff;
  text-shadow: 0 0 20px rgb(218, 222, 223), 0 0 20px rgba(10, 175, 230, 0);
}
.time {
  letter-spacing: 0.05em;
  font-size: 170px;
  line-height: 1;
}
.date {
  letter-spacing: 0.1em;
  font-size: 60px;
}
.text {
  letter-spacing: 0.1em;
  font-size: 12px;
  padding: 10px 0 0;
}
</style>
