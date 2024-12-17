import { router } from 'expo-router';
import { Text, View, Pressable, SafeAreaView, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useSession } from '../hooks/ctx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignIn() {
  const { signIn } = useSession();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ login?: string, password?: string }>({});
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  const validateInputs = () => {
    let isValid = true;
    const errors: { login?: string, password?: string } = {};

    if (!login) {
      errors.login = "Login is required.";
      isValid = false;
    }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) return;
console.log('login', login);
    setLoading(true);
    try {
      const response = await fetch(`${apiURL}/login`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "login":login, "password":password }),
      });

      if (response.ok) {
        const data = await response.json();
         if (data["access_token"]) {
          const token = data["access_token"];
          await AsyncStorage.setItem('JWT', token);

          signIn();
          router.replace('/'); 
        }
      } else {
        setError({ password: "Invalid login or password." });
      }
      
    } catch (error) {
      setError({ password: `An error occurred. Please try again later ${error}`  });
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = () => {
    //!TODO: Handle Google login
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>
      
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder='Login'
          value={login}
          onChangeText={(text) => {
            setLogin(text);
            if (error.login) setError((prev) => ({ ...prev, login: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.login && <Text style={styles.errorText}>{error.login}</Text>}

        <TextInput
          style={styles.input}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (error.password) setError((prev) => ({ ...prev, password: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.password && <Text style={styles.errorText}>{error.password}</Text>}

        <Pressable onPress={() => setError({ password: 'Reset password not available yet.' })}>
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
        <FontAwesome.Button name="google" size={28} backgroundColor="#000000" onPress={loginWithGoogle}>
          Login with Google
        </FontAwesome.Button>
      </View>

      <Text style={styles.footerText}>
        Don't Have Account? 
        <Pressable onPress={() => router.push('/sign-up')}>
        <Text style={styles.signup}>
              Sign Up
        </Text>
        </Pressable>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "red"
  },
  inputView: {
    gap: 15,
    width: "75%",
    paddingHorizontal: 40,
    marginBottom: 5
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 7
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
  },
  forgetText: {
    fontSize: 11,
    color: "red"
  },
  buttonView: {
    width: "75%",
    paddingHorizontal: 40
  },
  button: {
    backgroundColor: "red",
    height: 45,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center"
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold"
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23
  },
  footerText: {
    textAlign: "center",
    color: "gray",
  },
  signup: {
    color: "red",
    fontSize: 13
  }
});
