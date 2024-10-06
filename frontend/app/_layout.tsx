import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SessionProvider } from "@/hooks/ctx";
import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

    <SessionProvider>
      <Stack>
        <Stack.Screen name="index"  options={{
          // Hide the header for this route
          headerShown: false,
        }}/>
      </Stack>
    </SessionProvider>
    </ThemeProvider>

  );
}
