import apisause from 'apisauce';

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
    return api.post('/register', data);
  };

  return {emailLoginApi, getOTP, verifyOTP, createNewPassword, registerUser};
};

export default {
  create,
};
