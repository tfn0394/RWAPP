import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  Dimensions,
} from "react-native";
import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import DropDown from "./components/Dropdown";
import { KumeuMetwatchQuearyAllThisHour } from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import {
  getToday,
  getHour,
  // refreshInterval,
  showLoading,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import SixSquare from "./components/HomeSixSquare";
import {
  QuearyDropDownSelections,
  // wait,
} from "./components/QuearysAndFunctions/exportConsts";

/**
 * The Homescreen is the main display of the software. This will include a display
 * all the necessary data that needs to be displayed for our mentor to check and confirm
 * before showing the client
 *
 * @returns Scrollview of both the App and Website
 */
export default function HomeScreen() {
  const db = firebase.database();
  // eslint-disable-next-line no-unused-vars
  const [QuearyDate, setQearyDate] = useState(getToday(undefined));
  const [ShowLastHour, setShowLastHour] = useState(false);
  const [MetWatchData, setMetWatchData] = useState([
    "Loading Real Temp",
    "Loading Real Temp",
    "Loading Real Temp",
    "Loading Real Temp",
    "Loading Real Temp",
    "Loading Real Temp",
  ]);

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(4500);
  const [updatePage, setUpdatePage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [fml, setFml] = useState(true);

  const image = require("./images/logo.png");

  const [selectedLocation, setSelectedLocation] = useState("Kumeu");

  const fetchHourDataNow = useCallback(async () => {
    await Promise.all([
      KumeuMetwatchQuearyAllThisHour(
        db,
        QuearyDate,
        getHour(),
        setMetWatchData,
        setShowLastHour
      ),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db]);

  // const fetchPredictionHour = useCallback(async () => {
  //   console.log(PredictionNextHour);
  //   await Promise.all([
  //     KumeuMetwatchQuearyPredictionDataNowNoString(
  //       db,
  //       QuearyDate,
  //       getHour() + 1,
  //       setPredictionNextHour,
  //       setShowLastHour
  //     ),
  //   ]);
  //   console.log(PredictionNextHour);
  //   if (PredictionNextHour === "Loading") {
  //     const returnedNotFound = "Not Found";
  //     setPredictionNextHour(returnedNotFound);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [db]);

  useEffect(() => {
    fetchHourDataNow();
    // fetchPredictionHour();
    // refreshInterval(
    //   setLoading,
    //   setRefreshTime,
    //   refreshTime,
    //   setUpdatePage,
    //   updatePage
    // );
    refreshHomepage();
    loadHomePage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchHourDataNow, updatePage, refresh]);

  function refreshHomepage() {
    setTimeout(() => {
      setLoading(false);
      if (MetWatchData[0] !== null) {
        setRefreshTime(60000);
      } else {
        setRefreshTime(5000);
      }
      setUpdatePage(updatePage + "1");
    }, refreshTime);
  }

  function loadHomePage() {
    if (fml === true) {
      setRefresh(true);
      setRefresh(false);

      setTimeout(() => {
        setUpdatePage(updatePage + "1");
        setRefresh(true);
      }, 2000);
      setRefresh(false);
      setFml(false);
    }
  }

  return (
    <View style={styles.container1}>
      <View
        backgroundColor="#ffba00"
        width={Dimensions.get("window").width}
        alignItems={"center"}
      >
        <Image source={image} backgroundColor="#ffba00" style={styles.image} />
      </View>
      <DropDown
        styles={styles.defaultdrop}
        selectedValue={selectedLocation}
        setSelectedValue={setSelectedLocation}
        values={QuearyDropDownSelections}
      />

      <View>
        <Text style={styles.seconds}>Last Updated</Text>

        <View style={styles.containerRow}>
          <Text style={styles.time}>
            {MetWatchData[0]} {MetWatchData[6]}
          </Text>
        </View>
      </View>

      <SixSquare MetWatchData={MetWatchData} />
      {showLoading(loading)}

      <View style={styles.refreshbutton}>
        <Button
          title="Refresh"
          color="#ffba00"
          onPress={() => {
            setUpdatePage(updatePage + 1);
          }}
        />
      </View>

      {ShowLastHour ? (
        <Text style={styles.Date}>
          {/* Unable to find data for this hour. This data is from {MetWatchData[6]} */}
        </Text>
      ) : null}
    </View>
  );
}
/**
 * Styles represents the design and the display for data that needs to displayed
 * Which a total of 6 boxes of data display
 *
 * Data Display: Temperature, Leat Wetness, Frost, Prediction, Wind Direction and Speed
 */

const styles = StyleSheet.create({
  image: {
    marginTop: 30,
    marginBottom: 20,
    width: 360,
    height: 35,
  },
  container1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    height: Dimensions.get("window").height,
  },

  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  Date: {
    textAlign: "center",
    fontSize: 20,
    padding: 20,
    fontWeight: "bold",
  },
  ubabletofindData: {
    textAlign: "center",
    fontSize: 12,
    padding: 2,
    fontWeight: "bold",
  },
  seconds: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: 10,
  },
  time: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "bold",
  },
  refreshbutton: {
    padding: 10,
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
    color: "black",
    borderWidth: 5,
    borderRadius: 5,
    borderColor: "#ffba00",
    marginBottom: 1,
    marginLeft: 20,
  },
});
