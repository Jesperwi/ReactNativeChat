import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Image, Text } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const Chat = ({ route }) => {
  const [messages, setMessages] = useState([]);
  const currentUser = route.params.currentUserId; 
  const selectedUser = route.params.selectedUserId;
  const [currentUserPhoto, setcurrentUserPhoto] = useState(null);
  const [selectedUserPhoto, setselectedUserPhoto] = useState(null);
  const [selectedUserName, setselectedUserName] = useState(null);
  const [chatRoomId, setChatRoomId] = useState(null); // State to store the chat room ID
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch currentUser photo
    const fetchcurrentUserPhoto = async () => {
      const userDoc = await firestore().collection('User').doc(currentUser).get();
      if (userDoc.exists) {
        if(userDoc.exists && userDoc.data().photo) {
        setcurrentUserPhoto(userDoc.data().photo); // Assuming 'photo' is the field name in the document
        } else {
          return
        }
      }
    };
    // Fetch selectedUser photo
    const fetchselectedUserPhoto = async () => {
      const userDoc = await firestore().collection('User').doc(selectedUser).get();
      if (userDoc.exists) {
        if (userDoc.exists && userDoc.data().name) setselectedUserName(userDoc.data().name)
        if(userDoc.exists && userDoc.data().photo) {
          setselectedUserPhoto(userDoc.data().photo); // Assuming 'photo' is the field name in the document
        } else {
          return
        }
      }
    };
  
    fetchcurrentUserPhoto();
    fetchselectedUserPhoto();

  }, [currentUser, selectedUser]); // Rerun if either currentUser or selectedUser changes

  useEffect(() => {
    // Function to find an existing chat room or create a new one
    const findOrCreateChatRoom = async () => {
      const chatRoomsRef = firestore().collection('ChatRooms');
      const querySnapshot = await chatRoomsRef.where('userIds', 'in', [[currentUser, selectedUser], [selectedUser, currentUser]]).get();
      
      if (querySnapshot.empty) {
        // Create a new chat room if none exists
        const newChatRoomRef = await chatRoomsRef.add({
          userIds: [currentUser, selectedUser],
          lastMessage: "",
          lastMessageTime: firestore.FieldValue.serverTimestamp(),
        });
        setChatRoomId(newChatRoomRef.id);
      } else {
        // Use the existing chat room
        setChatRoomId(querySnapshot.docs[0].id);
      }
    };

    findOrCreateChatRoom();
  }, [currentUser, selectedUser]); // Depend on currentUser and selectedUser

  useEffect(() => {
    if (!chatRoomId) return;
  
    const unsubscribe = firestore()
      .collection('ChatRooms')
      .doc(chatRoomId)
      .collection('messages')
      .orderBy('createdAt', 'desc') // Make sure this matches the field in Firestore
      .onSnapshot(querySnapshot => {
        const firestoreMessages = querySnapshot.docs.map(doc => ({
          _id: doc.id,
          text: doc.data().text,
          createdAt: doc.data().createdAt ? doc.data().createdAt.toDate() : new Date(), // Convert Timestamp to Date
          user: doc.data().user,
        }));
        setMessages(firestoreMessages);
      }, error => {
        console.error("Error fetching messages: ", error);
      });
  
    return () => unsubscribe();
  }, [chatRoomId]);

  // Define the onSend function to send new messages
  const onSend = (newMessages = []) => {
    newMessages.forEach(message => {
      const messageToAdd = {
        text: message.text,
        createdAt: firestore.FieldValue.serverTimestamp(),
        user: message.user,
      };
      if (chatRoomId) {
        firestore()
          .collection('ChatRooms')
          .doc(chatRoomId)
          .collection('messages')
          .add(messageToAdd);
      }
    });

    setMessages(GiftedChat.append(messages, newMessages));
  };

  useEffect(() => {
    navigation.setOptions({
      title: selectedUserName,
      headerRight: () => (
        selectedUserPhoto ? (
          <Image
            source={{ uri: selectedUserPhoto }}
            style={{ width: 40, height: 40, borderRadius: 20, marginRight: 16 }}
          />
        ) : null
      ),
    });
  }, [selectedUserPhoto, selectedUserName]);


  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: currentUser,
        }}
        renderAvatar={(props) => {
   // Determine the avatar and name based on the message's user _id
        let avatarUrl = null;
        let userName = "";
        
        if (props.currentMessage.user._id === selectedUser) {
          avatarUrl = selectedUserPhoto;
          userName = selectedUserName; // Replace 'selectedUserName' with the actual variable holding the name
        }
        
        // Render the avatar and name if the URL is available
        return avatarUrl ? (
          <View style={{ alignItems: 'center' }}>
            <Text style={{fontSize: 12}}>{userName}</Text>
            <Image source={{ uri: avatarUrl }} style={{ width: 40, height: 40, borderRadius: 20 }} />
          </View>
        ) : null;
      }}
        
      />
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

export default Chat;
