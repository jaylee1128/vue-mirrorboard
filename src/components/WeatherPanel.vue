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
      apiKey="api-key"
      lat="36.4298820"
      long="127.387621"
      hourly
      @weatherData="updateWeatherData"
    />
    <HourlyWeather
      apiKey="api-key"
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
