import * as React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

/**
 * Choosing a specific and accurate date to display the data 
 * The purpose of this class is to give the user a free will 
 * to choose a specific time and date for displaying the data 
 * 
 * Data's: Temperature, Frost and Prediction
 * @param {*} props 
 * @returns  Data Time specifically
 */
export function TimeDatePickerRange(props) {
  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={props.DatePickerTime}
      mode={props.mode}
      minuteInterval={30}
      is24Hour={true}
      display="default"
      onChange={(event, dates) => {
        const dd = String(dates.getDate()).padStart(2, "0");
        const mm = String(dates.getMonth() + 1).padStart(2, "0"); // January is 0!
        const yyyy = dates.getFullYear();
        const today = dd + "-" + mm + "-" + yyyy;
        props.setShow(false);
        props.setQuearyDate(today);
        props.setDatePickerTime(dates);
        props.setQearyStarttime(dates.getHours());
        console.log(dates);
      }}
    />
  );
}

export default TimeDatePickerRange;
