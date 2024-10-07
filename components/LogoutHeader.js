import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import auth from '@react-native-firebase/auth';

const CustomHeader = ({navigation}) => {
  const handleLogout = async () => {
    try {
      await auth().signOut();
      navigation.navigate('LoginPage');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleLogout}>
        <Text style={styles.logoutButton}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  logoutButton: {
    color: '#FF364E',
    fontSize: 16,
  },
});

export default CustomHeader;
