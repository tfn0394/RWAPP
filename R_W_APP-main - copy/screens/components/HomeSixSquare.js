import { Text, View, Dimensions, StyleSheet } from "react-native";
import * as React from "react";

/**
 * The purpose of the six square
 *
 * @param {*} props
 * @returns
 */
export function SixSquare(props) {
  return (
    <>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <View style={styles.container}>
            <Text style={styles.squareTitle}>Temperature:</Text>
            <Text style={styles.squareText}>{props.MetWatchData[1]}°C</Text>
          </View>
        </View>
        <View style={styles.SquareShape}>
          <View style={styles.container}>
            <Text style={styles.squareTitle}>Humidity</Text>
            <Text style={styles.squareText}>{props.MetWatchData[2]}%</Text>
          </View>
        </View>
      </View>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <View style={styles.container}>
            <Text style={styles.squareTitle}>Wind Speed</Text>
            <Text style={styles.squareText}>{props.MetWatchData[3]}km/h</Text>
          </View>
        </View>
        <View style={styles.SquareShape}>
          <Text style={styles.squareTitle}>Wind Direction</Text>
          <Text style={styles.squareText}>{props.MetWatchData[4]}</Text>
        </View>
      </View>
      <View style={styles.containerRow}>
        <View style={styles.SquareShape}>
          <Text style={styles.squareTitle}>Leaf Wetness</Text>
          <Text style={styles.squareText}>{props.MetWatchData[5]}%</Text>
        </View>
        <View style={styles.SquareShape}>
          <Text style={styles.squareTitle}>Prediction +1 Hr</Text>
          <Text style={styles.squareText}>{props.MetWatchData[7]}°C</Text>
        </View>
      </View>
    </>
  );
}
/**
 * This represents the structure of the object
 * on both the webpage and on the app.
 */
export default SixSquare;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  containerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  squareText: {
    textAlign: "center",
    fontSize: 30,
    alignContent: "center", // Centered verticaly
    color: "#575757",
    fontWeight: "bold",
    padding: 10,
  },
  squareTitle: {
    color: "black",
    textAlign: "center",
    fontSize: 21,
    justifyContent: "center", // Centered horizontally
    flex: 1,
    fontWeight: "bold",
  },
  SquareShape: {
    alignContent: "center",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 5,
    marginRight: 5,
    width: Dimensions.get("window").width / 2.2,
    height: Dimensions.get("window").height / 7.2,
    backgroundColor: "#bdbdbd",
    borderRadius: 5,
  },
});
