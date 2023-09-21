import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import DropDown from "./components/Dropdown";
import TemputureGraph from "./components/TemputureGraph";
import {
  getToday,
  otherThanNull,
  showLoading,
  refreshInterval,
  filterTimeArray,
  returnQuearyDate,
  filterTimeRangeArray,
  DateNowMidnight,
  getYesterday,
  getDaysBack,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import {
  KumeuMetwatchQuearyRealDataLoop,
  KumeuMetwatchQuearyPredictionDataLoop,
  KumeuMetwatchQuearyPredictionTimeLoop,
  KumeuMetwatchQuearyRealDateLoop,
} from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import {
  defaultRefreshtime,
  QuearyDropDownSelections,
} from "./components/QuearysAndFunctions/exportConsts";
import CalenderRange from "./components/CalenderWebRange";

export default function Graph() {
  // real data and time
  const [MetWatchData, setMetWatchData] = useState([0, 0]);
  const [time, setTime] = useState(["Wait"]);
  // predicted data and time
  const [PredictionData, setPredictionData] = useState([0]);
  const [PredictTime, setPredictTime] = useState(["Wait"]);

  // dropdowns
  const [selectedLocation, setSelectedLocation] = useState("KumeuMetWatch");

  const [DatePickerTimeStart, setDatePickerTimeStart] = useState(
    DateNowMidnight()
  );
  const [DatePickerTimeEnd, setDatePickerTimeEnd] = useState(DateNowMidnight());

  const [QuearyDateStart, setQuearyDateStart] = useState(getDaysBack(5));
  const [QuearyDateEnd, setQuearyDateEnd] = useState(getToday());

  const [ShowCalenderStart, setShowCalenderStart] = useState(false);
  const [ShowCalenderEnd, setShowCalenderEnd] = useState(false);

  const [updatePage, setUpdatePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(defaultRefreshtime);

  const [DateEnd, setDateEnd] = useState(new Date());
  const [DateStart, setDateStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    return date;
  });

  const db = firebase.database();
  // const [refreshPage, setRefreshPage] = React.useState(false);

  const linedata = {
    labels: time,
    datasets: [
      {
        data: MetWatchData,
        color: (opacity) => `rgba(0, 0, 0, ${0.5})`,
        strokeWidth: 3,
        withDots: false,
      },
      {
        data: PredictionData,
        color: (opacity) => `rgba(255, 168, 0, ${0.5})`,
        strokeWidth: 3,
        withDots: false,
      },
    ],
  };

  // eslint-disable-next-line no-extend-native
  Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };

  function getDates(startDate, stopDate) {
    // eslint-disable-next-line no-array-constructor
    const dateArray = new Array();
    let currentDate = startDate;
    while (currentDate <= stopDate) {
      dateArray.push(new Date(currentDate));
      currentDate = currentDate.addDays(1);
    }
    console.log(dateArray);
    return dateArray;
  }

  /**
  *   This funtion gets the realtime data from the firebase realtime database it waits for a 
      response from the database before going to the next fuction using promise two arrays 
      metwatcharray is the array that will contain all the temputure data, same for 
      time array this is just an array that gets the time that corraspons with the temputure 
      data. At the end both arrays are removed of null data so that the graph can 
      display data correctly. 
  
      after the for loop the metwatch array that contains the realtimeData is cheched to see if it contains 
      any data besides null. If so it will be filtered to remove all nulls from the readtime infomation
      also the time array that corrasponds to that of the data is filtered the same so that all null data 
      is removed and this makes the graph look the best it can. 
  */
  const FirebaseRealtimeKumeu = useCallback(async () => {
    const MetWatcharray = [];
    const timearray = [];
    const PredictionArray = [];
    const PredictionTimeArray = [];

    const DateArray = [];
    console.log("date start:::::  " + DateStart);
    console.log("date end:::::  " + DateEnd);
    returnQuearyDate(getDates(DateStart, DateEnd), DateArray);

    for (let i = 0; i < DateArray.length; i++) {
      for (let counter = -1; counter < 25; counter++) {
        await Promise.all([
          KumeuMetwatchQuearyRealDataLoop(
            db,
            DateArray[i],
            counter,
            MetWatcharray
          ),
          KumeuMetwatchQuearyRealDateLoop(db, DateArray[i], counter, timearray),
        ]);
      }

      for (let counter = -1; counter < 25; counter++) {
        await Promise.all([
          KumeuMetwatchQuearyPredictionDataLoop(
            db,
            DateArray[i],
            counter,
            PredictionArray
          ),
          KumeuMetwatchQuearyPredictionTimeLoop(
            db,
            DateArray[i],
            counter,
            PredictionTimeArray
          ),
        ]);
      }
    }

    if (otherThanNull(MetWatcharray) || otherThanNull(PredictionArray)) {
      const MetWatchRealTimefilter = MetWatcharray.filter(Boolean);
      const TimeNullFilterArray = timearray.filter(Boolean);
      const filteredPredictionArray = PredictionArray.filter(Boolean);
      const filteredPredictionTimeArray = PredictionTimeArray.filter(Boolean);

      setMetWatchData(MetWatchRealTimefilter);
      setPredictionData(filteredPredictionArray);

      if (TimeNullFilterArray.length > 12) {
        setTime(filterTimeRangeArray(TimeNullFilterArray));
      } else {
        setTime(TimeNullFilterArray);
      }
      if (filteredPredictionTimeArray.length > 12) {
        setPredictTime(filterTimeArray(filteredPredictionTimeArray));
      } else {
        setPredictTime(filteredPredictionTimeArray);
      }
    } else {
      setPredictionData([0], [null]);
      setMetWatchData([0], [null]);

      setTime(["No Data"]);
      setPredictTime(["No Data"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  useEffect(() => {
    FirebaseRealtimeKumeu();
    refreshInterval(
      setLoading,
      setRefreshTime,
      refreshTime,
      setUpdatePage,
      updatePage
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updatePage]);

  return (
    <View style={styles.container}>
      <View style={styles.loading}>{showLoading(loading)}</View>

      {(!ShowCalenderStart || !ShowCalenderEnd) && (
        <>
          <View style={styles.loading}>{showLoading(loading)}</View>
          <Text style={styles.title}>
            Under Construction (unable to change start or end date)
          </Text>
          <DropDown
            styles={styles.defaultdrop}
            selectedValue={selectedLocation}
            setSelectedValue={setSelectedLocation}
            values={QuearyDropDownSelections}
          />
          <Text style={styles.TimeSelection24H}>
            Selection {QuearyDateStart} {"to"} {QuearyDateEnd}
          </Text>

          <View style={styles.legendView}>
            <Text>
              <Text style={styles.predictionLegend}>―― {"  "}</Text>
              <Text style={styles.legendText}>Predicted Temperature °C</Text>
            </Text>
            <Text>
              <Text style={styles.actualLegend}>―― </Text>
              <Text style={styles.legendText}>
                {"      "}Actual Temperature °C
              </Text>
            </Text>
          </View>

          <TemputureGraph linedata={linedata} />

          <View style={styles.ButtonRow}>
            <View style={styles.buttonsRight}>
              <Button
                color="#ffba00"
                title="Select start date"
                onPress={() => {
                  setShowCalenderStart(true);
                }}
              />
            </View>
            <View style={styles.buttonsRight}>
              <Button
                color="#ffba00"
                title="Select end date"
                onPress={() => {
                  setShowCalenderEnd(true);
                }}
              />
            </View>
            <Button
              color="#ffba00"
              title="Search"
              onPress={() => {
                setUpdatePage(updatePage + 1);
              }}
            />
          </View>
        </>
      )}

      {ShowCalenderStart && (
        <View>
          <CalenderRange
            defaultTime={DatePickerTimeStart}
            setdefaultTime={setDatePickerTimeStart}
            setQueary={setQuearyDateStart}
            setDate={setDateStart}
          />
          <Button
            color="#ffba00"
            title="Set start date"
            onPress={() => {
              setShowCalenderStart(false);
              setUpdatePage(updatePage + 1);
            }}
          />
        </View>
      )}
      {ShowCalenderEnd && (
        <View>
          <CalenderRange
            defaultTime={DatePickerTimeEnd}
            setdefaultTime={setDatePickerTimeEnd}
            setQueary={setQuearyDateEnd}
            setDate={setDateEnd}
          />

          <Button
            color="#ffba00"
            title="Set end date"
            onPress={() => {
              setShowCalenderEnd(false);
              setUpdatePage(updatePage + 1);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsRight: {
    marginRight: 10,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  SpaceReplaceGraph: {
    padding: 160,
    fontSize: 20,
  },
  searchButton: {
    padding: 10,
    fontSize: 20,
  },
  TimeSelection24H: {
    fontSize: 15,
  },
  containerRow: {
    flexDirection: "row",
  },
  ButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 300,
    flex: 1,
    maxHeight: 35,
    marginBottom: 10,
  },
  DropRowTitle: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 500,
    flex: 1,
    maxHeight: 35,
  },
  DropRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 400,
    flex: 1,
    maxHeight: 35,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    paddingBottom: 20,
    fontSize: 25,
    fontWeight: "bold",
  },
  Date: {
    margin: 10,
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  defaultdrop: {
    width: "50%",
    height: 50,
    color: "black",
    borderWidth: 5,
    borderRadius: 5,
    borderColor: "#ffba00",
    marginBottom: 1,
    marginLeft: 20,
  },
  defaultPicker: {
    width: 150,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFFFFF",
    marginBottom: 1,
    paddingLeft: 15,
  },
  Black: {
    textAlign: "center",
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  Yellow: {
    textAlign: "center",
    fontSize: 18,
    color: "#ffba00",
    fontWeight: "bold",
    paddingBottom: 20,
    paddingLeft: 20,
  },
  Blue: {
    textAlign: "center",
    fontSize: 18,
    color: "#5080FF",
    fontWeight: "bold",
    paddingRight: 20,
    paddingBottom: 20,
  },
  actualLegend: {
    color: "#000000",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -4,
  },
  legendView: {
    alignItems: "baseline",
    // borderColor: "#000000",
    // borderWidth: 1,
    // borderRadius: 2,
    padding: 15,
  },
  predictionLegend: {
    color: "#ffba00",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -2,
  },
  legendText: {
    color: "#000000",
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "bold",
  },
});
