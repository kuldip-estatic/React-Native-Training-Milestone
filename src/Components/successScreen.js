import React, {useEffect, useState} from 'react';
import {Text, Image, View, Alert, DeviceEventEmitter} from 'react-native';
import {Button} from 'react-native-elements';
import TextConstants from '../Utility/TextConstants';
import {useRoute, useNavigation} from '@react-navigation/native';
import InternetVerify from './InternetVerify';

const SuccessScreen = () => {
  const navigation = useNavigation();
  const [offline, setOffline] = useState(true);
  const route = useRoute();

  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };

  useEffect(() => {
    console.log(route, 'route');
    internetChangeListener();
  }, []);

  const continueClick = () => {
    navigation.navigate('createaccount', {
      countryCode: `${route.params.countryCode}`,
      phoneNumber: `${route.params.phoneNumber}`,
    });
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '35%',
      }}>
      <Image
        source={{uri: 'register_success'}}
        style={{
          width: '60%',
          height: 200,
          backgroundColor: 'lightgray',
          alignSelf: 'center',
          marginBottom: 60,
        }}
      />
      <Text
        style={{
          fontSize: 24,
          lineHeight: 32,
          color: '#2E2E2E',
          textAlign: 'center',
          fontWeight: 'bold',
        }}>
        {TextConstants.titleText}
      </Text>
      <Text
        style={{
          fontSize: 14,
          lineHeight: 21,
          textAlign: 'center',
          fontWeight: '400',
          width: 260,
          maxWidth: '100%',
          color: '#616161',
          alignSelf: 'center',
          marginVertical: 15,
        }}>
        {TextConstants.subTitleText}
      </Text>
      <Button
        title={TextConstants.text_continue_button}
        buttonStyle={{
          fontWeight: 'bold',
          marginBottom: 20,
          borderRadius: 4,
          paddingVertical: 13,
          backgroundColor: '#2667C9',
        }}
        containerStyle={{
          marginTop: 'auto',
        }}
        onPress={() => {
          continueClick();
        }}
      />
      {!offline && <InternetVerify />}
    </View>
  );
};

export default SuccessScreen;
