import { checkArray } from "./ExtraFunctions";

const quearyPrediction = "KumeuMetWatch/MetwatchPrediction/";
const querayRealtime = "KumeuMetWatch/MetWatchAuto/";

export function GetTimeGraphTitle(db, QuearyDate, counter, selectedLocation) {
  let response = null;
  db.ref(
    selectedLocation + "/MetWatchAuto/" + QuearyDate + " " + counter + "/0/Date"
  ).on("value", (snapshot) => {
    if (snapshot.val() !== null) response = snapshot.val();
  });

  db.ref(
    selectedLocation +
      "/MetwatchPrediction/" +
      QuearyDate +
      " " +
      counter +
      "/Date"
  ).on("value", (snapshot) => {
    if (snapshot.val() !== null) response = snapshot.val();
  });

  return response;
}

/**
 ** Gathers one object from the firebase database, this looks in
 * "KumeuMetWatch/MetwatchPrediction/QuearyDate" and looks for specific that corralates with
 * getHours return (eg: "24" <-- this is a 24hr time that is located at the end of a document
 * on firebase). Adds the objects to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param setPredictionData This is a useState set function that will be refrenced to set the data found in the database.
 * if nothing is found it will return "Unable to find predicted Temputure"
 * @param getHour Referece to a diffrent funtion.
 */
export function KumeuMetwatchQuearyPredictionDataNowNoString(
  db,
  QuearyDate,
  getHour,
  setPredictionData,
  setShowLastHour
) {
  let responses = "";
  db.ref(quearyPrediction + QuearyDate + " " + getHour + "/pTemp").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) responses = response + "°C";
    }
  );

  if (responses != null) {
    setPredictionData(responses);
  } else {
    let brake = false;
    if (responses == null) {
      for (let counter = 24; counter > 0; counter--) {
        if (brake === false) {
          db.ref(quearyPrediction + QuearyDate + " " + counter + "/pTemp").on(
            "value",
            (snapshot) => {
              const response = snapshot.val();
              if (response != null) responses = response + "°C";
            }
          );
        }
        if (responses !== null && responses !== undefined) {
          setShowLastHour(true);
          setPredictionData(responses);
          brake = true;
        } else {
          setShowLastHour(false);
        }
      }
    }
  }
}

export function KumeuMetwatchQuearyAllThisHour(
  db,
  QuearyDate,
  counter,
  setMetWatchData,
  setShowLastHour
) {
  let MetWatcharray = [];
  let response = 0;
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Date").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatcharray.push(response);
    }
  );
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Temp").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatcharray.push(response);
    }
  );
  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Relative Humidity (%)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatcharray.push(response);
  });
  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Wind Speed (kmh)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatcharray.push(response);
  });
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Wind Direction").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatcharray.push(response);
    }
  );
  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Leaf Wetness (%)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatcharray.push(response);
  });
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Time").on(
    "value",
    (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        const splitresponse = snapshot.val().split(" ");
        MetWatcharray.push(splitresponse[2]);
      } else {
        MetWatcharray.push(null);
      }
    }
  );

  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/pTemp").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatcharray.push(response);
    }
  );

  let brake = false;
  if (MetWatcharray.includes(null)) {
    for (counter; counter > 0; counter--) {
      if (brake === false) {
        MetWatcharray = [];
        db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Date").on(
          "value",
          (snapshot) => {
            response = snapshot.val();
            response = response !== null ? response : null;
            MetWatcharray.push(response);
          }
        );
        db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Temp").on(
          "value",
          (snapshot) => {
            response = snapshot.val();
            response = response !== null ? response : null;
            MetWatcharray.push(response);
          }
        );
        db.ref(
          querayRealtime +
            QuearyDate +
            " " +
            counter +
            "/0/Relative Humidity (%)"
        ).on("value", (snapshot) => {
          response = snapshot.val();
          response = response !== null ? response : null;
          MetWatcharray.push(response);
        });
        db.ref(
          querayRealtime + QuearyDate + " " + counter + "/0/Wind Speed (kmh)"
        ).on("value", (snapshot) => {
          response = snapshot.val();
          response = response !== null ? response : null;
          MetWatcharray.push(response);
        });
        db.ref(
          querayRealtime + QuearyDate + " " + counter + "/0/Wind Direction"
        ).on("value", (snapshot) => {
          response = snapshot.val();
          response = response !== null ? response : null;
          MetWatcharray.push(response);
        });
        db.ref(
          querayRealtime + QuearyDate + " " + counter + "/0/Leaf Wetness (%)"
        ).on("value", (snapshot) => {
          response = snapshot.val();
          response = response !== null ? response : null;
          MetWatcharray.push(response);
        });
        db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Time").on(
          "value",
          (snapshot) => {
            if (snapshot.val() !== null && snapshot.val() !== undefined) {
              const splitresponse = snapshot.val().split(" ");
              MetWatcharray.push(splitresponse[2]);
            } else {
              MetWatcharray.push(null);
            }
          }
        );
        db.ref(
          quearyPrediction + QuearyDate + " " + (counter + 1) + "/pTemp"
        ).on("value", (snapshot) => {
          response = snapshot.val();
          response = response !== null ? response : null;
          MetWatcharray.push(response);
        });
      }
      const array = [];
      array.push(MetWatcharray[0]);
      array.push(MetWatcharray[1]);
      array.push(MetWatcharray[2]);
      array.push(MetWatcharray[3]);
      array.push(MetWatcharray[4]);
      array.push(MetWatcharray[5]);
      array.push(MetWatcharray[6]);
      if (
        checkArray(array) === true &&
        array !== undefined &&
        array.length !== 0
      ) {
        setShowLastHour(true);
        brake = true;
      } else {
        setShowLastHour(false);
      }
    }
  }
  setMetWatchData(MetWatcharray);
}

