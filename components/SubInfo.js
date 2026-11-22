import { View, Text, Image } from 'react-native';
import { Image as CachedImage } from 'expo-image';
import { SIZES, FONTS, assets } from '../constants';
import { useTheme } from '../context/ThemeContext';

export const NFTTitle = ({ title, subTitle, titleSize, subTitleSize }) => {
    const { colors } = useTheme();
    return (
        <View>
            <Text style={{
                fontFamily: FONTS.semiBold,
                fontSize: titleSize,
                color: colors.text,
            }}>{title}</Text>
            <Text style={{
                fontFamily: FONTS.regular,
                fontSize: subTitleSize,
                color: colors.text,
            }}>{subTitle}</Text>
        </View>
    )
}

export const EthPrice = ({ price }) => {
    const { colors, isDark } = useTheme();
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image 
            source={assets.eth}
            resizeMode='contain'
            style={{ width: 20, height: 20, marginRight: 2, ...(isDark && { tintColor: colors.buttonBg }) }}
            />
            <Text style={{ 
                fontFamily: FONTS.medium,
                fontSize: SIZES.font,
                color: colors.text,
            }}>{price}</Text>
        </View>
    )
}

export const ImageCmp = ({ imgUrl, index }) => {
    return (
        <CachedImage 
        source={imgUrl}
        contentFit='contain'
        style={{
            width: 48,
            height: 48,
            marginLeft: index == 0 ? 0 : -SIZES.font,
        }}
        />
    )
}

export const People = () => {

    const images = [
        assets.person02,
        assets.person03,
        assets.person04
    ]

    return (
        <View style={{ flexDirection: 'row' }}>
            { images.map((imgUrl, index) => (
                <ImageCmp imgUrl={imgUrl} index={index} key={`People-${index}`}/>
            )) }
        </View>
    )
}

export const EndDate = () => {
    const { colors, shadows, isDark } = useTheme();
    return (
        <View style={{
            paddingHorizontal: SIZES.font,
            paddingVertical: SIZES.base,
            backgroundColor: colors.surface,
            borderWidth: isDark ? 1 : 0,
            borderColor: colors.border,
            justifyContent: 'center',
            alignItems: 'center',
            ...shadows.light,
            elevation: 1,
            maxWidth: '50%'
        }}>
            <Text style={{ 
                fontFamily: FONTS.regular,
                fontSize: SIZES.small,
                color: colors.text 
            }}>Ending in</Text>
            <Text style={{ 
                fontFamily: FONTS.regular,
                fontSize: SIZES.medium,
                color: colors.text 
            }}>12h 30m</Text>
        </View>
    )
}

export const SubInfo = () => {
    return (
        <View style={{
            width: '100%',
            paddingHorizontal: SIZES.font,
            marginTop: -SIZES.extraLarge,
            flexDirection: 'row',
            justifyContent: 'space-between',
        }}>
            <People />
            <EndDate />
        </View>
    )
}