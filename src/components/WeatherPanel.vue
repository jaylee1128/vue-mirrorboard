<script setup lang="ts">
import { ref } from "vue";
import CurrentWeather from "./CurrentWeather.vue";
import HourlyWeather from "./HourlyWeather.vue";

const weatherData = ref<any>("");
const updateWeatherData = (event: any) => (weatherData.value = event[0]);
</script>

<template>
  <div>
    <CurrentWeather
      apiKey="e7ed170c9b0f91b11e37cab93f5918b0"
      lat="36.4298820"
      long="127.387621"
      hourly
      @weatherData="updateWeatherData"
    />
    <HourlyWeather
      apiKey="e7ed170c9b0f91b11e37cab93f5918b0"
      lat="36.4298820"
      long="127.387621"
      hourly
    />
  </div>
</template>

<style scoped>
#weather {
  background: #00f;
}
</style>
