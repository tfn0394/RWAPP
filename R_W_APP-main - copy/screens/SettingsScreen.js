import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Button,
  Switch,
  TextInput,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import firebase from "./firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator } from "react-native-paper";
import { _loadData } from "./components/QuearysAndFunctions/KumeuMetWatchQuearys";
// import { SafeAreaInsetsContext } from "react-native-safe-area-context";

/**
 *The contents show on the screen like buttons, switch, input text field, push notifications, texts, 
 when user press the buttons then call the function, and send notification or stop notification, and the text changed, 
 on/off switch for control what notification would like to show, what range of ℃ and frost % to show
 */
export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(false);
  const [actualTempAlert, setActualTempAlert] = useState(false);
  const [predTempAlert, setPredTempAlert] = useState(false);
  const [LowFrostRisk, setLowFrostRisk] = useState(false);
  const [MedFrostRisk, setSwitchMedFrostRisk] = useState(false);
  const [HighFrostRisk, setSwitchHighFrostRisk] = useState(false);
  const [actualTempThreshold, SetActualTempThreshold] = useState(0);
  const [predTempThreshold, SetPredTempThreshold] = useState(0);
  const [emailAdress, SetEmailAddress] = useState(0);
  const [disable, setDisable] = useState(false);

  const db = firebase.database();

  const toggleNotifictions = () => {
    setPushEnabled((oldValue) => !oldValue);
    // console.log("In toggle " + !pushEnabled);
  };
  const toggleActualTempAlert = () => {
    setActualTempAlert((oldValue) => !oldValue);
  };
  const togglePredTempAlert = () => {
    setPredTempAlert((oldValue) => !oldValue);
  };
  const toggleSwitchLowFrostRisk = () => {
    setLowFrostRisk((oldValue) => !oldValue);
  };
  const toggleSwitchMedFrostRisk = () => {
    setSwitchMedFrostRisk((oldValue) => !oldValue);
  };
  const toggleSwitchHighFrostRisk = () => {
    setSwitchHighFrostRisk((oldValue) => !oldValue);
  };

  // Data with the related keys to store/Load
  // Enable Push Notification ==> pushEnabled
  // Enable actual temp alert ==> actualTempAlert
  // Actual Temp Threshold ==>
  // Enable prediction temp alert ==> predTempAlert
  // Pred Temp threshold ==>
  // Low Frost Risk ==> LowFrostRisk
  // Med Frost Risk ==> MedFrostRisk
  // High Frost Risk ==> HighFrostRisk
  useEffect(() => {
    _loadData(
      db,
      setPushEnabled,
      SetEmailAddress,
      setActualTempAlert,
      SetActualTempThreshold,
      setPredTempAlert,
      SetPredTempThreshold,
      setLowFrostRisk,
      setSwitchMedFrostRisk,
      setSwitchHighFrostRisk
    );
  }, [db]);

  function _storeData() {
    storeNotification("pushEnabled", pushEnabled);
    storeNotification("emailAdress", emailAdress);
    storeNotification("actualTempAlert", actualTempAlert);
    storeNotification("actualTempThreshold", actualTempThreshold);
    storeNotification("predTempAlert", predTempAlert);
    storeNotification("predTempThreshold", predTempThreshold);
    storeNotification("LowFrostRisk", LowFrostRisk);
    storeNotification("MedFrostRisk", MedFrostRisk);
    storeNotification("HighFrostRisk", HighFrostRisk);
    console.log("Data Saved");
    SaveDataToFirebase();
  }

  async function storeNotification(key, value) {
    if (value != null) {
      try {
        await AsyncStorage.setItem(key, value.toString());
        console.log("KEY: " + key + " VALUE: " + value);
      } catch (e) {
        console.error("Error saving Data " + e);
      }
    }
  }

  // This function saves the settings to firebase so SendNotification.py can see what settings are enabled.
  function SaveDataToFirebase() {
    db.ref("NotificationSettings/KumeuMetWatch")
      .set({
        pushEnabled,
        emailAdress,
        actualTempAlert,
        actualTempThreshold,
        predTempAlert,
        predTempThreshold,
        LowFrostRisk,
        MedFrostRisk,
        HighFrostRisk,
      })
      .catch((error) => {
        // error callback
        console.log("error ", error);
      });
    console.log("Saved!");
    saveTimer();
  }

  // function showSave() {
  //   if (disable) {
  //     return <ActivityIndicator> size={"small"} </ActivityIndicator>;
  //   }
  // }

  function saveTimer() {
    console.log("disable is " + disable);
    setTimeout(() => {
      setDisable(false);
    }, 1000);
  }

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.Body}>
        <View style={styles.container} marginTop={0}>
          <Text style={styles.containerTitle}>Email Notifications</Text>
          <View style={styles.topContainer}>
            <Text>Enable Email Notifications:</Text>
            <Switch
              style={styles.button}
              onValueChange={toggleNotifictions}
              value={pushEnabled}
            />
          </View>
          <View style={styles.midContainer}>
            <Text>Email Adress: </Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter the email address"
              defaultValue={emailAdress}
              placeholderTextColor="#60605e"
              // numeric
              keyboardType={"email-address"}
              onChangeText={(text) => SetEmailAddress(text)}
            />
          </View>
          <Text style={styles.containerTitle}>
            Actual Events To Be Notified For
          </Text>
          <View style={styles.topContainer}>
            <Text>Actual Temperature Below Threshold: </Text>
            <Switch
              style={styles.button}
              onValueChange={toggleActualTempAlert}
              value={actualTempAlert}
            />
          </View>
          <View style={styles.bottomContainer}>
            <Text>Threshold: </Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter the Number of ℃"
              defaultValue={actualTempThreshold}
              placeholderTextColor="#60605e"
              numeric
              keyboardType={"numeric"}
              onChangeText={(text) => SetActualTempThreshold(text)}
            />
          </View>
          <Text style={styles.containerTitle}>
            Prediction Events To Be Notified For
          </Text>
          <View style={styles.topContainer}>
            <Text>Predicted Temperature Below Threshold: </Text>
            <Switch
              style={styles.button}
              onValueChange={togglePredTempAlert}
              value={predTempAlert}
            />
          </View>
          <View style={styles.topContainer}>
            <Text>Threshold: </Text>
            <TextInput
              style={styles.inputText}
              placeholder="Enter the Number of ℃"
              placeholderTextColor="#60605e"
              numeric
              defaultValue={predTempThreshold}
              keyboardType={"numeric"}
              onChangeText={(text) => SetPredTempThreshold(text)}
            />
          </View>
          <Text style={styles.containerTitle}>
            Choose Frost Prediction Notifications{" "}
          </Text>
          <View style={styles.topContainer}>
            <Text>Low Frost Chance</Text>
            <Switch
              style={styles.button}
              onValueChange={toggleSwitchLowFrostRisk}
              value={LowFrostRisk}
            />
          </View>
          <View style={styles.topContainer}>
            <Text>Medium Frost Chance</Text>
            <Switch
              style={styles.button}
              onValueChange={toggleSwitchMedFrostRisk}
              value={MedFrostRisk}
            />
          </View>
          <View style={styles.topContainer}>
            <Text>High Frost Chance</Text>
            <Switch
              style={styles.button}
              onValueChange={toggleSwitchHighFrostRisk}
              value={HighFrostRisk}
            />
          </View>
          <View style={styles.padding}>
            <Button
              style={styles.saveButtonStyle}
              disabled={disable}
              color="#ffba00"
              title="Save Settings"
              onPress={() => {
                setDisable(true);
                _storeData();
              }}
            />
          </View>
        </View>
      </View>
      {/* {showSave()} */}
      <ActivityIndicator animating={disable} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 10,
  },
  saveButtonStyle: {
    color: "black",
  },
  Title: {
    textAlign: "center",
    fontSize: 40,
    alignContent: "center", // Centered verticaly
    color: "black",
    fontWeight: "bold",
    width: Dimensions.get("window").width,
    paddingVertical: 5,
    backgroundColor: "#ffba00",
  },
  inputText: {
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: -4,
  },
  button: {
    marginLeft: "auto",
    paddingBottom: 0,
    marginTop: -4,
  },
  titleText: {
    fontSize: 15,
  },
  Body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  containerTitle: {
    backgroundColor: "#ffba00",
    fontWeight: "bold",
    color: "black",
    fontSize: 17,
    padding: 5,
    paddingHorizontal: 10,
    width: Dimensions.get("window").width,
  },
  midContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: 400,
    padding: 20,
    paddingVertical: 5,
  },
  topContainer: {
    flexDirection: "row",
    width: Dimensions.get("window").width,
    padding: 15,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderBottomColor: "#f2f2f2",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    width: 400,
    padding: 20,
    paddingTop: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderTopColor: "#f2f2f2",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
