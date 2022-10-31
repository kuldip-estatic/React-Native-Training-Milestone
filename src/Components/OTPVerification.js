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
  const [offline, setOffline] = useState(true);
  const [loading, setLoading] = useState(false);
  const [comeFrom, setComeFrom] = useState('');
  const route = useRoute();

  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };

  useEffect(() => {
    internetChangeListener();
  }, []);

  useEffect(() => {
    setComeFrom(route.params.comeFrom);
  }, [comeFrom]);

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
    comeFrom === 'forget'
      ? await api.verifyOTP(route.params.email, otp, 'email').then(response => {
          setLoading(false);
          if (otp.length === 4) {
            if (response.ok) {
              navigation.navigate('createnewpassword', {
                email: route.params.email,
              });
            } else {
              if (response.status === 400) {
                Alert.alert(response.data.Message);
              } else {
                Alert.alert(response.problem);
              }
            }
          } else {
            Alert.alert('Social App', 'Please enter otp');
          }
        })
      : await api
          .verifyOTP(
            `${route.params.countryCode}${route.params.phoneNumber}`,
            otp,
            'phoneNumber',
          )
          .then(response => {
            setLoading(false);
            if (otp.length === 4) {
              comeFrom === 'login'
                ? response.ok
                  ? navigation.navigate('Home')
                  : response.status === 404
                  ? Alert.alert(response.data.Message)
                  : response.status === 400
                  ? Alert.alert(response.data.Message)
                  : Alert.alert(response.problem)
                : comeFrom === 'register'
                ? response.ok
                  ? navigation.navigate('success', {
                      countryCode: `${route.params.countryCode}`,
                      phoneNumber: `${route.params.phoneNumber}`,
                    })
                  : response.status === 400
                  ? Alert.alert(response.data.Message)
                  : Alert.alert(response.problem)
                : Alert.alert('forget otp');
            } else {
              Alert.alert('Social App', 'Please enter otp');
            }
          });
  };

  const handleResendOtpClick = async () => {
    setLoading(true);
    comeFrom === 'login'
      ? await api
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
          })
      : comeFrom === 'register'
      ? await api
          .getOTP(
            `${route.params.countryCode}${route.params.phoneNumber}`,
            'registration',
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
          })
      : await api
          .getOTP(route.params.email, 'retrievepassword', 'email')
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
        {comeFrom === 'register' ? (
          <View style={{marginTop: 20}}>
            <IconBackArrow
              name="arrow-back"
              style={{
                left: 0,
                position: 'absolute',
              }}
              size={20}
              onPress={() => {
                navigation.navigate('register');
              }}
            />
          </View>
        ) : (
          <></>
        )}
        <Text
          style={{
            fontSize: 24,
            lineHeight: 32,
            color: '#2E2E2E',
            fontWeight: 'bold',
            marginTop: 33,
          }}>
          {comeFrom === 'login'
            ? TextConstants.text_verification_head
            : comeFrom === 'register'
            ? 'Enter OTP'
            : 'Enter Code'}
        </Text>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: '#616161',
            marginTop: 8,
            fontWeight: '400',
          }}>
          {comeFrom === 'forget'
            ? 'We just send you a verification code via email'
            : TextConstants.text_verification_subhead}{' '}
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              color: '#2667C9',
              fontWeight: '600',
            }}>
            {comeFrom === 'forget'
              ? route.params.email
              : `${route.params.countryCode}${' '}${route.params.phoneNumber}`}
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
          title={
            comeFrom === 'login'
              ? TextConstants.text_submit_button
              : comeFrom === 'register'
              ? 'Submit Code'
              : 'Verify'
          }
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
