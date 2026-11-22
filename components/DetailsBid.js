import { View, Text } from 'react-native';
import { Image } from 'expo-image';
import { EthPrice } from './SubInfo';
import { SIZES, FONTS, imageSource } from '../constants';
import { useTheme } from '../context/ThemeContext';

const DetailsBid = ({ bid }) => {
  const { colors } = useTheme();
  return (
    <View style={{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SIZES.base,
        paddingHorizontal: SIZES.base*2,
    }}>
      <Image
        source={imageSource(bid.image)}
        contentFit='contain'
        style={{ width: 48, height: 48 }}
      />
      <View>
        <Text style={{
            fontFamily:FONTS.semiBold,
            fontSize: SIZES.small,
            color: colors.text,
        }}>Bid placed by {bid.name}</Text>
        <Text style={{
            fontFamily:FONTS.regular,
            fontSize: SIZES.small-2,
            color: colors.textMuted,
            marginTop: 3,
        }}>{bid.date}</Text>
      </View>
      <EthPrice price={bid.price}/>
    </View>
  )
}

export default DetailsBid