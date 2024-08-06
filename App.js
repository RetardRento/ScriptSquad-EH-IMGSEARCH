import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image as NativeImage,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import axios from "axios";

const API_URL = "http://192.168.0.6:5000/api/images";

const ExampleComponent = () => {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSearch = async () => {
    if (query.length > 0) {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_URL}?query=${query}`);
        setImages(response.data);
      } catch (err) {
        setError("Error fetching images");
        console.log(err);
      } finally {
        setLoading(false);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  useEffect(() => {
    if (query.length > 0) {
      handleSearch();
    } else {
      setImages([]);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={query}
        onChangeText={setQuery}
        placeholder="Search for images"
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={images}
          keyExtractor={(item) => item.id || item.toString()}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <NativeImage source={{ uri: item.url }} style={styles.image} />
              <Text style={styles.imageDescription}>{item.description}</Text>
            </View>
          )}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#282c34",
  },
  input: {
    height: 40,
    borderColor: "#61dafb",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: "#fff",
    backgroundColor: "#3a3f47",
  },
  button: {
    backgroundColor: "#61dafb",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#282c34",
    fontWeight: "bold",
    fontSize: 16,
  },
  loadingText: {
    color: "#61dafb",
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginTop: 10,
  },
  imageContainer: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1c1f24",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
  },
  imageDescription: {
    padding: 10,
    fontSize: 16,
    color: "#fff",
  },
});

export default ExampleComponent;
