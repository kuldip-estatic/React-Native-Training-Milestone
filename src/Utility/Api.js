// // a library to wrap and simplify api calls
// import apisauce from 'apisauce'
// import { Alert } from 'react-native'

// const LIVE = 'https://www.getpostman.com/collections/d96798bb83bbfabcabab'

// const create = (baseURL = LIVE) => {
//     const api = apisauce.create({
//         baseURL,
//         headers: {
//             'Content-Type': 'application/json',
//             'Cache-Control': 'no-cache'
//         },

//         timeout: 120000
//     })

//     // const setToken = (token) => api.setHeader('Authorization', 'Bearer ' + token)

//     // isInternetAvailable = () => {
//     //     if (InternetInstance.getInternetStatus()) {
//     //         return true
//     //     } else {
//     //         Alert.alert("Pocket Sergeant", "No internet connection found.")
//     //         return false
//     //     }
//     // }

//     // const setUsername = (id) => {
//     //     return api.get(`getAllCrimes?id=${id}`)
//     // }

//     const getAllData = (data) => {
//         return api.post(`/send-otp`, data)
//     }

//     const getAllCrimeList = () => {
//         return api.get(`getAllCrimes`)
//     }

//     return {
//         // setToken,
//         getAllCrimeList,
//         getAllData
//     }
// }

// export default {
//     create
// }

import apisause from 'apisauce';
import {Alert} from 'react-native';

// const DEV = 'https://www.getpostman.com/collections/d96798bb83bbfabcabab';
const DEV = 'http://192.168.1.191:10288';

const create = (baseURL = DEV) => {
  const api = apisause.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache',
    },
    timeout: 120000,
  });

  const emailLoginApi = data => {
    return api.post(`/login`, data);
  };

  const getOTP = (
    phone = '',
    purpose = 'registration' | 'login' | 'retrievepassword',
    getOtpUsing = 'phoneNumber' | 'email',
  ) => {
    const body = {
      [getOtpUsing]: phone.toLocaleLowerCase(),
      purpose: purpose,
    };
    return api.post('/send-otp', body);
  };

  const verifyOTP = (
    phone = '',
    otp = '',
    getOtpUsing = 'phoneNumber' | 'email',
  ) => {
    const body = {
      [getOtpUsing]: phone.toLocaleLowerCase(),
      otp: otp,
    };

    return api.post('/verify-otp', body);
  };

  const createNewPassword = (email = '', password = '') => {
    const body = {email, password};
    return api.post('/reset-password', body);
  };

  const registerUser = data => {
    // const body = {name, dateofBirth, gender, email, password, phoneNumber};
    console.log(data, 'data');

    return api.post('/register', data);
  };

  return {emailLoginApi, getOTP, verifyOTP, createNewPassword, registerUser};
};

export default {
  create,
};
