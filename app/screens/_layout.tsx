import { Tabs, Stack } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { CarProvider } from '@/context/CarContext'

export default function Layout() {
  return (
    <CarProvider>
      <Stack>
        <Stack.Screen name="tabs" options={{ headerShown: false}}>
        </Stack.Screen>
        <Stack.Screen name="editCar" options={{ title: 'Edit Car', headerShown: false }} />
      </Stack>
    </CarProvider>
  );
}
