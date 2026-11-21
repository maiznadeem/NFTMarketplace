import { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDatabase, ref, onValue } from '@react-native-firebase/database';

import { COLORS, FONTS, SIZES } from '../constants'
import { HomeHeader, FocusedStatusBar, NFTCard } from '../components';

const Home = () => {
  const insets = useSafeAreaInsets()
  const [nftData, setNftData] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const dbRef = ref(getDatabase(), 'NFTData')
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        const value = snapshot.val()
        // Realtime Database returns an array or an object keyed by id; ignore null entries.
        setNftData(value ? Object.values(value).filter(Boolean) : [])
        setLoading(false)
      },
      (error) => {
        console.warn('Failed to load NFTData', error)
        setLoading(false)
      }
    )
    return unsubscribe
  }, [])

  const visibleData = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return nftData
    return nftData.filter((item) => item.name?.toLowerCase().includes(term))
  }, [nftData, query])

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <FocusedStatusBar barStyle='light-content' backgroundColor='transparent' translucent={true} />
      <View style={{ flex: 1 }}>
        <View style={{ zIndex: 0 }}>
          <FlatList
            data={visibleData}
            renderItem={({ item }) => <NFTCard data={item} />}
            keyExtractor={(item, index) => String(item.id ?? index)}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={ <HomeHeader onSearch={setQuery}/> }
            ListEmptyComponent={
              <Text style={{
                textAlign: 'center',
                marginTop: SIZES.extraLarge,
                fontFamily: FONTS.regular,
                color: COLORS.gray,
              }}>
                {loading ? 'Loading...' : 'No NFTs found'}
              </Text>
            }
          />
        </View>
        <View style={{
          position: 'absolute',
          top: -insets.top,
          bottom: 0,
          right: 0,
          left: 0,
          zIndex:-1,
        }}>
          <View style={{ height: 300 + insets.top, backgroundColor: COLORS.primary }} />
          <View style={{ flex: 1, backgroundColor: COLORS.white }} />
        </View>
      </View>
    </View>
  )
}

export default Home