export function KumeuMetwatchQuearyAllToday(
  db,
  QuearyDate,
  counter,
  AllDataArray
) {
  let MetWatchobject = {};
  let response = 0;
  let prediction = 0;

  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/pTemp").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      prediction = response;
    }
  );

  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Date").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatchobject = { Date: response };
    }
  );
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Time").on(
    "value",
    (snapshot) => {
      if (snapshot.val() !== null && snapshot.val() !== undefined) {
        const splitresponse = snapshot.val().split(" ");
        MetWatchobject = { ...MetWatchobject, Time: splitresponse[2] };
      } else {
        MetWatchobject = { ...MetWatchobject, Time: null };
      }
    }
  );
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Temp").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatchobject = { ...MetWatchobject, Temp: response };
    }
  );

  MetWatchobject = { ...MetWatchobject, Prediction: prediction };

  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Relative Humidity (%)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatchobject = { ...MetWatchobject, Humid: response };
  });
  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Wind Speed (kmh)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatchobject = { ...MetWatchobject, WSpeed: response };
  });
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Wind Direction").on(
    "value",
    (snapshot) => {
      response = snapshot.val();
      response = response !== null ? response : null;
      MetWatchobject = { ...MetWatchobject, WD: response };
    }
  );
  db.ref(
    querayRealtime + QuearyDate + " " + counter + "/0/Leaf Wetness (%)"
  ).on("value", (snapshot) => {
    response = snapshot.val();
    response = response !== null ? response : null;
    MetWatchobject = { ...MetWatchobject, LeafW: response };
  });

  AllDataArray.push(MetWatchobject);
}

/**
 * Gathers objects from the firebase database, this looks in
 * "KumeuMetWatch/MetWatchAuto/QuearyDate" and loops the "counter"
 * amount of times. Adds the objects to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param counter This is the amount of data that will be looped though as this pushes more than one verable to the array
 * @param MetWatcharray this is the array that will contain the data after the function has finnished
 */
export function KumeuMetwatchQuearyRealDataLoop(
  db,
  QuearyDate,
  counter,
  MetWatcharray
) {
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Temp").on(
    "value",
    (snapshot) => {
      let response = snapshot.val();
      response = response !== null ? response : null;
      MetWatcharray.push(response);
    }
  );
}

/**
 * Gathers objects from the firebase database, this looks in
 * "KumeuMetWatch/MetWatchAuto/QuearyDate" and loops the "counter"
 * amount of times. Adds the time to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param counter This is the amount of data that will be looped though as this pushes more than one verable to the array
 * @param timearray this is the array that will contain the data after the function has finnished
 */
export function KumeuMetwatchQuearyRealTimeLoop(
  db,
  QuearyDate,
  counter,
  timearray
) {
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Time").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) {
        if (response.includes("am")) {
          const editresponse = response.split(" - ");
          timearray.push(editresponse[1]);
        } else {
          const editresponse = response.split(" - ");
          timearray.push(editresponse[1]);
        }
      }
    }
  );
}

export function KumeuMetwatchQuearyRealDateLoop(
  db,
  QuearyDate,
  counter,
  timearray
) {
  db.ref(querayRealtime + QuearyDate + " " + counter + "/0/Date").on(
    "value",
    (snapshot) => {
      let response = snapshot.val();
      response = response !== null ? response : null;
      timearray.push(response);
    }
  );
}

export function KumeuMetwatchQuearyPredictionFrostLoop(
  db,
  QuearyDate,
  counter,
  PredictionArray
) {
  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/pFrost").on(
    "value",
    (snapshot) => {
      let response = snapshot.val();
      response = response !== null ? response : null;
      PredictionArray.push(response);
    }
  );
}

