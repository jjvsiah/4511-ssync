import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SubtaskModal from "./SubtaskModal";

const AVATARS = {
  avatar1: require("../../../assets/images/avatar1.png"),
  avatar2: require("../../../assets/images/avatar2.png"),
};

const TaskItem = ({ task, onUpdate }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleTaskUpdate = () => {
    if (onUpdate) {
      onUpdate();
    }
  };

  const getPriorityStyle = (priority) => {
    const priorityValue = (priority || "medium").toLowerCase();

    switch (priorityValue) {
      case "high":
        return { backgroundColor: "#FFE4E4", color: "#FF4444" };
      case "medium":
        return { backgroundColor: "#E3F5E1", color: "#4CAF50" };
      case "low":
        return { backgroundColor: "#FFF4E4", color: "#FFA500" };
      default:
        return { backgroundColor: "#E3F5E1", color: "#4CAF50" };
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "figma":
        return <Ionicons name="logo-figma" size={20} color="#000" />;
      case "github":
        return <Ionicons name="logo-github" size={20} color="#000" />;
      case "teams":
        return <Ionicons name="people" size={20} color="#000" />;
      default:
        return <Ionicons name="apps" size={20} color="#000" />;
    }
  };

  const renderProgressBar = () => {
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;

    if (!hasSubtasks) {
      return (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: task.isComplete ? "100%" : "66%" },
              ]}
            />
          </View>
          <Text style={styles.progressText}>Progress</Text>
        </View>
      );
    }

    const completedSubtasks = task.subtasks.filter(
      (st) => st.isComplete
    ).length;
    const totalSubtasks = task.subtasks.length;

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          {[...Array(totalSubtasks)].map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  flex: 1,
                  marginRight: index === totalSubtasks - 1 ? 0 : 2,
                  backgroundColor:
                    index < completedSubtasks ? "#000" : "#E5E7EB",
                },
              ]}
            />
          ))}
        </View>
        <Text style={styles.progressText}>
          Progress{" "}
          {completedSubtasks > 0 && `(${completedSubtasks}/${totalSubtasks})`}
        </Text>
      </View>
    );
  };

  const priorityStyle = getPriorityStyle(task.priority);
  const safeAssignees = task.assignees || [];
  const safeDate = task.date || "No date";

  const getAvatarImage = (index) => {
    return index === 0 ? AVATARS.avatar1 : AVATARS.avatar2;
  };

  return (
    <TouchableOpacity
      style={styles.taskCard}
      onPress={() => setModalVisible(true)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskIconContainer}>
          {getPlatformIcon(task.platform)}
        </View>
        <View
          style={[
            styles.priorityTag,
            { backgroundColor: priorityStyle.backgroundColor },
          ]}
        >
          <Text style={[styles.priorityText, { color: priorityStyle.color }]}>
            {task.priority || "Medium"}
          </Text>
        </View>
      </View>

      <Text style={styles.taskTitle}>{task.title}</Text>

      {!task.isComplete && renderProgressBar()}

      <View style={styles.taskFooter}>
        <View style={styles.assignees}>
          {safeAssignees.slice(0, 2).map((assignee, index) => (
            <Image
              key={index}
              source={getAvatarImage(index)}
              style={[
                styles.assigneeAvatar,
                index > 0 && styles.assigneeAvatarOverlap,
              ]}
            />
          ))}
          {safeAssignees.length > 2 && (
            <View
              style={[styles.assigneeCounter, styles.assigneeAvatarOverlap]}
            >
              <Text style={styles.assigneeCounterText}>
                +{safeAssignees.length - 2}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>{safeDate}</Text>
        </View>
      </View>

      <SubtaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        task={task}
        onTaskUpdate={handleTaskUpdate}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  taskCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  taskIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  priorityTag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    flexDirection: "row",
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#000",
    borderRadius: 3,
  },
  progressSegment: {
    height: "100%",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  taskFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assignees: {
    flexDirection: "row",
  },
  assigneeAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
  },
  assigneeAvatarOverlap: {
    marginLeft: -8,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 12,
  },
});

export default TaskItem;
