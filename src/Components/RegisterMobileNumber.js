import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import CountryPicker, {
  Country,
  CountryCode,
  CountryCodeList,
} from 'react-native-country-picker-modal';
import DeviceCountry from 'react-native-device-country';
import {countryCodesList} from '../Utility/CountryCodes';

const RegisterMobileNumberInput = ({
  countryCode,
  setCountryCode,
  phoneNumber,
  setPhoneNumber,
}) => {
  const [show, setShow] = useState(false);
  const [countryCodes, setCountryCodes] = useState('NG');

  useEffect(() => {
    DeviceCountry.getCountryCode()
      .then(result => {
        const code = countryCodesList.filter(
          item => item.code === result.code.toUpperCase(),
        )[0].dial_code;
        setCountryCode(code);
        setCountryCodes(result.code.toUpperCase());
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <React.Fragment>
      <View style={styles.inputView}>
        <TouchableOpacity
          onPress={() => setShow(true)}
          style={[styles.countryCodeTO]}>
          <CountryPicker
            countryCode={countryCodes}
            visible={show}
            modalProps={{
              style: {
                height: '90%',
                position: 'absolute',
                width: '100%',
                alignSelf: 'center',
                right: 0,
                left: 0,
              },
              presentationStyle: 'formSheet',
            }}
            filterProps={{
              placeholder: 'Search',
            }}
            containerButtonStyle={{
              alignContent: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            onSelect={Country => {
              setCountryCodes(Country.cca2);
              setCountryCode(`+${Country.callingCode}`);
              setShow(false);
            }}
            withFilter
            withCallingCode
            withFlagButton
            withEmoji
            withCallingCodeButton
            withCloseButton
            withAlphaFilter
            excludeCountries={['AQ', 'BV', 'TF', 'HM', 'UM']}
          />
        </TouchableOpacity>
        <TextInput
          style={[
            {
              ...styles.inputStyle,
            },
          ]}
          placeholder="Mobile Number"
          keyboardType="number-pad"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          maxLength={20}
        />
      </View>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  inputView: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 4,
    marginTop: 24,
    paddingVertical: Platform.OS === 'android' ? 0 : 5,
  },
  countryCodeText: {
    textAlign: 'center',
    margin: 0,
    padding: 0,
    alignSelf: 'baseline',
    color: '#A0A0A0',
  },
  inputStyle: {
    width: '70%',
    fontSize: 14,
    fontWeight: '400',
    paddingHorizontal: 10,
    flex: 1,
    color: '#616161',
    alignContent: 'center',
    alignItems: 'center',
  },
  countryCodeTO: {
    width: '30%',
    paddingLeft: 10,
    marginBottom: Platform.OS === 'android' ? 5 : 0,
  },
});

export default RegisterMobileNumberInput;
