import * as React from "react";
import { LineChart } from "react-native-chart-kit";
import { Dimensions, Platform, StyleSheet } from "react-native";

/**
 * The purpose of this class is display the Temperature graph 
 * it includes dots on the temperature spefically and accurately.
 * 
 * Temperature graphs demonstrates details about the data that will help 
 * both the client and our mentor to understand how the temperature data's are being 
 * stored including the prediction of the data. Hence forseeing the future temperature 
 * to prevent frost problems
 * 
 * @param {*} props 
 * @returns LineChart 
 */
export function TemputureGraph(props) {
  function widthCalculate() {
    if (Platform.OS === "web") {
      return 1000;
    } else {
      return Dimensions.get("window").width;
    }
  }
  function heightCalculate() {
    if (props.height === null || props.height === undefined) {
      return 170;
    } else {
      return props.height;
    }
  }
  return (
    <LineChart
      data={props.linedata}
      width={widthCalculate()}
      height={heightCalculate()}
      yAxisSuffix="°C"
      verticalLabelRotation={0}
      withInnerLines={true}
      yAxisInterval={"2"}
      style={styles.graphStyle}
      fromZero={true}
      chartConfig={{
        decimalPlaces: 1,
        backgroundGradientFrom: 0,
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        backgroundColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 2, // optional, default 3
      }}
    />
  );
}

export default TemputureGraph;

const styles = StyleSheet.create({
  graphStyle: { marginBottom: 10 },
});