export function KumeuMetwatchQuearyPredictionFrostTimeLoop(
  db,
  QuearyDate,
  counter,
  PredictionArray
) {
  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/date").on(
    "value",
    (snapshot) => {
      let response = snapshot.val();
      response = response !== null ? response : null;
      if (response != null) {
        const DateTimeSplit = response.split(" ");

        switch (DateTimeSplit[1]) {
          case "00":
            PredictionArray.push("0am");
            break;
          case "01":
            PredictionArray.push("1am");
            break;
          case "02":
            PredictionArray.push("2am");
            break;
          case "03":
            PredictionArray.push("3am");
            break;
          case "04":
            PredictionArray.push("4am");
            break;
          case "05":
            PredictionArray.push("5am");
            break;
          case "06":
            PredictionArray.push("6am");
            break;
          case "07":
            PredictionArray.push("7am");
            break;
          case "08":
            PredictionArray.push("8am");
            break;
          case "09":
            PredictionArray.push("9am");
            break;
          case "0":
            PredictionArray.push("0am");
            break;
          case "1":
            PredictionArray.push("1am");
            break;
          case "2":
            PredictionArray.push("2am");
            break;
          case "3":
            PredictionArray.push("3am");
            break;
          case "4":
            PredictionArray.push("4am");
            break;
          case "5":
            PredictionArray.push("5am");
            break;
          case "6":
            PredictionArray.push("6am");
            break;
          case "7":
            PredictionArray.push("7am");
            break;
          case "8":
            PredictionArray.push("8am");
            break;
          case "9":
            PredictionArray.push("9am");
            break;
          case "10":
            PredictionArray.push("10am");
            break;
          case "11":
            PredictionArray.push("11am");
            break;
          case "12":
            PredictionArray.push("12pm");
            break;
          case "13":
            PredictionArray.push("1pm");
            break;
          case "14":
            PredictionArray.push("2pm");
            break;
          case "15":
            PredictionArray.push("3pm");
            break;
          case "16":
            PredictionArray.push("4pm");
            break;
          case "17":
            PredictionArray.push("5pm");
            break;
          case "18":
            PredictionArray.push("6pm");
            break;
          case "19":
            PredictionArray.push("7pm");
            break;
          case "20":
            PredictionArray.push("8pm");
            break;
          case "21":
            PredictionArray.push("9pm");
            break;
          case "22":
            PredictionArray.push("10pm");
            break;
          case "23":
            PredictionArray.push("11pm");
            break;
          case "24":
            PredictionArray.push("12pm");
            break;
          default:
            console.log("frost time not in range: " + DateTimeSplit[1]);
        }
      }
    }
  );
}

/**
 * Gathers objects from the firebase database, this looks in
 * "KumeuMetWatch/MetwatchPrediction/QuearyDate" and loops the "counter"
 * amount of times. Adds the objects to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param counter This is the amount of data that will be looped though as this pushes more than one verable to the array
 * @param PredictionArray this is the array that will contain the data after the function has finnished
 */
export function KumeuMetwatchQuearyPredictionDataLoop(
  db,
  QuearyDate,
  counter,
  PredictionArray
) {
  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/pTemp").on(
    "value",
    (snapshot) => {
      let response = snapshot.val();
      response = response !== null ? response : null;
      PredictionArray.push(response);
    }
  );
}

/**
 * Gathers objects from the firebase database, this looks in
 * "KumeuMetWatch/MetWatchAuto/QuearyDate" and loops the "counter"
 * amount of times. Adds the time to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param counter This is the amount of data that will be looped though as this pushes more than one verable to the array
 * @param timearray this is the array that will contain the data after the function has finnished
 */
