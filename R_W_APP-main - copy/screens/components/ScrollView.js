import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
/**
 * The scrollview list represents all the display whether 
 * it's horizontal or vertical 
 * The ScrollView is used to enable the user to make
 * adjustments to the display
 * 
 * @param {*} props 
 * @returns 
 */
export function ScrollViewList(props) {
  return (
    <View style={styles.size}>
      <ScrollView>
        {props.AllData.map((item, index) => {
          if (item.Date !== null) {
            return (
              <View key={item[index]} style={styles.item}>
                <View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Date: </Text>
                    <Text style={styles.Data}>{item.Date}</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Time: </Text>
                    <Text style={styles.Data}>{item.Time}</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Temperature: </Text>
                    <Text style={styles.Data}>{item.Temp}(°C)</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>
                      Predicted Temperature +1 Hr:{" "}
                    </Text>
                    <Text style={styles.Data}>{item.Prediction}(°C)</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Relative Humidity: </Text>
                    <Text style={styles.Data}> {item.Humid}%</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Wind Speed: </Text>
                    <Text style={styles.Data}> {item.WSpeed}(km/h)</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Wind Direction: </Text>
                    <Text style={styles.Data}>{item.WD}</Text>
                  </View>
                  <View style={styles.containerRow}>
                    <Text style={styles.Lables}>Leaf Wetness: </Text>
                    <Text style={styles.Data}> {item.LeafW}%</Text>
                  </View>
                </View>
              </View>
            );
          } else {
            return null;
          }
        })}
      </ScrollView>
    </View>
  );
}
export default ScrollViewList;
/**
 *  Created a ScrollViewList for design along with it's functions
 *  The purpose of the design is to make look more appealing
 *  not only for client but for our mentor as well.
 */
const styles = StyleSheet.create({
  Lables: {
    fontSize: 15,
    fontWeight: "bold",
  },
  Data: {
    fontSize: 15,
    fontWeight: "bold",
  },
  size: {
    height: 500,
    paddingBottom: 20,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: 350,
    height: 180,
    margin: 2,
    borderColor: "#2a4944",
    borderWidth: 1,
    backgroundColor: "#ffba22",
  },
  containerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 330,
  },
});
