import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProjectFeed from '../components/feed/ProjectFeed';

const feed = () => {
  const nav = useNavigation();
  const route = useRoute();

  useEffect(() => {
    nav.setOptions({
      headerShown: false,
    });
  }, [nav]);

  return (
    <View style={{ flex: 1 }}>
      <ProjectFeed route={route} />
    </View>
  );
};

export default feed;
