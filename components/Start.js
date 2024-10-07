import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {View, Text, Button, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import LogoutHeader from './LogoutHeader';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const Start = ({route}) => {
  const userName = route.params.name;
  const userId = route.params.userId;
  const userPic = route.params.image
  const navigation = useNavigation();
  const [userImage, setUserImage] = useState(userPic && typeof userPic === 'string' ? userPic : null);
  
  useEffect(() => {
    const fetchUserPhoto = async () => {
      const userDoc = await firestore().collection('User').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        setUserImage(userData.photo); // Assuming 'photo' is the field name in the document
      } else {
        console.log('No such document!');
      }
    };

    fetchUserPhoto();
  }, [userId]); // Dependency array ensures this effect runs whenever userId changes


  const uploadImage = async (imageUri) => {
    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const storageRef = storage().ref(`profilePictures/${userId}/${filename}`);
    try {
      await storageRef.putFile(imageUri);
      const url = await storageRef.getDownloadURL();
      return url;
    } catch (e) {
      console.error(e);
      return null;
    }
  };
  
  const updateUserProfileImage = async (imageUrl) => {
    // Check if the user already has a profile picture
    if (userImage) {
      // Delete the old profile picture
      const storageRef = storage().refFromURL(userImage);
      try {
        await storageRef.delete();
        // Now, proceed to update the user's profile image
        await firestore().collection('User').doc(userId).update({
          photo: imageUrl,
        });
        setUserImage(imageUrl);
      } catch (error) {
        console.error('Error deleting old profile picture:', error);
      }
    } else {
      // If there is no old profile picture, simply update the user's profile image
      await firestore().collection('User').doc(userId).update({
        photo: imageUrl,
      });
      setUserImage(imageUrl);
    }
  };
  
  
  const handleChoosePhoto = async () => {  
    // Launch the image picker to choose a new photo
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.assets && response.assets[0].uri) {
        const imageUrl = await uploadImage(response.assets[0].uri);
        if (imageUrl) {
          updateUserProfileImage(imageUrl);
        }
      }
    });
  };

  return (
    <View style={styles.container}>
      <LogoutHeader navigation={navigation} />
      <Text style={styles.head}>Our Chat</Text>
      <View style={styles.imageContainer}>
      {!userImage && (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleChoosePhoto}
        >
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>
      )}
        <TouchableOpacity
          onPress={handleChoosePhoto}
        >
      {userImage && (
        <Image source={{ uri: userImage }} style={styles.imagePreview} />
      )}
      </TouchableOpacity>
      </View>
      <Text style={styles.headerText}>Welcome {userName}</Text>
      <View style={styles.innerContainer}>
        <View style={styles.buttonContainer}>
          <Button
            title="Users Online"
            color="#FF364E"
            onPress={() => navigation.navigate('Users', {userId})}
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
  headerText: {
    flex: 1,
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 120,
  },
  uploadButton: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  uploadText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

Start.propTypes = {
  route: PropTypes.object.isRequired,
};

export default Start;
