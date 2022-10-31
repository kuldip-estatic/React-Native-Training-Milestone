import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import InternetVerify from '../../Components/InternetVerify';
import Api from '../../Utility/Api';
import {useNavigation} from '@react-navigation/native';
import TextConstants from '../../Utility/TextConstants';
import {Formik} from 'formik';
import * as yup from 'yup';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFe from 'react-native-vector-icons/Feather';
import RegisterMobileNumberInput from '../../Components/RegisterMobileNumber';
import Loader from '../../Components/Loader';

Icon.loadFont();
IconFe.loadFont();
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      TextConstants.password_validation_msg,
    ),
});

const api = Api.create();
const LoginContainer = () => {
  const navigation = useNavigation();
  const [emailLogin, setEmailLogin] = useState(true);
  const [numberLogin, setNumberLogin] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
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

  const onEmailLoginTabClick = () => {
    if (numberLogin) setNumberLogin(false);
    setEmailLogin(true);
  };

  const onNumberLoginTabClick = () => {
    if (emailLogin) setEmailLogin(false);
    setNumberLogin(true);
  };

  const handleEmailLoginClick = async values => {
    const data = values;
    setLoading(true);
    await api.emailLoginApi(data).then(response => {
      setLoading(false);
      if (response.ok) {
        navigation.navigate('Home');
      } else {
        if (response.status === 401) {
          Alert.alert(response.data.Message);
        } else if (response.status === 400) {
          Alert.alert(response.data.Message);
        } else {
          Alert.alert(response.problem);
        }
      }
    });
  };

  const handleSendOtpClick = async () => {
    setLoading(true);
    await api
      .getOTP(`${countryCode}${phoneNumber}`, 'login', 'phoneNumber')
      .then(response => {
        setLoading(false);
        if (response.ok) {
          navigation.navigate('otp', {
            countryCode: `${countryCode}`,
            phoneNumber: `${phoneNumber}`,
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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={Styles.mainContainer}>
        <View>
          <Text
            style={{
              color: '#2E2E2E',
              fontSize: 24,
              lineHeight: 32,
              fontWeight: 'bold',
            }}>
            {TextConstants.text_hello}
          </Text>
          <Text
            style={{
              fontSize: 13,
              lineHeight: 19.5,
              color: '#616161',
              marginTop: 6,
            }}>
            {TextConstants.text_Welcome}
          </Text>
        </View>
        <View style={{...Styles.tabView}}>
          <TouchableOpacity
            style={{
              ...Styles.tabOpacity,
              fontWeight: '400',
              backgroundColor: emailLogin ? '#2667C9' : '#FFFFFF',
            }}
            onPress={() => onEmailLoginTabClick()}>
            <Text
              style={{
                ...Styles.tabText,
                fontWeight: '500',
                color: emailLogin ? '#FFFFFF' : '#000000',
              }}>
              {TextConstants.text_email}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              ...Styles.tabOpacity,
              fontWeight: '400',
              backgroundColor: numberLogin ? '#2667C9' : '#FFFFFF',
            }}
            onPress={() => onNumberLoginTabClick()}>
            <Text
              style={{
                ...Styles.tabText,
                fontWeight: '400',
                color: numberLogin ? '#FFFFFF' : '#000000',
              }}>
              {TextConstants.text_number}
            </Text>
          </TouchableOpacity>
        </View>
        {emailLogin && (
          <>
            <Formik
              validationSchema={loginValidationSchema}
              initialValues={{
                email: '',
                password: '',
              }}
              onSubmit={values => handleEmailLoginClick(values)}>
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                errors,
                values,
                touched,
              }) => (
                <View style={{marginTop: 30}}>
                  <View style={Styles.textInputView}>
                    <Icon name="user" size={16} color="#C5C5C5" />
                    <TextInput
                      placeholder="email"
                      keyboardType="email-address"
                      style={{
                        ...Styles.txtInput,
                        fontWeight: '400',
                      }}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      maxLength={100}
                    />
                    {!errors.email && touched.email && (
                      <Icon
                        name="check"
                        color={'#2667C9'}
                        style={{
                          paddingRight: 10,
                          right: 0,
                          position: 'absolute',
                        }}
                        size={18}
                      />
                    )}
                  </View>
                  {errors.email && touched.email && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'red',
                        marginTop: 5,
                      }}>
                      {errors.email}
                    </Text>
                  )}
                  <View style={{...Styles.textInputView, marginTop: 16}}>
                    <IconFe name="lock" size={16} color="#C5C5C5" />
                    <TextInput
                      placeholder="Password"
                      autoCapitalize="none"
                      style={{
                        ...Styles.txtInput,
                        fontWeight: '400',
                      }}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                      maxLength={50}
                      secureTextEntry={passwordVisible}
                    />
                    <IconFe
                      color={'#C5C5C5'}
                      style={{
                        paddingRight: 14,
                        right: 0,
                        position: 'absolute',
                      }}
                      size={14}
                      name={passwordVisible ? 'eye' : 'eye-off'}
                      onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                  </View>
                  {errors.password && touched.password && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: 'red',
                        marginTop: 5,
                      }}>
                      {errors.password}
                    </Text>
                  )}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    style={Styles.btnLoginContainer}>
                    <Text
                      style={{
                        ...Styles.txtBtnLogin,
                        fontWeight: 'bold',
                      }}>
                      {TextConstants.text_login_button}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <TouchableOpacity style={Styles.forgotContainer}>
              <Text
                onPress={() => navigation.navigate('forget')}
                style={{
                  ...Styles.txtForgot,
                  fontWeight: '600',
                }}>
                {TextConstants.text_forget_password}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {numberLogin && (
          <RegisterMobileNumberInput
            countryCode={countryCode}
            setCountryCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        )}
        {numberLogin && (
          <TouchableOpacity
            onPress={handleSendOtpClick}
            disabled={!(countryCode && phoneNumber.length > 3)}
            style={Styles.btnLoginContainer}>
            <Text
              style={{
                ...Styles.txtBtnLogin,
                fontWeight: '600',
              }}>
              {TextConstants.send_code}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{alignItems: 'center', marginTop: 16}}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              fontWeight: '400',
              color: '#616161',
            }}>
            {TextConstants.text_pickmeup}{' '}
            <Text
              onPress={() => navigation.navigate('register')}
              style={{
                fontSize: 14,
                lineHeight: 21,
                fontWeight: '600',
                color: '#2667C9',
              }}>
              {TextConstants.text_register_now}
            </Text>
          </Text>
        </View>
        {!offline && <InternetVerify />}
        {loading && <Loader />}
      </View>
    </TouchableWithoutFeedback>
  );
};

const Styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  tabView: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2667C9',
    marginTop: 16,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  tabText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 21,
    padding: 3,
  },
  tabOpacity: {
    paddingVertical: 7,
    width: '50%',
  },
  textInputView: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: Platform.OS === 'ios' ? 13 : 0,
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: 4,
    alignContent: 'center',
  },
  txtInput: {
    paddingHorizontal: 8,
    paddingRight: 20,
    fontSize: 14,
    flex: 1,
    color: '#616161',
    alignItems: 'center',
    paddingVertical: Platform.OS === 'android' ? 10 : 0,
    paddingTop: Platform.OS === 'android' ? 12 : 0,
  },
  btnLoginContainer: {
    paddingVertical: 13,
    marginTop: 37,
    backgroundColor: '#2667C9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  txtBtnLogin: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginTop: 24,
  },
  txtForgot: {
    color: '#2667C9',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
});
export default LoginContainer;
