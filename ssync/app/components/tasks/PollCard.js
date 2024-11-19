import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PollOption = ({ text, isSelected, onSelect }) => (
  <TouchableOpacity className="flex-row items-center py-2" onPress={onSelect}>
    <View
      className={`w-5 h-5 rounded-full border-2 border-gray-300 mr-3 items-center justify-center
      ${isSelected ? "bg-blue-600 border-blue-600" : "bg-white"}`}
    >
      {isSelected && <View className="w-2 h-2 rounded-full bg-white" />}
    </View>
    <Text className="text-base">{text}</Text>
  </TouchableOpacity>
);

const PollCard = ({ poll, onVoteComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async () => {
    if (!selectedOption) return;

    try {
      const currentUserData = await AsyncStorage.getItem("loggedInUser");
      if (!currentUserData) return;

      const currentUser = JSON.parse(currentUserData);

      // Update the poll in the user's projects
      const updatedProjects = currentUser.projects.map((project) => ({
        ...project,
        tasks: project.tasks.map((task) => {
          if (task.id === poll.id) {
            return {
              ...task,
              options: task.options.map((option, index) => ({
                ...option,
                votes:
                  index === selectedOption ? option.votes + 1 : option.votes,
              })),
              voters: [...task.voters, currentUser.id],
            };
          }
          return task;
        }),
      }));

      const updatedUser = { ...currentUser, projects: updatedProjects };
      await AsyncStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

      // Update all users
      const usersData = await AsyncStorage.getItem("users");
      if (usersData) {
        const users = JSON.parse(usersData);
        const updatedUsers = users.map((user) =>
          user.id === currentUser.id ? updatedUser : user
        );
        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
      }

      setHasVoted(true);
      if (onVoteComplete) {
        onVoteComplete();
      }
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <View className="bg-[#373F51] rounded-xl p-4 mb-4">
      <Text className="text-white text-lg font-semibold mb-4">
        {poll.question}
      </Text>

      {poll.options.map((option, index) => (
        <PollOption
          key={index}
          text={option.text}
          isSelected={selectedOption === index}
          onSelect={() => !hasVoted && setSelectedOption(index)}
        />
      ))}

      {!hasVoted && (
        <TouchableOpacity
          onPress={handleVote}
          disabled={selectedOption === null}
          className={`mt-4 py-2 px-6 rounded-full self-end ${
            selectedOption !== null ? "bg-[#8B6EF3]" : "bg-gray-400"
          }`}
        >
          <Text className="text-white font-semibold">Vote</Text>
        </TouchableOpacity>
      )}

      {hasVoted && (
        <View className="mt-4">
          {poll.options.map((option, index) => (
            <View key={index} className="mb-2">
              <Text className="text-white">{`${option.text}: ${option.votes} votes`}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default PollCard;
