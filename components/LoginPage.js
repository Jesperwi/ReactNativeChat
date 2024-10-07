/* eslint-disable prettier/prettier */
import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ImageBackground,
} from 'react-native';

const Start = ({navigation}) => {
  const image = {
    uri: 'https://i.pinimg.com/originals/bc/47/67/bc47670a93657e3c7bceac136555a818.jpg',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.head}>Our Chat</Text>
      <ImageBackground source={image} style={styles.image} />
        <View style={styles.innerContainer}>
          <View style={styles.buttonContainer}>
          <Button
              title="Login"
              color="#FF364E"
              onPress={() => navigation.navigate('LoginComponent')}
            />
              <Button
              title="Add a user"
              color="#FF364E"
              onPress={() => navigation.navigate('AddUser')}
            />
          </View>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  head: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 80,
    color: '#3F3F3F',
    fontWeight: 'bold',
  },
});

Start.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Start;
