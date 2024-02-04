import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraType } from 'expo-camera';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import TabThree from './TabThree';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [isCameraReady, setCameraReady] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation(); // Hook from React Navigation

  useEffect(() => {
    (async () => {
      if (permission && permission.granted) {
        await Camera.requestCameraPermissionsAsync();
        setCameraReady(true);
      }
    })();
  }, [permission]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted || !isCameraReady) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        let photo = await cameraRef.current.takePictureAsync();
        setCapturedImage(photo.uri);
        await MediaLibrary.saveToLibraryAsync(photo.uri);
      } catch (error) {
        console.error('Error taking picture:', error);
      }
    }
  };

  const openPicker = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setCapturedImage(result.uri);
        navigation.navigate('three', { capturedImage: result.uri });
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} onCameraReady={() => setCameraReady(true)} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <Ionicons name="radio-button-on" size={90} color="white" />
          </TouchableOpacity>
        </View>
      </Camera>
      <TouchableOpacity style={styles.button1} onPress={openPicker}>
        {capturedImage && <Image source={{ uri: capturedImage }} style={{ width: 40, height: 40, borderWidth: 2, borderColor: 'white' }} />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  button: {
    alignItems: 'center',
    margin: 0,
  },
  button1: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    margin: 0,
    backgroundColor: 'transparent',
  },
});




