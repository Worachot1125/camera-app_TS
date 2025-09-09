import * as React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { CameraView, CameraType, FlashMode, CameraCapturedPicture } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";

const App: React.FC = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaPermission, setHasMediaPermission] = useState(false);

  const [image, setImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState<CameraType>("back");
  const [flashMode, setFlashMode] = useState<FlashMode>("off");

  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    (async () => {
      // request camera permissions
      const cameraModule = await import("expo-camera");
      const { status: cameraStatus } = await cameraModule.Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === "granted");

      // request meidia library permissions
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      setHasMediaPermission(mediaStatus === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo: CameraCapturedPicture = await cameraRef.current.takePictureAsync({ quality: 1 });
        setImage(photo.uri);
      } catch (err) {
        console.log("Error taking picture:", err);
      }
    }
  };

  const savePicture = async () => {
    if (image && hasMediaPermission) {
      await MediaLibrary.createAssetAsync(image);
      Alert.alert("Saved!", "Image has been saved to gallery.");
      setImage(null);
    }
  };

  const toggleCameraType = () => {
    setCameraType(prev => (prev === "back" ? "front" : "back"));
  };

  const toggleFlash = () => {
    const newFlash = flashMode === "off" ? "on" : "off";
    setFlashMode(newFlash);
  };

  if (!hasCameraPermission || !hasMediaPermission) {
    return (
      <View style={styles.center}>
        <Text>Requesting permissions...</Text>
      </View>
    );
  }

  // Image preview
  if (image) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: image }} style={styles.imagePreview} />
        <View style={styles.bottomButtons}>
          <TouchableOpacity style={styles.button} onPress={() => setImage(null)}>
            <Text style={styles.buttonText}>📸 Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={savePicture}>
            <Text style={styles.buttonText}>💾 Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        flash={flashMode}
      />

      {/* Overlay ปุ่ม */}
      <View style={styles.bottomButtons}>
        <TouchableOpacity style={styles.sideButton} onPress={toggleFlash}>
          <Text style={styles.sideButtonText}>{flashMode === "on" ? "⚡" : "💡"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.captureText}>📸</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sideButton} onPress={toggleCameraType}>
          <Text style={styles.sideButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  camera: { flex: 1, width: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  imagePreview: { flex: 1, width: "100%" },
  bottomButtons: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff5",
    justifyContent: "center",
    alignItems: "center",
  },
  captureText: { fontSize: 35 },
  sideButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff5",
    justifyContent: "center",
    alignItems: "center",
  },
  sideButtonText: { fontSize: 25 },
  button: {
    padding: 15,
    backgroundColor: "#fff5",
    borderRadius: 10,
  },
  buttonText: { fontSize: 18 },
});

export default App;