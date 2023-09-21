import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import * as React from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import {
  getToday,
  refreshInterval,
  showLoading,
} from "./components/QuearysAndFunctions/ExtraFunctions";
import { KumeuMetwatchQuearyAllToday } from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
import { ScrollViewList } from "./components/ScrollView";
import DropDown from "./components/Dropdown";
import Calender from "./components/CalenderWeb";
import {
  defaultRefreshtime,
  QuearyDropDownSelections,
} from "./components/QuearysAndFunctions/exportConsts";


/**
 * The purpose of this function ListWeb is hour selection followed
 * by it's refresh page followed by it's calendar.
 * So therefore overall it demonstrates the hour throughout the day.
 */

export default function ListWeb() {
  const [AllData, setAllData] = useState([[null, null]]);
  const [ShowCalender, setShowCalender] = useState(false);
  const [QuearyDate, setQuearyDate] = useState(getToday());
  const [show, setShow] = useState(false);
  const [showAll, setshowAll] = useState(true);
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
    console.log(AllDataArray);
    console.log(AllDataArray[2].Date);
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

  return (
    <>
      {showAll && (
        <View style={styles.container}>
          <DropDown
            styles={styles.defaultdrop}
            selectedValue={selectedLocation}
            setSelectedValue={setSelectedLocation}
            values={QuearyDropDownSelections}
          />
          <Text style={styles.title}>{QuearyDate}</Text>
          {!ShowCalender && (
            <>
              <ScrollViewList
                AllData={AllData}
                refreshFuntion={setUpdatePage}
                refreshVerable={updatePage}
              />

              <View style={styles.containerRow}>
                <Button
                  color="#ffba00"
                  title="Select Date"
                  onPress={() => {
                    setShowCalender(true);
                  }}
                />
                {showLoading(loading)}
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
      )}
      {show && (
        <View>
          <Button
            color="#ffba00"
            title="cancel"
            onPress={() => {
              console.log("open");
              setshowAll(true);
              setShow(false);
            }}
          />
        </View>
      )}
    </>
  );
}
/**
 * This style sheet represents the display of the the functions on the
 * objects on both website and app.
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
    marginRight: 10,
    width: 350,
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
