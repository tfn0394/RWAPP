import * as React from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export function TimeDatePicker(props) {
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
        dates.setDate(dates.getDate() + 1);
        props.setDate(dates);
        console.log("Date in picker: " + dates);
      }}
    />
  );
}

export default TimeDatePicker;
