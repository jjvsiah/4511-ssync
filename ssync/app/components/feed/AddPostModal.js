import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddPostModal = ({ visible, onClose, onAddPost }) => {
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const [poster, setPoster] = useState('');

  useEffect(() => {
    const getPosterName = async () => {
      try {
        // Get logged-in user email from AsyncStorage
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');

        if (loggedInUser) {
          // Retrieve the users array from AsyncStorage
          const existingUsers = await AsyncStorage.getItem('users');
          const users = existingUsers ? JSON.parse(existingUsers) : [];

          // Find the user by email
          const user = users.find((u) => u.email === loggedInUser);
          if (user) {
            // Set the user's name as poster
            console.log('THE USER - ' + user);
            setPoster(user.name);
          } else {
            console.error('User not found.');
          }
        } else {
          console.error('No logged-in user found.');
        }
      } catch (error) {
        console.error('Error fetching poster name: ', error);
      }
    };

    getPosterName();
  }, []);

  const handleAddPost = () => {
    if (postTitle.trim() && postBody.trim()) {
      const currentDate = new Date();
      const newPost = {
        title: postTitle,
        body: postBody,
        timestamp: currentDate.toISOString(),
        poster: poster, // Add the poster's name to the post
      };

      // Call onAddPost prop to add the post
      onAddPost(newPost);

      // Clear input fields and close the modal
      setPostTitle('');
      setPostBody('');
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
            <FontAwesome name='close' size={24} color='#000' />
          </TouchableOpacity>

          <Text className='text-center text-4xl font-psemibold pt-5 mb-5'>
            Add a Post
          </Text>

          <Text className='text-2xl text-black font-iregular mb-2'>Title</Text>
          <TextInput
            value={postTitle}
            onChangeText={setPostTitle}
            placeholder='Enter project name'
            style={styles.input}
          />

          <Text className='text-2xl text-black font-iregular mb-2 mt-7'>
            Post Body
          </Text>
          <TextInput
            value={postBody}
            onChangeText={setPostBody}
            placeholder='Enter the post body'
            style={[styles.input, styles.bodyInput]}
            multiline
            textAlignVertical='top'
          />

          <TouchableOpacity
            onPress={handleAddPost}
            className='bg-[#275BBC] py-3 rounded-full mt-5 mb-3'>
            <Text className='text-white text-center text-2xl font-ibold'>
              Add Post
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
  bodyInput: {
    height: 100,
    borderRadius: 20,
  },
});

export default AddPostModal;
