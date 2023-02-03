<script lang="ts" setup>
import { ref } from "vue";
import { utcToTime } from "./WeatherUtils";
const props = defineProps({
  apiKey: String,
  lat: String,
  long: String,
  units: {
    type: String,
    default: "metric", // metric, imperial
  },
});

const convertDirection = (angle: number) => {
  if (angle >= 22.5 && angle < 67.5) {
    return "NE";
  } else if (angle >= 67.5 && angle < 112.5) {
    return "E";
  } else if (angle >= 112.5 && angle < 157.5) {
    return "SE";
  } else if (angle >= 157.5 && angle < 202.5) {
    return "S";
  } else if (angle >= 202.5 && angle < 247.5) {
    return "SW";
  } else if (angle >= 247.5 && angle < 292.5) {
    return "W";
  } else if (angle >= 292.5 && angle < 337.5) {
    return "NW";
  } else if (angle >= 337.5 || angle < 22.5) {
    return "N";
  }
};
const weather = ref<any>();
const currentWeather = ref<any>();

async function getCurrentWeather() {
  const weatherData = await fetch(
    `https://api.openweathermap.org/data/3.0/onecall?lat=${props.lat}&lon=${props.long}&appid=${props.apiKey}&units=${props.units}&exclude=minutely,alerts,hourly,daily`
  );
  weather.value = await weatherData.json();
  currentWeather.value = weather.value.current;
}

setInterval(
  getCurrentWeather,
  60 * 1000 * import.meta.env.VITE_WEATHER_REFRESH_MINUTE
);
getCurrentWeather();
</script>

<template>
  <div
    class="card"
    style="padding-left: 15px; padding-bottom: 20px"
    v-if="currentWeather"
  >
    <div style="display: flex">
      <h1 style="flex: 1; font-size: 50px">Now</h1>
      <div class="desc" style="font-size: 20px">
        {{ currentWeather.weather[0].description }}
      </div>
      <img
        draggable="false"
        :alt="currentWeather.weather[0]"
        :src="`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`"
      />
    </div>
    <div class="grid-container">
      <div>
        Temperature
        {{ currentWeather.temp }}°C
      </div>
      <div>
        Feels Like
        {{ currentWeather.feels_like }}°C
      </div>
      <div>
        Cloud Cover
        {{ currentWeather.clouds }}%
      </div>
      <div>
        Humidity
        {{ currentWeather.humidity }}%
      </div>
      <div>
        Pressure
        {{ currentWeather.pressure }}hPa
      </div>
      <div>
        Wind
        {{ currentWeather.wind_speed }}m/s
        {{ convertDirection(currentWeather.wind_deg) }}
      </div>
      <div>
        Sunrise
        {{ utcToTime(currentWeather.sunrise, weather.timezone_offset) }}
      </div>
      <div>
        Sunset
        {{ utcToTime(currentWeather.sunset, weather.timezone_offset) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid-container {
  display: grid;
  /* max-width: 600px; */
  grid-template-columns: auto auto auto;
  grid-gap: 10px;
  padding: 10px;
  font-size: 20px;
}

.desc {
  display: flex;
  flex: 2;
  align-self: center;
  flex-direction: row-reverse;
}

.card {
  min-width: 150px;
  margin: 0.5rem;
  padding: 0.5rem;
  border-radius: 15px;
  box-shadow: 5px 4px 9px 3px rgba(0, 0, 0, 0.3);
  transition: 0.3s;
  background-color: #fff2;
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: rgb(230, 230, 230);
}
</style>
