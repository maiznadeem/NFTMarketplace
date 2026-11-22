import './utils/splash';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';

// Imported for its side effect: App Check starts fetching its token at launch, in parallel with rendering.
import './firebase/appCheck';

import { ThemeProvider, useTheme } from './context/ThemeContext';
import Home from './screens/Home';
import Details from './screens/Details';

const Stack = createStackNavigator();

const AppContent = () => {
  const { colors, isDark, ready } = useTheme();

  // Fonts are embedded at build time (expo-font config plugin), so there is nothing to load here.
  // The native splash stays up until Home has content (utils/splash.js).
  if (!ready) return null;

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
