<script setup lang="ts">
import { onMounted } from "vue";
import { Calendar } from "@fullcalendar/core";
//import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import googleCalendarPlugin from "@fullcalendar/google-calendar";
import { eventSources } from "./CalendarEventSources";

defineProps<{
  text?: string;
}>();

let calendar: any = undefined;
let useGoogleOAuth2 = JSON.parse(import.meta.env.VITE_GOOGLE_USE_OATH2);

async function checkGoogleAuth(): Promise<boolean> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let path = "/checkgoogleauth";
    let res = await fetch(path);
    let json = await res.json();

    if (json.error) {
      alert(json.error);
      return false;
    }

    if (json.needauth) {
      //alert("Click ok after Google sign in.");
      if (!confirm("Click ok after Google sign in.")) {
        return false;
      } else {
        continue;
      }
      //continue;
    }

    if (json.ok) {
      return true;
    }
  }
}

async function getGoogleOAuth2Events() {
  try {
    let evs: any[] = [];
    let curdate = new Date();

    for (let i = 0; i < eventSources.length; i++) {
      const src = eventSources[i];

      let path = "/googleevents?id=" + encodeURIComponent(src.googleCalendarId);
      fetch(path).then((res: Response) => {
        res.json().then((json) => {
          if (json.needauth) {
            if (i == eventSources.length - 1) {
              updateEvents();
            }
            return;
          }

          if (json.error) {
            alert("getGoogleOAuth2Events error : " + json.error);
            return;
          }

          json.items.forEach((item: any) => {
            if (item.start.date) {
              if (item.recurrence) {
                let sdate = new Date(item.start.date);
                sdate.setFullYear(curdate.getFullYear());
                item.start.date = sdate;
                let edate = new Date(item.end.date);
                edate.setFullYear(curdate.getFullYear());
                item.end.date = edate;
              }

              evs.push({
                title: item.summary,
                start: item.start.date,
                end: item.end.date,
                color: src.color,
                allDay: true,
              });
            } else {
              evs.push({
                title: item.summary,
                start: item.start.dateTime,
                end: item.end.dateTime,
                color: src.color,
              });
            }
          });

          if (i == eventSources.length - 1) {
            setTimeout(() => {
              createCalendar(); // for today background bug
              //calendar.getEventSourceById("default")?.remove();
              calendar.addEventSource({ id: "default", events: evs });
            }, 500);
          }
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  if (useGoogleOAuth2) updateEvents();
  else createCalendar();
});

function updateEvents() {
  checkGoogleAuth().then((rslt: boolean) => {
    if (rslt) {
      getGoogleOAuth2Events();
    }
  });
}

function createCalendar() {
  if (calendar) calendar.destroy();

  let el: HTMLElement = document.getElementById("fc")!;

  if (useGoogleOAuth2) {
    calendar = new Calendar(el, {
      plugins: [dayGridPlugin],
      initialView: "dayGridMonth",
      weekends: true,
      headerToolbar: { start: "", center: "title", end: "" },
      eventSources: [{ id: "default", events: [] }],
      now: new Date(),
    });
  } else {
    calendar = new Calendar(el, {
      plugins: [dayGridPlugin, googleCalendarPlugin],
      initialView: "dayGridMonth",
      googleCalendarApiKey: import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY,
      weekends: true,
      headerToolbar: { start: "", center: "title", end: "" },
      eventSources: eventSources,
      now: new Date(),
    });
  }

  calendar.render();
}

if (useGoogleOAuth2) {
  setInterval(
    updateEvents,
    1000 * 60 * import.meta.env.VITE_CALENDAR_REFRESH_MINUTE
  );
}
</script>

<template>
  <div id="calendar">
    <!--FullCalendar id="fc" :options="calendarOptions" style="flex: 1" />-->
    <div id="fc" style="flex: 1" />
  </div>
</template>

<style scoped>
#calendar {
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
