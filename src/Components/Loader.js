import React from 'react';
import {View, Dimensions, ActivityIndicator, Text} from 'react-native';

const screenDimensions = Dimensions.get('window');

const Loader = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        zIndex: 10,
        backgroundColor: '#ffffff',
        opacity: 0.5,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        width: screenDimensions.width,
        height: screenDimensions.height,
      }}>
      <ActivityIndicator size={50} />
    </View>
  );
};

export default Loader;
