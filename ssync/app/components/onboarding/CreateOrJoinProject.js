import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';
import CreateProjectModal from './CreateProjectModal';
import JoinProjectModal from './JoinProjectModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'nativewind';

const CreateOrJoinProject = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false); // New state for Join Modal
  const [userProjects, setUserProjects] = useState([]);
  const nav = useNavigation();
  const router = useRouter();

  const generateProjectCode = () => {
    return Math.random().toString(36).substr(2, 8).toUpperCase(); // Generates 8-character alphanumeric code
  };

  const handleCreateProject = async (newProject) => {
    try {
      // Get the current user from AsyncStorage
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (!loggedInUser) {
        alert('No user is logged in');
        return;
      }

      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];

      const { projectName, description } = newProject;
      const projectCode = generateProjectCode();

      const project = {
        id: projectCode,
        name: projectName,
        description: description,
        posts: [],
      };

      storeProject(project);

      // Find user and update their project list
      const updatedUsers = users.map((user) => {
        if (user.email === loggedInUser) {
          return {
            ...user,
            projects: [...(user.projects || []), projectCode],
            selectedProject: projectCode,
          };
        }
        return user;
      });

      // Save the updated users list back to AsyncStorage
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
      console.log('Project Created:', projectName, description);

      // Navigate to the project feed
      setCreateModalVisible(false);
      console.log('going to home');
      router.push('/home');
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const storeProject = async (project) => {
    try {
      // Retrieve the existing projects list
      const existingProjects = await AsyncStorage.getItem('projects');
      let projects = [];

      // Parse any existing projects, else make a new array
      if (existingProjects) {
        projects = JSON.parse(existingProjects);
      }

      // Add the new project to the list
      projects.push(project);

      // Save the updated list back to AsyncStorage
      await AsyncStorage.setItem('projects', JSON.stringify(projects));
      console.log('Project added:', project);
    } catch (error) {
      console.error('Error storing project:', error);
    }
  };

  const handleJoinProject = async (projectName) => {
    try {
      const loggedInUser = await AsyncStorage.getItem('loggedInUser');
      if (!loggedInUser) {
        alert('No user is logged in');
        return;
      }

      alert('Joining project ' + projectName);
    } catch (error) {
      console.error('Error joining project:', error);
    }
  };

  // Create new project modal
  return (
    <View className='flex-1 bg-[#275BBC] items-center pt-24 w-full'>
      <Text className='text-white text-5xl mb-4 font-psemibold pt-10'>
        Let's dive in
      </Text>

      <Text className='text-white text-3xl font-isemibold px-2.5  mb-12 text-center'>
        Join an existing project or create your own!
      </Text>

      <TouchableOpacity
        className='bg-[#A9E6FC] w-[90vw] py-14 rounded-[50%] flex-row justify-center items-center mb-12'
        onPress={() => setJoinModalVisible(true)}>
        <View className='bg-white rounded-full pl-6 pt-6 mr-3 w-[90px] h-[90px]'>
          <FontAwesome5 name='share-alt' size={50} color='black' />
        </View>
        <Text className='text-black font-psemibold pl-3 text-3xl'>
          Join a Project
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className='bg-[#E3D8FB] w-[90vw] py-14 rounded-[50%] flex-row justify-center items-center'
        onPress={() => setCreateModalVisible(true)}>
        <Text className='text-black font-psemibold pr-3 text-3xl'>
          Create a Project
        </Text>
        <View className='bg-white rounded-full pl-6 pt-6 ml-3 w-[90px] h-[90px]'>
          <FontAwesome5 name='pencil-alt' size={50} color='black' />
        </View>
      </TouchableOpacity>

      <CreateProjectModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onCreateProject={handleCreateProject}
      />

      <JoinProjectModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onJoinProject={handleJoinProject}
      />
    </View>
  );
};

export default CreateOrJoinProject;
