import * as React from "react";
import { StyleSheet, Text, View, Image, ScrollView } from "react-native";

const image = require("./images/AUTlogo.jpg");
const kumeuLogo = require("./images/DefaultMapImage.jpg");

/**
 * The purpose of this page is display our client including our
 * mentors what we are working on including what University we
 * are studying and what are we studying.
 *
 * It includes a client name, mentor and the Team Members name
 *
 * @returns Information about the "About Page"
 */
export default function AboutPage() {
  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Image source={kumeuLogo} style={styles.image1} />
        <Text style={styles.title} />
        <Text style={styles.abouttext}>
          This Research and Development project was requested by Michaell
          Brajkovich to create an app that Monitors, Visualises and Predicts
          weather parameters at his vineyard. This is an early build of an
          exciting project that has further potential. Currently data from the
          weather station on his vineyard is shown on the app and graphed along
          with predictions made. These predictions are made from a custom
          Machine Learning model as well as forecast APIs. Another project will
          set up a new weather station that can get more frequent data in order
          to ensure Michael has up to date data to monitor his vineyard.
          Temperature and frost prediction allows for an early warning for
          frost.
        </Text>
        <Text style={styles.title}> Supervisor: Akbar Ghobakhlou</Text>
        <Text style={styles.title}> Client: Michael Brajkovich {"\n\n"}</Text>
        <Text style={styles.title}> Team Members:</Text>
        <Text style={styles.people}>
          Michael Chan, Matt Herbert, Taea Lambert, Chiu Pui Lee Bob, Val
          Arroyo.
        </Text>

        <View>
          <Image source={image} style={styles.image2} />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
    </ScrollView>
  );
}
/**
 * Stylesheet represents the design on both App and Website
 */
const styles = StyleSheet.create({
  image1: {
    width: 180,
    height: 180,
    borderRadius: 5,
    marginTop: 10,
    resizeMode: "contain",
  },
  image2: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginTop: 20,
    resizeMode: "contain",
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
  abouttext: {
    textAlign: "justify",
    width: 365,
    padding: 10,
    fontSize: 19,
  },
  people: {
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
