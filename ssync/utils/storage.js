import AsyncStorage from "@react-native-async-storage/async-storage";
import { staticUsers } from "../data/users";

export const resetAndInitialiseData = async () => {
  try {
    // Clear all data
    await AsyncStorage.clear();

    // Initialise with fresh data (hopefully)
    await AsyncStorage.setItem("users", JSON.stringify(staticUsers));

    console.log("Data reinitialized successfully");
    // Verify the data
    const storedUsers = await AsyncStorage.getItem("users");
    console.log("Verified stored users:", JSON.parse(storedUsers));
  } catch (error) {
    console.error("Error reinitializing data:", error);
  }
};
