/**
 * It takes a time in seconds and an offset in seconds and returns a new Date object with the timezone
 * offset applied
 * @param {number} time - the time in seconds since the epoch
 * @param {number} offset - The offset of the timezone you want to convert to.
 * @returns A Date object.
 */
export const convertTimeZone = (time: number, offset: number) => {
  const date = new Date((time + offset) * 1000);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  const nd = new Date(utc);
  return nd;
};

/**
 * It takes a UTC time and an offset and returns a date in the format of "Day, Day of Month Month"
 * @param {number} time - number - the time in milliseconds
 * @param {number} offset - -28800
 * @returns A string in the format of "Monday, 1 January"
 */
export const utcToDate = (time: number, offset: number) => {
  const date = convertTimeZone(time, offset);
  const day = date.toLocaleString("default", { weekday: "long" });
  const month = date.toLocaleString("default", { month: "long" });
  const dayOfMonth = date.getDate();
  return `${day}, ${dayOfMonth} ${month}`;
};

export const utcToDateShort = (time: number, offset: number) => {
  const date = convertTimeZone(time, offset);
  const day = date.toLocaleString("default", { weekday: "short" });
  return `${day}`;

};

/**
 * It takes a UTC time and an offset and returns a formatted time
 * @param {number} time - number - the time in milliseconds
 * @param {number} offset - -28800
 * @returns A string in the format of "HH:MM am/pm"
 */
export const utcToTime = (time: number, offset: number) => {
  const date = convertTimeZone(time, offset);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";
  const hour = hours == 12 && ampm == "pm" ? hours : hours % 12;
  const formattedHour = hour < 10 ? `0${hour}` : hour;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHour}:${formattedMinutes} ${ampm}`;
};

export const utcToTimeShort = (time: number, offset: number) => {
  const date = convertTimeZone(time, offset);
  const hours = date.getHours();
  return `${hours}`;
};

/**
 * It takes an array of strings and returns a string of comma separated values
 * @param {any[]} excludes - any[]
 * @returns A function that takes an array of any type and returns a string of the array elements
 * joined by a comma.
 */
export const excludeString = (excludes: any[]) => {
  return excludes.join(",");
};
