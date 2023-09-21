import * as React from "react";
import { ActivityIndicator } from "react-native-paper";
// import { wait } from "./exportConsts";
/**
 * Return a new Date with hours, minutes and seconds === 0
 *
 * @returns New Date
 */
export function DateNowMidnight() {
  const DateNow = new Date();
  DateNow.setHours(0);
  DateNow.setMinutes(0);
  DateNow.setSeconds(0);
  return DateNow;
}

/**
 *Calculates a time and displays eg:"20:20" (8:20pm)
 *
 * @returns String
 */
export function getTime() {
  const today = new Date();
  let time = "Unable to find time";
  if (today.getHours() < 10) {
    if (today.getMinutes() < 10) {
      time = "0" + today.getHours() + ":" + "0" + today.getMinutes();
    } else {
      time = "0" + today.getHours() + ":" + today.getMinutes();
    }
  } else {
    if (today.getMinutes() < 10) {
      time = today.getHours() + ":" + "0" + today.getMinutes();
    } else {
      time = today.getHours() + ":" + today.getMinutes();
    }
  }
  return time;
}

/**
 * Returns the hour currently eg:"15" (3pm)
 * @returns string
 */
export function getHour() {
  const today = new Date();
  const time = today.getHours();
  return time;
}

/**
 * Pass in an array and will return the array without any NULL inside.
 * This funtion does not clean objects.
 *
 * @param arr The array that will have all null verables removed
 * @returns Array
 */
export function otherThanNull(arr) {
  return arr.some((el) => el !== null);
}

/**
 * Returns a Date string corasponding to right now
 * eg: 20-04-2021
 *
 * @returns String
 */
export function getToday() {
  const dates = new Date();
  const dd = String(dates.getDate()).padStart(2, "0");
  const mm = String(dates.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = dates.getFullYear();
  const today = dd + "-" + mm + "-" + yyyy;
  return today;
}

export function getYesterday() {
  const dates = new Date();
  dates.setDate(dates.getDate() - 1);
  const dd = String(dates.getDate()).padStart(2, "0");
  const mm = String(dates.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = dates.getFullYear();
  const today = dd + "-" + mm + "-" + yyyy;
  return today;
}
export function getDaysBack(days) {
  const dates = new Date();
  dates.setDate(dates.getDate() - days);
  const dd = String(dates.getDate()).padStart(2, "0");
  const mm = String(dates.getMonth() + 1).padStart(2, "0"); // January is 0!
  const yyyy = dates.getFullYear();
  const today = dd + "-" + mm + "-" + yyyy;
  return today;
}

/**
 * Filter though array giving back an array with the first, middle and last spot populated
 *
 * @param NullFilterArray  array containing all hours corrasponding to data fetch from firbase  Array ["12pm", "1pm", "2pm",]
 * @returns Array
 */
export function filterTimeArray(NullFilterArray) {
  const firstNum = NullFilterArray[0];
  const midNum =
    NullFilterArray[
      NullFilterArray.length - parseInt(NullFilterArray.length / 2, 10)
    ];
  const LastNum = NullFilterArray[NullFilterArray.length - 1];

  return NullFilterArray.map((item, index) => {
    if (item === firstNum || item === midNum || item === LastNum) {
      return item;
    } else {
      return "";
    }
  });
}
export function filterTimeRangeArray(NullFilterArray) {
  const firstNum = NullFilterArray[0];
  const midNum =
    NullFilterArray[
      NullFilterArray.length - parseInt(NullFilterArray.length / 2, 10)
    ];
  const LastNum = NullFilterArray[NullFilterArray.length - 1];

  const returnedArray = [];
  returnedArray[0] = firstNum;
  returnedArray[
    NullFilterArray.length - parseInt(NullFilterArray.length / 2, 10)
  ] = midNum;
  returnedArray[NullFilterArray.length - 1] = LastNum;

  return returnedArray;
}

export function formatFrostData(filteredPredictionFrostArray) {
  const returnedArray = [];
  let persentageFrost;
  filteredPredictionFrostArray.map((item, index) => {
    switch (item) {
      case "No Frost Risk":
        persentageFrost = 0;
        break;
      case "Low Frost Risk":
        persentageFrost = 20;
        break;
      case "Med Frost Risk":
        persentageFrost = 50;
        break;
      case "High Frost Risk":
        persentageFrost = 100;
        break;
      default:
        persentageFrost = 0;
        break;
    }
    returnedArray.push(persentageFrost);
    return 0;
  });
  return returnedArray;
}

export function refreshInterval(
  setLoading,
  setRefreshTime,
  refreshTime,
  setUpdatePage,
  updatePage
) {
  setTimeout(() => {
    setLoading(false);
    setRefreshTime(60000);
    setUpdatePage(updatePage + 1);
  }, refreshTime);
}

export function showLoading(loading) {
  if (loading === true) {
    return <ActivityIndicator size={"large"} color={"#389cff"} />;
  }
}

export function returnQuearyDate(dates, DateArray) {
  for (let i = 0; i < dates.length; i++) {
    if (dates[i] instanceof Date) {
      const dd = String(dates[i].getDate()).padStart(2, "0");
      const mm = String(dates[i].getMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = dates[i].getFullYear();
      const today = dd + "-" + mm + "-" + yyyy;
      DateArray.push(today);
    }
  }
}

export function checkArray(arr) {
  return arr.some((el) => el !== null);
}