export function KumeuMetwatchQuearyPredictionTimeLoop(
  db,
  QuearyDate,
  counter,
  timearray
) {
  db.ref(quearyPrediction + QuearyDate + " " + (counter + 1) + "/date").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();

      if (response != null) {
        const DateTimeSplit = response.split(" ");

        switch (DateTimeSplit[1]) {
          case "0":
            timearray.push("0am");
            break;
          case "1":
            timearray.push("1am");
            break;
          case "2":
            timearray.push("2am");
            break;
          case "3":
            timearray.push("3am");
            break;
          case "4":
            timearray.push("4am");
            break;
          case "5":
            timearray.push("5am");
            break;
          case "6":
            timearray.push("6am");
            break;
          case "7":
            timearray.push("7am");
            break;
          case "8":
            timearray.push("8am");
            break;
          case "9":
            timearray.push("9am");
            break;
          case "00":
            timearray.push("0am");
            break;
          case "01":
            timearray.push("1am");
            break;
          case "02":
            timearray.push("2am");
            break;
          case "03":
            timearray.push("3am");
            break;
          case "04":
            timearray.push("4am");
            break;
          case "05":
            timearray.push("5am");
            break;
          case "06":
            timearray.push("6am");
            break;
          case "07":
            timearray.push("7am");
            break;
          case "08":
            timearray.push("8am");
            break;
          case "09":
            timearray.push("9am");
            break;
          case "10":
            timearray.push("10am");
            break;
          case "11":
            timearray.push("11am");
            break;
          case "12":
            timearray.push("12pm");
            break;
          case "13":
            timearray.push("1pm");
            break;
          case "14":
            timearray.push("2pm");
            break;
          case "15":
            timearray.push("3pm");
            break;
          case "16":
            timearray.push("4pm");
            break;
          case "17":
            timearray.push("5pm");
            break;
          case "18":
            timearray.push("6pm");
            break;
          case "19":
            timearray.push("7pm");
            break;
          case "20":
            timearray.push("8pm");
            break;
          case "21":
            timearray.push("9pm");
            break;
          case "22":
            timearray.push("10pm");
            break;
          case "23":
            timearray.push("11pm");
            break;
          case "24":
            timearray.push("12pm");
            break;
          default:
            console.log("prediction time not in range: " + DateTimeSplit[1]);
        }
      }
    }
  );
}

/**
 ** Gathers one object from the firebase database, this looks in
 * "KumeuMetWatch/MetwatchPrediction/QuearyDate" and looks for specific that corralates with
 * getHours return (eg: "24" <-- this is a 24hr time that is located at the end of a document
 * on firebase). Adds the objects to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param setPredictionData This is a useState set function that will be refrenced to set the data found in the database.
 * if nothing is found it will return "Unable to find predicted Temputure"
 * @param getHour Referece to a diffrent funtion.
 */
export function KumeuMetwatchQuearyPredictionDataNow(
  db,
  QuearyDate,
  setPredictionData,
  getHour
) {
  db.ref(quearyPrediction + QuearyDate + " " + (getHour + 1) + "/pTemp").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null)
        setPredictionData(
          "Prediction (" +
            (new Date().getHours() + 1) +
            ":00)\n" +
            +response +
            "°C"
        );
      else setPredictionData("Unable to find predicted Temperature");
    }
  );
}

/**
 ** Gathers one object from the firebase database, this looks in
 * "KumeuMetWatch/MetWatchAuto/QuearyDate" and looks for specific that corralates with
 * getHours return (eg: "24" <-- this is a 24hr time that is located at the end of a document
 * on firebase). Adds the objects to the array that is referened in the funtion.
 *
 * @param db  This is the database that will be passed from where you call it its an import from firbease and db=firebase.database
 * @param QuearyDate This is the Date that will be passed in telling where to look in the database which date plus a 24hr time eg:"20-08-2021 15"
 * @param setMetWatchData This is a useState set function that will be refrenced to set the data found in the database.
 * if nothing is found it will return "Unable to find predicted Temputure"
 * @param getHour Referece to a diffrent funtion.
 */
export function KumeuMetwatchQuearyRealDataNow(
  db,
  QuearyDate,
  setMetWatchData,
  getHour
) {
  db.ref(querayRealtime + QuearyDate + " " + getHour + "/0/Temp").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null)
        setMetWatchData("Temperature Now:\n" + response + "°C");
      else setMetWatchData("Unable to find real Temperature");
    }
  );
}

const toBool = (StringVal) => {
  if (StringVal === "false") {
    return false;
  } else if (StringVal === "true");
  return true;
};

export function _loadData(
  db,
  setPushEnabled,
  SetEmailAddress,
  setActualTempAlert,
  SetActualTempThreshold,
  setPredTempAlert,
  SetPredTempThreshold,
  setLowFrostRisk,
  setSwitchMedFrostRisk,
  setSwitchHighFrostRisk
) {
  // Load Push notification setting
  db.ref("NotificationSettings/KumeuMetWatch/pushEnabled").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setPushEnabled(response);
      console.log(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/emailAdress").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) SetEmailAddress(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/actualTempAlert").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setActualTempAlert(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/actualTempThreshold").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) SetActualTempThreshold(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/predTempAlert").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setPredTempAlert(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/predTempThreshold").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) SetPredTempThreshold(response);
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/LowFrostRisk").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setLowFrostRisk(toBool(response));
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/MedFrostRisk").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setSwitchMedFrostRisk(toBool(response));
    }
  );
  db.ref("NotificationSettings/KumeuMetWatch/HighFrostRisk").on(
    "value",
    (snapshot) => {
      const response = snapshot.val();
      if (response != null) setSwitchHighFrostRisk(toBool(response));
    }
  );
  console.log("Succesfully Loaded Settings");
}
