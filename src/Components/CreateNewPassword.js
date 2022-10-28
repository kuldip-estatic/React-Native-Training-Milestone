import React, {useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  DeviceEventEmitter,
} from 'react-native';
import Api from '../../src/Utility/Api';
import {useNavigation, useRoute} from '@react-navigation/native';
import InternetVerify from './InternetVerify';
import TextConstants from '../Utility/TextConstants';
import Icon from 'react-native-vector-icons/Entypo';
import IconFeather from 'react-native-vector-icons/Feather';
import IconIc from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as yup from 'yup';

IconFeather.loadFont();
Icon.loadFont();
IconIc.loadFont();
const CreateNewPassword = () => {
  const navigation = useNavigation();
  const api = Api.create();
  const route = useRoute();
  const passwordValidationSchema = yup.object().shape({
    password: yup
      .string()
      .required('Password is required')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        TextConstants.password_validation_msg,
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Password does not match')
      .required('Confirm Password is required'),
  });

  const [offline, setOffline] = useState(true);
  const [pwdVisible, setPwdVisible] = useState(false);
  const [cfmPwdVisible, setCfmPwdVisible] = useState(false);
  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };

  useEffect(() => {
    internetChangeListener();
  }, []);
  const handleSubmitPasswordClick = async values => {
    const response = await api.createNewPassword(
      route.params.email,
      values.password,
    );
    if (response.ok) {
      navigation.navigate('login');
    } else {
      if (response.status === 404) {
        Alert.alert(response.data.Message);
      } else if (response.status === 403) {
        Alert.alert(response.data.Message);
      } else if (response.status === 400) {
        Alert.alert(response.data.Message);
      } else {
        Alert.alert(response.problem);
      }
    }
  };
  return (
    <View style={styles.presentationView}>
      <IconIc
        name="arrow-back"
        style={{color: '#2E2E2E'}}
        size={20}
        onPress={() => {
          navigation.navigate('forgetotp', {email: route.params.email});
        }}
      />
      <Text style={styles.txtHello}>
        {TextConstants.create_new_pass_heading}
      </Text>
      <Text style={styles.txtSubHead}>
        {TextConstants.create_new_pass_subtext}
      </Text>
      <View style={{marginTop: 15}}>
        <Formik
          validationSchema={passwordValidationSchema}
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          onSubmit={value => handleSubmitPasswordClick(value)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            errors,
            values,
            touched,
          }) => (
            <>
              <View style={styles.textInputView}>
                <IconFeather name="lock" size={16} color="#C5C5C5" />
                <TextInput
                  keyboardType={
                    Platform.OS === 'android' ? 'default' : 'email-address'
                  }
                  autoCapitalize="none"
                  style={styles.txtInput}
                  placeholder="New password"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  secureTextEntry={!pwdVisible}
                />
                <IconFeather
                  name={pwdVisible ? 'eye-off' : 'eye'}
                  size={16}
                  color="#C5C5C5"
                  style={{
                    paddingRight: 20,
                    right: 0,
                    position: 'absolute',
                  }}
                  onPress={() => setPwdVisible(!pwdVisible)}
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
              <View style={{...styles.textInputView, marginTop: 10}}>
                <IconFeather name="lock" size={16} color="#C5C5C5" />
                <TextInput
                  keyboardType={
                    Platform.OS === 'android' ? 'default' : 'email-address'
                  }
                  autoCapitalize="none"
                  style={styles.txtInput}
                  placeholder={'Confirm Password'}
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  secureTextEntry={!cfmPwdVisible}
                />
                <IconFeather
                  name={cfmPwdVisible ? 'eye-off' : 'eye'}
                  size={16}
                  style={{
                    paddingRight: 20,
                    right: 0,
                    position: 'absolute',
                  }}
                  color="#C5C5C5"
                  onPress={() => setCfmPwdVisible(!cfmPwdVisible)}
                />
              </View>
              {errors.confirmPassword && touched.confirmPassword && (
                <Text
                  style={{
                    fontSize: 13,
                    color: 'red',
                    marginTop: 5,
                  }}>
                  {errors.confirmPassword}
                </Text>
              )}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.btnLoginContainer}>
                <Text style={styles.txtBtnLogin}>Submit</Text>
              </TouchableOpacity>
            </>
          )}
        </Formik>
      </View>
      <View style={styles.createAccContainer}>
        <Text
          style={{
            ...styles.createAccText,
            color: '#616161',
            fontWeight: '400',
          }}>
          Back to{' '}
          <Text
            onPress={() => {
              navigation.navigate('login');
            }}
            style={{
              ...styles.createAccText,
              color: '#2667C9',
              fontWeight: 'bold',
            }}>
            {TextConstants.text_login}{' '}
          </Text>
        </Text>
      </View>
      {!offline && <InternetVerify />}
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
    fontWeight: '400',
  },
});

export default CreateNewPassword;
