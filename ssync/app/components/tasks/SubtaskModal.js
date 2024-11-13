import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

const SubtaskModal = ({ visible, onClose, task, onUpdateTask }) => {
  const handleSubtaskToggle = (subtaskId) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, isComplete: !subtask.isComplete }
        : subtask
    );

    const progress =
      (updatedSubtasks.filter((st) => st.isComplete).length /
        updatedSubtasks.length) *
      100;

    onUpdateTask({
      ...task,
      subtasks: updatedSubtasks,
      progress,
    });
  };

  const handleMarkComplete = () => {
    onUpdateTask({
      ...task,
      isComplete: true,
      progress: 100,
      subtasks: task.subtasks.map((st) => ({ ...st, isComplete: true })),
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Subtasks</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.subtaskList}>
            {task?.subtasks.map((subtask) => (
              <TouchableOpacity
                key={subtask.id}
                style={styles.subtaskItem}
                onPress={() => handleSubtaskToggle(subtask.id)}
              >
                <Ionicons
                  name={subtask.isComplete ? "checkbox" : "square-outline"}
                  size={24}
                  color="#275BBC"
                />
                <Text style={styles.subtaskText}>{subtask.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.completeButton}
            onPress={handleMarkComplete}
          >
            <Text style={styles.completeButtonText}>Mark as complete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export { SubtaskModal };

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  subtaskList: {
    maxHeight: "70%",
  },
  subtaskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  subtaskText: {
    marginLeft: 12,
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: "#275BBC",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  completeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
