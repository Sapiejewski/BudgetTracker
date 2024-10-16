import React, {useState, useEffect}  from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useSession } from '../../hooks/ctx';
import { SafeAreaView } from 'react-native-safe-area-context';
// import { Ionicons } from '@expo/vector-icons'; // For the plus icon
import { GroupCard }  from '../../components/GroupCard';
import  {Card}  from '@rneui/themed';

type GroupCardProps = {
  GroupName: string;
  GroupUsers: string[];
  YourBalance: number;
};


export default function Index() {
  const apiURL = process.env.EXPO_PUBLIC_API_URL;

  const { signOut } = useSession();
  const [groups, setGroups] = useState<GroupCardProps[]>([]);

  useEffect(() => {
    fetchGroups();

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
      </View>
      {groups.map((g:GroupCardProps)=>
      <GroupCard GroupName={g.GroupName} GroupUsers={g.GroupUsers} YourBalance={g.YourBalance}/>)}
      
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
});
