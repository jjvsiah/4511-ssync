import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const FilterModal = ({ visible, onClose, onApplyFilter }) => {
  const [dateOrder, setDateOrder] = useState("");
  const [priorityOrder, setPriorityOrder] = useState("");
  const [assignedToMe, setAssignedToMe] = useState(false);

  const handleConfirm = () => {
    onApplyFilter({
      dateOrder,
      priorityOrder,
      assignedToMe,
    });
    onClose();
  };

  const FilterOption = ({ text, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.filterOption, isSelected && styles.filterOptionSelected]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterOptionText,
          isSelected && styles.filterOptionTextSelected,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Selection</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[
              styles.assignedToMe,
              assignedToMe && styles.filterOptionSelected,
            ]}
            onPress={() => setAssignedToMe(!assignedToMe)}
          >
            <Text
              style={[
                styles.filterOptionText,
                assignedToMe && styles.filterOptionTextSelected,
              ]}
            >
              Assigned to Me
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Date/Time</Text>
          <View style={styles.optionsRow}>
            <FilterOption
              text="New to Old"
              isSelected={dateOrder === "newToOld"}
              onPress={() => setDateOrder("newToOld")}
            />
            <FilterOption
              text="Old to New"
              isSelected={dateOrder === "oldToNew"}
              onPress={() => setDateOrder("oldToNew")}
            />
          </View>

          <Text style={styles.sectionTitle}>Priority</Text>
          <View style={styles.optionsRow}>
            <FilterOption
              text="High to Low"
              isSelected={priorityOrder === "highToLow"}
              onPress={() => setPriorityOrder("highToLow")}
            />
            <FilterOption
              text="Low to High"
              isSelected={priorityOrder === "lowToHigh"}
              onPress={() => setPriorityOrder("lowToHigh")}
            />
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "80%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  filterOption: {
    backgroundColor: "#F0F9FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
  },
  filterOptionSelected: {
    backgroundColor: "#275BBC",
  },
  filterOptionText: {
    color: "#275BBC",
    fontSize: 14,
    textAlign: "center",
  },
  filterOptionTextSelected: {
    color: "white",
  },
  assignedToMe: {
    backgroundColor: "#F0F9FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
  },
  confirmButton: {
    backgroundColor: "#275BBC",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FilterModal;
