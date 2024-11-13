import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  StyleSheet,
} from 'react-native';

const JoinProjectModal = ({ visible, onClose, onJoinProject }) => {
  const [projectCode, setProjectCode] = useState('');

  const handleJoinProject = () => {
    if (projectCode.trim()) {
      // Call onJoinProject to handle joining with the provided code
      onJoinProject(projectCode);

      // Clear input field and close the modal
      setProjectCode('');
      onClose();
    } else {
      alert('Please enter a project code.');
    }
  };

  return (
    <Modal visible={visible} transparent animationType='slide'>
      <View className='flex-1 justify-center items-center bg-black/30'>
        <View className='bg-white p-5 rounded-[30%] shadow-lg w-[90vw]'>
          <TouchableOpacity onPress={onClose}>
            <Text className='text-right text-lg text-gray-700'>X</Text>
          </TouchableOpacity>

          <Text className='text-center text-4xl font-semibold pt-5 mb-5'>
            Join Project
          </Text>

          <Text className='text-2xl text-black font-iregular mb-2'>
            Project Code
          </Text>
          <TextInput
            value={projectCode}
            onChangeText={setProjectCode}
            placeholder='Enter project code'
            style={styles.input}
            autoCapitalize='none'
          />

          <Text className='text-center text-xl text-gray-500 font-iregular mt-5'>
            OR
          </Text>

          <Text className='text-2xl text-black font-iregular mt-5 mb-2'>
            Scan QR Code
          </Text>

          {/* QR Code Container and Image using nativewind classes */}
          <View className='flex justify-center items-center my-4'>
            <Image
              source={require('../../../assets/images/phone-qr-code.png')}
              className='w-[150px] h-[300px]'
            />
          </View>

          <TouchableOpacity
            onPress={handleJoinProject}
            className='bg-[#275BBC] py-3 rounded-full mt-5 mb-3'>
            <Text className='text-white text-center text-2xl font-ibold'>
              Join
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
});

export default JoinProjectModal;
