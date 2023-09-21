import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import DropDown from "./components/Dropdown";
import TemputureGraph from "./components/TemputureGraph";
import TimeDatePickerRange from "./components/TimeDatePickerRange";
import {
  DateNowMidnight,
  filterTimeRangeArray,
  getToday,
  getYesterday,
  otherThanNull,
  returnQuearyDate,
  showLoading,
  refreshInterval,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import {
  KumeuMetwatchQuearyPredictionDataLoop,
  KumeuMetwatchQuearyRealDataLoop,
  KumeuMetwatchQuearyRealDateLoop,
} from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import { ScrollView } from "react-native-gesture-handler";
import {
  defaultRefreshtime,
  QuearyDropDownSelections,
} from "./components/QuearysAndFunctions/exportConsts";

export default function GraphRange() {
  // real data and time
  const [MetWatchData, setMetWatchData] = useState([0, 0]);
  const [time, setTime] = useState(["Wait"]);
  // predicted data and time
  const [PredictionData, setPredictionData] = useState([0]);

  // dropdowns
  const [selectedLocation, setSelectedLocation] = useState("KumeuMetWatch");

  const [QuearyDateStart, setQuearyDateStart] = useState(getYesterday);
  const [QuearyDateEnd, setQuearyDateEnd] = useState(getToday);

  const [updatePage, setUpdatePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(defaultRefreshtime);

  const [DateEnd, setDateEnd] = useState(new Date());
  const [DateStart, setDateStart] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 5);
    return date;
  });

  const [DatePickerTimeStart, setDatePickerTimeStart] = useState(
    DateNowMidnight()
  );
  const [DatePickerTimeEnd, setDatePickerTimeEnd] = useState(DateNowMidnight());

  const [showDateTimeStart, setshowDateTimeStart] = useState(false);
  const [showDateTimeEnd, setshowDateTimeEnd] = useState(false);

  const db = firebase.database();

  const linedata = {
    labels: time,
    datasets: [
      {
        data: MetWatchData,
        color: (opacity) => `rgba(0, 0, 0, ${1})`,
        strokeWidth: 1,
        withDots: false,
      },
      {
        data: PredictionData,
        color: (opacity) => `rgba(255, 168, 0, ${1})`,
        strokeWidth: 1,
        withDots: false,
      },
    ],
  };

  const showMode = (startEnd) => {
    if (startEnd === 1) {
      setshowDateTimeStart(true);
    } else if (startEnd === 2) {
      setshowDateTimeEnd(true);
    }
  };

  const showDatepickerStart = () => {
    showMode(1);
  };
  const showDatepickerEnd = () => {
    showMode(2);
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

    const DateArray = [];
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
          KumeuMetwatchQuearyPredictionDataLoop(
            db,
            DateArray[i],
            counter,
            PredictionArray
          ),
        ]);
      }
    }

    if (otherThanNull(MetWatcharray) || otherThanNull(PredictionArray)) {
      const MetWatchRealTimefilter = MetWatcharray.filter(Boolean);
      const TimeNullFilterArray = timearray.filter(Boolean);
      const filteredPredictionArray = PredictionArray.filter(Boolean);

      setMetWatchData(MetWatchRealTimefilter);
      setPredictionData(filteredPredictionArray);

      if (TimeNullFilterArray.length > 12) {
        setTime(filterTimeRangeArray(TimeNullFilterArray));
      } else {
        setTime(TimeNullFilterArray);
      }
    } else {
      setPredictionData([0], [null]);
      setMetWatchData([0], [null]);

      setTime(["No Data"]);
    }
  }, [DateStart, DateEnd, db]);

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

      <DropDown
        styles={styles.defaultdrop}
        selectedValue={selectedLocation}
        setSelectedValue={setSelectedLocation}
        values={QuearyDropDownSelections}
      />

      {/* <Text style={styles.Date}> */}
      <Text style={styles.TimeSelection24H}>
        Selection {QuearyDateStart} {"to"} {QuearyDateEnd}
      </Text>

      <ScrollView>
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

        <TemputureGraph linedata={linedata} height={350} />
      </ScrollView>

      <View style={styles.containerRowButton}>
        <View style={styles.buttonsRight}>
          <Button
            onPress={showDatepickerStart}
            color="#ffba00"
            title="Start Date"
          />
        </View>
        <View style={styles.buttonsRight}>
          <Button
            onPress={showDatepickerEnd}
            color="#ffba00"
            title="End Date"
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
      {showDateTimeStart && (
        <TimeDatePickerRange
          DatePickerTime={DatePickerTimeStart}
          mode={"date"}
          setShow={setshowDateTimeStart}
          setQuearyDate={setQuearyDateStart}
          setDatePickerTime={setDatePickerTimeStart}
          setDate={setDateStart}
        />
      )}
      {showDateTimeEnd && (
        <TimeDatePickerRange
          DatePickerTime={DatePickerTimeEnd}
          mode={"date"}
          setShow={setshowDateTimeEnd}
          setQuearyDate={setQuearyDateEnd}
          setDatePickerTime={setDatePickerTimeEnd}
          setDate={setDateEnd}
        />
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
  TimeSelection24H: {
    fontSize: 20,
    padding: 10,
    fontWeight: "bold",
  },
  containerRow: {
    flexDirection: "row",
  },
  containerRowButton: {
    flexDirection: "row",
    margin: 15,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
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
    width: "50%",
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFFFFF",
    marginBottom: 1,
    paddingLeft: 15,
  },
  Black: {
    textDecorationLine: "underline",
    textAlign: "center",
    color: "#000000",
    fontSize: 18,
    fontWeight: "bold",
  },
  Yellow: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 18,
    color: "#ffba00",
    fontWeight: "bold",
    marginTop: 10,
  },
  Blue: {
    textDecorationLine: "underline",
    textAlign: "center",
    fontSize: 20,
    color: "#5080FF",
    fontWeight: "bold",
    marginTop: 10,
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
