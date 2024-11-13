import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';

const ProjectFeed = ({ route }) => {
  // const { projectName, description } = route.params;

  if (!route || !route.params) {
    console.log('Error: route or route.params is undefined');
    return <Text>Error: Missing route data.</Text>; // Return an error message if route or params are missing
  }

  const { projectName, description } = route.params;

  // const { projectName, description } = route?.params || {};

  if (!projectName || !description) {
    console.log('Error: projectName or description is missing');
    // You could also handle the case where projectName or description is missing, maybe navigate back or show an error message
    return <Text>Error: Missing project data.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <View className='bg-white w-full pt-16 rounded-b-[30%] mb-5'>
        <TouchableOpacity className='absolute left-5 top-5'>
          <FontAwesome name='bars' size={24} color='#000' />
        </TouchableOpacity>
        <Text className='text-center text-4xl font-psemibold mt-10 mb-3'>
          {projectName}
        </Text>
        <Text className='text-center text-lg font-pregular text-gray-600 mb-5'>
          12 Oct 2024 - 5 Dec 2024
        </Text>
        <View className='flex-row justify-evenly mb-5'>
          <TouchableOpacity className='bg-[#8971C4] py-3 px-8 rounded-full'>
            <Text className='text-white text-2xl font-psemibold'>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-[#8971C4] py-3 px-8 rounded-full'>
            <Text className='text-white text-2xl font-psemibold'>Members</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Feed Section */}
      <View className='w-full px-5'>
        <View className='flex-row justify-between mb-4'>
          <TouchableOpacity className='bg-[#275BBC] py-2 px-5 rounded-full flex-row items-center'>
            <FontAwesome name='plus' size={18} color='#fff' />
            <Text className='text-white text-xl font-pregular ml-2'>
              Add a post
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-[#275BBC] py-2 px-5 rounded-full flex-row items-center'>
            <Text className='text-white text-xl font-pregular mr-2'>
              Project Code
            </Text>
            <FontAwesome name='caret-down' size={18} color='#fff' />
          </TouchableOpacity>
        </View>

        <TouchableOpacity className='bg-white py-2 px-5 rounded-full mb-5'>
          <FontAwesome name='filter' size={20} color='#000' />
        </TouchableOpacity>

        {/* Project Description */}
        <Text className='text-center text-lg font-pregular text-gray-800 mb-5'>
          This is the description of the project. You can put a detailed
          description here.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#e7e6eb',
  },
});

export default ProjectFeed;
