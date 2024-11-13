import { View, Text } from 'react-native';
import React from 'react';
import ProfileContent from '../screens/ProfileContent';
import 'nativewind';

const profile = () => {
  return (
    <View className='flex-1 justify-center items-center'>
      <ProfileContent />
    </View>
  );
};

export default profile;
