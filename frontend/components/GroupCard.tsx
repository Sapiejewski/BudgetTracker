import React from 'react';
import { Card } from '@rneui/themed';
import { Text, View, StyleSheet, Pressable } from 'react-native';

type GroupCardProps = {
  GroupName: string;
  GroupUsers: string[];
  YourBalance: number;
};

export const GroupCard  = ({ GroupName, GroupUsers, YourBalance }:GroupCardProps) => {
  return (
    <Pressable>
    <Card >
      <Card.Title>{GroupName}</Card.Title>
      <Card.Divider />
      {GroupUsers.map((u,i) => {
          return (
            <View key={i} style={styles.user}>
              <Text style={styles.name}>{u}</Text>
            </View>
          );
        })}
      <Text style={styles.balanceText}>Your Balance: {YourBalance}</Text>
    </Card>
    </Pressable>
  );
};
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
