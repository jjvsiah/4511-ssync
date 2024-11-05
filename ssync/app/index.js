import { View, Text, StatusBar } from "react-native";
import React from "react";
import { Link } from "expo-router";
import "nativewind"; // This ensures nativewind is properly loaded

const App = () => {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-3xl font-pblack">Ssync</Text>
      <StatusBar style="auto" />
      <Link href="/login" style={{ color: "blue" }}>
        Login
      </Link>
    </View>
  );
};

export default App;
