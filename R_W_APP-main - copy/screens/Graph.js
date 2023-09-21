import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import DropDown from "./components/Dropdown";
import TemputureGraph from "./components/TemputureGraph";
import TimeDatePicker from "./components/TimeDatePicker";
import {
  DateNowMidnight,
  filterTimeArray,
  formatFrostData,
  getToday,
  otherThanNull,
  refreshInterval,
  showLoading,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import {
  KumeuMetwatchQuearyRealDataLoop,
  KumeuMetwatchQuearyRealTimeLoop,
  KumeuMetwatchQuearyPredictionDataLoop,
  KumeuMetwatchQuearyPredictionTimeLoop,
  KumeuMetwatchQuearyPredictionFrostLoop,
  KumeuMetwatchQuearyPredictionFrostTimeLoop,
  GetTimeGraphTitle,
} from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import FrostBarChart from "./components/FrostBarChart";
import { ScrollView } from "react-native-gesture-handler";
import {
  QuearyDropDownSelections,
  defaultRefreshtime,
  wait,
} from "./components/QuearysAndFunctions/exportConsts";

export default function Graph() {
  // real data and time
  const [MetWatchData, setMetWatchData] = useState([0, 0]);
  const [time, setTime] = useState(["Wait"]);
  // predicted data and time
  const [PredictionData, setPredictionData] = useState([0]);
  const [PredictTime, setPredictTime] = useState([0]);
  // frost data and time
  const [FrostData, setFrostData] = useState([0]);
  const [FrostTime, setFrostTime] = useState(["Wait"]);
  // dropdowns
  const [QearyStarttime, setQearyStarttime] = useState("0");
  const [selectedLocation, setSelectedLocation] = useState("KumeuMetWatch");
  const [selectedValue, setSelectedValue] = useState("24");

  const [Graphdate, setDate] = useState();
  const [QuearyDate, setQuearyDate] = useState(getToday());

  const [DatePickerTime, setDatePickerTime] = useState(DateNowMidnight());
  const [mode, setMode] = useState("date");

  const [showDateTime, setshowDateTime] = useState(false);
  const [ShowGraph, setShowGraph] = useState(true);
  const [ShowSpace, setShowSpace] = useState(false);

  const db = firebase.database();

  const [loading, setLoading] = useState(true);

  const [updatePage, setUpdatePage] = useState(1);
  const [refreshTime, setRefreshTime] = useState(defaultRefreshtime);

  /**
   *
   */
  const linedata = {
    labels: time,
    datasets: [
      {
        data: MetWatchData,
        color: (opacity) => `rgba(0, 0, 0, ${0.8})`,
        strokeWidth: 1,
      },
      {
        data: PredictionData,
        withDots: false,
        color: (opacity = 1) => `rgba(255, 168, 0, ${0.8})`,
        strokeWidth: 1,
      },
    ],
  };
  const FrostBar = {
    labels: FrostTime,
    datasets: [
      {
        data: FrostData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 1,
      },
    ],
  };

  const showMode = (currentMode) => {
    setshowDateTime(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };
  const showTimepicker = () => {
    showMode("time");
  };

  /**
  * This fuction will get the date that will be displayed a the top of the screen 
    it will first queary though all the data that is referencing today within the firebase
    realtime database if it cannot find anything it will print out  
    "Unable to find any data for: "+QuearyDate +" ("+ selectedValue +"hr)";

    snapshot.val() is the response from the database.
    setDate() is the funtion that allows the set of the usestate date
  */
  function fetchDateKumeu() {
    let response = null;

    const together = parseInt(QearyStarttime, 10) + parseInt(selectedValue, 10);
    for (let counter = 0; counter < together; counter++) {
      response = GetTimeGraphTitle(db, QuearyDate, counter, selectedLocation);
      if (response !== "0" && response !== null) {
        break;
      }
    }

    if (response === null) {
      setShowGraph(false);
      setShowSpace(true);
      response =
        "Unable to find any data for: " +
        QuearyDate +
        " (" +
        selectedValue +
        "hr)";
    } else {
      setShowGraph(true);
      setShowSpace(false);
    }
    setDate(response);
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
    const PredictionFrostArray = [];
    const PredictionFrostTimeArray = [];

    const together = parseInt(QearyStarttime, 10) + parseInt(selectedValue, 10);

    for (let counter = QearyStarttime; counter < together; counter++) {
      await Promise.all([
        KumeuMetwatchQuearyRealDataLoop(db, QuearyDate, counter, MetWatcharray),
        KumeuMetwatchQuearyRealTimeLoop(db, QuearyDate, counter, timearray),
      ]);
    }
    for (let counter = QearyStarttime - 1; counter < together; counter++) {
      await Promise.all([
        KumeuMetwatchQuearyPredictionDataLoop(
          db,
          QuearyDate,
          counter,
          PredictionArray
        ),
        KumeuMetwatchQuearyPredictionTimeLoop(
          db,
          QuearyDate,
          counter,
          PredictionTimeArray
        ),
        KumeuMetwatchQuearyPredictionFrostLoop(
          db,
          QuearyDate,
          counter,
          PredictionFrostArray
        ),
        KumeuMetwatchQuearyPredictionFrostTimeLoop(
          db,
          QuearyDate,
          counter,
          PredictionFrostTimeArray
        ),
      ]);
    }
    /**
     * if Statement represents checking for selection.
     */
    if (otherThanNull(MetWatcharray) || otherThanNull(PredictionArray)) {
      const MetWatchRealTimefilter = MetWatcharray.filter(Boolean);
      const TimeNullFilterArray = timearray.filter(Boolean);
      const filteredPredictionArray = PredictionArray.filter(Boolean);
      const filteredPredictionTimeArray = PredictionTimeArray.filter(Boolean);
      const filteredPredictionFrostArray = PredictionFrostArray.filter(Boolean);
      const filteredPredictionFrostTimeArray =
        PredictionFrostTimeArray.filter(Boolean);

      setMetWatchData(MetWatchRealTimefilter);
      setPredictionData(filteredPredictionArray);
      setFrostData(formatFrostData(filteredPredictionFrostArray));

      if (TimeNullFilterArray.length > 12) {
        setTime(filterTimeArray(TimeNullFilterArray));
      } else {
        setTime(TimeNullFilterArray);
      }
      if (filteredPredictionTimeArray.length > 12) {
        setPredictTime(filterTimeArray(filteredPredictionTimeArray));
      } else {
        setPredictTime(filteredPredictionTimeArray);
      }
      if (filteredPredictionFrostTimeArray.length > 11) {
        setFrostTime(filterTimeArray(filteredPredictionFrostTimeArray));
      } else {
        setFrostTime(filteredPredictionFrostTimeArray);
      }

      // setTime(TimeNullFilterArray);
      // setPredictTime(filteredPredictionTimeArray);
      // setFrostTime(filteredPredictionFrostTimeArray);
    } else {
      setPredictionData([0], [null]);
      setMetWatchData([0], [null]);
      setFrostData([0], [null]);
      setTime(["No Data"]);
      setPredictTime(["No Data"]);
      setFrostTime(["No Data"]);
    }
  }, [QearyStarttime, selectedValue, db, QuearyDate]);

  useEffect(() => {
    fetchDateKumeu();
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

  if (MetWatchData[0] === null && loading) {
    wait(1000);
    setUpdatePage(updatePage + 1);
  }

  /**
   * This stylesheet represents the Temperature graph including it's design
   * along with Date and Hour picker for selection on the display.
   * Therefore the client has the freewill to choose at what specific time
   * they would like to display the time and date
   */

  return (
    <View style={styles.container}>
      <View style={styles.loading}>{showLoading(loading)}</View>

      <DropDown
        styles={styles.defaultdrop}
        selectedValue={selectedLocation}
        setSelectedValue={setSelectedLocation}
        values={QuearyDropDownSelections}
      />
      <Text style={styles.Date}>{Graphdate}</Text>
      <Text>
        Selection {<Text style={styles.TimeSelection24H}>(24hr)</Text>}:
        {QearyStarttime} - {QearyStarttime + parseInt(selectedValue, 10) - 1}
      </Text>
      {ShowGraph && (
        <>
          <ScrollView>
            <View style={styles.legendView}>
              <Text>
                <Text style={styles.predictionLegend}>―― </Text>
                <Text style={styles.legendText}>
                  {"    "}Predicted Temperature °C
                </Text>
              </Text>
              <Text>
                <Text style={styles.actualLegend}>―•― </Text>
                <Text style={styles.legendText}>
                  {"     "}Actual Temperature °C
                </Text>
              </Text>
            </View>
            <TemputureGraph linedata={linedata} />
            <Text style={styles.tempText}>
              Predicted Temperature for {PredictTime[PredictTime.length - 1]} is{" "}
              {PredictionData[PredictTime.length - 1]}
            </Text>
            {/* <Text style={styles.tempText}>
              Current Temperature for {time[PredictTime.length - 1]} is{" "}
              {MetWatchData[PredictTime.length - 1]}
            </Text> */}
            {/* <Text style={styles.Yellow}>Prediction</Text>
            <TemputureGraph linedata={PredictTemp} /> */}
            <Text style={styles.Blue}>Frost Chance</Text>
            <FrostBarChart linedata={FrostBar} />
          </ScrollView>
        </>
      )}

      {ShowSpace && (
        <>
          <Text style={styles.SpaceReplaceGraph}>No Data</Text>
        </>
      )}
      <View style={styles.containerRow}>
        <View style={styles.buttonsRight}>
          <Button onPress={showDatepicker} color="#ffba00" title="Start Date" />
        </View>
        <View style={styles.buttonsRight}>
          <Button onPress={showTimepicker} color="#ffba00" title="Start Time" />
        </View>
        <Button
          color="#ffba00"
          title="Search"
          onPress={() => {
            setUpdatePage(updatePage + 1);
          }}
        />
      </View>
      {showDateTime && (
        <TimeDatePicker
          DatePickerTime={DatePickerTime}
          mode={mode}
          setShow={setshowDateTime}
          setQuearyDate={setQuearyDate}
          setDatePickerTime={setDatePickerTime}
          setQearyStarttime={setQearyStarttime}
        />
      )}
      <DropDown
        styles={styles.defaultPicker}
        selectedValue={selectedValue}
        setSelectedValue={setSelectedValue}
        values={[
          { title: "8 Hours", value: "8" },
          { title: "2 Hours", value: "2" },
          { title: "5 Hours", value: "5" },
          { title: "12 Hours", value: "12" },
          { title: "24 Hours", value: "24" },
        ]}
      />
    </View>
  );
}

/**
 * StyleSheet on the graph is the design for
 * the graph display. To make it look more appealing
 */
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
    fontSize: 15,
  },
  containerRow: {
    flexDirection: "row",
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
  tempText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 15,
    paddingBottom: 10,
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
    // backgroundColor: "white",
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
