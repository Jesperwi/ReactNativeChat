// index.web.js
import React from 'react';
import ReactDOM from 'react-dom';
import { View, Text } from 'react-native';

const App = () => (
  <View>
    <Text>Hello, World!</Text>
  </View>
);

ReactDOM.render(<App />, document.getElementById('root'));