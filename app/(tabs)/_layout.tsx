import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "@/constants/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: "#D7E1E7",
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopColor: Colors.primary,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="home-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="materias"
        options={{
          title: "Matérias",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="book-outline" size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="sessoes"
        options={{
          title: "Sessões",
          tabBarIcon: ({ color, size }) => (
            <Ionicons color={color} name="list-outline" size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
