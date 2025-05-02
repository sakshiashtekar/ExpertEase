import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer'; 
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from './screens/WelcomeScreen';
import { DatabaseProvider } from "./context/DatabaseContext"
import PaymentScreen from "./screens/student/PaymentScreen"
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
import ExpertFeedbackScreen from './screens/expert/ExpertFeedbackScreen';
import ExpertChatbotScreen from './screens/expert/ExpertChatbotScreen';
import StudentFeedbackScreen from './screens/student/StudentFeedbackScreen';
import StudentChatbotScreen from './screens/student/StudentChatbotScreen';
import { StripeProvider} from "@stripe/stripe-react-native"
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const ExpertDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <ExpertDrawerContent {...props} />}>
    <Drawer.Screen name="ExpertHome" component={ExpertHomeScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="ExpertProfile" component={ExpertProfileScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="ExpertChatbot" component={ExpertChatbotScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="ExpertFeedback" component={ExpertFeedbackScreen} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

const StudentDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <StudentDrawerContent {...props} />}>
    <Drawer.Screen name="StudentHome" component={StudentHomeScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="StudentProfile" component={StudentProfileScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="StudentChatbot" component={StudentChatbotScreen} options={{ headerShown: false }} />
    <Drawer.Screen name="StudentFeedback" component={StudentFeedbackScreen} options={{ headerShown: false }} />
  </Drawer.Navigator>
);

const STRIPE_PUBLISHABLE_KEY = "pk_test_51RK14HPmwBwI5GdfmGsHvOPmTZ23KAAsx4t8gMqf9fm1aifz85wnZ1RY8sbBZJCEBF9nBKoYQddKSOHUoYIQOWcl00nN9kiBaF"
export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
    <DatabaseProvider>
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
          <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ headerShown: false }} />
          {/* Drawer screens for Expert and Student */}
          <Drawer.Screen name="ExpertDrawer" component={ExpertDrawer} options={{ headerShown: false }} />
          <Drawer.Screen name="StudentDrawer" component={StudentDrawer} options={{ headerShown: false }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </DatabaseProvider>
    </StripeProvider>
  );
}
