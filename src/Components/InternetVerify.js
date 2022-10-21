import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text, Dimensions} from 'react-native';
const DEVICE_DIMENSION = Dimensions.get('window');
const InternetVerify = () => {
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        height: DEVICE_DIMENSION.height,
        // width: DEVICE_DIMENSION.width,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Internet nathi tamaru....</Text>
    </View>
  );
};

export default InternetVerify;
