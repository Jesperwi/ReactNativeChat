import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

const UsersListComponent = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const currentUserUid = auth().currentUser.uid;

  useEffect(() => {
    console.log('Current User UID:', currentUserUid);

    const unsubscribe = firestore()
      .collection('User')
      .onSnapshot(querySnapshot => {
        const userArray = [];
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          // Only add user if their uid is not the current user's uid
          if (userData.id !== currentUserUid) {
            userArray.push(userData);
          }
        });
        setUsers(userArray);
      }, error => {
        console.log('Error fetching users:', error);
        // Handle potential errors, such as permission issues or network errors
      });

    // Cleanup on unmount
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              // Navigate to the Chat component with the current user and the selected user IDs as props
              navigation.navigate('Chat', {
                currentUserId: currentUserUid, // Replace with the actual current user ID
                selectedUserId: item.id, // Replace with the field that contains the user ID
              });
            }}>
            <View style={styles.userItem}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
              {/* You can add a small arrow button here */}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white'
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#333',
  },
});

export default UsersListComponent;
