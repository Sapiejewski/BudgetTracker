import { router } from "expo-router";
import {
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useSession } from "../hooks/ctx";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function SignIn() {
  const { signIn } = useSession();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ login?: string; password?: string }>({});
  const apiURL = process.env.EXPO_PUBLIC_API_URL;

  const validateInputs = () => {
    let isValid = true;
    const errors: { login?: string; password?: string } = {};

    if (!login.trim()) {
      errors.login = "Login is required.";
      isValid = false;
    }

    if (!password.trim()) {
      errors.password = "Password is required.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data["access_token"]) {
          const token = data["access_token"];
          await AsyncStorage.setItem("JWT", token);
          signIn();
          router.replace("/");
        }
      } else {
        setError({ password: "Invalid login or password." });
      }
    } catch (error) {
      setError({ password: "An error occurred. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    //!TODO: Handle Google login
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Image
          source={require("../assets/images/logo.svg")} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Login</Text>

        <View style={styles.inputView}>
          <TextInput
            style={[styles.input, error.login && styles.errorInput]}
            placeholder="Login"
            value={login}
            onChangeText={(text) => {
              setLogin(text);
              if (error.login) setError((prev) => ({ ...prev, login: "" }));
            }}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {error.login && <Text style={styles.errorText}>{error.login}</Text>}

          <TextInput
            style={[styles.input, error.password && styles.errorInput]}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (error.password) setError((prev) => ({ ...prev, password: "" }));
            }}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {error.password && <Text style={styles.errorText}>{error.password}</Text>}

          <Pressable
            onPress={() => setError({ password: "Reset password not available yet." })}
          >
            <Text style={styles.forgetText}>Forgot Password?</Text>
          </Pressable>
        </View>

        <View style={styles.buttonView}>
          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>LOGIN</Text>
            )}
          </Pressable>
          <Text style={styles.optionsText}>or </Text>
        </View>

        <View style={styles.mediaIcons}>
          <FontAwesome.Button
            name="google"
            size={20}
            backgroundColor="#000000"
            onPress={loginWithGoogle}
          >
            Login with Google
          </FontAwesome.Button>
        </View>

        <Text style={styles.footerText}>
          Don't Have an Account?{" "}
          <Pressable onPress={() => router.push("/sign-up")}>
            <Text style={styles.signup}>Sign Up</Text>
          </Pressable>
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  logo: {
    width: "100%",
    height: 200,
    marginBottom: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#31C48D",
    textTransform: "uppercase",
    marginBottom: 40,
  },
  inputView: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#31C48D",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#f8f8f8",
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  forgetText: {
    fontSize: 13,
    color: "#31C48D",
    textAlign: "right",
  },
  buttonView: {
    width: "100%",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#31C48D",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  optionsText: {
    textAlign: "center",
    color: "#888",
    fontSize: 14,
    marginVertical: 10,
  },
  mediaIcons: {
    marginBottom: 20,
  }});
