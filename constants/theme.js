// Raw brand colours (the light palette's values). Prefer the semantic tokens from useTheme().
export const COLORS = {
  primary: "#001F2D",
  secondary: "#4D626C",

  white: "#FFF",
  gray: "#74858C",
};

export const BRAND = {
  navy: "#001F2D",
  ivory: "#F5EFE3",
  gold: "#C9A45C",
};

// Semantic palettes. Light matches the original look; dark is a deliberate design
// (near-black navy, elevated surfaces, ivory text, gold accent), not an inversion.
export const PALETTES = {
  light: {
    background: "#FFFFFF",
    surface: "#FFFFFF",        // cards, small chips
    surfaceAlt: "#FFFFFF",     // circle buttons over images
    text: "#001F2D",
    textMuted: "#4D626C",
    textSubtle: "#74858C",     // empty/loading text
    headerBg: "#001F2D",
    headerText: "#FFFFFF",
    inputBg: "#74858C",
    inputText: "#FFFFFF",
    inputPlaceholder: "#D5DEE2",
    buttonBg: "#001F2D",
    buttonText: "#FFFFFF",
    border: "#E3E8EA",
    overlay: "rgba(255, 255, 255, 0.5)", // Details bottom bar
    shadow: "#74858C",
    toggleIcon: "#FFFFFF",
    toggleBg: "rgba(255, 255, 255, 0.14)",
    statusBar: "light-content", // both screens start with a dark header / image
  },
  dark: {
    background: "#0B1218",
    surface: "#14202A",
    surfaceAlt: "#1B2A36",
    text: "#F5EFE3",
    textMuted: "#A3B1B8",
    textSubtle: "#8797A0",
    headerBg: "#001F2D",
    headerText: "#F5EFE3",
    inputBg: "#1B2A36",
    inputText: "#F5EFE3",
    inputPlaceholder: "#8797A0",
    buttonBg: "#C9A45C",
    buttonText: "#001F2D",
    border: "#25343F",
    overlay: "rgba(11, 18, 24, 0.82)",
    shadow: "#000000",
    toggleIcon: "#C9A45C",
    toggleBg: "rgba(245, 239, 227, 0.10)",
    statusBar: "light-content",
  },
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
};

export const FONTS = {
  bold: "Inter-Bold",
  semiBold: "Inter-SemiBold",
  medium: "Inter-Medium",
  regular: "Inter-Regular",
  light: "Inter-Light",
};

const shadow = (color, height, opacity, radius, elevation) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

// Theme-aware shadows; pass the palette's `shadow` colour.
export const getShadows = (color, strength = 1) => ({
  light: shadow(color, 1, 0.22 * strength, 2.22, 3),
  medium: shadow(color, 3, 0.29 * strength, 4.65, 7),
  dark: shadow(color, 7, 0.41 * strength, 9.11, 14),
});

// Static light shadows, kept for backwards compatibility.
export const SHADOWS = getShadows(COLORS.gray);
