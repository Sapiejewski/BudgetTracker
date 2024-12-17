import React, {useState, useEffect}  from 'react';
import { Text, View, StyleSheet, TouchableOpacity,Button } from 'react-native';
import { useSession } from '../../hooks/ctx';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GroupCard }  from '../../components/GroupCard';
import  {Card}  from '@rneui/themed';

type GroupCardProps = {
  GroupName: string;
  GroupUsers: string[];
  YourBalance: number;
};


export default function Index() {
  const apiURL = process.env.EXPO_PUBLIC_API_URL;
  const [token, setToken] = useState<string | null>(null);
  const { signOut } = useSession();
  const [groups, setGroups] = useState<GroupCardProps[]>([]);
  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('JWT');
      // alert(value);
      if (value !== null) {
        alert(value); 
        return value;
      } else {
        console.log('No token found'); 
        return null;
      }
    } catch (e) {
      console.error('Error reading token:', e);
      return null;
    }
  };
  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await getData();
      setToken(storedToken); // Update state with the token
    };
    fetchToken();
  }, []);

  const fetchGroups = async () => {
    try {
      const res = await fetch(`${apiURL}/GroupsInfo`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const response = await res.json();
        const data = response["data"]

        setGroups(data);
      } else {
        console.error('Failed to fetch groups');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.signOut}>Log Out</Text>
        </TouchableOpacity>
        {/* <Button
  onPress={()=>{console.log("CWEL")}}
  title="Learn More"
  color="#841584"
  accessibilityLabel="Learn more about this purple button"
/>    */}
      <Text style={styles.signOut}>{}</Text>
      </View>
      {/* {groups.map((g:GroupCardProps)=>
      <GroupCard GroupName={g.GroupName} GroupUsers={g.GroupUsers} YourBalance={g.YourBalance}/>)} */}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  user: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    marginTop: 5,
  },
  topBar: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  signOut: {
    color: 'red',
    fontSize: 16,
  },
  groupList: {
    padding: 10,
  },
  card: {
    backgroundColor: '#e6e6e6',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userText: {
    fontSize: 14,
  },
  balanceText: {
    fontSize: 16,
    marginTop: 10,
    fontWeight: '600',
  },
  createGroupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
  },
  createGroupText: {
    marginLeft: 8,
    fontSize: 16,
    color: 'blue',
  },
})
