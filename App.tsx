import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ProductInputScreen } from './src/screens/ProductInputScreen';
import { RecommendationScreen } from './src/screens/RecommendationScreen';
import { InvoiceDetailsScreen } from './src/screens/InvoiceDetailsScreen';
import { ErrorBoundary } from './src/components/ErrorBoundary';
import type { RootStackParamList } from './src/navigation/types';

const Stack = createStackNavigator<RootStackParamList>();
const queryClient = new QueryClient();

// Suppress Expo update errors globally (updates are disabled)
if (typeof ErrorUtils !== 'undefined') {
  const originalHandler = ErrorUtils.getGlobalHandler();
  ErrorUtils.setGlobalHandler((error, isFatal) => {
    // Suppress "Failed to download remote update" errors
    if (
      error?.message?.includes('Failed to download remote update') ||
      error?.message?.includes('java.io.IOException') ||
      error?.message?.includes('remote update') ||
      error?.stack?.includes('remote update')
    ) {
      console.log('Suppressed Expo update error (updates are disabled)');
      return; // Suppress the error
    }
    // Call original handler for other errors
    if (originalHandler) {
      originalHandler(error, isFatal);
    }
  });
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <QueryClientProvider client={queryClient}>
          <NavigationContainer>
            <StatusBar style="dark" backgroundColor="#F9FAFB" translucent={false} />
            <Stack.Navigator
              initialRouteName="ProductInput"
              screenOptions={{
                headerStyle: {
                  backgroundColor: '#3B82F6',
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen
                name="ProductInput"
                component={ProductInputScreen}
                options={{
                  title: 'Product Search',
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="Recommendation"
                component={RecommendationScreen}
                options={{
                  title: 'Recommendations',
                }}
              />
              <Stack.Screen
                name="InvoiceDetails"
                component={InvoiceDetailsScreen}
                options={{
                  headerShown: false,
                }}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </QueryClientProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

