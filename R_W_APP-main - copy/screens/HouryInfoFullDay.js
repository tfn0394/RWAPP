import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import TimeDatePicker from "./components/TimeDatePicker";
import {
  DateNowMidnight,
  getToday,
  refreshInterval,
  showLoading,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import { KumeuMetwatchQuearyAllToday } from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import { ScrollViewList } from "./components/ScrollView";
import DropDown from "./components/Dropdown";
import {
  defaultRefreshtime,
  QuearyDropDownSelections,
} from "./components/QuearysAndFunctions/exportConsts";

/**
 * This class represents hour display throughout the day
 * Since there are 24 hours we have chosen to display from 1 hour till 24 hours worth of data
 * 
 * @returns Promise 
 */
export default function List() {
  const [AllData, setAllData] = useState([]);
  const [QuearyDate, setQuearyDate] = useState(getToday());
  const [DatePickerTime, setDatePickerTime] = useState(DateNowMidnight());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const db = firebase.database();
  const [selectedLocation, setSelectedLocation] = useState("Kumeu");


  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(defaultRefreshtime);
  const [updatePage, setUpdatePage] = useState(1);
  const FirebaseRealtimeKumeu = useCallback(async () => {
    const AllDataArray = [];

    for (let counter = 25; counter > 0; counter--) {
      await Promise.all([
        KumeuMetwatchQuearyAllToday(db, QuearyDate, counter, AllDataArray),
      ]);
    }
    setAllData(AllDataArray);
  }, [db, QuearyDate]);

  useEffect(() => {
    console.log("refreshed");
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

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };
  const showDatepicker = () => {
    showMode("date");
  };

  /**
   * This style is for the Background of both App and Website
   * 
   */
  return (
    <View style={styles.container}>
      <DropDown
        styles={styles.defaultdrop}
        selectedValue={selectedLocation}
        setSelectedValue={setSelectedLocation}
        values={QuearyDropDownSelections}
      />
      <Text style={styles.title}>{QuearyDate}</Text>
      <ScrollViewList
        AllData={AllData}
        refreshFuntion={setUpdatePage}
        refreshVerable={updatePage}
      />
      <View style={styles.containerRow}>
        <Button color="#ffba00" onPress={showDatepicker} title="Select Date" />
        {showLoading(loading)}
        <Button
          color="#ffba00"
          title="Search"
          onPress={() => {
            setUpdatePage(updatePage + 1);
          }}
        />
      </View>

      {show && (
        <TimeDatePicker
          DatePickerTime={DatePickerTime}
          mode={mode}
          setShow={setShow}
          setQuearyDate={setQuearyDate}
          setDatePickerTime={setDatePickerTime}
        />
      )}
    </View>
  );
}
/**
 * This style represents the design of an object that is included 
 * on the display or on the screen. For the purpose of making it 
 * look more appealing for the client and our mentor
 */
const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: "pink",
    marginHorizontal: 20,
  },

  SpaceReplaceGraph: {
    padding: 160,
    fontSize: 20,
  },
  TimeSelection24H: {
    fontSize: 13,
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 330,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    paddingBottom: 15,
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
  Purple: {
    color: "#9C27B0",
    fontSize: 18,
    fontWeight: "bold",
  },
  Red: {
    fontSize: 18,
    color: "#F44336",
    fontWeight: "bold",
    paddingBottom: 20,
  },
});
