import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const CreateTask = () => {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState(new Date());
  const [taskTime, setTaskTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [taskPriority, setTaskPriority] = useState("High");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [subtasks, setSubtasks] = useState([
    { id: Date.now(), title: "", isComplete: false },
  ]);
  const [assignedUsers, setAssignedUsers] = useState([
    { id: 1, name: "Amy", avatar: "https://i.pravatar.cc/100?img=1" },
    { id: 2, name: "Jess", avatar: "https://i.pravatar.cc/100?img=2" },
  ]);

  // Extended platform options
  const platforms = [
    { id: "", name: "Select Platform" },
    { id: "figma", name: "Figma" },
    { id: "github", name: "GitHub" },
    { id: "vscode", name: "VS Code" },
    { id: "teams", name: "Microsoft Teams" },
    { id: "slack", name: "Slack" },
    { id: "notion", name: "Notion" },
    { id: "jira", name: "Jira" },
    { id: "custom", name: "Custom Platform" },
  ];

  // Subtask functions
  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: Date.now(), title: "", isComplete: false },
    ]);
  };

  const removeSubtask = (id) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((task) => task.id !== id));
    }
  };

  const updateSubtask = (id, title) => {
    setSubtasks(
      subtasks.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setTaskDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTaskTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleCreateTask = async () => {
    try {
      // Validation
      if (!taskTitle.trim()) {
        Alert.alert("Error", "Please enter a task title");
        return;
      }
      if (!selectedPlatform) {
        Alert.alert("Error", "Please select a platform");
        return;
      }
      // if (!subtasks[0].title.trim()) {
      //   Alert.alert("Error", "Please add at least one subtask");
      //   return;
      // }

      const currentUserData = await AsyncStorage.getItem("currentUser");
      if (!currentUserData) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      const currentUser = JSON.parse(currentUserData);

      // Filter out empty subtasks and ensure proper structure
      const filteredSubtasks = subtasks
        .filter((task) => task.title.trim())
        .map((task) => ({
          id: task.id,
          title: task.title.trim(),
          isComplete: false,
        }));

      // Calculate initial progress
      const progress = 0; // Start at 0%

      const newTask = {
        id: Date.now(),
        title: taskTitle,
        description: taskDescription,
        date: formatDate(taskDate),
        time: formatTime(taskTime),
        priority: taskPriority,
        platform: selectedPlatform,
        assignees: assignedUsers,
        subtasks: filteredSubtasks,
        isComplete: false,
        progress: progress,
        totalSubtasks: filteredSubtasks.length,
        completedSubtasks: 0,
      };

      if (!currentUser.projects || !currentUser.projects.length) {
        currentUser.projects = [
          {
            id: 1,
            projectName: "My Project",
            description: "Default project",
            tasks: [],
          },
        ];
      }

      currentUser.projects[0].tasks.push(newTask);

      await AsyncStorage.setItem("currentUser", JSON.stringify(currentUser));
      const usersData = await AsyncStorage.getItem("users");
      const users = JSON.parse(usersData);
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      await AsyncStorage.setItem("tasksLastUpdated", Date.now().toString());

      console.log("Task created successfully");
      router.back();
    } catch (error) {
      console.error("Error creating task:", error);
      Alert.alert("Error", "Failed to create task. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Task</Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Task title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
          numberOfLines={3}
        />

        <View style={styles.rowContainer}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{formatDate(taskDate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>{formatTime(taskTime)}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={taskDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={taskTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {["Low", "Medium", "High"].map((priority) => (
            <TouchableOpacity
              key={priority}
              style={[
                styles.priorityButton,
                taskPriority === priority && styles.priorityButtonActive,
              ]}
              onPress={() => setTaskPriority(priority)}
            >
              <Text
                style={[
                  styles.priorityText,
                  taskPriority === priority && styles.priorityTextActive,
                ]}
              >
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Platform</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedPlatform}
            onValueChange={(itemValue) => setSelectedPlatform(itemValue)}
            style={styles.picker}
          >
            {platforms.map((platform) => (
              <Picker.Item
                key={platform.id}
                label={platform.name}
                value={platform.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Subtasks</Text>
        {subtasks.map((subtask, index) => (
          <View key={subtask.id} style={styles.subtaskRow}>
            <TextInput
              style={[styles.input, styles.subtaskInput]}
              placeholder={`Subtask ${index + 1}`}
              value={subtask.title}
              onChangeText={(text) => updateSubtask(subtask.id, text)}
            />
            {subtasks.length > 1 && (
              <TouchableOpacity
                style={styles.removeSubtaskButton}
                onPress={() => removeSubtask(subtask.id)}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity style={styles.addSubtaskButton} onPress={addSubtask}>
          <Ionicons name="add-circle" size={24} color="#275BBC" />
          <Text style={styles.addSubtaskText}>Add subtask</Text>
        </TouchableOpacity>
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.createButtonText}>Create Task</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 40,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
    fontFamily: "pregular",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  pickerContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginBottom: 16,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#F5F5F5",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "#000000",
  },
  priorityText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "500",
  },
  priorityTextActive: {
    color: "#FFFFFF",
  },
  subtaskRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  subtaskInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  addSubtaskButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 16,
  },
  addSubtaskText: {
    marginLeft: 8,
    color: "#275BBC",
    fontSize: 16,
    fontWeight: "500",
  },
  createButton: {
    flexDirection: "row",
    backgroundColor: "#275BBC",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    fontFamily: "pregular",
  },
});

export default CreateTask;
