import React, {useEffect} from 'react';
import {SafeAreaView, View, Text, DeviceEventEmitter} from 'react-native';
import Navigator from './src/Navigators';
import NetInfo from '@react-native-community/netinfo';

const App = () => {
  useEffect(() => {
    NetInfo.addEventListener(state => {
      let netState = state.isConnected;
      DeviceEventEmitter.emit('netListener', netState);
    });
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Navigator />
    </SafeAreaView>
  );
};
export default App;
