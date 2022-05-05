import 'react-native-gesture-handler';
import React from 'react';
import {Colors} from 'react-native-paper';
import {Icon} from 'react-native-elements';
import Profile from './components/profile';
import ViewList from './components/viewList';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const App = () => {
  return (
    <>
      {/* <MainNavigator /> */}
      {/* <BottomNavigator /> */}
      <DrawerNavigator />
    </>
  );
};

export default App;

const MainNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login App">
        <Stack.Screen name="Sign Up" component={LoginPage} />
        <Stack.Screen name="Login App" component={MainPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const BottomNavigator = () => {
  const BottomNav = createBottomTabNavigator();
  return (
    <NavigationContainer>
      <BottomNav.Navigator
        initialRouteName="Main"
        screenOptions={route => ({
          tabBarIcon: props => {
            const IconMap = {
              Main: 'delete',
              'Sign Up': 'menu',
            };

            return <Icon name={IconMap[route.route.name]} {...props} />;
          },
          tabBarActiveTintColor: Colors.indigo700,
          tabBarInactiveTintColor: Colors.indigo100,
        })}>
        <BottomNav.Screen name="Sign Up" component={LoginPage} />
        <BottomNav.Screen name="Main" component={MainPage} />
      </BottomNav.Navigator>
    </NavigationContainer>
  );
};

const DrawerNavigator = () => {
  const DrawerNav = createDrawerNavigator();

  return (
    <NavigationContainer>
      <DrawerNav.Navigator>
        <DrawerNav.Screen name="Profile" component={Profile} />
        <DrawerNav.Screen name="View List" component={ViewList} />
        <DrawerNav.Screen name="Login App" component={LoginPage} />
      </DrawerNav.Navigator>
    </NavigationContainer>
  );
};
