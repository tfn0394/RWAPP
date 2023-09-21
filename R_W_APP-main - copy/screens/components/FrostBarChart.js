import * as React from "react";
import { BarChart } from "react-native-chart-kit";
import { Dimensions, Platform, StyleSheet } from "react-native";

/**The purpose of this Barchart is to display the data 
 * hence instead of just having a straight line it's better 
 * to have a bar chart to ensure the the graph is properly working
 * 
 * @param {*} props 
 * @returns BarChart
 */
export function FrostBarChart(props) {
  function widthCalculate() {
    if (Platform.OS === "web") {
      return 1000;
    } else {
      return Dimensions.get("window").width - 30;
    }
  }
  /**
   * The purpose of this return is for the webpage and app
   */
  return (
    <BarChart
      data={props.linedata}
      width={widthCalculate()}
      height={190}
      yAxisSuffix="%"
      verticalLabelRotation={0}
      showValuesOnTopOfBars={true}
      withInnerLines={true}
      style={styles.graphStyle}
      fromZero={true}
      chartConfig={{
        decimalPlaces: 0,
        backgroundGradientFromOpacity: 0,
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(	80, 128, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        backgroundColor: (opacity = 0) => `rgba(255, 255, 255, ${opacity})`,
        strokeWidth: 5, // optional, default 3
      }}
    />
  );
}

export default FrostBarChart;
const styles = StyleSheet.create({
  graphStyle: { marginBottom: 10 },
});
