import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import ExpertSignupScreen from './screens/expert/ExpertSignupScreen';
import StudentSignupScreen from './screens/student/StudentSignupScreen';
import ExpertLoginScreen from './screens/expert/ExpertLoginScreen';
import StudentLoginScreen from './screens/student/StudentLoginScreen';
import ExpertHomeScreen from './screens/expert/ExpertHomeScreen';
import StudentHomeScreen from './screens/student/StudentHomeScreen';
import PostDoubtScreen from './screens/student/PostDoubtScreen';
import SpecificDoubtScreen from './screens/expert/SpecificDoubtScreen';
import ExpertProfileScreen from './screens/expert/ExpertProfileScreen';
import StudentProfileScreen from './screens/student/StudentProfileScreen';
import ExpertDrawerContent from './screens/expert/ExpertDrawerContent';
import StudentDrawerContent from './screens/student/StudentDrawerContent';
import FeedbackScreen from './screens/FeedbackScreen';
import ChatbotScreen from './screens/ChatbotScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ExpertDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <ExpertDrawerContent {...props} />}>
    <Drawer.Screen name="ExpertHome" component={ExpertHomeScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="ExpertProfile" component={ExpertProfileScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="Chatbot" component={ChatbotScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

const StudentDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <StudentDrawerContent {...props} />}>
    <Drawer.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="StudentProfile" component={StudentProfileScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="Chatbot" component={ChatbotScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="Feedback" component={FeedbackScreen} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Welcome">
        {/* Stack Screens */}
        <Drawer.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="StudentLogin" component={StudentLoginScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="ExpertLogin" component={ExpertLoginScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="StudentSignUp" component={StudentSignupScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="ExpertSignUp" component={ExpertSignupScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="PostDoubt" component={PostDoubtScreen} options={{ headerShown: false }} />
        <Drawer.Screen name="SpecificDoubt" component={SpecificDoubtScreen} options={{ headerShown: false }} />
        {/* Drawer screens for Expert and Student */}
        <Drawer.Screen name="ExpertDrawer" component={ExpertDrawer} options={{ headerShown: false }} />
        <Drawer.Screen name="StudentDrawer" component={StudentDrawer} options={{ headerShown: false }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
