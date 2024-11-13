import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";

const ScheduleMeeting = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [mode, setMode] = useState("Online");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [priority, setPriority] = useState("High");
  const [assignedUsers, setAssignedUsers] = useState([
    { id: 1, name: "Amy", avatar: "https://i.pravatar.cc/100?img=1" },
    { id: 2, name: "Cass", avatar: "https://i.pravatar.cc/100?img=2" },
  ]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  const removeAssignee = (userId) => {
    setAssignedUsers(assignedUsers.filter((user) => user.id !== userId));
  };

  const handleScheduleMeeting = async () => {
    try {
      if (!title.trim()) {
        Alert.alert("Error", "Please enter a meeting title");
        return;
      }

      const currentUserData = await AsyncStorage.getItem("currentUser");
      if (!currentUserData) {
        Alert.alert("Error", "No user logged in");
        return;
      }

      const currentUser = JSON.parse(currentUserData);

      const newMeeting = {
        id: Date.now(),
        type: "meeting",
        title: title.trim(),
        mode,
        location: location.trim(),
        date: date.toLocaleDateString(),
        time: time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        priority,
        assignees: assignedUsers,
        isComplete: false,
      };

      if (!currentUser.projects || !currentUser.projects.length) {
        currentUser.projects = [
          {
            id: 1,
            projectName: "My Project",
            description: "Default project",
            tasks: [],
          },
        ];
      }

      currentUser.projects[0].tasks.push(newMeeting);
      await AsyncStorage.setItem("currentUser", JSON.stringify(currentUser));

      const usersData = await AsyncStorage.getItem("users");
      const users = JSON.parse(usersData);
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id ? currentUser : user
      );
      await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));

      router.back();
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      Alert.alert("Error", "Failed to schedule meeting. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule Meeting</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.label}>Meeting title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter meeting title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Mode</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === "In-Person" && styles.modeButtonActive,
            ]}
            onPress={() => setMode("In-Person")}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === "In-Person" && styles.modeButtonTextActive,
              ]}
            >
              In-Person
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              mode === "Online" && styles.modeButtonActive,
            ]}
            onPress={() => setMode("Online")}
          >
            <Text
              style={[
                styles.modeButtonText,
                mode === "Online" && styles.modeButtonTextActive,
              ]}
            >
              Online
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${
            mode === "Online" ? "meeting link" : "location"
          }`}
          value={location}
          onChangeText={setLocation}
        />

        <View style={styles.row}>
          <View style={styles.halfWidth}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{date.toLocaleDateString()}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.halfWidth}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text>
                {time.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Priority</Text>
        <View style={styles.priorityContainer}>
          {["Low", "Medium", "High"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[
                styles.priorityButton,
                priority === p && styles.priorityButtonActive,
              ]}
              onPress={() => setPriority(p)}
            >
              <Text
                style={[
                  styles.priorityButtonText,
                  priority === p && styles.priorityButtonTextActive,
                ]}
              >
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Invite members:</Text>
        <View style={styles.assigneeContainer}>
          {assignedUsers.map((user) => (
            <View key={user.id} style={styles.assigneeChip}>
              <Text style={styles.assigneeName}>{user.name}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAssignee(user.id)}
              >
                <Text>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.scheduleButton}
        onPress={handleScheduleMeeting}
      >
        <Ionicons name="calendar" size={24} color="white" />
        <Text style={styles.scheduleButtonText}>Schedule Meeting</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  modeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  modeButtonActive: {
    backgroundColor: "black",
  },
  modeButtonText: {
    color: "#666",
  },
  modeButtonTextActive: {
    color: "white",
  },
  priorityContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  priorityButtonActive: {
    backgroundColor: "black",
  },
  priorityButtonText: {
    color: "#666",
  },
  priorityButtonTextActive: {
    color: "white",
  },
  assigneeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  assigneeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  assigneeName: {
    marginRight: 4,
  },
  removeButton: {
    padding: 4,
  },
  scheduleButton: {
    flexDirection: "row",
    backgroundColor: "#275BBC",
    margin: 16,
    padding: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default ScheduleMeeting;
