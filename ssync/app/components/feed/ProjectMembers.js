import React from 'react';
import { View, Text, Image } from 'react-native';

const ProjectMembers = ({ project }) => {
  return (
    <View className='bg-white rounded-[50%] border-[#8971C4] border-[0.25px] mx-5 px-5 mb-10'>
      <View className='flex-row flex-wrap py-3'>
        {project.users.map((user, index) => (
          <View key={index} className='w-1/2 p-2'>
            <View className='bg-white rounded-lg'>
              <View className='flex-row items-start'>
                <Image
                  source={{ uri: user.profileIcon }}
                  className='w-12 h-12 rounded-full mr-4'
                />
                <View>
                  <Text className='text-lg font-pregular'>{user.name}</Text>
                  <Text className='text-sm'>
                    {user.tasksCompleted} Tasks Done
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProjectMembers;
