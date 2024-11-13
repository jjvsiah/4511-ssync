import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'nativewind';
import Icon from 'react-native-vector-icons/FontAwesome';

const signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accepted, setAccepted] = useState(false);
  const nav = useNavigation();
  const router = useRouter();

  useEffect(() => {
    nav.setOptions({
      headerShown: true,
      header: () => (
        <View className='h-40 bg-white flex-row pr-[70px] justify-center items-center pt-12 px-5'>
          <TouchableOpacity onPress={() => nav.goBack()}>
            <Image
              source={require('../../assets/icons/left-arrow-black.png')}
              className='w-12 h-12'
            />
          </TouchableOpacity>

          <Text className='text-4xl font-pregular text-center text-black flex-1'>
            Register
          </Text>
        </View>
      ),
    });
  }, [nav]);

  const handleSignup = async () => {
    const nameRegex = /^(?=.*[a-zA-ZÀ-ÿ])[a-zA-ZÀ-ÿ\s'-]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

    // Error checking
    if (!name || !nameRegex.test(name)) {
      alert('Please enter a valid name.');
      setName('');
      return;
    }

    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      setEmail('');
      return;
    }

    if (!passwordRegex.test(password)) {
      alert(
        'Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter and 1 number.'
      );
      setPassword('');
      return;
    }

    if (!accepted) {
      alert('Please accept the terms and conditions to proceed.');
      return;
    }

    console.log('Registering with', email, password);

    try {
      const existingUsers = await AsyncStorage.getItem('users');
      const users = existingUsers ? JSON.parse(existingUsers) : [];
      users.push({ name, email, password, projects: [] });
      await AsyncStorage.setItem('users', JSON.stringify(users));
      console.log('User data saved successfully');

      await AsyncStorage.setItem('loggedInUser', email);
      await AsyncStorage.setItem('isLoggedIn', 'true');
      router.push('/home');
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  return (
    <View className='flex-1 justify-start p-6 bg-white'>
      <Text className='text-2xl font-ibold mt-5 mb-2 '>Name</Text>
      <View className='mb-7'>
        <TextInput
          placeholder='Enter your name'
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <Text className='text-2xl font-ibold mb-2 '>Email</Text>
      <View className='mb-7'>
        <TextInput
          placeholder='Enter your email'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize='none'
        />
      </View>

      <Text className='text-2xl font-ibold mb-2'>Password</Text>
      <View className='mb-3'>
        <TextInput
          placeholder='Enter your password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize='none'
        />
      </View>

      {/* Terms and Conditions */}
      <View className='flex-row items-center mb-16'>
        <TouchableOpacity onPress={() => setAccepted(!accepted)}>
          <View
            className={`ml-5 w-5 h-5 border-2 rounded flex justify-center items-center ${
              accepted ? 'bg-black' : 'border-gray-300'
            }`}>
            {accepted && <Icon name='check' size={14} color='white' />}
          </View>
        </TouchableOpacity>
        <Text className='text-sm font-iregular pl-3 pr-10'>
          I accept and comply with SSYNC's{' '}
          <Text className='underline'>Terms and Conditions</Text> and{' '}
          <Text className='underline'>Privacy Policy</Text>
        </Text>
      </View>

      {/* Register Button */}
      <TouchableOpacity onPress={handleSignup} style={styles.button}>
        <Text className='text-white text-center text-2xl font-ibold'>
          Register
        </Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity onPress={() => router.replace('/login')}>
        <Text className='text-xl font-iregular text-center'>
          Have an account? <Text className='font-ibold'>Log in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    borderColor: '#D9D9D9',
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 50,
    width: '100%',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#275BBC',
    paddingVertical: 12,
    borderRadius: 50,
    marginBottom: 16,
    color: 'white',
    fontFamily: 'Inter-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default signup;
