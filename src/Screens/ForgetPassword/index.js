import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Keyboard,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import InternetVerify from '../../Components/InternetVerify';
import TextConstants from '../../Utility/TextConstants';
import IconBackArrow from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Entypo';
import Api from '../../Utility/Api';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import Loader from '../../Components/Loader';

IconBackArrow.loadFont();
Icon.loadFont();
const api = Api.create();
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is required'),
});

const ForgetPasswordContainer = () => {
  const navigation = useNavigation();
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

  const handleGetOtpClick = async values => {
    const data = values;
    setLoading(true);
    await api.getOTP(data.email, 'retrievepassword', 'email').then(response => {
      setLoading(false);
      if (response.ok) {
        navigation.navigate('otp', {
          email: data.email,
          comeFrom: 'forget',
        });
      } else {
        if (response.status === 404) {
          Alert.alert(response.data.Message);
        } else {
          Alert.alert(response.problem);
        }
      }
    });
  };
  const handleLoginNav = () => {
    navigation.navigate('login');
  };

  return (
    <View style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.presentationView}>
          <IconBackArrow
            name="arrow-back"
            style={{color: '#2E2E2E'}}
            size={20}
            onPress={() => {
              navigation.navigate('login');
            }}
          />
          <Text style={styles.txtHello}>{TextConstants.forgot_pass}</Text>
          <Text style={styles.txtSubHead}>
            {TextConstants.forgetpass_subtext}
          </Text>

          <Formik
            validationSchema={validationSchema}
            initialValues={{
              email: '',
            }}
            onSubmit={values => handleGetOtpClick(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              touched,
            }) => (
              <>
                <View style={{marginTop: 15}}>
                  <View style={styles.textInputView}>
                    <Icon name="email" size={16} color="#C5C5C5" />
                    <TextInput
                      placeholder="email"
                      keyboardType="email-address"
                      style={styles.txtInput}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      maxLength={100}
                    />
                    {!errors.email && touched.email && (
                      <Icon
                        style={{
                          right: 0,
                          position: 'absolute',
                          paddingRight: 15,
                        }}
                        name="check"
                        size={16}
                        color="#2667C9"
                      />
                    )}
                  </View>
                  {errors.email && touched.email && (
                    <Text style={{fontSize: 13, color: 'red', marginTop: 5}}>
                      {errors.email}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={handleSubmit}
                  style={styles.btnLoginContainer}>
                  <Text style={styles.txtBtnLogin}>
                    {TextConstants.text_submit_button}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Formik>

          <View style={styles.createAccContainer}>
            <Text
              style={{
                ...styles.createAccText,
                color: '#616161',
                fontWeight: '400',
              }}>
              {TextConstants.remember_pass_text}{' '}
              <Text
                onPress={handleLoginNav}
                style={{
                  ...styles.createAccText,
                  color: '#2667C9',
                  fontWeight: 'bold',
                }}>
                {TextConstants.text_login}
              </Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
      {!offline && <InternetVerify />}
      {loading && <Loader />}
    </View>
  );
};

const styles = StyleSheet.create({
  presentationView: {
    marginHorizontal: 20,
    marginTop: 20,
    flex: 1,
  },
  txtHello: {
    marginTop: 21,
    fontSize: 24,
    color: '#2E2E2E',
    lineHeight: 32,
    fontWeight: 'bold',
  },
  txtSubHead: {
    fontSize: 13,
    color: '#616161',
    marginTop: 6,
    lineHeight: 19.5,
    fontWeight: '400',
  },
  textInputView: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  txtInput: {
    paddingLeft: 8,
    fontSize: 14,
    marginRight: 30,
    paddingVertical: 13,
    fontWeight: '400',
    color: '#616161',
    flex: 1,
  },
  btnLoginContainer: {
    paddingVertical: 13,
    marginTop: 24,
    backgroundColor: '#2667C9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  txtBtnLogin: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    lineHeight: 24,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 24,
  },
  txtForgot: {
    color: '#2667C9',
    fontWeight: 'bold',
    fontSize: 12,
  },
  createAccContainer: {
    alignSelf: 'center',
    marginTop: 78,
  },
  createAccText: {
    fontSize: 14,
  },
  txt: {
    fontSize: 13,
    color: 'red',
    marginTop: 5,
  },
});

export default ForgetPasswordContainer;
