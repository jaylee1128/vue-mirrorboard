<script setup lang="ts">
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { eventSources } from "./CalendarEventSources";
import type { an } from "@fullcalendar/core/internal-common";

defineProps<{
  text?: string;
}>();

const calendarOptions = ref({
  plugins: [dayGridPlugin, googleCalendarPlugin],
  initialView: "dayGridMonth",
  googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
  weekends: true,
  headerToolbar: { start: "", center: "title", end: "" },
  eventSources: eventSources,
});

function asdf(a:any) {
  console.log(a)
  //console.log(b)
  //console.log(c)
}

// let recaptchaScript = document.createElement('script');
// recaptchaScript.setAttribute('src', 'https://accounts.google.com/gsi/client');
// document.head.appendChild(recaptchaScript);

fetch("/googlerefreshtoken").then((value: Response) => {
  value.json().then((json: any) => {
    console.log(json);
  });
});
</script>

<template>
  <div id="calendar">
    <!--<FullCalendar :options="calendarOptions" style="flex: 1" />-->
    <div id="g_id_onload"
      data-client_id="4522972674-4684ps8qbolfbe6ip6l787omsbovcbhg.apps.googleusercontent.com"
      data-context="use"
      data-ux_mode="popup"
      @data-callback="asdf"
      data-close_on_tap_outside="false"
      data-itp_support="true">
    </div>

    <div class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="filled_black"
      data-text="continue_with"
      data-size="large"
      data-logo_alignment="left">
    </div>
  </div>
</template>

<style scoped>
#calendar {
  /* background: #ff0000; */
  height: 100%;
  display: flex;
  align-items: center;
}
</style>

<style>
.fc-daygrid-dot-event {
  color: white;
}
</style>
