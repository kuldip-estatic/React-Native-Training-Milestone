import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import IconBackArrow from 'react-native-vector-icons/Ionicons';
import TextConstants from '../Utility/TextConstants';
import Api from '../../src/Utility/Api';
import OTPTextView from 'react-native-otp-textinput';
import {Button} from 'react-native-elements';
import {useRoute, useNavigation} from '@react-navigation/native';
import Loader from './Loader';

IconBackArrow.loadFont();
const api = Api.create();
const OTPContainer = () => {
  const navigation = useNavigation();
  const [otpExpiresin, setOtpExpiresIn] = useState(60);
  const [otp, setOTP] = useState('');
  const route = useRoute();
  const [offline, setOffline] = useState(true);
  const [loading, setLoading] = useState(false);

  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };

  useEffect(() => {
    internetChangeListener();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setOtpExpiresIn(lastTimerCount => {
        lastTimerCount <= 1 && clearInterval(timer);
        return lastTimerCount - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [otpExpiresin === 60]);

  const handleSubmitOtpClick = async () => {
    setLoading(true);
    await api
      .verifyOTP(
        `${route.params.countryCode}${route.params.phoneNumber}`,
        otp,
        'phoneNumber',
      )
      .then(response => {
        setLoading(false);
        if (otp.length === 4) {
          if (response.ok) {
            navigation.navigate('Home');
          } else {
            if (response.status === 404) {
              Alert.alert(response.data.Message);
            } else if (response.status === 400) {
              Alert.alert(response.data.Message);
            } else {
              Alert.alert(response.problem);
            }
          }
        } else {
          Alert.alert('Social App', 'Please enter otp');
        }
      });
  };

  const handleResendOtpClick = async () => {
    setLoading(true);
    await api
      .getOTP(
        `${route.params.countryCode}${route.params.phoneNumber}`,
        'login',
        'phoneNumber',
      )
      .then(response => {
        setLoading(false);
        if (response.ok) {
          Alert.alert(response.data.Message);
        } else {
          if (response.status === 404) {
            Alert.alert(response.data.Message);
          } else {
            Alert.alert(response.problem);
          }
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 20,
          backgroundColor: '#fff',
        }}>
        <Text
          style={{
            fontSize: 24,
            lineHeight: 32,
            color: '#2E2E2E',
            fontWeight: 'bold',
            marginTop: 33,
          }}>
          {TextConstants.text_verification_head}
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: '#616161',
            marginTop: 8,
            fontWeight: '400',
          }}>
          {TextConstants.text_verification_subhead}{' '}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              color: '#2667C9',
              fontWeight: '600',
            }}>
            {' '}
            {route.params.countryCode}
            {'  '}
            <Text style={{alignSelf: 'flex-start'}}>
              {route.params.phoneNumber
                .slice(0, route.params.phoneNumber.length - 3)
                .replace(/[0-9]/g, '*')}
            </Text>
            {route.params.phoneNumber.slice(
              route.params.phoneNumber.length - 3,
            )}
          </Text>
        </Text>
        <OTPTextView
          inputCount={4}
          offTintColor="rgba(46, 46, 46, 0.1)"
          handleTextChange={setOTP}
          tintColor="#2667C9"
          textInputStyle={{
            borderBottomWidth: 1,
            color: '#2E2E2E',
          }}
          containerStyle={{
            marginTop: 32,
            justifyContent: 'center',
            alignItems: 'center',
            color: '#2E2E2E',
          }}
        />
        <Button
          title={TextConstants.text_submit_button}
          buttonStyle={{
            marginVertical: 20,
            borderRadius: 4,
            paddingVertical: 13,
            backgroundColor: '#2667C9',
            marginTop: 50,
          }}
          titleStyle={{
            fontSize: 16,
            lineHeight: 24,
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
          onPress={handleSubmitOtpClick}
        />
        {otpExpiresin > 0 && (
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19,
              color: '#616161',
              fontWeight: '400',
              marginTop: 24,
              textAlign: 'center',
            }}>
            {TextConstants.resend_code_text} 00:{' '}
            {otpExpiresin.toLocaleString('en-US', {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
          </Text>
        )}
        <Button
          titleStyle={{
            color: otpExpiresin <= 0 ? '#2667C9' : 'gray',
            fontWeight: 'bold',
            fontSize: 14,
            marginTop: 16,
            lineHeight: 19,
          }}
          type="clear"
          disabled={otpExpiresin > 0}
          title={TextConstants.reset_code_title}
          onPress={() => {
            handleResendOtpClick();
            setOtpExpiresIn(60);
          }}
        />
        {!offline && <InternetVerify />}
        {loading && <Loader />}
      </View>
    </TouchableWithoutFeedback>
  );
};
export default OTPContainer;
