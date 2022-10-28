import React, {useEffect, useState} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  DeviceEventEmitter,
} from 'react-native';
import Api from '../../Utility/Api';
import Icon from 'react-native-vector-icons/AntDesign';
import IconFe from 'react-native-vector-icons/Feather';
import IconMCI from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMI from 'react-native-vector-icons/MaterialIcons';
import IconCheck from 'react-native-vector-icons/AntDesign';
import {Button} from 'react-native-elements';
import {Dropdown} from 'react-native-element-dropdown';
import DatePicker from 'react-native-date-picker';
import {Formik} from 'formik';
import * as yup from 'yup';
import moment from 'moment';
import TextConstants from '../../Utility/TextConstants';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InternetVerify from '../../Components/InternetVerify';

IconCheck.loadFont();
IconFe.loadFont();
IconMCI.loadFont();
Icon.loadFont();
IconMI.loadFont();
IconMCI.loadFont();

const accountValidationSchema = yup.object().shape({
  fullName: yup.string().required('Full name is required'),
  date: yup.string().required('Date is required'),
  gender: yup.object().shape({
    label: yup.string().required('Gender is required'),
    value: yup.string().required('Gender is required'),
  }),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email is required'),
  Password: yup
    .string()
    .required('Password is required')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      TextConstants.password_validation_msg,
    ),
});

