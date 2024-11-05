import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CreateTaskScreen = () => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [subTasks, setSubTasks] = useState([]);

  const handleAddSubTask = () => {
    setSubTasks([...subTasks, ""]);
  };

  const handleCreateTask = () => {
    // Add your logic to create the task here
    console.log("Task created:", {
      title: taskTitle,
      description: taskDescription,
      date: taskDate,
      time: taskTime,
      priority: taskPriority,
      subTasks,
    });
  };

  return (
    <View className="bg-white h-full pb-4">
      <View className="flex-row items-center px-4 py-3">
        <TouchableOpacity className="p-2">
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-psemibold text-3xl flex-1 text-center">
          Create Task
        </Text>
      </View>
      <View className="p-4 flex-grow">
        <TextInput
          className="bg-gray-200 p-3 rounded-lg"
          placeholder="Enter task title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <TextInput
          className="bg-gray-200 p-3 rounded-lg mt-4"
          placeholder="Enter task description"
          value={taskDescription}
          onChangeText={setTaskDescription}
          multiline
        />
        <View className="flex-row justify-between mt-4">
          <TextInput
            className="bg-gray-200 p-3 rounded-lg flex-1 mr-2"
            placeholder="DD/MM/YYYY"
            value={taskDate}
            onChangeText={setTaskDate}
          />
          <TextInput
            className="bg-gray-200 p-3 rounded-lg flex-1 ml-2"
            placeholder="HH:MM"
            value={taskTime}
            onChangeText={setTaskTime}
          />
        </View>
        <View className="flex-row items-center mt-4">
          <Text className="font-psemibold mr-2">Priority:</Text>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              taskPriority === "Low"
                ? "bg-blue-100 text-white"
                : "bg-white border border-gray-300"
            }`}
            onPress={() => setTaskPriority("Low")}
          >
            <Text
              className={`font-psemibold ${
                taskPriority === "Low" ? "text-white" : "text-blue-100"
              }`}
            >
              Low
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              taskPriority === "Medium"
                ? "bg-blue-100 text-white"
                : "bg-white border border-gray-300"
            }`}
            onPress={() => setTaskPriority("Medium")}
          >
            <Text
              className={`font-psemibold ${
                taskPriority === "Medium" ? "text-white" : "text-blue-100"
              }`}
            >
              Medium
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-4 py-2 rounded-full ${
              taskPriority === "High"
                ? "bg-blue-100 text-white"
                : "bg-white border border-gray-300"
            }`}
            onPress={() => setTaskPriority("High")}
          >
            <Text
              className={`font-psemibold ${
                taskPriority === "High" ? "text-white" : "text-blue-100"
              }`}
            >
              High
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mt-4">
          <Text className="font-psemibold">Subsection tasks</Text>
          {subTasks.map((_, index) => (
            <View key={index} className="flex-row items-center my-2">
              <TextInput
                className="bg-gray-200 p-3 rounded-lg flex-1 mr-2"
                placeholder={`Subtask ${index + 1}`}
                value={subTasks[index]}
                onChangeText={(text) => {
                  const updatedSubTasks = [...subTasks];
                  updatedSubTasks[index] = text;
                  setSubTasks(updatedSubTasks);
                }}
              />
              <TouchableOpacity
                onPress={() =>
                  setSubTasks(subTasks.filter((_, i) => i !== index))
                }
              >
                <Ionicons name="close" size={24} color="gray" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            className="flex-row items-center mt-2"
            onPress={handleAddSubTask}
          >
            <Ionicons name="add" size={24} color="blue" />
            <Text className="font-psemibold text-blue-100 ml-2">
              Add subtask
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        className="bg-blue-100 py-4 rounded-lg mx-4 mt-4"
        onPress={handleCreateTask}
      >
        <Text className="text-white font-psemibold text-center text-lg">
          Create Task
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateTaskScreen;
