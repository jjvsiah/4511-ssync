import { View, Text, Modal, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const TaskModal = ({ visible, onClose, onNewTaskPress }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/30">
        <View className=" absolute top-40 right-5 bg-white w-1/2 pb-10 px-4 p-2 rounded-lg shadow-lg">
          <TouchableOpacity onPress={onClose}>
            <Text className="text-right text-gray-100 text-lg">X</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-row"
            onPress={() => {
              onNewTaskPress(); // Navigate to createTask
              onClose(); // Close the modal
            }}
          >
            <Ionicons name="clipboard" size={24} />
            <Text style={styles.optionText}>New Task</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row mt-7">
            <Ionicons name="calendar-clear" size={24} />
            <Text style={styles.optionText}>New Meeting</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-row mt-7">
            <Ionicons name="stats-chart" size={24} />
            <Text style={styles.optionText}>New Poll</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  optionText: {
    color: "black",
    textAlign: "left",
    fontFamily: "pregular",
    marginLeft: 8,
  },
});

export default TaskModal;
