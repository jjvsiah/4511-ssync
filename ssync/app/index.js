import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { resetAndInitialiseData } from '../utils/storage';

const Index = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Initializing app data...');
        await resetAndInitialiseData(); // Call your initialization function
        console.log('App data initialized successfully.');
        await checkLoginStatus();
      } catch (error) {
        console.error('Error during initialization:', error);
        setIsLoading(false);
      }
      await checkLoginStatus();
    };

    const checkLoginStatus = async () => {
      const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');
      if (isLoggedIn === 'true') {
        router.replace('/home', undefined, { animation: 'none' }); // Navigate to home if logged in
      } else {
        router.replace('/OnboardingMain', undefined, { animation: 'none' }); // Navigate to onboarding if not logged in
      }
      setIsLoading(false);
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#275BBC' />
      </View>
    );
  }

  return null;
};

export default Index;
