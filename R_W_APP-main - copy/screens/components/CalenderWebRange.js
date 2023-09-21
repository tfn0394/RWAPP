import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

export default class CalenderRange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: props.defaultTime,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });

    console.log(date);
    const dates = new Date(date._d);
    const dd = String(dates.getDate()).padStart(2, "0");
    const mm = String(dates.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = dates.getFullYear();
    const today = dd + "-" + mm + "-" + yyyy;
    console.log("This is the date+++++" + dates);
    this.props.setdefaultTime(dates);
    this.props.setDate(dates);

    if (today !== "NaN-NaN-NaN") {
      this.props.setQueary(today);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CalendarPicker
          width={400}
          heigh={400}
          onDateChange={this.onDateChange}
          selectedDayColor="#ffba00"
          dayShape={"square"}
        />
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
