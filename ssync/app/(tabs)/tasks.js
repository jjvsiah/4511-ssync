import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import React, { useState } from "react";
import TaskModal from "../components/TaskModal";

const Tasks = () => {
  const [activeButton, setActiveButton] = useState("complete");
  const [modalVisible, setModalVisible] = useState(false);

  const buttons = [
    { id: "complete", label: "Complete" },
    { id: "todo", label: "To Do" },
    { id: "polls", label: "Polls" },
  ];

  const getButtonStyle = (buttonId) => {
    return activeButton === buttonId
      ? "w-1/3 mt-4 bg-blue-100 p-3 rounded-full"
      : "w-1/3 mt-4 p-3";
  };

  const getTextStyle = (buttonId) => {
    return activeButton === buttonId
      ? "text-white text-center font-psemibold"
      : "text-gray-500 text-center font-psemibold";
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <View className="flex-row justify-between items-center px-8 pt-4">
        <Text className="font-pregular text-3xl text-center flex-1">Tasks</Text>
        <TouchableOpacity
          className="object-right"
          onPress={() => setModalVisible(true)}
        >
          <Image source={require("../../assets/images/AddTask.png")} />
        </TouchableOpacity>
      </View>

      <View className="flex-row px-6 pt-2">
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.id}
            className={getButtonStyle(button.id)}
            onPress={() => setActiveButton(button.id)}
          >
            <Text className={getTextStyle(button.id)}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Modal */}
      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};

export default Tasks;
