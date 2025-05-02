import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../supabase';
import { Alert } from 'react-native';
import { useRef } from 'react';

export default function PaymentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { doubtData } = route.params;

  const hasSubmitted = useRef(false); // 👈 flag to prevent double insert

  const handleWebViewNavigationStateChange = async (navState) => {
    const { url } = navState;

    if (url.includes('example.com/success') && !hasSubmitted.current) {
      hasSubmitted.current = true; // 👈 block future inserts

      try {
        const { error } = await supabase.from('doubts').insert([doubtData]);
        if (error) {
          console.error('Supabase insert error:', error);
          Alert.alert('Error', 'Failed to save doubt after payment.');
        } else {
          Alert.alert('Success', 'Your doubt has been posted successfully!');
          navigation.navigate('StudentDrawer', { screen: 'StudentHome' });
        }
      } catch (err) {
        console.error('Insert exception:', err);
        Alert.alert('Unexpected Error', 'Please try again.');
      }
    }
  };

  return (
    <WebView
      source={{ uri: 'https://buy.stripe.com/test_cN228taihfRE6Nq6oq' }}
      onNavigationStateChange={handleWebViewNavigationStateChange}
      style={{ flex: 1 }}
    />
  );
}
