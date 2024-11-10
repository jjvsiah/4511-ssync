import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
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

  const handleCreateTask = () => {
    console.log("Task created:", {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
      priority: taskPriority,
      assignedUsers,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="black"
            onPress={() => router.back()}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Task</Text>
        <View style={styles.backButton} />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Task title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
        />

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

        <Text style={styles.label}>Subsection tasks</Text>
        <TextInput
          style={styles.input}
          placeholder="Add smaller achievable tasks"
        />

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
      </View>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateTask}>
        <Text>
          <Ionicons name="add" size={24} color="white" />
        </Text>
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
});

export default CreateTask;
