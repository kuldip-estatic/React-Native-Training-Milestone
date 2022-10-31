import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Alert,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  DeviceEventEmitter,
} from 'react-native';
import ImageView from 'react-native-image-viewing';
import IconFe from 'react-native-vector-icons/Feather';
import Swiper from 'react-native-swiper';
import InternetVerify from '../../Components/InternetVerify';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
IconFe.loadFont();
const HomeController = () => {
  const navigation = useNavigation();

  const images = [
    {
      uri: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
    },
  ];

  const [visible, setIsVisible] = useState(false);
  const [offline, setOffline] = useState(true);

  const internetChangeListener = () => {
    DeviceEventEmitter.addListener('netListener', netStatus => {
      setOffline(netStatus);
    });
  };

  useEffect(() => {
    internetChangeListener();
  }, []);
  const myDate = new Date();
  const hours = myDate.getHours();
  var greet;

  if (hours < 12) greet = 'morning';
  else if (hours >= 12 && hours <= 17) greet = 'afternoon';
  else if (hours >= 17 && hours <= 24) greet = 'evening';
  return (
    <View
      style={{
        flex: 1,
      }}>
      <View style={{flexDirection: 'row', marginTop: 25}}>
        <View style={{flex: 0.2}}>
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}
            onPress={() => setIsVisible(true)}>
            <Image
              source={{
                uri: 'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50',
              }}
              style={{
                width: wp('14%'),
                height: wp('14%'),
                borderRadius: wp('7%'),
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <ImageView
            images={images}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
          />
        </View>

        <View style={{flex: 0.6, justifyContent: 'center'}}>
          <Text
            style={{
              fontWeight: '400',
              fontSize: 14,
              color: '#1A1A1C',
              lineHeight: 19.5,
            }}>
            Good {greet}!
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 20,
              color: '#1A1A1C',
              lineHeight: 30,
            }}>
            Hi, Benjamin
          </Text>
        </View>

        <View
          style={{
            flex: 0.2,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          <TouchableOpacity onPress={() => Alert.alert('Menu!')}>
            <Image
              source={{uri: 'icon_menu'}}
              style={{
                width: wp('10%'),
                height: wp('10%'),
                borderRadius: wp('5%'),
                backgroundColor: 'lightgray',
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          flex: 1,
          marginBottom: 80,
          marginTop: 24,
          marginRight: 20,
          marginLeft: 20,
          borderRadius: 10,
          overflow: 'hidden',
        }}>
        <Swiper
          loop={false}
          dotStyle={{
            backgroundColor: '#D9D9D963',
            width: 36,
            height: 3,
            marginBottom: 14,
          }}
          activeDotStyle={{
            backgroundColor: '#2667C9',
            width: 36,
            height: 3,
            marginBottom: 14,
          }}>
          <View>
            <ImageBackground
              source={{
                uri: 'https://media.istockphoto.com/photos/indian-man-headshot-picture-id1138008134?k=20&m=1138008134&s=170667a&w=0&h=sjL29jSAK9HW7kcKsiWqU3kRHxWuXoMzPIY5Zl2bSG0=',
              }}
              style={{
                height: '100%',
              }}
              resizeMode="stretch">
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  bottom: 60,
                }}>
                <View
                  style={{
                    paddingLeft: 24,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      lineHeight: 36,
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                    Esther Howard, 34
                  </Text>
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <IconFe
                      name="map-pin"
                      style={{
                        color: '#fff',
                      }}
                      size={14}
                    />
                    <Text
                      style={{
                        color: '#fff',
                        marginLeft: 10,
                        fontSize: 12,
                        paddingTop: 3,
                        fontWeight: '400',
                      }}>
                      Pembroke, Pines
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: 11,
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      width: wp('14%'),
                      height: wp('14%'),
                      borderRadius: wp('7%'),
                      backgroundColor: '#D9D9D9F5',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}>
                    <TouchableOpacity onPress={() => Alert.alert('Menu!')}>
                      <Image
                        source={{
                          uri: 'icon_cross',
                        }}
                        style={{
                          width: wp('6%'),
                          height: wp('6%'),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginLeft: 12,
                      width: wp('14%'),
                      height: wp('14%'),
                      borderRadius: wp('7%'),
                      backgroundColor: '#D9D9D9F5',
                      justifyContent: 'center',
                      alignItems: 'center',
                      overflow: 'hidden',
                    }}>
                    <TouchableOpacity onPress={() => Alert.alert('Menu!')}>
                      <Image
                        source={{
                          uri: 'icon_heart',
                        }}
                        style={{
                          width: wp('7%'),
                          height: wp('7%'),
                        }}
                        resizeMode="contain"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </View>
          <View>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbWVufGVufDB8fDB8fA%3D%3D&w=1000&q=80',
              }}
              style={{
                height: '100%',
              }}
              resizeMode="stretch"
            />
          </View>
          <View>
            <ImageBackground
              source={{
                uri: 'https://images.unsplash.com/photo-1552642986-ccb41e7059e7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aW5kaWFuJTIwbWVufGVufDB8fDB8fA%3D%3D&w=1000&q=80',
              }}
              style={{
                height: '100%',
              }}
              resizeMode="stretch"
            />
          </View>
        </Swiper>
      </View>
      {!offline && <InternetVerify />}
    </View>
  );
};

export default HomeController;
