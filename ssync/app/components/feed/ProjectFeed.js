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
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);

  const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

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
        const currentUserString = await AsyncStorage.getItem('loggedInUser');
        if (!currentUserString) {
          setError('No logged-in user found.');
          return;
        }

        const currentUser = JSON.parse(currentUserString);
        setCurrentUser(currentUser);
        const selectedProjectCode = currentUser.selectedProject;

        // GET CURRENT PROJECT
        const selectedProject = currentUser.projects.find(
          (project) => project.id === selectedProjectCode
        );

        if (!selectedProject) {
          setError('Selected project not found.');
          return;
        }

        // Set selected project data to state
        setProject(selectedProject);

        const sortedPosts = selectedProject.posts.sort((a, b) => {
          return new Date(b.dateTime) - new Date(a.dateTime); // Sort in descending order
        });

        setPosts(sortedPosts);
      } catch (error) {
        setError('Error loading project data.');
        console.error(error);
      }
    };

    fetchProjectData();
  }, []);

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
    setIsAddPostModalVisible(!isAddPostModalVisible);
  };

  const toggleCodeSection = () => {
    setIsCodeExpanded(!isCodeExpanded);
  };

  const handleAddPost = async (newPost) => {
    if (!currentUser) {
      alert('Please log in first.');
      return;
    }

    const updatedProjects = currentUser.projects.map((project) => {
      if (project.id === currentUser.selectedProject) {
        return {
          ...project,
          posts: [newPost, ...project.posts], // Add post to the selected project
        };
      }
      return project;
    });

    const updatedPosts = [newPost, ...posts].sort(
      (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
    );

    setPosts(updatedPosts);
    try {
      await AsyncStorage.setItem(
        'users',
        JSON.stringify([
          {
            ...currentUser,
            projects: updatedProjects,
          },
        ])
      );

      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post to project:', error);
      alert('Error adding post.');
    }
  };

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!project) {
    return <Text>Loading project...</Text>;
  }

  const contentHeight = screenHeight - 80;

  return (
    <View className='bg-[#e7e6eb]'>
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView className='mt-12'>
          <TouchableOpacity
            className='absolute left-5 top-4 z-15'
            onPress={toggleMenu}>
            <Image
              source={require('../../../assets/icons/cross-black.png')} // Adjust the path as needed
              className='w-9 h-9'
            />
          </TouchableOpacity>
          <Text className='font-pregular text-3xl mt-24 text-center mb-5'>
            Select Project
          </Text>
          {currentUser.projects.map((proj, index) => {
            const backgroundColor = index % 2 === 0 ? '#E9E5FF' : '#B9E5FF';
            return (
              <TouchableOpacity
                key={proj.id}
                style={{ backgroundColor }}
                className='rounded-3xl mx-8 py-5 mb-5'
                onPress={() => {
                  // Handle navigation or project selection
                  console.log(`Navigating to project: ${proj.projectName}`);
                }}>
                <Text className='text-center text-xl font-psemibold'>
                  {proj.projectName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <View className='bg-white w-full pt-16 rounded-b-[30%]'>
        <TouchableOpacity
          className='absolute left-5 left-[30px] top-[55px]'
          onPress={toggleMenu}>
          <Image
            source={require('../../../assets/icons/hamburger-menu.png')} // Adjust the path as needed
            className='w-8 h-8'
          />
        </TouchableOpacity>

        <Text className='text-center text-4xl font-pregular mt-10'>
          {project.projectName}
        </Text>
        <Text className='text-center text-lg font-pextralight mb-3'>
          12 Oct 2024 - 5 Dec 2024
        </Text>
        <Text className='text-center text-xl font-iregular mb-5'>
          {project.description}
        </Text>
        <View className='flex-row justify-center mb-5'>
          <TouchableOpacity className='bg-[#8971C4] py-2 px-6 rounded-full mr-2'>
            <Text className='text-white text-rg font-psemibold'>Progress</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-[#8971C4] py-2 px-6 rounded-full ml-2'>
            <Text className='text-white text-rg font-psemibold'>Members</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          { height: contentHeight },
        ]}>
        {/* Main Feed Section */}
        <View className='w-full px-5 pt-5'>
          <View className='flex-row justify-between'>
            <TouchableOpacity
              className={`bg-[#275BBC] px-5 rounded-[10%] flex-row items-center ${
                isCodeExpanded ? 'mb-8' : 'mb-0'
              }`}
              onPress={toggleAddPostModal}>
              <Image
                source={require('../../../assets/icons/plus-circle-icon.png')}
                style={{ width: 20, height: 20 }}
              />
              <Text className='text-white text-rg font-ibold ml-2 py-3'>
                Add a post
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-5 rounded-[10%] ${
                isCodeExpanded ? 'bg-[#003387]' : 'bg-[#275BBC]'
              }`}
              onPress={toggleCodeSection}>
              <View className='flex-row items-center pt-[8px]'>
                <Text className='text-white text-rg font-ibold mr-2'>
                  Project Code
                </Text>
                <FontAwesome
                  name={isCodeExpanded ? 'caret-up' : 'caret-down'}
                  size={22}
                  color='#fff'
                />
              </View>
              {isCodeExpanded && (
                <View className='flex-row items-center'>
                  {/* Render the project code and QR code */}
                  <Text className='text-white font-semibold text-lg underline mr-3'>
                    {project.projectCode}
                  </Text>
                  <Image
                    source={require('../../../assets/icons/qr-code.png')}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className={`bg-white py-1 px-5 rounded-full flex-row items-center ${
                isCodeExpanded ? 'mb-8' : 'mb-0'
              }`}>
              <FontAwesome name='filter' size={20} color='#000' />
            </TouchableOpacity>
          </View>
        </View>
        <View className='w-full px-5 pt-5'>
          {posts === undefined || posts.length === 0 ? (
            <Text>No posts available.</Text>
          ) : (
            posts.map((post, index) => {
              const postDateFormatted = formattedDate(post.dateTime);

              return (
                <View
                  key={index}
                  className='py-4 px-5 bg-white rounded-2xl mb-3'>
                  <View className='flex-row items-start'>
                    {/* Profile picture */}
                    <Image
                      source={{ uri: post.profileIcon }}
                      className='w-11 h-11 rounded-full mr-3'
                    />

                    {/* Poster name and post title */}
                    <View>
                      <Text className='text-xs font-pregular'>
                        {post.posterName}
                      </Text>
                      <Text className='text-lg font-pregular'>
                        {post.postName}
                      </Text>
                    </View>

                    {/* Date/Time in top right corner */}
                    <Text className='text-xs text-gray-500 font-pregular absolute top-0 right-0'>
                      {postDateFormatted}
                    </Text>
                  </View>

                  {/* Post content */}
                  <Text className='mt-2 text-sm font-iregular'>
                    {post.content}
                  </Text>
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
    textAlign: 'center',
  },
  projectItem: {
    borderRadius: 10, // Rounded corners
    padding: 15,
    marginHorizontal: 15,
    marginVertical: 5,
  },
  menuItemText: {
    fontSize: 18,
  },
  // projectText: {
  //   fontSize: 16,
  //   fontWeight: '600',
  //   color: '#333',
  //   textAlign: 'center',
  // },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: '#e7e6eb',
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
