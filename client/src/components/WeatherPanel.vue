<script setup lang="ts">
import { ref } from "vue";
import CurrentWeather from "./CurrentWeather.vue";
import HourlyWeather from "./HourlyWeather.vue";

const apikey = ref(import.meta.env.VITE_OPENWEATHERMAP_API_KEY);
const lat = ref(import.meta.env.VITE_OPENWEATHERMAP_LAT);
const long = ref(import.meta.env.VITE_OPENWEATHERMAP_LONG);
</script>

<template>
  <div>
    <CurrentWeather :apiKey="apikey" :lat="lat" :long="long" hourly />
    <HourlyWeather :apiKey="apikey" :lat="lat" :long="long" hourly />
  </div>
</template>
