import React, { useEffect, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import 'nativewind'; // This ensures nativewind is properly loaded
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const OnboardingMain = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        router.replace('/home'); // Skip onboarding and go to home if logged in
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <View className='flex-1 justify-end items-center bg-[#8EC9E6]'>
      <View className='pb-[20px]'>
        <Image
          source={require('../../assets/images/ssync-welcome-img.png')}
          className='mb-[10px]'
          style={styles.mainImage}
        />
      </View>
      <View className='w-full rounded-3xl bg-white px-4 pb-[100px] pt-[40px]'>
        <Text className='font-semibold font-psemibold text-4xl mb-6 text-center'>
          Welcome to SSync!
        </Text>
        <Text className='font-iregular text-xl text-center mx-auto mb-8 max-w-[260px]'>
          Discover endless collaboration potential for your team
        </Text>
        <View className='flex-row justify-between gap-16 max-w-[320px] mx-auto'>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/signup')}
            style={styles.button}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar style='auto' />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#275BBC',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
    flex: 1,
  },
  buttonText: {
    color: 'white',
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    textAlign: 'center',
  },
  mainImage: {
    width,
    height: height * 0.45,
  },
});

export default OnboardingMain;
