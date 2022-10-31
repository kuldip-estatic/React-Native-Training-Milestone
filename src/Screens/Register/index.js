import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import InternetVerify from '../../Components/InternetVerify';
import IconBackArrow from 'react-native-vector-icons/Ionicons';
import Api from '../../Utility/Api';
import {useNavigation} from '@react-navigation/native';
import TextConstants from '../../Utility/TextConstants';
import RegisterMobileNumberInput from '../../Components/RegisterMobileNumber';
import {Button} from 'react-native-elements';
import Loader from '../../Components/Loader';

IconBackArrow.loadFont();
const api = Api.create();

const RegisterContainer = () => {
  const navigation = useNavigation();
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
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

  const handleGetOTPClick = async () => {
    setLoading(true);
    await api
      .getOTP(`${countryCode}${phoneNumber}`, 'registration', 'phoneNumber')
      .then(response => {
        setLoading(false);
        if (response.ok) {
          navigation.navigate('registerotp', {
            countryCode: `${countryCode}`,
            phoneNumber: `${phoneNumber}`,
          });
        } else {
          if (response.status === 409) {
            Alert.alert(response.data.Message);
          } else if (response.status === 400) {
            Alert.alert(response.data.Message);
          } else {
            Alert.alert(response.problem);
          }
        }
      });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{paddingHorizontal: 20, marginTop: 20}}>
          <IconBackArrow
            name="arrow-back"
            size={20}
            style={{
              color: '#090F47',
            }}
            onPress={() => {
              navigation.navigate('login');
            }}
          />
          <View>
            <Text
              style={{
                fontSize: 24,
                color: '#2E2E2E',
                fontWeight: 'bold',
                marginTop: 21,
              }}>
              {TextConstants.enter_phone}
            </Text>

            <Text
              style={{
                fontSize: 13,
                marginBottom: 15,
                marginTop: 6,
                color: '#616161',
                fontWeight: '400',
              }}>
              {TextConstants.we_will_send}
            </Text>
          </View>
          <View>
            <RegisterMobileNumberInput
              countryCode={countryCode}
              setCountryCode={setCountryCode}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
            />
          </View>
          <View
            style={{
              marginTop: 20,
            }}>
            <Text style={{fontSize: 12, fontWeight: '300', lineHeight: 18}}>
              {TextConstants.by_signing} {''}
              <Text
                style={{color: '#2667C9', fontWeight: '600', fontSize: 12}}
                onPress={() => Alert.alert('Under Development')}>
                {TextConstants.terms} {''}
              </Text>
              {TextConstants.and} {''}
              <Text
                style={{color: '#2667C9', fontWeight: '600', fontSize: 12}}
                onPress={() => Alert.alert('Under Development')}>
                {TextConstants.privacy}
              </Text>
            </Text>
            <Button
              title={TextConstants.text_continue_button}
              titleStyle={{
                fontWeight: 'bold',
                fontSize: 16,
                lineHeight: 24,
              }}
              buttonStyle={{
                marginVertical: 20,
                borderRadius: 4,
                paddingVertical: 13,
                backgroundColor: '#2667C9',
              }}
              disabled={!(countryCode && phoneNumber.length > 3)}
              onPress={handleGetOTPClick}
            />
          </View>
        </View>
        {!offline && <InternetVerify />}
        {loading && <Loader />}
      </View>
    </TouchableWithoutFeedback>
  );
};
export default RegisterContainer;
