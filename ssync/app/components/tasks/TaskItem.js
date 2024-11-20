<<<<<<< HEAD
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TaskProgress = ({ progress, subtaskCount }) => {
  const segments = Array(subtaskCount).fill(0);
  const filledSegments = Math.floor((progress / 100) * subtaskCount);

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        {segments.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressSegment,
              index < filledSegments && styles.progressSegmentFilled,
              index === segments.length - 1 && styles.progressSegmentLast,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>Progress</Text>
    </View>
=======
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
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
  );
};

const TaskItem = ({ task, onPress }) => {
  const getPriorityStyle = (priority) => {
    const colors = {
      High: { bg: "#FFE4E4", text: "#FF4444" },
      Medium: { bg: "#E3F5E1", text: "#4CAF50" },
      Low: { bg: "#FFF4E5", text: "#FFA500" },
    };
    return colors[priority];
  };

  const priorityStyle = getPriorityStyle(task.priority);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        {/* Platform Icon */}
        <Image source={task.platformIcon} style={styles.platformIcon} />

        {/* Priority Tag */}
        <View
          style={[styles.priorityTag, { backgroundColor: priorityStyle.bg }]}
        >
          <Text style={[styles.priorityText, { color: priorityStyle.text }]}>
            {task.priority}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{task.title}</Text>

      {!task.isComplete && (
        <TaskProgress
          progress={task.progress}
          subtaskCount={task.subtasks.length}
        />
      )}

      <View style={styles.footer}>
        <View style={styles.assignees}>
          {task.assignees.map((assignee, index) => (
            <Image
              key={assignee.id}
              source={{ uri: assignee.avatar }}
              style={[
                styles.assigneeAvatar,
                index > 0 && styles.assigneeAvatarOverlap,
              ]}
            />
          ))}
        </View>

        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>{task.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export { TaskItem };

const styles = StyleSheet.create({
<<<<<<< HEAD
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
=======
  taskCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "black",
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
<<<<<<< HEAD
  platformIcon: {
    width: 24,
    height: 24,
=======
  taskIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  progressBarContainer: {
    marginBottom: 12,
  },
<<<<<<< HEAD
  progressBar: {
    flexDirection: "row",
=======
  progressBarBackground: {
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
<<<<<<< HEAD
    overflow: "hidden",
    marginBottom: 4,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    marginRight: 2,
=======
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
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
  },
  progressSegmentFilled: {
    backgroundColor: "#275BBC",
  },
  progressSegmentLast: {
    marginRight: 0,
  },
  progressLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  footer: {
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
    fontSize: 12,
    color: "#666",
  },
});
<<<<<<< HEAD
=======

export default TaskItem;
>>>>>>> dd67b41f11623cf415163ac1dea4d0f89c0d4026
