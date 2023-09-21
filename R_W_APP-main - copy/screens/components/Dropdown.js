import * as React from "react";
import { Picker } from "@react-native-picker/picker";

/**The purpose of this dropdown is for the map. 
 * Their components to make the graph look more 
 * modular
 * 
 * @param {*} props 
 * @returns Dropdwown
 */
export function DropDown(props) {
  return (
    <Picker
      style={props.styles}
      selectedValue={props.selectedValue}
      onValueChange={(itemValue, itemIndex) =>
        props.setSelectedValue(itemValue)
      }
    >
      {props.values.map((value, index) => {
        return (
          <Picker.Item label={value.title} value={value.value} key={index} />
        );
      })}
    </Picker>
  );
}

export default DropDown;
