import React from 'react';
import { View, Text, Image, StatusBar, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SIZES, FONTS, assets } from '../constants';
import { useTheme } from '../context/ThemeContext';
import { CircleButton, RectButton, SubInfo, FocusedStatusBar, DetailsDesc, DetailsBid } from '../components';

const DetailsHeader = ({data, navigation}) => (
  <View style={{ width: '100%', height: 373 }}>
    <Image 
      source={{uri: data.image}}
      resizeMode='cover'
      style={{ width: '100%', height: '100%' }}
    />
    <CircleButton 
      imgURL={assets.left}
      handlePress={() => navigation.goBack()}
      left={15}
      top={StatusBar.currentHeight + 10}
    />
    <CircleButton 
      imgURL={assets.heart}
      right={15}
      top={StatusBar.currentHeight + 10}
    />
  </View>
)

const Details = ({ route, navigation }) => {
  const { data } = route.params;
  const { colors, shadows } = useTheme();
  
  return (
    <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.background }}>
      <FocusedStatusBar 
        barStyle={colors.statusBar}
        backgroundColor='transparent'
        translucent={true}
      />
      <View style={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        paddingVertical: SIZES.font,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.overlay,
        zIndex: 1,
      }}>
        <RectButton 
          minWidth={170}
          fontSize={SIZES.large}
          {...shadows.dark}
        />
      </View>
      <FlatList 
        data={data.bids}
        renderItem={({ item }) => <DetailsBid bid={item} /> }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: SIZES.extraLarge*3}}
        ListHeaderComponent={() => (
          <>
            <DetailsHeader data={data} navigation={navigation}/>
            <SubInfo />
            <View style={{ padding: SIZES.font }}>
              <DetailsDesc data={data}/>
              {data.bids != null && (
                <Text style={{
                  fontSize: SIZES.font,
                  fontFamily: FONTS.semiBold,
                  color: colors.text,
                }}>Current Bids</Text>
              )}
            </View>
          </>
        )}
      />
    </SafeAreaView>
  )
}

export default Details