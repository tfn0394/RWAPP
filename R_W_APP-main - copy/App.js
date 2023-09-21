import "react-native-gesture-handler";

import * as React from "react";
import { Platform } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

// Screens in the application to navigate to
import HomeScreen from "./screens/HomeScreen";
import DashboardScreen from "./screens/DashboardScreen";
import Graph from "./screens/Graph";
import GraphRange from "./screens/GraphRange";
import GraphRangeWeb from "./screens/GraphRangeWeb";
import GraphWeb from "./screens/GraphWeb";
import SettingsScreen from "./screens/SettingsScreen";
import AboutPage from "./screens/AboutPage";
import List from "./screens/HouryInfoFullDay";
import ListWeb from "./screens/HouryInfoFullDayWeb";

const Drawer = createDrawerNavigator();

function App() {
  if (Platform.OS === "web") {
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name={"Home"} component={HomeScreen} />
          <Drawer.Screen name={"Dashboard"} component={DashboardScreen} />
          <Drawer.Screen name={"Hourly Information"} component={ListWeb} />
          <Drawer.Screen name={"Graph"} component={GraphWeb} />
          <Drawer.Screen name={"Graph Range"} component={GraphRangeWeb} />
          <Drawer.Screen name={"About"} component={AboutPage} />
        </Drawer.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name={"Home"} component={HomeScreen} />
        <Drawer.Screen name={"Dashboard"} component={DashboardScreen} />
        <Drawer.Screen name={"Hourly Information"} component={List} />
        <Drawer.Screen name={"Graph"} component={Graph} />
        <Drawer.Screen name={"Graph Range"} component={GraphRange} />
        <Drawer.Screen name={"Settings"} component={SettingsScreen} />
        <Drawer.Screen name={"About"} component={AboutPage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default App;