const CreateAccountContainer = () => {
  const navigation = useNavigation();
  const [successState, setSuccessState] = useState(false);
  const [open, setOpen] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [offline, setOffline] = useState(true);
  const route = useRoute();
  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };
  const api = Api.create();
  useEffect(() => {
    internetChangeListener();
  }, []);

  const handleSubmitClick = async values => {
    const data = {
      name: values.fullName,
      dateOfBirth: moment(values.date, 'DD/MM/YYYY').format('YYYY/MM/DD'),
      gender: values.gender.value,
      email: values.email.toLocaleLowerCase(),
      password: values.Password,
      phoneNumber: route.params.phoneNumber,
    };

    const response = await api.registerUser(data);
    if (response.ok) {
      navigation.navigate('Home');
    } else {
      if (response.status === 409) {
        Alert.alert(response.data.Message);
      } else {
        Alert.alert(response.problem);
      }
    }
  };

  return (
    <React.Fragment>
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flex: 1,
          backgroundColor: '#fff',
        }}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled
        enableOnAndroid
        enableAutomaticScroll>
        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: '5%',
            marginTop: 24,
          }}>
          <Text
            style={{
              fontSize: 24,
              lineHeight: 32,
              fontWeight: 'bold',
              color: '#2E2E2E',
            }}>
            {TextConstants.create_profile}
          </Text>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 19.5,
              marginTop: 6,
              fontWeight: '400',
              color: '#616161',
            }}>
            {TextConstants.create_profile_subtext}
          </Text>
          <Formik
            validationSchema={accountValidationSchema}
            initialValues={{
              fullName: '',
              date: '',
              gender: {label: '', value: ''},
              email: '',
              Password: '',
            }}
            onSubmit={values => handleSubmitClick(values)}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              values,
              touched,
              setFieldValue,
            }) => (
              <>
                <View
                  style={{
                    borderColor: '#E0E0E0',
                    height: 50,
                    marginTop: 24,
                    borderWidth: 1,
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="user"
                    color={'#C5C5C5'}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                    size={16}
                  />
                  <TextInput
                    placeholder="Fullname"
                    placeholderTextColor={'#C5C5C5'}
                    style={styles.txtInput}
                    maxLength={100}
                    onChangeText={handleChange('fullName')}
                    onBlur={handleBlur('fullName')}
                    value={values.fullName}
                  />
                </View>
                {errors.fullName && touched.fullName && (
                  <Text style={{...styles.txt}}>{errors.fullName}</Text>
                )}
                <View
                  style={{
                    borderColor: '#E0E0E0',
                    alignItems: 'center',
                    height: 50,
                    marginTop: 20,
                    borderWidth: 1,
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                  }}>
                  <IconFe
                    name="calendar"
                    color={'#C5C5C5'}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                    size={16}
                  />
                  <Text
                    style={{
                      color: '#616161',
                      fontWeight: '400',
                      flex: 1,
                    }}
                    onPress={() => setOpen(true)}>
                    {values.date ? (
                      values.date
                    ) : (
                      <Text
                        style={{
                          color: '#C5C5C5',
                          fontWeight: '400',
                        }}>
                        Date of Birth
                      </Text>
                    )}
                  </Text>
                  <DatePicker
                    mode="date"
                    modal
                    open={open}
                    date={
                      typeof values.date === 'string' ? new Date() : values.date
                    }
                    onConfirm={date => {
                      setFieldValue('date', moment(date).format('DD/MM/YYYY'));
                      setOpen(false);
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                    maximumDate={(() => {
                      let currentDate = new Date();
                      return new Date(
                        currentDate.setDate(currentDate.getDate() - 1),
                      );
                    })()}
                    minimumDate={(() => {
                      let currentDate = new Date();
                      return new Date(
                        currentDate.setFullYear(
                          currentDate.getFullYear() - 150,
                        ),
                      );
                    })()}
                  />
                </View>
                {errors.date && touched.date && (
                  <Text style={{...styles.txt}}>{errors.date}</Text>
                )}
                <View>
                  <View
                    style={{
                      borderColor: '#E0E0E0',
                      height: 50,
                      marginTop: 20,
                      borderWidth: 1,
                      borderRadius: 4,
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <IconMCI
                      name="gender-male-female"
                      color={'#C5C5C5'}
                      style={{
                        paddingRight: 10,
                        paddingLeft: 10,
                      }}
                      size={16}
                    />
                    <Dropdown
                      itemTextStyle={{
                        fontSize: 15,
                        color: '#616161',
                        fontWeight: '400',
                      }}
                      iconStyle={{
                        opacity: 0.3,
                      }}
                      placeholderStyle={{
                        width: '100%',
                        fontSize: 15,
                        color: '#C5C5C5',
                        fontWeight: '400',
                      }}
                      style={{
                        width: '88%',
                        // paddingLeft: 1.5,
                        // paddingRight: 55,
                      }}
                      selectedTextStyle={{
                        color: '#616161',
                        fontWeight: '400',
                      }}
                      data={[
                        {label: 'Male', value: 'Male'},
                        {label: 'Female', value: 'Female'},
                        {label: 'Other', value: 'other'},
                      ]}
                      labelField="label"
                      valueField="value"
                      placeholder="Gender"
                      value={values.gender}
                      onChange={item => {
                        setFieldValue('gender', item);
                      }}
                    />
                  </View>
                </View>
                {errors.gender && touched.gender && (
                  <Text style={{...styles.txt}}>{errors.gender.value}</Text>
                )}
                <View
                  style={{
                    borderColor: '#E0E0E0',
                    height: 50,
                    marginTop: 20,
                    borderWidth: 1,
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Icon
                    name="user"
                    color={'#C5C5C5'}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                    size={16}
                  />
                  <TextInput
                    placeholder="Email"
                    style={{
                      ...styles.txtInput,
                      paddingHorizontal: 3,
                    }}
                    keyboardType="email-address"
                    placeholderTextColor={'#C5C5C5'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                    maxLength={100}
                  />
                  {!errors.email && touched.email && (
                    <IconCheck
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
                  <Text style={{...styles.txt}}>{errors.email}</Text>
                )}
                <View
                  style={{
                    borderColor: '#E0E0E0',
                    height: 50,
                    marginTop: 20,
                    borderWidth: 1,
                    borderRadius: 4,
                    display: 'flex',
                    justifyContent: 'flex-start',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <IconFe
                    name="lock"
                    color={'#C5C5C5'}
                    style={{
                      paddingRight: 10,
                      paddingLeft: 10,
                    }}
                    size={16}
                  />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor={'#C5C5C5'}
                    style={{...styles.txtInput}}
                    onChangeText={handleChange('Password')}
                    onBlur={handleBlur('Password')}
                    value={values.Password}
                    maxLength={50}
                    secureTextEntry={passwordVisible}
                  />
                  <IconFe
                    color={'#C5C5C5'}
                    style={{
                      paddingRight: 10,
                      right: 0,
                      position: 'absolute',
                    }}
                    size={16}
                    name={passwordVisible ? 'eye' : 'eye-off'}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  />
                </View>
                {errors.Password && touched.Password && (
                  <Text style={{...styles.txt}}>{errors.Password}</Text>
                )}
                <Button
                  title={TextConstants.text_continue_button}
                  titleStyle={{
                    fontWeight: 'bold',
                    fontSize: 16,
                    lineHeight: 24,
                  }}
                  buttonStyle={{
                    marginTop: 60,
                    borderRadius: 4,
                    paddingVertical: 12,
                    backgroundColor: '#2667C9',
                  }}
                  containerStyle={{
                    borderRadius: 4,
                    paddingVertical: 13,
                  }}
                  onPress={handleSubmit}
                />
              </>
            )}
          </Formik>
        </View>
        {!offline && <InternetVerify />}
      </KeyboardAwareScrollView>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  txt: {
    fontSize: 13,
    color: 'red',
    marginTop: 5,
    fontWeight: '400',
  },
  txtInput: {
    marginRight: 30,
    width: '80%',
    flex: 1,
    fontWeight: '400',
    fontSize: 14,
    color: '#616161',
    marginTop: Platform.OS === 'android' ? 5 : 0,
    paddingLeft: 0,
  },
});
export default CreateAccountContainer;
