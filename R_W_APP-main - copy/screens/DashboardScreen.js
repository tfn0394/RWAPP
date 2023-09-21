import * as React from "react";
import { StyleSheet, View, Button, Text, ImageBackground } from "react-native";
import firebase from "./firebase";
import { useState, useEffect, useCallback } from "react";
import openMap from "react-native-open-maps";

import "firebase/database";
import {
  refreshInterval,
  showLoading,
} from "./components/QuearysAndFunctions/ExtraFunctions";
// import { defaultRefreshtime } from "./components/QuearysAndFunctions/exportConsts";

/**
 * The purpose of the Dashboard is to display all the necesary data
 * that needs to be displayed.
 * 
 * Data Display: Temperature, Leaf Wetness, Frost, Prediction
 * 
 * @returns Firebase Database
 */
export default function DashboardScreen() {
  const db = firebase.database();
  const [MetWatchTemp, setMetWatchTemp] = useState(null);
  const [MetWatchFrost, setMetWatchFrost] = useState(null);
  const [updatePage, setUpdatePage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [refreshTime, setRefreshTime] = useState(1000);

  const metwatchlocation = { latitude: -36.776215, longitude: 174.568611 };
  const metwatchMapImage = require("./images/MetwatchKumeuNode.png");
  const defultMapImage = require("./images/defaultdashboard.png");

  function Openmetwatchlocation() {
    openMap(metwatchlocation);
  }

  /**
   *  The purpose of Metwatch is display the map on both App and Website.
   * 
   *  Therefore the client including our mentor can view the map on the phone on both 
   *  App and on the Website. Another function for Metwatch is to also view the wether on the map.
   */
  const fetchMetWatchData = useCallback(async () => {
    let MapMetwatch = 0;
    let Frost = "";
    const dates = new Date();
    const dd = String(dates.getDate()).padStart(2, "0");
    const mm = String(dates.getMonth() + 1).padStart(2, "0");
    const yyyy = dates.getFullYear();
    const today = dd + "-" + mm + "-" + yyyy;
    const hour = dates.getHours();
    const querayRealtime = "KumeuMetWatch/MetWatchAuto/";
    const quearyPrediction = "KumeuMetWatch/MetwatchPrediction/";

    await Promise.all([
      db
        .ref(querayRealtime + today + " " + hour + "/0/Temp")
        .on("value", (snapshot) => {
          const response = snapshot.val();
          MapMetwatch = response;
        }),
      db
        .ref(quearyPrediction + today + " " + (hour + 1) + "/pFrost")
        .on("value", (snapshot) => {
          const response = snapshot.val();
          Frost = response;
        }),
    ]);
    if (MapMetwatch === null) {
      setMetWatchTemp("No Data for " + today + " " + hour + "(24hr) ");
      if (Frost === null) {
        setMetWatchFrost("Unable to find frost prediction");
      } else {
        setMetWatchFrost(Frost);
      }
    } else {
      setMetWatchTemp(MapMetwatch + "°C");
      if (Frost === null) {
        setMetWatchFrost("Unable to find frost prediction");
      } else {
        setMetWatchFrost(Frost);
      }
    }
  }, [db]);

  useEffect(() => {
    fetchMetWatchData();
    refreshInterval(
      setLoading,
      setRefreshTime,
      refreshTime,
      setUpdatePage,
      updatePage
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [MetWatchTemp, fetchMetWatchData, updatePage]);

  /**
   * Returns the design format about on the both the Website and App
   */
  return (
    <View style={styles.container}>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={metwatchMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text
                style={styles.squareTitle}
                onPress={() => {
                  Openmetwatchlocation();
                }}
              >
                Kumeu MetWatch
              </Text>
              <Text style={styles.squareText}>{MetWatchTemp} </Text>
              <Text style={styles.squareText}>Frost: {MetWatchFrost} </Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={defultMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text style={styles.squareTitle}> Weather Station 1</Text>
              <Text style={styles.squareText}>{} </Text>
              <Text style={styles.squareText}> In Development</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={defultMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text style={styles.squareTitle}> Weather Station 2</Text>
              <Text style={styles.squareText}>{} </Text>
              <Text style={styles.squareText}> In Development</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={defultMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text style={styles.squareTitle}>{}</Text>
              <Text style={styles.squareText}>{} </Text>
              <Text style={styles.squareText}> In Development</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={defultMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text style={styles.squareTitle}>{}</Text>
              <Text style={styles.squareText}>{} </Text>
              <Text style={styles.squareText}> In Development</Text>
            </View>
          </ImageBackground>
        </View>
        <View style={styles.SquareShape}>
          <ImageBackground
            source={defultMapImage}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.container}>
              <Text style={styles.squareTitle}>{}</Text>
              <Text style={styles.squareText}>{} </Text>
              <Text style={styles.squareText}> In Development</Text>
            </View>
          </ImageBackground>
        </View>
      </View>
      <View style={styles.separator} />
      <View style={styles.loading}>{showLoading(loading)}</View>
      <Button
        color="#ffba00"
        title="Refresh"
        onPress={() => {
          setUpdatePage(updatePage + 1);
        }}
      />
    </View>
  );
}
/**
 * StyleSheet represents the design on both App along with the website
 */
const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: "center",
  },
  loading: {
    paddingTop: 20,
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
    fontSize: 20,
    fontWeight: "bold",
  },
  Temputure: {
    fontSize: 10,
    fontWeight: "bold",
  },
  separator: {
    height: 20,
    width: "80%",
  },
  defaultPicker: {
    width: "50%",
    height: 0,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#FFFFFF",
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 0,
  },
  squareText: {
    textAlign: "center",
    paddingBottom: 20,
    alignContent: "center", // Centered verticaly
    justifyContent: "center", // Centered horizontally
    fontSize: 15,
    height: 60,
    color: "white",
    fontWeight: "bold",
  },
  squareTitle: {
    color: "white",
    fontSize: 20,
    justifyContent: "center", // Centered horizontally
    flex: 1,
    fontWeight: "bold",
  },
  SquareShape: {
    alignContent: "center",
    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,
    width: 180,
    height: 180,
    backgroundColor: "#808080",
    borderRadius: 5,
  },
});
