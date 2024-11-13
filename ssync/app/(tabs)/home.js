import { View, Text } from 'react-native';
import React, { useState, useEffect, useLayoutEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateOrJoinProject from '../components/onboarding/CreateOrJoinProject';
import { useNavigation } from '@react-navigation/native';

const home = () => {
  const [projects, setProjects] = useState([]);
  const navigation = useNavigation();

  // Check for stored projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (!loggedInUser) return;

        const existingUsers = await AsyncStorage.getItem('users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];
        const user = users.find((u) => u.email === loggedInUser);

        if (user && user.projects) {
          setProjects(user.projects); // Set projects of the logged-in user
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    fetchProjects(); // Fetch projects when component mounts
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center items-center'>
      {projects.length === 0 ? (
        // If projects then show the CreateOrJoinProject component
        <CreateOrJoinProject />
      ) : (
        // If projects then render calendar and projects view
        <Text>Projects exist</Text>
      )}
    </View>
  );
};

export default home;
