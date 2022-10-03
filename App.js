import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View, TextInput, Pressable, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { GOOGLE_API_KEY, GOOGLE_GEOCODING_API_URL } from "@env";

export default function App() {
  const [search, setSearch] = useState();
  const [title, setTitle] = useState("My Home");
  const [marker, setMarker] = useState({
    latitude: 60.2709334,
    longitude: 25.0777202,
  });
  const [region, setRegion] = useState({
    latitude: 60.2709334,
    longitude: 25.0777202,
    latitudeDelta: 0.03,
    longitudeDelta: 0.03,
  });

  let url =
    GOOGLE_GEOCODING_API_URL + "?address=" + search + "&key=" + GOOGLE_API_KEY;

  const getLocation = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.status !== "ZERO_RESULTS") {
        const latitude = data.results[0].geometry.location.lat;
        const longitude = data.results[0].geometry.location.lng;
        setTitle(data.results[0].formatted_address);
        setMarker({
          latitude: latitude,
          longitude: longitude,
        });
        setRegion({
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });
      } else if (search == undefined) {
        Alert.alert("Fill in search terms");
      } else {
        Alert.alert("No results found!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <MapView style={styles.map} region={region} initialRegion={region}>
        <Marker coordinate={marker} title={title} />
      </MapView>
      <View style={styles.searchContainer}>
        <Ionicons name="location-sharp" size={26} color="black" />
        <TextInput
          style={styles.input}
          onChangeText={(search) => setSearch(search)}
          placeholder="Search with full address"
          value={search}
          keyboardType="default"
        />
        <Pressable style={styles.button} onPress={getLocation}>
          <Ionicons name="search" size={26} color="black" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    position: "absolute",
    top: 45,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    backgroundColor: "white",
    borderColor: "gray",
    borderWidth: 1,
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  input: {
    width: "80%",
    height: 45,
    padding: 5,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
});
