import { isString } from "lodash-es";
import { utcToZonedTime } from "date-fns-tz";

export function isIsoDateWithoutTime(string) {
  const regex = /^\d{4}-(0[0-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/g;
  return string?.match(regex) != null;
}

export function setWindowName(namePostfix) {
  document.title = `${import.meta.env.VITE_PAGE_TITLE_PREFIX}${namePostfix}`;
}
export function retrieveDateOnly(isoDate) {
  return isoDate.substring(0, 10);
}
export function dayAfter(date) {
  const dateObject = new Date(date);
  dateObject.setDate(dateObject.getDate() + 1);
  return retrieveDateOnly(dateObject.toISOString());
}

export function adjustDateToLocal(originalDate) {
  const tz = import.meta.env.VITE_BASE_TZ || "Europe/Berlin";
  return utcToZonedTime(new Date(originalDate).getTime(), tz);
}

export function isEmail(value) {
  if (!isString(value)) return;
  return value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
}

export function isStrongPassword(value) {
  if (!isString(value)) return;
  const regex =
    /^(?=(.*[a-z]){1,})(?=(.*[A-Z]){1,})(?=(.*[0-9]){1,})(?=(.*[!@#$%^&*()\-__+.]){1,}).{8,}$/;
  return value.match(regex);
}

export async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export function convertRemoteImageToDataUrl(url, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function () {
    var reader = new FileReader();
    reader.onloadend = function () {
      callback(reader.result);
    };
    reader.readAsDataURL(xhr.response);
  };
  xhr.open("GET", url);
  xhr.responseType = "blob";
  xhr.send();
}

export function checkIfAnyValueOfObjectIsDefined(object) {
  return object && Object.values(object).find((v) => !!v) ? true : false;
}

export function checkIfDateIsDaysBeforeToday(date, daysBeforeToday) {
  const daysDifference =
    (new Date().getTime() - new Date(date).getTime()) / 1000 / 60 / 60 / 24;
  return daysDifference < daysBeforeToday;
}
export function sanitizeComment(message) {
  // Create clickable links from link text
  const URLMatcher =
    /(?:(?:https):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/i;

  const html = message.replace(
    URLMatcher,
    (match) => `<a href="${match}" target="_blank">${match}</a>`
  );
  return html;
}
