<script setup lang="ts">
import DateClock from "./components/DateClock.vue";
import MonthCalendar from "./components/MonthCalendar.vue";
import WeatherPanel from "./components/WeatherPanel.vue";
import RssNews from "./components/RssNews.vue";
</script>

<template>
  <header></header>
  <main>
    <div class="leftpan">
      <DateClock class="clock" text="" />
      <div class="spliter"></div>
      <WeatherPanel id="weather"></WeatherPanel>
    </div>
    <div class="rightpan">
      <MonthCalendar class="calendar" />
      <RssNews class="news"></RssNews>
    </div>
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
  width: 41%;
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
  width: 95%;
  flex: 9;
}

.rightpan {
  align-items: center;
  width: 59%;
  display: flex;
  flex-direction: column;
}

.news {
  width: 100%;
  height: 100px;
  flex: 1;
}
</style>
