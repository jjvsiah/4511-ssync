import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import ProjectFeed from '../components/feed/ProjectFeed';

const feed = () => {
  const nav = useNavigation();

  useEffect(() => {
    nav.setOptions({
      headerShown: false,
    });
  }, [nav]);

  return (
    <View style={{ flex: 1 }}>
      <ProjectFeed />
    </View>
  );
};

export default feed;
