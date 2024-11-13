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
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
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
  platformIcon: {
    width: 24,
    height: 24,
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
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    flexDirection: "row",
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: "#F0F0F0",
    marginRight: 2,
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
