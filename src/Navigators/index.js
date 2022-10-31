import React from 'react';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeContainer from '../Screens/Home';
import ForgetPasswordContainer from '../Screens/ForgetPassword';
import RegisterContainer from '../Screens/Register';
import LoginContainer from '../Screens/Login';
import OTPContainer from '../Components/OTPVerification';

import CreateNewPassword from '../Components/CreateNewPassword';
import SuccessScreen from '../Components/successScreen';
import CreateAccountContainer from '../Screens/CreateAccount';

const Stack = createNativeStackNavigator();

const Navigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen
          name="Home"
          component={HomeContainer}
          options={{headerShown: false}}
        />
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen name="login" component={LoginContainer} />
          <Stack.Screen name="otp" component={OTPContainer} />
          <Stack.Screen name="register" component={RegisterContainer} />
          <Stack.Screen
            name="createaccount"
            component={CreateAccountContainer}
          />
          <Stack.Screen name="forget" component={ForgetPasswordContainer} />
          <Stack.Screen
            name="createnewpassword"
            component={CreateNewPassword}
          />
          <Stack.Screen name="success" component={SuccessScreen} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigator;
