import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#6F4E37' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
      <Stack.Screen name="menu" options={{ title: 'Coffee Menu' }} />
      <Stack.Screen name="beans" options={{ title: 'Coffee Beans' }} />
      <Stack.Screen name="baristas" options={{ title: 'Our Baristas' }} />
      <Stack.Screen name="orders" options={{ title: 'Orders History' }} />
      <Stack.Screen name="explore" options={{ title: 'Explore' }} />
    </Stack>
  );
}