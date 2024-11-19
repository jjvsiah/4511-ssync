import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

const CreateProjectModal = ({ visible, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleCreateProject = () => {
    if (projectName.trim() && projectDescription.trim()) {
      const newProject = {
        projectName,
        description: projectDescription,
      };

      // Call onCreateProject prop to add the project to the user's projects
      onCreateProject(newProject);

      // Clear input fields, close the modal
      setProjectName('');
      setProjectDescription('');
      onClose();
    } else {
      alert('Please fill in both fields.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View className='flex-1 justify-center items-center bg-black/30'>
        <View className='bg-white p-5 rounded-[30%] shadow-lg w-[90vw]'>
          <TouchableOpacity onPress={onClose}>
            <Text className='text-right text-lg text-gray-700'>X</Text>
          </TouchableOpacity>

          <Text className='text-center text-4xl font-psemibold pt-5 mb-5'>
            Create Project
          </Text>

          <Text className='text-2xl text-black font-iregular mb-2'>Name</Text>
          <TextInput
            value={projectName}
            onChangeText={setProjectName}
            placeholder='Enter project name'
            style={styles.input}
          />

          <Text className='text-2xl text-black font-iregular mb-2 mt-7'>
            Description
          </Text>
          <TextInput
            value={projectDescription}
            onChangeText={setProjectDescription}
            placeholder='Enter project description'
            style={[styles.input, styles.descriptionInput]}
            multiline
            textAlignVertical='top'
          />

          <TouchableOpacity
            onPress={handleCreateProject}
            className='bg-[#275BBC] py-3 rounded-full mt-5 mb-3'>
            <Text className='text-white text-center text-2xl font-ibold'>
              Create
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  descriptionInput: {
    height: 100,
    borderRadius: 20,
  },
});

export default CreateProjectModal;
