import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const CreateTask = () => {
  const router = useRouter();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("08:00");
  const [taskPriority, setTaskPriority] = useState("High");
  const [assignedUsers, setAssignedUsers] = useState([
    { id: 1, name: "Amy", avatar: "https://i.pravatar.cc/100?img=1" },
    { id: 2, name: "Jess", avatar: "https://i.pravatar.cc/100?img=2" },
  ]);

  // New state for platform and subtasks
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformModalVisible, setPlatformModalVisible] = useState(false);
  const [subtasks, setSubtasks] = useState([{ id: Date.now(), title: "" }]);

  // Platform options with icons
  const platforms = [
    { id: "figma", name: "Figma", icon: "logo-figma" },
    { id: "vscode", name: "VS Code", icon: "code-slash" },
    { id: "github", name: "GitHub", icon: "logo-github" },
    { id: "excel", name: "Excel", icon: "document" },
    { id: "teams", name: "Teams", icon: "people" },
  ];

  // Handle adding new subtask
  const addSubtask = () => {
    setSubtasks([...subtasks, { id: Date.now(), title: "" }]);
  };

  // Handle updating subtask
  const updateSubtask = (id, title) => {
    setSubtasks(
      subtasks.map((task) => (task.id === id ? { ...task, title } : task))
    );
  };

  // Handle removing subtask
  const removeSubtask = (id) => {
    if (subtasks.length > 1) {
      setSubtasks(subtasks.filter((task) => task.id !== id));
    }
  };

  const handleCreateTask = () => {
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
      priority: taskPriority,
      platform: selectedPlatform,
      assignedUsers,
      subtasks: subtasks.filter((task) => task.title.trim() !== ""),
      isComplete: false,
      progress: 0,
    };

    // Here you would add the task to your tasks list
    console.log("Task created:", newTask);
    router.back();
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
        {/* Platform Selection */}
        <Text style={styles.label}>Platform</Text>
        <TouchableOpacity
          style={styles.platformSelector}
          onPress={() => setPlatformModalVisible(true)}
        >
          {selectedPlatform ? (
            <View style={styles.selectedPlatform}>
              <Ionicons
                name={platforms.find((p) => p.id === selectedPlatform)?.icon}
                size={24}
                color="#275BBC"
              />
              <Text style={styles.selectedPlatformText}>
                {platforms.find((p) => p.id === selectedPlatform)?.name}
              </Text>
            </View>
          ) : (
            <Text style={styles.placeholderText}>Select platform</Text>
          )}
          <Ionicons name="chevron-down" size={24} color="#666" />
        </TouchableOpacity>

        {/* Existing fields */}
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
          numberOfLines={4}
        />

        {/* Priority*/}
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
                  styles.priorityButtonText,
                  taskPriority === priority && styles.priorityButtonTextActive,
                ]}
              >
                {priority}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date */}
        <View style={styles.dateTimeContainer}>
          <View style={styles.dateContainer}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={taskDate}
              onChangeText={setTaskDate}
            />
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="08:00"
              value={taskTime}
              onChangeText={setTaskTime}
            />
          </View>
        </View>

        {/* Subtasks Section */}
        <Text style={styles.label}>Subtasks</Text>
        {subtasks.map((subtask, index) => (
          <View key={subtask.id} style={styles.subtaskRow}>
            <TextInput
              style={[styles.input, styles.subtaskInput]}
              placeholder={`Subtask ${index + 1}`}
              value={subtask.title}
              onChangeText={(text) => updateSubtask(subtask.id, text)}
            />
            <TouchableOpacity
              style={styles.removeSubtaskButton}
              onPress={() => removeSubtask(subtask.id)}
            >
              <Ionicons name="close-circle" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={styles.addSubtaskButton} onPress={addSubtask}>
          <Ionicons name="add-circle" size={24} color="#275BBC" />
          <Text style={styles.addSubtaskText}>Add subtask</Text>
        </TouchableOpacity>

        {/* Rest of your existing fields */}
        {/* ... */}
      </ScrollView>

      {/* Platform Selection Modal */}
      <Modal
        visible={platformModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPlatformModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Platform</Text>
              <TouchableOpacity onPress={() => setPlatformModalVisible(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            {platforms.map((platform) => (
              <TouchableOpacity
                key={platform.id}
                style={styles.platformOption}
                onPress={() => {
                  setSelectedPlatform(platform.id);
                  setPlatformModalVisible(false);
                }}
              >
                <Ionicons name={platform.icon} size={24} color="#275BBC" />
                <Text style={styles.platformOptionText}>{platform.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Assignee  */}
      <Text style={styles.label}>Assign to:</Text>
      <View style={styles.assigneeContainer}>
        {assignedUsers.map((user) => (
          <View key={user.id} style={styles.assigneeChip}>
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            <Text style={styles.assigneeName}>{user.name}</Text>
            <TouchableOpacity style={styles.removeButton}>
              <Text>
                <Ionicons name="close" size={20} color="#666" />
              </Text>
            </TouchableOpacity>
          </View>
        ))}
        <TouchableOpacity style={styles.addAssigneeButton}>
          <Text>
            <Ionicons name="add" size={24} color="#4B6BF6" />
          </Text>
        </TouchableOpacity>
      </View>

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
  dateTimeContainer: {
    flexDirection: "row",
    gap: 16,
  },
  dateContainer: {
    flex: 1,
  },
  timeContainer: {
    flex: 1,
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "#000",
  },
  priorityButtonText: {
    color: "#666",
    fontWeight: "500",
  },
  priorityButtonTextActive: {
    color: "white",
  },
  assigneeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  assigneeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  assigneeName: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#333",
  },
  removeButton: {
    padding: 2,
  },
  addAssigneeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
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
  bottomNav: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },

  // New styles for platform selection and subtasks
  platformSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  selectedPlatform: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedPlatformText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  placeholderText: {
    color: "#666",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  platformOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: "#F5F5F5",
  },
  platformOptionText: {
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
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
  removeSubtaskButton: {
    padding: 4,
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
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
});

export default CreateTask;
