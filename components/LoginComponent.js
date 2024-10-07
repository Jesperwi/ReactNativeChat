/* eslint-disable prettier/prettier */
import React, {useState} from 'react';
import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const LoginComponent = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    try {
      const userCredential = await auth().signInWithEmailAndPassword(email, password);
      const uid = userCredential.user.uid;

      // Fetch the user's name from Firestore
      const userDoc = await firestore().collection('User').doc(uid).get();
      if (userDoc.exists) {
        // Navigate to the Chat component and pass the userName as a parameter
        navigation.navigate('Start', {name:userDoc.data().name, userId: uid, image: userDoc.data().photo});
      } else {
        Alert.alert('Error', 'User does not have a profile.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none" // Prevents auto-capitalization of email input
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true} // Hide password input
        autoCapitalize="none" // Prevents auto-capitalization of password input
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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

export default LoginComponent;
