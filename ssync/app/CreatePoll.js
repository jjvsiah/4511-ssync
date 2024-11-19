import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreatePoll = () => {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);

  const addOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    } else {
      Alert.alert('Limit Reached', 'Maximum 5 options allowed');
    }
  };

  const updateOption = (text, index) => {
    const newOptions = [...options];
    newOptions[index] = text;
    setOptions(newOptions);
  };

  const removeOption = (index) => {
    if (options.length > 1) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleCreatePoll = async () => {
    try {
      if (!question.trim()) {
        Alert.alert('Error', 'Please enter a poll question');
        return;
      }

      const validOptions = options.filter((opt) => opt.trim());
      if (validOptions.length < 2) {
        Alert.alert('Error', 'Please add at least 2 options');
        return;
      }

      const currentUserData = await AsyncStorage.getItem('loggedInUser');
      if (!currentUserData) {
        Alert.alert('Error', 'No user logged in');
        return;
      }

      const currentUser = JSON.parse(currentUserData);

      const newPoll = {
        id: Date.now().toString(),
        type: 'poll', // Keep this to identify as poll
        question: question.trim(),
        options: validOptions.map((option) => ({
          text: option,
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
          votes: 0,
        })),
        voters: [],
        created: new Date().toISOString(),
      };

      if (currentUser.projects && currentUser.projects.length > 0) {
        currentUser.projects[0].tasks.push(newPoll);

        await AsyncStorage.setItem('loggedInUser', JSON.stringify(currentUser));

        // Update all users
        const usersData = await AsyncStorage.getItem('users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const updatedUsers = users.map((user) =>
            user.id === currentUser.id ? currentUser : user
          );
          await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
        }

        Alert.alert('Success', 'Poll created successfully', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]);
      } else {
        Alert.alert('Error', 'No project found to add poll to');
      }
    } catch (error) {
      console.error('Error creating poll:', error);
      Alert.alert('Error', 'Failed to create poll. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name='arrow-back' size={24} color='black' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Poll</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Create poll</Text>
        <TextInput
          style={styles.input}
          placeholder='Poll question'
          value={question}
          onChangeText={setQuestion}
          multiline
        />

        {options.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <TextInput
              style={styles.optionInput}
              placeholder={`Option ${index + 1}`}
              value={option}
              onChangeText={(text) => updateOption(text, index)}
            />
            {options.length > 1 && (
              <TouchableOpacity
                onPress={() => removeOption(index)}
                style={styles.removeOption}>
                <Ionicons name='close-circle' size={24} color='#666' />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
          <Ionicons name='add-circle-outline' size={24} color='#666' />
          <Text style={styles.addOptionText}>Add options</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreatePoll}>
          <Ionicons name='add' size={24} color='white' />
          <Text style={styles.createButtonText}>Create Poll</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    minHeight: 50,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionInput: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
  removeOption: {
    padding: 4,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  addOptionText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 16,
  },
  createButton: {
    flexDirection: 'row',
    backgroundColor: '#275BBC',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default CreatePoll;
