import { Tabs, Stack } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CarProvider } from '@/context/CarContext'

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
          tabBarIcon: ({ color, focused}) => (
            <FontAwesome5 name="gas-pump" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="maintenance"
        options={{
          title: "Maintenance",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome6 name="wrench" size={24} color={color} />
          )
        }}
      />      
    </Tabs>
  );
}
