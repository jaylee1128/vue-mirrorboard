<script setup lang="ts">
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { eventSources } from "./CalendarEventSources";

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
</script>

<template>
  <div id="calendar">
    <FullCalendar :options="calendarOptions" style="flex: 1" />
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
