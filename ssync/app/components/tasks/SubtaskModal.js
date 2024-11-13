import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SubtaskModal = ({ visible, onClose, task, onTaskUpdate }) => {
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [markComplete, setMarkComplete] = useState(false);

  const handleCheckboxToggle = async (subtaskId) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, isComplete: !subtask.isComplete }
        : subtask
    );
    setSubtasks(updatedSubtasks);
  };

  const handleConfirm = async () => {
    try {
      const currentUserData = await AsyncStorage.getItem("currentUser");
      if (!currentUserData) return;

      const currentUser = JSON.parse(currentUserData);

      // Find and update the task
      currentUser.projects = currentUser.projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((t) => {
          if (t.id === task.id) {
            return {
              ...t,
              subtasks: subtasks,
              isComplete: markComplete, // Only mark complete if checkbox is checked
              progress:
                (subtasks.filter((st) => st.isComplete).length /
                  subtasks.length) *
                100,
            };
          }
          return t;
        }),
      }));

      await AsyncStorage.setItem("currentUser", JSON.stringify(currentUser));

      const usersData = await AsyncStorage.getItem("users");
      const users = JSON.parse(usersData);
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

      if (onTaskUpdate) {
        onTaskUpdate();
      }

      onClose();
    } catch (error) {
      console.error("Error updating subtasks:", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>Subtasks</Text>
              <View style={styles.editButton}>
                <Text style={styles.editButtonText}>Edit</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.subtasksList}>
            {subtasks.map((subtask, index) => (
              <TouchableOpacity
                key={subtask.id}
                style={styles.subtaskItem}
                onPress={() => handleCheckboxToggle(subtask.id)}
              >
                <View style={styles.checkboxContainer}>
                  <View
                    style={[
                      styles.checkbox,
                      subtask.isComplete && styles.checkboxChecked,
                    ]}
                  >
                    {subtask.isComplete && (
                      <Ionicons
                        name="checkmark-sharp"
                        size={14}
                        color="white"
                      />
                    )}
                  </View>
                  <Text style={styles.subtaskText}>{subtask.title}</Text>
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={styles.markCompleteItem}
              onPress={() => setMarkComplete(!markComplete)}
            >
              <View style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    markComplete && styles.checkboxChecked,
                  ]}
                >
                  {markComplete && (
                    <Ionicons name="checkmark-sharp" size={14} color="white" />
                  )}
                </View>
                <Text style={styles.subtaskText}>Mark as complete</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: "#E5F1FF",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  editButtonText: {
    color: "#275BBC",
    fontSize: 14,
    fontWeight: "500",
  },
  subtasksList: {
    marginBottom: 20,
  },
  subtaskItem: {
    paddingVertical: 12,
  },
  markCompleteItem: {
    paddingVertical: 12,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#275BBC",
    borderColor: "#275BBC",
  },
  subtaskText: {
    fontSize: 16,
    color: "#1F2937",
  },
  confirmButton: {
    backgroundColor: "#275BBC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SubtaskModal;
