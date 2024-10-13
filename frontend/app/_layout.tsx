import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { SessionProvider } from "@/hooks/ctx";
import { useColorScheme } from '@/hooks/useColorScheme';
import { useFonts } from 'expo-font';
// const [fontsLoaded] = useFonts({
//   antoutline: require('@ant-design/icons-react-native/fonts/antoutline.ttf'),
//  })
export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <SessionProvider>
      <Stack>
        <Stack.Screen name="(tabs)"  options={{
          // Hide the header for this route
          headerShown: false,
        }}/>
      </Stack>
    </SessionProvider>
    </ThemeProvider>

  );
}
