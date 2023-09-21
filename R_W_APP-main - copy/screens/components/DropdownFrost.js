import * as React from "react";
import { Picker } from "@react-native-picker/picker";

/**
 * The purpose of dropdown frost is for reading the 
 * frost data
 */

export function DropdownFrost(props) {
  return (
    <Picker
      style={props.styles}
      selectedValue={props.selectedValue}
      onValueChange={(itemValue, itemIndex) =>
        props.setSelectedValue(itemValue)
      }
    >
      <Picker.Item label="Daily" value={props.values[0]} />
      <Picker.Item label="Hourly" value={props.values[1]} />
      <Picker.Item label="Monthy" value={props.values[2]} />
    </Picker>
  );
}

export default DropdownFrost;
