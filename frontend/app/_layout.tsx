import { Stack } from "expo-router";
import { SessionProvider } from "@/hooks/ctx";
export default function RootLayout() {
  return (
    <SessionProvider>
      <Stack>
        <Stack.Screen name="index"  options={{
          // Hide the header for this route
          headerShown: false,
        }}/>
      </Stack>
    </SessionProvider>
  );
}
