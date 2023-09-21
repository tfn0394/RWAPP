import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

/**
 * Calender is for a date selection to search for the 
 * past data collection
 */
export default class Calender extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    // console.log(date._d);
    // console.log(new Date(date._d));
    // console.log(new Date(date._d).getDate());
  }

  setQueayDate(startDate) {
    console.log(startDate);
    const date = new Date(startDate);
    console.log(date);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = date.getFullYear();
    const today = dd + "-" + mm + "-" + yyyy;
    if (today !== "NaN-NaN-NaN") {
      this.props.setQueary(today);
    }
  }
  /**The ourpose of this is for the webpage return
   * 
   * @returns Webpage
   */
  render() {
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : "";
    return (
      <View style={styles.container}>
        <CalendarPicker
          width={400}
          heigh={400}
          onDateChange={this.onDateChange}
          selectedDayColor="#ffba00"
          dayShape={"square"}
        />

        {this.setQueayDate(startDate)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: "#FFFFFF",
  },
});
