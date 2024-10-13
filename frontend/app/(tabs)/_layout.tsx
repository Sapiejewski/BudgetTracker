import { Text } from 'react-native';
import { Redirect, Stack, Tabs } from 'expo-router';
import { useSession } from '../../hooks/ctx';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function AppLayout() {
const colorScheme = useColorScheme();


  const { session, isLoading } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  return (
  <Tabs  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
  }}> 
  
<Tabs.Screen
  name="groups"
  options={{
    title: 'Groups',
    tabBarIcon: ({ color, focused }) =>
         <FontAwesome name='group'/>
  }}
/>
<Tabs.Screen
  name="index"
  options={{
    title: 'Home',
    tabBarIcon: ({ color, focused }) => (
      <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
    ),
  }}
/>
<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    // tabBarIcon: ({ color, focused }) =>
        //  <FontAwesome name='profile'/>
  }}
/>

</Tabs>)
}
