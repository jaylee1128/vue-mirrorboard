<script lang="ts" setup>
import { ref } from "vue";
import { excludeString, utcToDateShort, utcToTimeShort } from "./WeatherUtils";

const props = withDefaults(
  defineProps<{
    apiKey: string;
    lat: string;
    long: string;
    hourly?: boolean;
    daily?: boolean;
    units?: string;
    excludes?: any[];
  }>(),
  {
    hourly: false,
    daily: false,
    units: "metric", // metric, imperial
    excludes: () => ["minutely", "alerts", "current"],
  }
);

const isLoaded = ref(false);
const weather = ref<any>("");
const hourlyData = ref<any>();

var hwDay = "";
setInterval(
  getWeather,
  60 * 1000 * import.meta.env.VITE_WEATHER_REFRESH_MINUTE
);
getWeather();

async function getWeather() {
  const apiLink = `https://api.openweathermap.org/data/2.5/onecall?lat=${
    props.lat
  }&lon=${props.long}&appid=${props.apiKey}&units=${
    props.units
  }&exclude=${excludeString(props.excludes)}`;

  try {
    const weatherData = await fetch(apiLink);
    weather.value = await weatherData.json();
    hourlyData.value = weather.value.hourly;
    //console.log(hourlyData.value);
  } catch (error) {
    console.log(error);
  }
}

function getHwDay(dt: number, get: boolean = false): string {
  if (get) return hwDay;

  var day = utcToDateShort(dt, weather.value.timezone_offset);

  if (day != hwDay) {
    hwDay = day;
    return hwDay;
  } else {
    return "";
  }
}
</script>

<template>
  <div class="weathercon">
    <div v-if="hourlyData && props.hourly" class="wrap">
      <div
        v-for="condition in hourlyData"
        :key="condition"
        style="
          margin-top: 0px;
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 0px;
        "
      >
        <p
          v-if="getHwDay(condition.dt).length > 0"
          style="margin-top: 1px; height: 22px"
          align="center"
        >
          {{ getHwDay(condition.dt, true) }}
        </p>
        <p v-else style="margin-top: 1px; height: 22px">&nbsp;</p>
        <p style="margin: 0.25rem" align="center">
          {{ utcToTimeShort(condition.dt, weather.timezone_offset) }}시
        </p>
        <p style="margin-top: 2px" align="center">{{ condition.temp }}°C</p>
        <Transition appear>
          <div class="center">
            <div class="absolute">
              <div class="relative left-[-50%]" v-show="!isLoaded">
                <div class="lds-dual-ring"></div>
              </div>
            </div>
          </div>
        </Transition>
        <Transition>
          <div class="center" v-show="isLoaded">
            <img
              width="40"
              height="40"
              draggable="false"
              @load="isLoaded = true"
              :alt="condition.weather[0]"
              :src="`https://openweathermap.org/img/wn/${condition.weather[0].icon}@2x.png`"
            />
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weathercon {
  user-select: none;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  color: rgb(230, 230, 230);
}
.wrap {
  display: flex;
  flex-wrap: wrap;
}

.center {
  display: flex;
  justify-content: center;
}

.lds-dual-ring {
  display: inline-block;
  width: 30px;
  height: 30px;
}

.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 30px;
  height: 30px;
  margin: 8px;
  border-radius: 50%;
  border: 6px solid #fff;
  border-color: rgba(25, 25, 25, 0.8) transparent #fff transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}

@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
