import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  Dimensions,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import TaskModal from '../components/tasks/TaskModal';
import FilterModal from '../components/tasks/FilterModal';
import TaskItem from '../components/tasks/TaskItem';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Tasks = () => {
  const [activeButton, setActiveButton] = useState('todo');
  const [modalVisible, setModalVisible] = useState(false);
  const [rawTasks, setRawTasks] = useState([]); // Store unfiltered tasks
  const [displayedTasks, setDisplayedTasks] = useState([]); // Store filtered tasks
  const [currentUser, setCurrentUser] = useState(null);
  const slideAnim = useState(new Animated.Value(-250))[0];
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterSettings, setFilterSettings] = useState({
    dateOrder: '',
    priorityOrder: '',
    assignedToMe: false,
  });

  // Apply filters to tasks
  const applyFilters = async (tasks) => {
    let filteredTasks = [...tasks];

    // Filter by assignment
    if (filterSettings.assignedToMe) {
      const currentUserEmail = await AsyncStorage.getItem('loggedInUser');
      // TODO: CHECK THIS
      filteredTasks = filteredTasks.filter((task) =>
        task.assignees.some((assignee) => assignee.email === currentUserEmail)
      );
    }

    // Sort by date
    if (filterSettings.dateOrder) {
      filteredTasks.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return filterSettings.dateOrder === 'newToOld'
          ? dateB - dateA
          : dateA - dateB;
      });
    }

    // Sort by priority
    if (filterSettings.priorityOrder) {
      const priorityValues = {
        High: 3,
        Medium: 2,
        Low: 1,
      };

      filteredTasks.sort((a, b) => {
        const priorityA = priorityValues[a.priority] || 0;
        const priorityB = priorityValues[b.priority] || 0;
        return filterSettings.priorityOrder === 'highToLow'
          ? priorityB - priorityA
          : priorityA - priorityB;
      });
    }

    const renderContent = () => {
      if (displayedTasks.length === 0) {
        return renderEmptyState();
      }

      return displayedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdate={() => setRefreshKey((oldKey) => oldKey + 1)}
        />
      ));
    };
    return filteredTasks;
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
        // setProject(selectedProject);
      } catch (error) {
        setError('Error loading project data.');
        console.error(error);
      }
    };

    fetchProjectData();
  }, []);

  const buttons = [
    { id: 'complete', label: 'COMPLETE' },
    { id: 'todo', label: 'TO DO' },
  ];

  // Load tasks when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadUserTasks();
    }, [activeButton, refreshKey])
  );

  // Load and filter tasks
  const loadUserTasks = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem('loggedInUser');
      if (currentUserData) {
        const user = JSON.parse(currentUserData);
        // setCurrentUser(user);

        if (!user.projects || user.projects.length === 0) {
          setRawTasks([]);
          setDisplayedTasks([]);
          return;
        }

        const selectedProjectCode = user.selectedProject;

        const selectedProject = user.projects.find(
          (project) => project.id === selectedProjectCode
        );

        if (!selectedProject || !selectedProject.tasks) {
          setRawTasks([]);
          setDisplayedTasks([]);
          return;
        }

        // Get all tasks from the selected project
        const allTasks = selectedProject.tasks;

        let filteredItems;
        filteredItems = allTasks.filter((item) => {
          return activeButton === 'complete'
            ? item.isComplete
            : !item.isComplete;
        });

        if (filteredItems.length > 0) {
          filteredItems = await applyFilters(filteredItems);
        }

        // Filter based on active button (complete/todo)
        const buttonFilteredTasks = allTasks.filter((task) => {
          if (activeButton === 'complete') return task.isComplete;
          if (activeButton === 'todo') return !task.isComplete;
          return false;
        });

        setRawTasks(buttonFilteredTasks);

        // Apply additional filters
        const filteredTasks = await applyFilters(buttonFilteredTasks);
        setDisplayedTasks(filteredTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      setRawTasks([]);
      setDisplayedTasks([]);
    }
  };

  // Load tasks when screen comes into focus or filters change
  useFocusEffect(
    React.useCallback(() => {
      loadUserTasks();
    }, [activeButton, refreshKey, filterSettings]) // Added filterSettings as dependency
  );

  const handleFilterApply = async (filters) => {
    setFilterSettings(filters);
    const filteredTasks = await applyFilters(rawTasks);
    setDisplayedTasks(filteredTasks);
  };

  const getButtonStyle = (buttonId) => {
    return activeButton === buttonId
      ? 'w-1/3 mt-4 bg-blue-500 p-3 rounded-full'
      : 'w-1/3 mt-4 p-3';
  };

  const getTextStyle = (buttonId) => {
    return activeButton === buttonId
      ? 'text-white text-center font-psemibold'
      : 'text-gray-500 text-center font-psemibold';
  };

  const onNewTaskPress = () => {
    router.push('/create-task');
    setModalVisible(false);
  };

  const onNewMeetingPress = () => {
    router.push('/ScheduleMeeting');
    setModalVisible(false);
  };

  // Add empty state
  const renderEmptyState = () => (
    <View className='flex-1 justify-center items-center p-8'>
      <Text className='text-gray-500 text-center text-lg mb-4'>
        No tasks found. Create a new task to get started!
      </Text>
    </View>
  );

  return (
    <SafeAreaView className='bg-white h-full'>
      <View className='flex-row justify-between items-center px-8 pt-4'>
        <Text className='font-pregular text-3xl text-center flex-1'>Tasks</Text>
        <TouchableOpacity
          className='object-right'
          onPress={() => setModalVisible(true)}>
          <Image source={require('../../assets/images/AddTask.png')} />
        </TouchableOpacity>
      </View>

      <View className='flex-row px-6 pt-2'>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            className={getButtonStyle(button.id)}
            onPress={() => setActiveButton(button.id)}>
            <Text className={getTextStyle(button.id)}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        className='bg-[#8EC9E6] p-2 rounded-full items-center w-1/5 ml-4'
        onPress={() => setFilterModalVisible(true)}>
        <Ionicons name='filter' size={24} color='black' />
      </TouchableOpacity>

      <ScrollView className='px-4 pt-4'>
        {displayedTasks.length > 0
          ? displayedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={() => {
                  // Trigger a refresh when a task is updated
                  setRefreshKey((oldKey) => oldKey + 1);
                }}
              />
            ))
          : renderEmptyState()}
      </ScrollView>
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilter={handleFilterApply}
      />

      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onNewTaskPress={onNewTaskPress}
        onNewMeetingPress={onNewMeetingPress}
      />
    </SafeAreaView>
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

export default Tasks;
