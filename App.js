import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { useFonts } from 'expo-font';

import { appCheckReady } from './firebase/appCheck';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './screens/Home';
import Details from './screens/Details';

const Stack = createStackNavigator();

const AppContent = () => {
  const { colors, isDark, ready } = useTheme();

  const [loaded] = useFonts({
    InterBold: require('./assets/fonts/Inter-Bold.ttf'),
    InterSemiBold: require('./assets/fonts/Inter-SemiBold.ttf'),
    InterMedium: require('./assets/fonts/Inter-Medium.ttf'),
    InterRegular: require('./assets/fonts/Inter-Regular.ttf'),
    InterLight: require('./assets/fonts/Inter-Light.ttf'),
  });

  // Wait for the first App Check token so the first database read is already attested.
  const [appCheckDone, setAppCheckDone] = useState(false);
  useEffect(() => { appCheckReady.finally(() => setAppCheckDone(true)); }, []);

  if (!loaded || !ready || !appCheckDone) return null;

  const base = isDark ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.buttonBg,
    },
  };

  return (
      <NavigationContainer theme={theme} >
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName='Home'>
          <Stack.Screen name='Home' component={Home} />
          <Stack.Screen name='Details' component={Details} />
        </Stack.Navigator>
      </NavigationContainer>
  );

}

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
