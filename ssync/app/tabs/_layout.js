import { View, Text } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";

const TabIcon = (icon, color, name, focused) => {
  return (
    <View>
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
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
      <Tabs>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => <TabIcon />,
          }}
        />
      </Tabs>
    </>
  );
};

export default TabsLayout;
