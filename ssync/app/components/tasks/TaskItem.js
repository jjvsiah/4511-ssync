import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

const TaskItem = ({ title, date, priority, progress, icon, assignees }) => (
  <View style={styles.taskCard}>
    <View style={styles.taskHeader}>
      {/* Task Icon */}
      <View style={styles.taskIconContainer}>
        <Image source={icon} style={styles.taskIcon} />
      </View>

      {/* Priority Tag */}
      <View
        style={[
          styles.priorityTag,
          {
            backgroundColor: priority === "High" ? "#FFE4E4" : "#E3F5E1",
          },
        ]}
      >
        <Text
          style={[
            styles.priorityText,
            {
              color: priority === "High" ? "#FF4444" : "#4CAF50",
            },
          ]}
        >
          {priority}
        </Text>
      </View>
    </View>

    {/* Task Title */}
    <Text style={styles.taskTitle}>{title}</Text>

    {/* Progress Bar Container */}
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <Text style={styles.progressText}>Progress</Text>
    </View>

    {/* Bottom Row */}
    <View style={styles.taskFooter}>
      {/* Assignees */}
      <View style={styles.assignees}>
        {assignees.map((assignee, index) => (
          <Image
            key={index}
            source={assignee}
            style={[styles.assigneeAvatar, { marginLeft: index > 0 ? -8 : 0 }]}
          />
        ))}
      </View>

      {/* Date */}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#666" />
        <Text style={styles.dateText}>{date}</Text>
      </View>
    </View>
  </View>
);

const Tasks = () => {
  const router = useRouter();

  const hardcodedTasks = [
    {
      title: "Create low fidelity prototype",
      date: "10 Jan",
      priority: "High",
      progress: 60,
      // icon: require("../assets/images/figma-icon.png"),
      assignees: [
        // require("../assets/avatar1.png"),
        // require("../assets/avatar2.png"),
      ],
    },
    {
      title: "Push changes for launch page",
      date: "7 Feb",
      priority: "Medium",
      progress: 40,
      // icon: require("../assets/github-icon.png"),
      assignees: [
        // require("../assets/avatar3.png"),
        // require("../assets/avatar4.png"),
      ],
    },
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: -30,
      }}
    >
      {/* Filter Button */}
      <TouchableOpacity style={styles.filterButton}>
        <Text style={styles.filterText}>Filter</Text>
        <Ionicons name="filter" size={16} />
      </TouchableOpacity>

      {/* Tasks List */}
      <ScrollView style={styles.tasksList}>
        {hardcodedTasks.map((task, index) => (
          <TaskItem key={index} {...task} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#8EC9E6",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 16,
  },
  filterText: {
    marginRight: 4,
  },
  tasksList: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
  taskIcon: {
    width: 20,
    height: 20,
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
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "black",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
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

export default Tasks;
