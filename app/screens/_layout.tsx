import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="addcar"
        options={{
          title: "Add New Car",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="car"
        options={{
          title: "The car",
          headerShown: true,
        }}
      />
     
    </Stack>
  );
}
