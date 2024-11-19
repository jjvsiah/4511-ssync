// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Alert,
//   Image,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useRouter, useNavigation } from "expo-router";
// import "nativewind";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const nav = useNavigation();
//   const router = useRouter();

//   useEffect(() => {
//     nav.setOptions({
//       headerShown: true,
//       header: () => (
//         <View className="h-40 bg-white flex-row pr-[70px] justify-center items-center pt-12 px-5">
//           <TouchableOpacity onPress={() => nav.goBack()}>
//             <Image
//               source={require("../../assets/icons/left-arrow-black.png")}
//               className="w-12 h-12"
//             />
//           </TouchableOpacity>

//           <Text className="text-4xl font-pregular text-center text-black flex-1">
//             Log In
//           </Text>
//         </View>
//       ),
//     });
//   }, [nav]);

//   const handleLogin = async () => {
//     try {
//       const storedUsers = await AsyncStorage.getItem("users");
//       const users = storedUsers ? JSON.parse(storedUsers) : [];

//       const user = users.find(
//         (user) => user.email === email && user.password === password
//       );
//       if (user) {
//         await AsyncStorage.setItem("isLoggedIn", "true");
//         router.push("/home");
//       } else {
//         Alert.alert("Invalid Credentials", "Email or password is incorrect");
//         setEmail("");
//         setPassword("");
//       }
//     } catch (error) {
//       console.error("Error reading data from AsyncStorage:", error);
//       Alert.alert("Error", "There was an issue with the login process");
//     }
//   };

//   return (
//     <View className="flex-1 justify-start p-6 bg-white">
//       <Text className="text-2xl font-ibold mt-5 mb-2 ">Email</Text>
//       <View className="mb-7">
//         <TextInput
//           placeholder="Enter your email"
//           value={email}
//           onChangeText={setEmail}
//           style={styles.input}
//           autoCapitalize="none"
//         />
//       </View>

//       <Text className="text-2xl font-ibold mb-2">Password</Text>
//       <View className="mb-3">
//         <TextInput
//           placeholder="Enter your password"
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//           style={styles.input}
//           autoCapitalize="none"
//         />
//       </View>

//       {/* Forgot Password Link - static feature */}
//       <Text className="text-sm font-ibold mb-16">Forgot Password?</Text>
//       {/* </TouchableOpacity> */}

//       {/* Log In Button */}
//       <TouchableOpacity onPress={handleLogin} style={styles.button}>
//         <Text className="text-white text-center text-2xl font-ibold">
//           Log In
//         </Text>
//       </TouchableOpacity>

//       {/* Register Link */}
//       <TouchableOpacity onPress={() => router.replace("/signup")}>
//         <Text className="text-xl font-iregular text-center">
//           Don't have an account? <Text className="font-ibold">Register</Text>
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     borderColor: "#D9D9D9",
//     borderWidth: 1,
//     paddingVertical: 20,
//     paddingHorizontal: 16,
//     borderRadius: 50,
//     width: "100%",
//     fontFamily: "Inter-Regular",
//     fontSize: 16,
//   },
//   button: {
//     backgroundColor: "#275BBC",
//     paddingVertical: 12,
//     borderRadius: 50,
//     marginBottom: 16,
//     color: "white",
//     fontFamily: "Inter-SemiBold",
//     fontWeight: "600",
//     fontSize: 20,
//     textAlign: "center",
//   },
// });

// export default login;

// Using STATIC USERS
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
<<<<<<< HEAD
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { staticUsers, initializeData } from "../../data/users";
=======
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, useNavigation } from 'expo-router';
import 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation();
  const router = useRouter();

  // Initialize data when component mounts
  useEffect(() => {
    const setupInitialData = async () => {
      try {
        const existingUsers = await AsyncStorage.getItem("users");
        if (!existingUsers) {
          await initializeData();
        }
      } catch (error) {
        console.error("Error setting up initial data:", error);
      }
    };

    setupInitialData();
  }, []);

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
            Log In
          </Text>
        </View>
      ),
    });
  }, [nav]);

  const handleLogin = async () => {
    try {
<<<<<<< HEAD
      if (!email || !password) {
        Alert.alert("Error", "Please enter both email and password");
        return;
      }

      const storedUsers = await AsyncStorage.getItem("users");
      const users = storedUsers ? JSON.parse(storedUsers) : staticUsers;
=======
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026

      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
<<<<<<< HEAD
        // Store user data for the session
        await AsyncStorage.setItem("currentUser", JSON.stringify(user));
        await AsyncStorage.setItem("isLoggedIn", "true");

        // Clear input fields
        setEmail("");
        setPassword("");

        // Navigate to home screen
        router.push("/home");
      } else {
        Alert.alert(
          "Invalid Credentials",
          "Email or password is incorrect\n\nHint: Try these credentials:\nEmail: john@example.com\nPassword: password123"
        );
        setPassword("");
      }
    } catch (error) {
      console.error("Error during login:", error);
      Alert.alert("Error", "There was an issue with the login process");
=======
        await AsyncStorage.setItem('isLoggedIn', 'true');
        await AsyncStorage.setItem('loggedInUser', JSON.stringify(user)); // Store the entire user object
        console.log('stored the user in async');
        router.push('/home');
      } else {
        Alert.alert('Invalid Credentials', 'Email or password is incorrect');
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error reading data from AsyncStorage:', error);
      Alert.alert('Error', 'There was an issue with the login process');
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
    }
  };

  return (
    <View className='flex-1 justify-start p-6 bg-white'>
      <Text className='text-2xl font-ibold mt-5 mb-2 '>Email</Text>
      <View className='mb-7'>
        <TextInput
          placeholder='Enter your email'
          value={email}
          onChangeText={setEmail}
          style={styles.input}
<<<<<<< HEAD
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
=======
          autoCapitalize='none'
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
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
<<<<<<< HEAD
          autoCapitalize="none"
          autoComplete="password"
        />
      </View>

      <Text className="text-sm font-ibold mb-16">Forgot Password?</Text>

      <TouchableOpacity
        onPress={handleLogin}
        style={styles.button}
        activeOpacity={0.7}
      >
        <Text className="text-white text-center text-2xl font-ibold">
=======
          autoCapitalize='none'
        />
      </View>

      <Text className='text-sm font-ibold mb-16'>Forgot Password?</Text>

      {/* Log In Button */}
      <TouchableOpacity onPress={handleLogin} style={styles.button}>
        <Text className='text-white text-center text-2xl font-ibold'>
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
          Log In
        </Text>
      </TouchableOpacity>

<<<<<<< HEAD
      <TouchableOpacity
        onPress={() => router.replace("/signup")}
        activeOpacity={0.7}
      >
        <Text className="text-xl font-iregular text-center">
          Don't have an account? <Text className="font-ibold">Register</Text>
=======
      {/* Register Link */}
      <TouchableOpacity onPress={() => router.replace('/signup')}>
        <Text className='text-xl font-iregular text-center'>
          Don't have an account? <Text className='font-ibold'>Register</Text>
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
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

export default login;
