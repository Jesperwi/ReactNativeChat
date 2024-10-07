import React from 'react';
import Start from './components/Start';
import LoginPage from './components/LoginPage';
import Chat from './components/Chat';
import LoginComponent from './components/LoginComponent';
import AddUser from './components/AddUser';
import Users from './components/Users';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen
          name="LoginPage"
          component={LoginPage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Start"          
          component={Start}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="LoginComponent"
          component={LoginComponent}
          options={{
            title: 'Login', // Set the custom header name here
          }}
        />
        <Stack.Screen 
          name="Chat" 
          component={Chat} />
        <Stack.Screen name="AddUser" component={AddUser} />
        <Stack.Screen name="Users" component={Users} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
