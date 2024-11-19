import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import 'nativewind';

const ProfileContent = () => {
  const router = useRouter();

  const handleLogout = async () => {
    // Remove the login status from AsyncStorage
    await AsyncStorage.removeItem('isLoggedIn');
    router.replace('/OnboardingMain'); // Redirect to main onboarding screen
  };

  return (
    <View className='flex-1 justify-center items-center'>
      <Text className='text-2xl mb-4 iregular'>Profile</Text>
      {/* Log Out Button */}
      <TouchableOpacity
        className='mt-8 bg-blue-500 p-3 rounded-lg'
        onPress={handleLogout}>
        <Text className='text-white text-lg iregular'>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileContent;
