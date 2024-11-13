import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PollCard = ({ poll, onVoteComplete }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = async (optionIndex) => {
    try {
      // Get current user data
      const currentUserData = await AsyncStorage.getItem("currentUser");
      const currentUser = JSON.parse(currentUserData);

      // Check if user has already voted
      if (poll.voters?.includes(currentUser.id)) {
        setHasVoted(true);
        return;
      }

      // Get all users data
      const usersData = await AsyncStorage.getItem("users");
      let users = JSON.parse(usersData);

      // Find and update the poll in the users data
      users = users.map((user) => {
        const updatedUser = { ...user };
        updatedUser.projects = user.projects.map((project) => {
          const updatedProject = { ...project };
          updatedProject.tasks = project.tasks.map((task) => {
            if (task.type === "poll" && task.id === poll.id) {
              // Update vote count for the selected option
              const updatedOptions = task.options.map((option, index) => {
                if (index === optionIndex) {
                  return {
                    ...option,
                    votes: (option.votes || 0) + 1,
                  };
                }
                return option;
              });

              // Add user to voters list
              return {
                ...task,
                options: updatedOptions,
                voters: [...(task.voters || []), currentUser.id],
              };
            }
            return task;
          });
          return updatedProject;
        });
        return updatedUser;
      });

      // Update AsyncStorage
      await AsyncStorage.setItem("users", JSON.stringify(users));

      // Update current user data
      const updatedCurrentUser = users.find(
        (user) => user.id === currentUser.id
      );
      await AsyncStorage.setItem(
        "currentUser",
        JSON.stringify(updatedCurrentUser)
      );

      setSelectedOption(optionIndex);
      setHasVoted(true);
      if (onVoteComplete) onVoteComplete();
    } catch (error) {
      console.error("Error voting in poll:", error);
    }
  };

  const calculatePercentage = (votes, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((votes / totalVotes) * 100);
  };

  const getTotalVotes = () => {
    return poll.options.reduce((sum, option) => sum + (option.votes || 0), 0);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.question}>{poll.title}</Text>

      <View style={styles.optionsContainer}>
        {poll.options.map((option, index) => {
          const totalVotes = getTotalVotes();
          const percentage = calculatePercentage(option.votes || 0, totalVotes);
          const isSelected = selectedOption === index;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && styles.selectedOption,
                hasVoted && { opacity: 0.8 },
              ]}
              onPress={() => !hasVoted && handleVote(index)}
              disabled={hasVoted}
            >
              <View style={styles.optionContent}>
                <View style={styles.radioContainer}>
                  <View
                    style={[styles.radio, isSelected && styles.radioSelected]}
                  />
                </View>
                <Text style={styles.optionText}>{option.text}</Text>
              </View>

              {hasVoted && (
                <View style={styles.percentageContainer}>
                  <Text style={styles.percentageText}>{`${percentage}%`}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {hasVoted && (
        <Text style={styles.totalVotes}>{`${getTotalVotes()} votes`}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  question: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectedOption: {
    backgroundColor: "#e8f0fe",
    borderColor: "#275BBC",
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  radioContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#275BBC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  radio: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "transparent",
  },
  radioSelected: {
    backgroundColor: "#275BBC",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  percentageContainer: {
    marginLeft: 8,
  },
  percentageText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#275BBC",
  },
  totalVotes: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    textAlign: "right",
  },
});

export default PollCard;
