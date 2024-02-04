import React, { useEffect } from 'react';
import { View, Text, Image } from 'react-native';

export default function TabThree({ route }) {
  const { capturedImage } = route?.params || {};

  useEffect(() => {
    // Log when capturedImage changes
    console.log('Captured Image:', capturedImage);
  }, [capturedImage]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>TabThree</Text>
      {capturedImage ? (
        <Image source={{ uri: capturedImage }} style={{ margin: 16 }} />
      ) : (
        <Text>No image captured</Text>
      )}
    </View>
  );
}


