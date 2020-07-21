import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Image } from 'react-native';

import Feed from './pages/Feed';
import logo from './assets/instagram.png';

const App = createStackNavigator();

const Routes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#f5f5f5' },
      headerShown: true,
      headerTitleAlign: 'center',
      headerTitle: () => <Image source={logo} />,
    }}
  >
    <App.Screen name="Feed" component={Feed} />
  </App.Navigator>
);

export default Routes;
