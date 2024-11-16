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

  const handleAddPost = async () => {
    if (postTitle.trim() && postBody.trim()) {
      try {
        // Retrieve logged-in user
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        const currentUser = JSON.parse(loggedInUser);

        if (currentUser) {
          const currentDate = new Date();
          const newPost = {
            id: Date.now(), // Unique ID
            postName: postTitle,
            content: postBody,
            dateTime: currentDate.toISOString(),
            posterName: currentUser.name,
            posterEmail: currentUser.email,
            profileIcon: currentUser.avatar,
          };

          onAddPost(newPost);

          setPostTitle('');
          setPostBody('');
          onClose();
        } else {
          alert('Error: Unable to find the logged-in user.');
        }
      } catch (error) {
        console.error('Error adding post:', error);
      }
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
