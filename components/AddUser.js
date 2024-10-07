/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const AddUserComponent = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const addUserToFirestoreAndAuth = async () => {
    if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      // Use Firebase Authentication to create the user account
      const userCredential = await auth().createUserWithEmailAndPassword(email, password);
      const userId = userCredential.user.uid;

      // Then, store additional user information in Firestore
      await firestore().collection('User').doc(userId).set({
        name,
        email,
        id: userId,
      });

      Alert.alert('Success', 'User added successfully!');
      setName('');
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add user.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Hide password input
      />
      <Button title="Add User" onPress={addUserToFirestoreAndAuth} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontSize: 18,
    borderRadius: 6,
  },
});

export default AddUserComponent;
