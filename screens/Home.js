import { useEffect, useMemo, useState } from 'react';
import { View, FlatList, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDatabase, ref, onValue } from '@react-native-firebase/database';

import { FONTS, SIZES } from '../constants'
import { useTheme } from '../context/ThemeContext';
import { HomeHeader, FocusedStatusBar, NFTCard } from '../components';
import { appCheckReady } from '../firebase/appCheck';

const Home = () => {
  const insets = useSafeAreaInsets()
  const { colors } = useTheme()
  const [nftData, setNftData] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    let loaded = false
    const fail = () => {
      if (loaded) return
      setLoadFailed(true)
      setLoading(false)
    }
    const dbRef = ref(getDatabase(), 'NFTData')
    const unsubscribe = onValue(
      dbRef,
      (snapshot) => {
        loaded = true
        const value = snapshot.val()
        // Realtime Database returns an array or an object keyed by id; ignore null entries.
        setNftData(value ? Object.values(value).filter(Boolean) : [])
        setLoadFailed(false)
        setLoading(false)
      },
      (error) => {
        console.warn('Failed to load NFTData', error)
        fail()
      }
    )
    // The database requires App Check. On a device that can't be attested, reads are refused without
    // an error callback, so report the failure instead of showing "Loading..." forever.
    appCheckReady.then((ok) => { if (!ok) fail() })
    const timeout = setTimeout(fail, 15000)
    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [])

  const visibleData = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return nftData
    return nftData.filter((item) => item.name?.toLowerCase().includes(term))
  }, [nftData, query])

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: colors.headerBg }}>
      <FocusedStatusBar barStyle={colors.statusBar} backgroundColor='transparent' translucent={true} />
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
                color: colors.textSubtle,
              }}>
                {loading ? 'Loading...' : loadFailed ? 'Couldn’t load NFTs on this device.' : 'No NFTs found'}
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
          <View style={{ height: 300 + insets.top, backgroundColor: colors.headerBg }} />
          <View style={{ flex: 1, backgroundColor: colors.background }} />
        </View>
      </View>
    </View>
  )
}

export default Home
