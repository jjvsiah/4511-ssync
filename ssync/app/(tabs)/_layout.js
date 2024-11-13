import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View className="items-center justify-center">
      <Ionicons name={iconName} size={24} color={color} />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#808080",
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="home" // Pass as a string, not an object
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="feed"
          options={{
            title: "Feed",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="document-text" // Pass as a string, not an object
                color={color}
                name="Feed"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: "Tasks",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="time" // Pass as a string, not an object
                color={color}
                name="Tasks"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                iconName="person-circle" // Pass as a string, not an object
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
