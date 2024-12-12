import { router } from 'expo-router';
import { Text, View, Pressable, SafeAreaView, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useSession } from '../hooks/ctx'; // Reuse your session context
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function SignUp() {
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  const { signIn, isLoading: sessionLoading } = useSession();
  const [login, setLogin] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ login?:string,email?: string, name?: string, surname?: string , password?: string, confirmPassword?: string }>({});

  const validateInputs = () => {
    let isValid = true;
    const errors: { login?:string,email?: string, name?: string,surname?: string, password?: string, confirmPassword?: string } = {};

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      errors.email = "A valid email is required.";
      isValid = false;
    }

    
    if (!login) {
      errors.login = "Login is required.";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required.";
      isValid = false;
    }

    if (!surname) {
        errors.surname = "Surname is required.";
        isValid = false;
      }

    if (!password) {
      errors.password = "Password is required.";
      isValid = false;
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSignUp = async () => {
    if (!validateInputs()) return;
    setLoading(true);
    try {
      const res = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ "login":login,"email":email,"name": name,"surname": surname, "password":password }),
      });
      if (res.ok) {
        console.log("OK")      
      }

    } catch (error) {
      setError({ password: "Unable to sign up. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  const signUpWithGoogle = () => {
    //!TODO: Handle Google sign-up
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

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
        {error.email && <Text style={styles.errorText}>{error.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder='Email'
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (error.email) setError((prev) => ({ ...prev, email: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.email && <Text style={styles.errorText}>{error.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder='Name'
          value={name}
          onChangeText={(text) => {
            setName(text);
            if (error.name) setError((prev) => ({ ...prev, name: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.name && <Text style={styles.errorText}>{error.name}</Text>}

          
        <TextInput
          style={styles.input}
          placeholder='Surname'
          value={surname}
          onChangeText={(text) => {
            setSurname(text);
            if (error.surname) setError((prev) => ({ ...prev, surname: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.surname && <Text style={styles.errorText}>{error.surname}</Text>}

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

        <TextInput
          style={styles.input}
          placeholder='Confirm Password'
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (error.confirmPassword) setError((prev) => ({ ...prev, confirmPassword: '' }));
          }}
          autoCorrect={false}
          autoCapitalize='none'
        />
        {error.confirmPassword && <Text style={styles.errorText}>{error.confirmPassword}</Text>}
      </View>

      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleSignUp} disabled={loading || sessionLoading}>
          {loading || sessionLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>SIGN UP</Text>
          )}
        </Pressable>
        <Text style={styles.optionsText}>or </Text>
      </View>

      <View style={styles.mediaIcons}>
        <FontAwesome.Button name="google" size={28} backgroundColor="#000000" onPress={signUpWithGoogle}>
          Sign Up with Google
        </FontAwesome.Button>
      </View>

      <Text style={styles.footerText}>
        Already have an account?<Text onPress={() => router.push('/sign-in')} style={styles.login}>  Login</Text>
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
  login: {
    color: "red",
    fontSize: 13
  }
});
