import { TouchableOpacity, View, Text, Image } from 'react-native'
import React from 'react';

import { COLORS, SIZES, FONTS } from '../constants';
import { useTheme } from '../context/ThemeContext';

export const CircleButton = ({ imgURL, handlePress, ...props }) => {
  const { shadows } = useTheme();
  // Floats over photos, so it stays white (dark icons) in both modes.
  return (
    <TouchableOpacity
        style={{
            width: 40,
            height: 40,
            backgroundColor: COLORS.white,
            position: 'absolute',
            borderRadius: SIZES.extraLarge,
            alignItems: 'center',
            justifyContent: 'center',
            ...shadows.light,
            ...props,
        }}
        onPress={handlePress}
    >
        <Image 
            source={imgURL}
            resizeMode='contain'
            style={{ width: 24, height: 24 }}
        />
    </TouchableOpacity>
  )
}

export const RectButton = ({ minWidth, fontSize, handlePress, ...props }) => {
    const { colors } = useTheme();
    return (
    <TouchableOpacity
        style={{
            backgroundColor: colors.buttonBg,
            borderRadius: SIZES.extraLarge,
            minWidth: minWidth,
            padding: SIZES.small,
            ...props,
        }}
        onPress={handlePress}
    >
        <Text style={{
            fontFamily: FONTS.semiBold,
            fontSize: fontSize,
            color: colors.buttonText,
            textAlign: 'center',
        }}>Place a bid</Text>
    </TouchableOpacity>
    )
}