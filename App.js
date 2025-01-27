import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import ExpertSignupScreen from './screens/expert/ExpertSignupScreen';
import StudentSignupScreen from './screens/student/StudentSignupScreen';
import ExpertLoginScreen from './screens/expert/ExpertLoginScreen';
import StudentLoginScreen from './screens/student/StudentLoginScreen';
import ExpertHomeScreen from './screens/expert/ExpertHomeScreen';
import StudentHomeScreen from './screens/student/StudentHomeScreen';

const Stack = createStackNavigator();


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentLogin" component={StudentLoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExpertLogin" component={ExpertLoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentSignUp" component={StudentSignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExpertSignUp" component={ExpertSignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="ExpertHome" component={ExpertHomeScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
