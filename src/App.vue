<script setup lang="ts">
import DateClock from "./components/DateClock.vue";
import MonthCalendar from "./components/MonthCalendar.vue";
import WeatherPanel from "./components/WeatherPanel.vue";
</script>

<template>
  <header></header>

  <main>
    <div class="leftpan">
      <DateClock class="clock" text="" />
      <div class="spliter"></div>
      <WeatherPanel id="weather"></WeatherPanel>
    </div>
    <MonthCalendar class="calendar" />
  </main>
</template>

<style scoped>
main {
  height: 100%;
  display: flex;
  flex-direction: row;
}

.leftpan {
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
}
.clock {
  margin: 50px;
}
.spliter {
  flex: 1;
}

#weather {
  flex: 1;
}

.calendar {
  margin-left: 5px;
}
</style>
