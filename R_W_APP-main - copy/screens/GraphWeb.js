import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button, Dimensions } from "react-native";
import DropDown from "./components/Dropdown";
import TemputureGraph from "./components/TemputureGraph";
import Calender from "./components/CalenderWeb";
import {
  getToday,
  otherThanNull,
  formatFrostData,
  showLoading,
  refreshInterval,
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
import {
  defaultRefreshtime,
  QuearyDropDownSelections,
} from "./components/QuearysAndFunctions/exportConsts";

/**
 * The purpose of this function is displaying and returning the graph
 * data's and display including all the date, Temperature, Prediction and Frost
 *
 * @returns Promise
 */
export default function Graph() {
  // real data and time
  const [MetWatchData, setMetWatchData] = useState([0, 0]);
  const [time, setTime] = useState(["Wait"]);
  // predicted data and time
  const [PredictionData, setPredictionData] = useState([0]);
  const [PredictTime, setPredictTime] = useState(["Wait"]);
  // frost data and time
  const [FrostData, setFrostData] = useState([0]);
  const [FrostTime, setFrostTime] = useState(["Wait"]);
  // dropdowns
  const [QearyStarttime, setQearyStarttime] = useState("0");
  const [selectedLocation, setSelectedLocation] = useState("KumeuMetWatch");
  const [selectedValue, setSelectedValue] = useState("24");

  const [Graphdate, setDate] = useState();
  const [QuearyDate, setQuearyDate] = useState(getToday());

  const [ShowCalender, setShowCalender] = useState(false);
  const [ShowGraph, setShowGraph] = useState(true);
  const [ShowSpace, setShowSpace] = useState(false);

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(defaultRefreshtime);
  const [updatePage, setUpdatePage] = useState(1);

  const db = firebase.database();

  const linedata = {
    labels: time,
    // legend: ["Actual Temperature °C", "Predicted Temperature °C"],
    datasets: [
      {
        data: MetWatchData,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        strokeWidth: 3,
      },
      {
        data: PredictionData,
        color: (opacity) => `rgba(255, 168, 0, ${0.5})`,
        strokeWidth: 3,
        withDots: false,
      },
    ],
  };
  const FrostBar = {
    labels: FrostTime,
    datasets: [
      {
        data: FrostData,
        color: (opacity) => `rgba(0, 0, 255, ${1})`,
        strokeWidth: 1,
      },
    ],
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
      setTime(TimeNullFilterArray);
      setPredictTime(filteredPredictionTimeArray);
      setFrostTime(filteredPredictionFrostTimeArray);
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
    console.log(MetWatchData);
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

  console.log("Update " + updatePage);

  return (
    <View style={styles.container}>
      <View style={styles.loading}>{showLoading(loading)}</View>
      <DropDown
        styles={styles.defaultdrop}
        selectedValue={selectedLocation}
        setSelectedValue={setSelectedLocation}
        values={QuearyDropDownSelections}
      />
      {!ShowCalender && (
        <>
          <Text style={styles.Date}>{Graphdate}</Text>
          <Text>
            Selection {<Text style={styles.TimeSelection24H}>(24hr)</Text>}:
            {QearyStarttime} -{" "}
            {parseInt(QearyStarttime, 10) + parseInt(selectedValue, 10) - 1}
          </Text>
          {ShowGraph && (
            <View style={styles.container1}>
              <View style={styles.legendView}>
                <Text>
                  <Text style={styles.predictionLegend}>―― {"  "}</Text>
                  <Text style={styles.legendText}>
                    Predicted Temperature °C
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
              <Text style={styles.Black}>
                Predicted Temperature for {PredictTime.at(-1)} is{" "}
                {PredictionData.at(-1) + "°C"}
              </Text>
              <Text style={styles.tempText}>
                Current Temperature for {time.at(-1)} is{" "}
                {MetWatchData.at(-1) + "°C"}
              </Text>
              <Text style={styles.Blue}>Frost Chance %</Text>
              <FrostBarChart linedata={FrostBar} />
            </View>
          )}

          {ShowSpace && (
            <>
              <Text style={styles.SpaceReplaceGraph}>No Data</Text>
            </>
          )}

          <View style={styles.ButtonRow}>
            <Button
              color="#ffba00"
              title="Select Date"
              onPress={() => {
                setShowCalender(true);
              }}
            />
            <Button
              color="#ffba00"
              title="    Search    "
              onPress={() => {
                setUpdatePage(updatePage + 1);
              }}
            />
          </View>
          <View style={styles.DropRowTitle}>
            <Text> Selected Hours</Text>
            <Text> Start Time </Text>
          </View>
          <View style={styles.DropRow}>
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
            <DropDown
              styles={styles.defaultPicker}
              selectedValue={QearyStarttime}
              setSelectedValue={setQearyStarttime}
              values={[
                { title: "00:00", value: "0" },
                { title: "08:00", value: "8" },
                { title: "12:00", value: "12" },
                { title: "16:00", value: "16" },
                { title: "20:00", value: "20" },
              ]}
            />
          </View>
        </>
      )}
      {ShowCalender && (
        <View>
          <Calender setQueary={setQuearyDate} />
          <Button
            color="#ffba00"
            title="Submit"
            onPress={() => {
              setShowCalender(false);
              setUpdatePage(updatePage + 1);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
    height: Dimensions.get("window").height + 1000,
  },
  container1: {
    paddingTop: 10,
    textAlign: "center",
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
    width: 150,
    height: 35,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFFFFF",
    marginBottom: 1,
    paddingLeft: 15,
  },
  legendText: {
    color: "#000000",
    textAlign: "justify",
    fontSize: 14,
    fontWeight: "bold",
  },
  tempText: {
    textAlign: "center",
    color: "#000000",
    fontSize: 15,
    fontFamily: "Arial",
    paddingBottom: 20,
  },
  Black: {
    textAlign: "center",
    fontFamily: "Arial",
    color: "#000000",
    fontSize: 15,
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
  predictionLegend: {
    color: "#ffba00",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
  },
  actualLegend: {
    color: "#000000",
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: -4,
  },
  legendView: {
    alignContent: "flex-start",
    textAlign: "left",
    // backgroundColor: "white",
    // borderColor: "#000000",
    // borderWidth: 1,
    // borderRadius: 2,
    padding: 15,
  },
});
