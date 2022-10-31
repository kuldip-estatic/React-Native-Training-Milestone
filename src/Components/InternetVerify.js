import React from 'react';
import {View, Text, Dimensions, Image} from 'react-native';

const DEVICE_DIMENSION = Dimensions.get('window');

const InternetVerify = () => {
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fff',
      }}>
      <Image source={{uri: 'no_wifi'}} style={{width: 100, height: 100}} />
      <Text style={{textAlign: 'center'}}>No Internet</Text>
    </View>
  );
};

export default InternetVerify;
