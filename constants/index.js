import assets from "./assets";
import { COLORS, SHADOWS, SIZES, FONTS } from "./theme";

// Image values in NFTData are either a bundled asset key (bid avatars, e.g. "person02") or a URI
// (artwork as a data: URI). Returns an image source for either.
const imageSource = (value) => (assets[value] ? assets[value] : { uri: value });

export { assets, COLORS, SHADOWS, SIZES, FONTS, imageSource };
