import { Stack } from "expo-router";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SessionProvider } from "@/hooks/ctx";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Image, StyleSheet } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Custom logo component
  const HeaderLogo = () => (
    <Image
      source={require('./../assets/images/logo.svg')} // Adjust the path to your logo file
      style={styles.logo}
      resizeMode="contain"
    />
  );

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SessionProvider>
        <Stack>
          <Stack.Screen name="sign-in" options={{ headerShown: false }} />
          <Stack.Screen name="sign-up" options={{ headerShown: false }} />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerTitle: () => <HeaderLogo />, // Set the logo as the title
              headerStyle: { backgroundColor: "transparent" }, // Optional: Transparent header background
              headerTitleAlign: "center", // Align the title/logo to the center
              headerShown: true, // Ensure the header is shown
            }}
          />
        </Stack>
      </SessionProvider>
    </ThemeProvider>
  );
}

// Styles for the logo
const styles = StyleSheet.create({
  logo: {
    width: 1000, // Adjust width
    height: 600, // Adjust height
  },
});
