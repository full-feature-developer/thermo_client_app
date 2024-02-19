import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import config from "./config";

const serverUrl = config.SERVER_URL;

const DataFetcher = () => {
  const [temperature, setTemperature] = useState("");
  const [rssi, setRssi] = useState("");
  const [signalStrength, setSignalStrength] = useState("");
  const [showRSSI, setShowRSSI] = useState(false); // State to control RSSI visibility
  const [pressCount, setPressCount] = useState(0); // State to count the button presses

  const classifyRSSI = (rssi) => {
    if (rssi > -75) return "EXCELLENT";
    else if (rssi > -85) return "GOOD";
    else return "LOW";
  };

  const fetchData = async () => {
    try {
      const response = await fetch(`${serverUrl}/data`);
      const data = await response.json();
      const formattedTemp = parseFloat(data.temperature).toFixed(1);

      if (data.temperature && data.RSSI !== undefined) {
        setTemperature(formattedTemp);
        setRssi(data.RSSI);
        setSignalStrength(classifyRSSI(data.RSSI));
      } else {
        console.log("Data is not in the expected format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch or parse data:", error);
    }
  };

  const incrementPressCount = () => {
    const newCount = pressCount + 1;
    setPressCount(newCount);

    if (newCount === 4) {
      setShowRSSI(true); // Show RSSI after 4 button presses
      setPressCount(0); // Reset the press count
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={incrementPressCount}>
        <View style={styles.pressArea}></View>
      </TouchableWithoutFeedback>

      <Text style={styles.text}>Temperature: {temperature} °F</Text>
      {showRSSI && <Text style={styles.text}>RSSI: {rssi}</Text>}
      <Text style={styles.text}>Signal Strength: {signalStrength}</Text>

      <TouchableOpacity onPress={fetchData} style={styles.button}>
        <Text style={styles.buttonText}>Get Temperature</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
    marginLeft: 20,
  },
  text: {
    fontSize: 16,
    margin: 5,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 10,
    width: "90%",
    borderRadius: 20,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  pressArea: {
    position: "absolute",
    top: 20,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ddd", // Light grey, make transparent if desired
    zIndex: 1, // Ensure the touchable area is above other components
  },
});

export default DataFetcher;
