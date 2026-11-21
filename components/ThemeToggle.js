import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useTheme } from '../context/ThemeContext';

// Sun/moon button; shows the icon of the mode you will switch to.
const ThemeToggle = ({ style }) => {
  const { isDark, colors, toggleMode } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleMode}
      accessibilityRole='button'
      accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.toggleBg,
        ...style,
      }}
    >
      <Ionicons name={isDark ? 'sunny' : 'moon'} size={22} color={colors.toggleIcon} />
    </TouchableOpacity>
  );
};

export default ThemeToggle;
