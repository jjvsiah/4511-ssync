import React, { useState, useEffect, useLayoutEffect } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateOrJoinProject from '../components/onboarding/CreateOrJoinProject';
import { useNavigation } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const cardWidth = width * 0.6; // 60% of screen width
const AVATARS = {
  avatar1: require('../../assets/images/avatar1.png'),
  avatar2: require('../../assets/images/avatar2.png'),
};

// const clearStorage = async () => {
//   try {
//     await AsyncStorage.clear();
//     Alert.alert('Success', 'Storage cleared!');
//     console.log('Storage cleared!');
//   } catch (e) {
//     Alert.alert('Error', 'Error clearing AsyncStorage');
//     console.error('Error clearing AsyncStorage', e);
//   }
// };

const ProjectCard = ({ project }) => {
  const router = useRouter();
  console.log('project1: ' + project);
  const backgroundColor = project.name.toLowerCase().includes('java')
    ? 'bg-[#E9E5FF]'
    : 'bg-[#B9E5FF]';

  const memberCount = project.members?.length || 1;

  const getAvatarImage = (index) => {
    return index === 0 ? AVATARS.avatar1 : AVATARS.avatar2;
  };

  return (
    <TouchableOpacity
      className={`${backgroundColor} p-4 rounded-xl mr-4`}
      style={{ width: cardWidth }}
      onPress={() => router.push(`/project/${project.id}`)}>
      <Text className='text-xl font-semibold mb-3'>{project.projectName}</Text>
      <View className='flex-row items-center mb-4'>
        <View className='flex-row'>
          {/* Show first two member avatars */}
          {[...Array(Math.min(2, memberCount))].map((_, index) => (
            <Image
              key={index}
              source={getAvatarImage(index)}
              className={`w-8 h-8 rounded-full border-2 border-white ${
                index > 0 ? '-ml-2' : ''
              }`}
            />
          ))}
          {/* Show additional members count */}
          {memberCount > 2 && (
            <View className='w-8 h-8 rounded-full bg-[#FFD700] items-center justify-center -ml-2 border-2 border-white'>
              <Text className='text-xs font-bold'>+{memberCount - 2}</Text>
            </View>
          )}
        </View>
      </View>
      <TouchableOpacity
        className='bg-[#275BBC] py-2.5 rounded-full items-center'
        onPress={() => router.push(`/project/${project.id}`)}>
        <Text className='text-white font-semibold'>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const CreateProjectModal = ({ visible, onClose, onCreateProject }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    setIsLoading(true);
    try {
      await onCreateProject({ projectName, description });
      setProjectName('');
      setDescription('');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create project');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 bg-black/50 justify-center items-center'>
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className='bg-white w-[85%] rounded-3xl p-6 shadow-xl'>
              <Text className='text-2xl font-bold text-center mb-6'>
                Create Project
              </Text>

              <View className='mb-4'>
                <Text className='text-base font-medium mb-2'>Name</Text>
                <TextInput
                  className='w-full h-12 px-4 rounded-xl border border-gray-200 text-base'
                  placeholder='Enter project name'
                  value={projectName}
                  onChangeText={setProjectName}
                  returnKeyType='next'
                  placeholderTextColor='#999'
                />
              </View>

              <View className='mb-6'>
                <Text className='text-base font-medium mb-2'>Description</Text>
                <TextInput
                  className='w-full h-24 px-4 py-3 rounded-xl border border-gray-200 text-base'
                  placeholder='Enter project description'
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  textAlignVertical='top'
                  returnKeyType='done'
                  placeholderTextColor='#999'
                  onSubmitEditing={Keyboard.dismiss}
                />
              </View>

              <TouchableOpacity
                className='bg-[#275BBC] w-full h-12 rounded-xl items-center justify-center'
                onPress={handleCreate}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color='white' />
                ) : (
                  <Text className='text-white text-base font-semibold'>
                    Create
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const loadProjects = async () => {
  try {
    const currentUserData = await AsyncStorage.getItem('currentUser');
    if (currentUserData) {
      const user = JSON.parse(currentUserData);
      setProjects(user.projects || []);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
    Alert.alert('Error', 'Failed to load projects');
  }
};

const handleCreateProject = async (newProject) => {
  try {
    const currentUserData = await AsyncStorage.getItem('currentUser');
    if (!currentUserData) throw new Error('No user logged in');

    const currentUser = JSON.parse(currentUserData);
    const projectToAdd = {
      ...newProject,
      id: Date.now().toString(),
      tasks: [],
      members: [{ id: currentUser.id, email: currentUser.email }],
    };

    // Update current user's projects
    const updatedUser = {
      ...currentUser,
      projects: [...(currentUser.projects || []), projectToAdd],
    };

    await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update projects in users array
    const usersData = await AsyncStorage.getItem('users');
    if (usersData) {
      const users = JSON.parse(usersData);
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? updatedUser : user
      );
      await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
    }

    setProjects(updatedUser.projects);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// if (isLoading) {
//   return (
//     <View className='flex-1 justify-center items-center bg-white'>
//       <ActivityIndicator size='large' color='#275BBC' />
//     </View>
//   );
// }

// export default home;

const home = () => {
  const [projects, setProjects] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem('currentUser');
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        // console.log('USER PROJECTS - ' + user.projects);
        setProjects(user.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    }
  };

  // Check for stored projects
  // useEffect(() => {
  //   const fetchProjects = async () => {
  //     try {
  //       const loggedInUser = await AsyncStorage.getItem('loggedInUser');
  //       if (!loggedInUser) return;

  //       const existingUsers = await AsyncStorage.getItem('users');
  //       const users = existingUsers ? JSON.parse(existingUsers) : [];
  //       const user = users.find((u) => u.email === loggedInUser);

  //       if (user && user.projects) {
  //         setProjects(user.projects); // Set projects of the logged-in user
  //       }
  //     } catch (error) {
  //       console.error('Error loading projects:', error);
  //     }
  //   };

  //   fetchProjects(); // Fetch projects when component mounts
  // }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View className='flex-1 justify-center items-center'>
      {/* <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button title='Clear AsyncStorage' onPress={clearStorage} />
      </View> */}
      {projects.length === 0 ? (
        // If projects then show the CreateOrJoinProject component
        <CreateOrJoinProject />
      ) : (
        // If projects then render calendar and projects view
        // <Text>Projects exist</Text>
        <SafeAreaView className='flex-1 bg-white'>
          <ScrollView
            className='flex-1 px-6'
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps='handled'>
            <View className='flex-row justify-between items-center mb-6 mt-4'>
              <Text className='text-3xl font-semibold'>Your Projects</Text>
              <TouchableOpacity
                className='bg-[#275BBC] w-10 h-10 rounded-full items-center justify-center'
                onPress={() => setModalVisible(true)}>
                <Ionicons name='add' size={24} color='white' />
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className='mb-8'>
              {projects.length > 0 ? (
                projects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))
              ) : (
                <View
                  className='justify-center items-center'
                  style={{ width: cardWidth }}>
                  <Text className='text-gray-500 text-center'>
                    No projects yet. Create one to get started!
                  </Text>
                </View>
              )}
            </ScrollView>

            <Text className='text-3xl font-semibold mb-4'>Calendar</Text>
            <Image
              source={require('../../assets/images/calendar.png')}
              className='w-[336] h-[306]'
              resizeMode='contain'
            />
          </ScrollView>

          <CreateProjectModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onCreateProject={handleCreateProject}
          />
        </SafeAreaView>
      )}
    </View>
  );
};

// export default Home;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   ScrollView,
//   Image,
//   Modal,
//   TextInput,
//   Alert,
//   Keyboard,
//   TouchableWithoutFeedback,
//   ActivityIndicator,
//   Dimensions,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import CreateOrJoinProject from "../components/onboarding/CreateOrJoinProject";
// import { useRouter, useNavigation } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";

// const { width } = Dimensions.get("window");
// const cardWidth = width * 0.6;
// const AVATARS = {
//   avatar1: require("../../assets/images/avatar1.png"),
//   avatar2: require("../../assets/images/avatar2.png"),
// };

// const ProjectCard = ({ project }) => {
//   const router = useRouter();
//   const backgroundColor = project.projectName.toLowerCase().includes("java")
//     ? "bg-[#E9E5FF]"
//     : "bg-[#B9E5FF]";

//   const memberCount = project.members?.length || 1;

//   const getAvatarImage = (index) => {
//     return index === 0 ? AVATARS.avatar1 : AVATARS.avatar2;
//   };

//   return (
//     <TouchableOpacity
//       className={`${backgroundColor} p-4 rounded-xl mr-4`}
//       style={{ width: cardWidth }}
//       onPress={() => router.push(`/project/${project.id}`)}
//     >
//       <Text className="text-xl font-semibold mb-3">{project.projectName}</Text>
//       <View className="flex-row items-center mb-4">
//         <View className="flex-row">
//           {[...Array(Math.min(2, memberCount))].map((_, index) => (
//             <Image
//               key={index}
//               source={getAvatarImage(index)}
//               className={`w-8 h-8 rounded-full border-2 border-white ${
//                 index > 0 ? "-ml-2" : ""
//               }`}
//             />
//           ))}
//           {memberCount > 2 && (
//             <View className="w-8 h-8 rounded-full bg-[#FFD700] items-center justify-center -ml-2 border-2 border-white">
//               <Text className="text-xs font-bold">+{memberCount - 2}</Text>
//             </View>
//           )}
//         </View>
//       </View>
//       <TouchableOpacity
//         className="bg-[#275BBC] py-2.5 rounded-full items-center"
//         onPress={() => router.push(`/project/${project.id}`)}
//       >
//         <Text className="text-white font-semibold">View</Text>
//       </TouchableOpacity>
//     </TouchableOpacity>
//   );
// };

// const CreateProjectModal = ({ visible, onClose, onCreateProject }) => {
//   const [projectName, setProjectName] = useState("");
//   const [description, setDescription] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleCreate = async () => {
//     if (!projectName.trim()) {
//       Alert.alert("Error", "Please enter a project name");
//       return;
//     }

//     setIsLoading(true);
//     try {
//       await onCreateProject({ projectName, description });
//       setProjectName("");
//       setDescription("");
//       onClose();
//     } catch (error) {
//       Alert.alert("Error", "Failed to create project");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal
//       visible={visible}
//       transparent
//       animationType="fade"
//       onRequestClose={onClose}
//     >
//       <TouchableWithoutFeedback onPress={onClose}>
//         <View className="flex-1 bg-black/50 justify-center items-center">
//           <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
//             <View className="bg-white w-[85%] rounded-3xl p-6 shadow-xl">
//               <Text className="text-2xl font-bold text-center mb-6">
//                 Create Project
//               </Text>

//               <View className="mb-4">
//                 <Text className="text-base font-medium mb-2">Name</Text>
//                 <TextInput
//                   className="w-full h-12 px-4 rounded-xl border border-gray-200 text-base"
//                   placeholder="Enter project name"
//                   value={projectName}
//                   onChangeText={setProjectName}
//                   returnKeyType="next"
//                   placeholderTextColor="#999"
//                 />
//               </View>

//               <View className="mb-6">
//                 <Text className="text-base font-medium mb-2">Description</Text>
//                 <TextInput
//                   className="w-full h-24 px-4 py-3 rounded-xl border border-gray-200 text-base"
//                   placeholder="Enter project description"
//                   value={description}
//                   onChangeText={setDescription}
//                   multiline
//                   textAlignVertical="top"
//                   returnKeyType="done"
//                   placeholderTextColor="#999"
//                   onSubmitEditing={Keyboard.dismiss}
//                 />
//               </View>

//               <TouchableOpacity
//                 className="bg-[#275BBC] w-full h-12 rounded-xl items-center justify-center"
//                 onPress={handleCreate}
//                 disabled={isLoading}
//               >
//                 {isLoading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text className="text-white text-base font-semibold">
//                     Create
//                   </Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           </TouchableWithoutFeedback>
//         </View>
//       </TouchableWithoutFeedback>
//     </Modal>
//   );
// };

// const Home = () => {
//   const [projects, setProjects] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isNewUser, setIsNewUser] = useState(false);
//   const navigation = useNavigation();
//   const router = useRouter();

//   useEffect(() => {
//     checkUserStatus();
//   }, []);

//   const checkUserStatus = async () => {
//     try {
//       const currentUserData = await AsyncStorage.getItem("currentUser");
//       const previousRoute = await AsyncStorage.getItem("previousRoute");

//       if (
//         previousRoute === "/signup" &&
//         (!currentUserData || !JSON.parse(currentUserData).projects?.length)
//       ) {
//         setIsNewUser(true);
//       }

//       if (currentUserData) {
//         const user = JSON.parse(currentUserData);
//         setProjects(user.projects || []);
//       }
//     } catch (error) {
//       console.error("Error checking user status:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCreateProject = async (newProject) => {
//     try {
//       const currentUserData = await AsyncStorage.getItem("currentUser");
//       if (!currentUserData) throw new Error("No user logged in");

//       const currentUser = JSON.parse(currentUserData);
//       const projectToAdd = {
//         ...newProject,
//         id: Date.now().toString(),
//         tasks: [],
//         members: [{ id: currentUser.id, email: currentUser.email }],
//       };

//       const updatedUser = {
//         ...currentUser,
//         projects: [...(currentUser.projects || []), projectToAdd],
//       };

//       await AsyncStorage.setItem("currentUser", JSON.stringify(updatedUser));

//       const usersData = await AsyncStorage.getItem("users");
//       if (usersData) {
//         const users = JSON.parse(usersData);
//         const updatedUsers = users.map((user) =>
//           user.id === currentUser.id ? updatedUser : user
//         );
//         await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
//       }

//       setProjects(updatedUser.projects);
//       setIsNewUser(false); // Hide CreateOrJoinProject after creating first project
//       await AsyncStorage.removeItem("previousRoute"); // Clear the previous route
//     } catch (error) {
//       console.error("Error creating project:", error);
//       throw error;
//     }
//   };

//   useEffect(() => {
//     navigation.setOptions({
//       headerShown: false,
//     });
//   }, [navigation]);

//   if (isLoading) {
//     return (
//       <View className="flex-1 justify-center items-center bg-white">
//         <ActivityIndicator size="large" color="#275BBC" />
//       </View>
//     );
//   }

//   if (isNewUser) {
//     return <CreateOrJoinProject onCreateProject={handleCreateProject} />;
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView
//         className="flex-1 px-6"
//         showsVerticalScrollIndicator={false}
//         keyboardShouldPersistTaps="handled"
//       >
//         <View className="flex-row justify-between items-center mb-6 mt-4">
//           <Text className="text-3xl font-semibold">Your Projects</Text>
//           <TouchableOpacity
//             className="bg-[#275BBC] w-10 h-10 rounded-full items-center justify-center"
//             onPress={() => setModalVisible(true)}
//           >
//             <Ionicons name="add" size={24} color="white" />
//           </TouchableOpacity>
//         </View>

//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           className="mb-8"
//         >
//           {projects.length > 0 ? (
//             projects.map((project) => (
//               <ProjectCard key={project.id} project={project} />
//             ))
//           ) : (
//             <View
//               className="justify-center items-center"
//               style={{ width: cardWidth }}
//             >
//               <Text className="text-gray-500 text-center">
//                 No projects yet. Create one to get started!
//               </Text>
//             </View>
//           )}
//         </ScrollView>

//         <Text className="text-3xl font-semibold mb-4">Calendar</Text>
//         <Image
//           source={require("../../assets/images/calendar.png")}
//           className="w-[336] h-[306]"
//           resizeMode="contain"
//         />
//       </ScrollView>

//       <CreateProjectModal
//         visible={modalVisible}
//         onClose={() => setModalVisible(false)}
//         onCreateProject={handleCreateProject}
//       />
//     </SafeAreaView>
//   );
// };

// export default Home;
// =======
// ----------

// const Home = () => {
//   const [projects, setProjects] = useState([]);
//   // const [modalVisible, setModalVisible] = useState(false);
//   // const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     loadProjects();
//   }, []);

//   return (
//   );
// };


