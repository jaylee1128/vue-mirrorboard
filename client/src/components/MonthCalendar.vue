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

function getDateFromTZ(tz: string): Date {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //let [_, year, month, day, hour, min, sec] = tz.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/)
  let match = tz.match(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/);

  if (!match) {
    return new Date();
  }

  let date = new Date(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6])
  );
  return date;
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

              if (item.recurrence) {
                let sdate = new Date(item.start.dateTime);

                let untildate = new Date();
                let freq = 0;
                let exdates: Date[] = [];

                item.recurrence.forEach((curr: string) => {
                  if (curr.indexOf("RRULE:FREQ=") >= 0) {
                    let idx = curr.indexOf("UNTIL=") + 6;
                    let lastidx = curr.indexOf(";", idx);
                    let until = curr.substring(idx, lastidx);

                    untildate = getDateFromTZ(until);
                    //untildate = new Date(until);

                    if (curr.indexOf("WEEKLY") >= 0) {
                      freq = 7;
                    } else if (curr.indexOf("DAILY") >= 0) {
                      freq = 1;
                    } else if (curr.indexOf("MONTHLY") >= 0) {
                      freq = 30;
                    } else if (curr.indexOf("YEARLY") >= 0) {
                      freq = 365;
                    }
                  } else if (curr.indexOf("EXDATE") >= 0) {
                    let idx = curr.indexOf(":") + 1;
                    let exdate = curr.substring(idx);
                    let exdatearr = exdate.split(",");
                    exdatearr.forEach((exdatestr: string) => {
                      let exdate = getDateFromTZ(exdatestr);
                      exdates.push(exdate);
                    });
                  }
                });

                while (
                  sdate < untildate &&
                  !(sdate.getMonth() > curdate.getMonth() + 1)
                ) {
                  sdate = new Date(
                    sdate.getTime() + 1000 * 60 * 60 * 24 * freq
                  );

                  if (
                    exdates.find(
                      (exdate) => exdate.getTime() == sdate.getTime()
                    )
                  ) {
                    continue;
                  }

                  let edate = new Date(item.end.dateTime);
                  edate.setTime(edate.getTime() + 1000 * 60 * 60 * 24 * freq);
                  let ev = {
                    title: item.summary,
                    start: sdate,
                    end: edate,
                    color: src.color,
                  };
                  evs.push(ev);
                }
              }
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
