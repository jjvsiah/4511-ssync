import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Animated,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddPostModal from './AddPostModal';
import 'nativewind';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ProgressInfo from './ProgressInfo';
import ProjectMembers from './ProjectMembers';
import PostFilterModal from './PostFilterModal';
import Feed from './Feed';

const ProjectFeed = () => {
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isMembersVisible, setIsMembersVisible] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateOrder, setDateOrder] = useState('newToOld');
  const [timeFrame, setTimeFrame] = useState('allTime');
  const [isProgressVisible, setIsProgressVisible] = useState(false);

  const [isAddPostModalVisible, setIsAddPostModalVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(-250))[0];

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

        // Get current project
        const selectedProject = currentUser.projects.find(
          (project) => project.id === selectedProjectCode
        );

        if (!selectedProject) {
          setError('Selected project not found.');
          return;
        }

        // Set selected project data to state
        setProject(selectedProject);
        setPosts(selectedProject.posts);
      } catch (error) {
        setError('Error loading project data.');
        console.error(error);
      }
    };

    fetchProjectData();
  }, []);

  const changeSelectedProject = async (newProjectId) => {
    try {
      currentUser.selectedProject = newProjectId;

      // Save the updated users array back to AsyncStorage
      await AsyncStorage.setItem('loggedInUser', JSON.stringify(currentUser));
      setCurrentUser(currentUser);

      // Fetch the new selected project and update the project state
      const selectedProject = currentUser.projects.find(
        (project) => project.id === newProjectId
      );

      if (selectedProject) {
        setProject(selectedProject);
        setPosts(selectedProject.posts);
      }

      setSearchQuery('');
      setDateOrder('newToOld');
      setTimeFrame('allTime');
    } catch (error) {
      console.error('Error changing selected project:', error);
    }
  };

  const toggleMenu = () => {
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

  const toggleMembersVisibility = () => {
    setIsMembersVisible(!isMembersVisible);

    if (!isMembersVisible) {
      setIsProgressVisible(false); // Ensure progress section is hidden when members is shown
    }
  };

  const toggleProgressVisibility = () => {
    setIsProgressVisible(!isProgressVisible);
    if (!isProgressVisible) {
      setIsMembersVisible(false); // Ensure members section is hidden when progress is shown
    }
  };

  const toggleFilterModal = () => {
    setIsFilterModalVisible((prev) => !prev);
  };

  const handleApplyFilter = () => {
    toggleFilterModal();
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

    const updatedPosts = [newPost, ...posts];

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

  return (
    <View>
      <Animated.View
        style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}
        className='shadow-lg'>
        <ScrollView>
          <TouchableOpacity
            className='absolute left-5 top-16 h-full z-15'
            onPress={toggleMenu}>
            <Image
              source={require('../../../assets/icons/cross-black.png')}
              className='w-9 h-9'
            />
          </TouchableOpacity>
          <Text className='font-pregular text-3xl mt-28 text-center mb-5'>
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
                  changeSelectedProject(proj.id);
                  toggleMenu();
                }}>
                <Text className='text-center text-lg font-psemibold'>
                  {proj.projectName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>

      <SafeAreaView className='h-full bg-white'>
        <View className='bg-[#e7e6eb] h-[100%]'>
          <View className='bg-white w-full rounded-b-[30%]'>
            <TouchableOpacity className='absolute left-6' onPress={toggleMenu}>
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

            <View className='flex-row justify-center mb-8'>
              <TouchableOpacity
                className={`py-2 px-6 rounded-full mr-2 ${
                  isProgressVisible ? 'bg-[#280384]' : 'bg-[#8971C4]'
                }`}
                onPress={toggleProgressVisibility}>
                <Text className='text-white text-rg font-psemibold'>
                  Progress
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className={`py-2 px-6 rounded-full ml-2 ${
                  isMembersVisible ? 'bg-[#280384]' : 'bg-[#8971C4] '
                }`}
                onPress={toggleMembersVisibility}>
                <Text className='text-white text-rg font-psemibold'>
                  Members
                </Text>
              </TouchableOpacity>
            </View>

            {/* Progress Section */}
            {isProgressVisible && <ProgressInfo />}

            {/* Members Section */}
            {isMembersVisible && <ProjectMembers project={project} />}
          </View>

          <ScrollView>
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
                  className={`${
                    dateOrder !== 'newToOld' ||
                    timeFrame !== 'allTime' ||
                    searchQuery !== ''
                      ? 'bg-[#013387]' // Change to dark blue if filters are applied
                      : 'bg-[#275bbc]' // Default color
                  } py-1 px-5 rounded-full flex-row items-center ${
                    isCodeExpanded ? 'mb-8' : 'mb-0'
                  }`}
                  onPress={toggleFilterModal}>
                  <FontAwesome name='filter' size={20} color='#fff' />
                </TouchableOpacity>
              </View>
            </View>
            <View className='w-full px-5 pt-5'>
              {posts && (
                <Feed
                  posts={posts}
                  searchQuery={searchQuery}
                  dateOrder={dateOrder}
                  timeFrame={timeFrame}
                />
              )}
            </View>
          </ScrollView>

          {isAddPostModalVisible && (
            <AddPostModal
              isVisible={isAddPostModalVisible}
              onClose={toggleAddPostModal}
              onAddPost={handleAddPost}
              className='h-full'
            />
          )}

          {isFilterModalVisible && (
            <PostFilterModal
              visible={isFilterModalVisible}
              onClose={toggleFilterModal} // Pass the toggler to close the modal
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateOrder={dateOrder}
              setDateOrder={setDateOrder}
              timeFrame={timeFrame}
              setTimeFrame={setTimeFrame}
              onApplyFilter={handleApplyFilter}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ProjectFeed;
