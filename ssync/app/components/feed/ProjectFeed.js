import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPostModal from './AddPostModal';
import 'nativewind';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
const { height: screenHeight } = Dimensions.get('window');

const ProjectFeed = () => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
  const [loggedInUserEmail, setLoggedInUserEmail] = useState(null);
  const slideAnim = useState(new Animated.Value(-250))[0];

  const getUserNameByEmail = async (email) => {
    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
      const user = parsedUsers.find((u) => u.email === email);
      console.log(users);
      console.log('email ' + email.email);
      return user ? user.name : 'Unknown User';
    } catch (error) {
      console.error('Error fetching user data:', error);
      return 'Unknown User';
    }
  };

  const formattedDate = (timestamp) => {
    const postDate = new Date(timestamp);
    const day = postDate.getDate();
    const month = postDate.getMonth() + 1;
    const year = postDate.getFullYear();
    let hours = postDate.getHours();
    const minutes = postDate.getMinutes().toString().padStart(2, '0');
    const isPM = hours >= 12;
    hours = hours % 12 || 12;
    const ampm = isPM ? 'PM' : 'AM';

    return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        // Fetch the logged-in user from AsyncStorage
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        if (!loggedInUser) {
          setError('No logged-in user found.');
          return;
        }

        // Fetch all users from AsyncStorage
        const existingUsers = await AsyncStorage.getItem('users');
        const users = existingUsers ? JSON.parse(existingUsers) : [];

        // Find the user by email
        const user = users.find((u) => u.email === loggedInUser);
        if (!user) {
          setError('User not found.');
          return;
        }

        setLoggedInUserEmail(user);

        // Fetch all projects from AsyncStorage
        const existingProjects = await AsyncStorage.getItem('projects');
        const projects = existingProjects ? JSON.parse(existingProjects) : [];

        setProjectsList(projects);

        // Find the selected project code from the user data
        const selectedProjectCode = user.selectedProject;

        // Find the project that matches the selected project code
        const selectedProject = projects.find(
          (project) => project.id === selectedProjectCode
        );

        if (!selectedProject) {
          setError('Selected project not found.');
          return;
        }

        // Set selected project data to state
        setProject(selectedProject);
      } catch (error) {
        setError('Error loading project data.');
        console.error(error);
      }
    };

    fetchProjectData();
  }, []);

  useEffect(() => {
    const fetchUserNamesForPosts = async () => {
      try {
        const usersData = await AsyncStorage.getItem('users');
        const users = usersData ? JSON.parse(usersData) : [];

        const postsWithUserNames = await Promise.all(
          posts.map(async (post) => {
            const user = users.find((u) => u.email === post.userEmail);
            const userName = user ? user.name : 'Unknown User';
            return { ...post, userName };
          })
        );

        setPosts(postsWithUserNames);
      } catch (error) {
        console.error('Error fetching usernames for posts:', error);
      }
    };

    if (posts && posts.length > 0) {
      fetchUserNamesForPosts();
    }
  }, [posts]);

  const handleAddPostToProject = async (newPost) => {
    try {
      const existingProjects = await AsyncStorage.getItem('projects');
      const projects = existingProjects ? JSON.parse(existingProjects) : [];

      const updatedProjects = projects.map((selectedProject) => {
        if (selectedProject.id === project.id) {
          const updatedPosts = [...selectedProject.posts, newPost];
          return { ...selectedProject, posts: updatedPosts };
        }
        return selectedProject;
      });

      await AsyncStorage.setItem('projects', JSON.stringify(updatedProjects));
      setPosts((prevPosts) => [...prevPosts, newPost]);

      console.log('hereee');
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post to project:', error);
      alert('Error adding post.');
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Access posts for the current project.id
        const projectPosts = project[posts] || [];
        console.log(project);

        // Set the posts for the current project
        setPosts(projectPosts);
        // setLoadingPosts(false);
      } catch (error) {
        setError('Error loading posts.');
        console.error(error);
      }
    };

    // Only fetch posts if project and project.id exist
    if (project && project.id) {
      fetchPosts();
    }
  }, [project]);

  const toggleMenu = () => {
    console.log('pressing');
    setIsMenuOpen(!isMenuOpen);

    Animated.timing(slideAnim, {
      toValue: isMenuOpen ? -250 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const toggleAddPostModal = () => {
    // console.log('TOGGLING!!');
    setIsAddPostModalVisible(!isAddPostModalVisible);
    console.log(isAddPostModalVisible);
  };

  const handleAddPost = async (newPost) => {
    if (!loggedInUserEmail) {
      alert('Please log in first.');
      return;
    }

    const userName = await getUserNameByEmail(loggedInUserEmail);
    // console.log('username: ' + userName.name);

    const postWithUserDetails = {
      ...newPost,
      userEmail: loggedInUserEmail,
      userName, // Add the user name to the new post
    };

    handleAddPostToProject(postWithUserDetails);
    toggleAddPostModal();
  };

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!project) {
    return <Text>Loading project...</Text>;
  }

  const contentHeight = screenHeight - 80;

  return (
    <View style={styles.sidebarContainer}>
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView style={styles.menuItems}>
          <TouchableOpacity style={styles.closeButton} onPress={toggleMenu}>
            <FontAwesome name='close' size={30} color='#000' />
          </TouchableOpacity>
          <Text style={styles.menuTitle}>Your Projects</Text>
          {projectsList.map((proj) => (
            <TouchableOpacity
              key={proj.id}
              style={styles.menuItem}
              onPress={() => {
                // Handle navigation or project selection
                console.log(`Navigating to project: ${proj.name}`);
              }}>
              <Text style={styles.menuItemText}>{proj.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      <View className='bg-white w-full pt-16 rounded-b-[30%]'>
        <TouchableOpacity
          className='absolute left-10 left-[30px] top-[60px]'
          onPress={toggleMenu}>
          <FontAwesome name='bars' size={30} color='#000' />
        </TouchableOpacity>

        <Text className='text-center text-4xl font-pregular mt-10'>
          {project.name}
        </Text>
        <Text className='text-center text-lg font-pextralight mb-3'>
          12 Oct 2024 - 5 Dec 2024
        </Text>
        <Text className='text-center text-xl font-iregular mb-5'>
          {project.description}
        </Text>
        <View className='flex-row justify-center mb-5'>
          <TouchableOpacity className='bg-[#8971C4] py-2 px-6 rounded-full mr-2'>
            <Text className='text-white text-lg font-psemibold'>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-[#8971C4] py-2 px-6 rounded-full ml-2'>
            <Text className='text-white text-lg font-psemibold'>Members</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={
          ([styles.contentContainer], { height: contentHeight })
        }>
        {/* Main Feed Section */}
        <View className='w-full px-5 pt-5'>
          <View className='flex-row justify-between'>
            <TouchableOpacity
              className='bg-[#275BBC] px-5 rounded-[10%] flex-row items-center'
              onPress={toggleAddPostModal}>
              <Image
                source={require('../../../assets/icons/plus-circle-icon.png')}
                style={{ width: 20, height: 20 }}
              />
              <Text className='text-white text-lg font-ibold ml-2'>
                Add a post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className='bg-[#275BBC] px-5 rounded-[10%] flex-row items-center'>
              <Text className='text-white text-lg font-ibold mr-2 '>
                Project Code
              </Text>
              <FontAwesome name='caret-down' size={22} color='#fff' />
            </TouchableOpacity>

            <TouchableOpacity className='bg-white py-1 px-5 rounded-full flex-row items-center mb-5'>
              <FontAwesome name='filter' size={20} color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <View className='w-full px-5 pt-5'>
          {posts === undefined || posts.length === 0 ? (
            <Text>No posts available.</Text>
          ) : (
            posts.map((post, index) => {
              const userName = post.userName; // Replace with actual user name fetching logic

              const postDateFormatted = formattedDate(post.timestamp);

              return (
                <View key={index} style={{ padding: 10, borderBottomWidth: 1 }}>
                  <View>
                    <Text>{userName}</Text>
                    <Text>{postDateFormatted}</Text>
                  </View>
                  <Text>{post.title}</Text>
                  <Text>{post.body}</Text>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {isAddPostModalVisible && (
        <AddPostModal
          isVisible={isAddPostModalVisible}
          onClose={toggleAddPostModal}
          onAddPost={handleAddPost}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
    backgroundColor: '#e7e6eb',
  },
  menu: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: 250,
    backgroundColor: '#fff',
    zIndex: 10,
    elevation: 10,
  },
  menuItems: {
    marginTop: 50,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    paddingTop: 60,
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  menuItemText: {
    fontSize: 18,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: 'red',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 15,
  },
  postCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: '#888',
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postBody: {
    fontSize: 14,
    color: '#333',
  },
});

export default ProjectFeed;
