import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="car"
        options={{
          title: "Car",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name='car' color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="gaslog"
        options={{
          title: "Gas Log",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          headerShown: false,
        }}
      />
     
    </Tabs>
  );
}
