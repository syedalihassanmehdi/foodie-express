import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
  Image, FlatList, TextInput, Dimensions, Modal, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInUp, 
  FadeInRight, 
  FadeInDown,
  Layout,
  SlideInRight
} from 'react-native-reanimated';
import { Theme } from '@/constants/theme';
import { useMenuData } from '@/lib/menuData';
import { useRouter } from 'expo-router';
import { subscribeToOffers, subscribeToBundles, subscribeToUserAddresses, type Offer, type Bundle, type Address } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { categories, loading: menuLoading } = useMenuData();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const allItems = categories.flatMap(c => c.items);
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
  const firstName = user?.displayName?.split(' ')[0] || 'Foodie';
  
  // Location States
  const [currentAddress, setCurrentAddress] = useState('Select Location');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const loadAddress = async () => {
      try {
        const saved = await AsyncStorage.getItem('user_address');
        if (saved === '123 Foodie Street, NY') {
          await AsyncStorage.removeItem('user_address');
          setCurrentAddress('Select Location');
        } else if (saved) {
          setCurrentAddress(saved);
        } else {
          setCurrentAddress('Select Location');
        }
      } catch (err) {
        console.warn('Failed to load address', err);
        setCurrentAddress('Select Location');
      }
    };
    loadAddress();

    const u1 = subscribeToOffers(setOffers);
    const u2 = subscribeToBundles(b => setBundles(b.filter(x => x.active)));
    
    let u3: () => void;
    if (user) {
      u3 = subscribeToUserAddresses(user.uid, setSavedAddresses);
    }
    
    return () => { 
      u1(); 
      u2(); 
      if (u3) u3();
    };
  }, [user]);

  const handleSelectAddress = async (addr: string) => {
    setCurrentAddress(addr);
    setShowLocationModal(false);
    try {
      await AsyncStorage.setItem('user_address', addr);
    } catch (err) {
      console.warn('Failed to save address', err);
    }
  };

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setIsLocating(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let [geoCode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      if (geoCode) {
        const addressParts = [geoCode.name, geoCode.street, geoCode.city].filter(Boolean);
        const newAddr = addressParts.join(', ');
        handleSelectAddress(newAddr);
      }
    } catch (err) {
      console.log('Location error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header & Search */}
      <LinearGradient 
        colors={['#1a1a1a', 'transparent']} 
        style={styles.headerGradient}
      >
        <SafeAreaView edges={['top']} style={styles.headerContainer}>
          <View style={styles.headerTop}>
            <Animated.View entering={FadeInDown.delay(100)}>
              <Text style={styles.greetingText}>{greeting}, {firstName} 👋</Text>
              <Pressable style={styles.locationSelector} onPress={() => setShowLocationModal(true)}>
                <Ionicons name="location" size={18} color={Theme.colors.primary} />
                <Text style={styles.locationText} numberOfLines={1}>{currentAddress}</Text>
                <Ionicons name="chevron-down" size={16} color={Theme.colors.primary} />
              </Pressable>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(200)}>
              <Pressable style={styles.profileBtn} onPress={() => router.push('/(tabs)/profile')}>
                <Ionicons name="person" size={20} color={Theme.colors.primary} />
              </Pressable>
            </Animated.View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Floating Search Bar */}
      <Animated.View entering={FadeInUp.delay(300)} style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color={Theme.colors.textLight} />
          <TextInput
            placeholder="What are you craving?"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Theme.colors.textLight}
          />
          <View style={styles.filterBtn}>
            <Ionicons name="options-outline" size={20} color={Theme.colors.primary} />
          </View>
        </View>
      </Animated.View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        decelerationRate="normal"
      >
        {/* Offers Slider */}
        {offers.length > 0 && (
          <View style={styles.section}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={offers.filter(o => o.active)}
              keyExtractor={item => item.id}
              snapToInterval={width * 0.85 + 16}
              decelerationRate="fast"
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInRight.delay(index * 200)}>
                  <LinearGradient
                    colors={[Theme.colors.primary, Theme.colors.accent]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.offerCard}
                  >
                    <View style={styles.offerInfo}>
                      <View style={styles.offerBadgeBox}>
                        <Text style={styles.offerBadge}>PROMO</Text>
                      </View>
                      <Text style={styles.offerTitle}>{item.title}</Text>
                      <Text style={styles.offerDesc}>{item.description}</Text>
                      <Pressable style={styles.claimBtn}>
                        <Text style={styles.claimBtnText}>Claim: {item.code}</Text>
                      </Pressable>
                    </View>
                    <Ionicons name="flash" size={120} color="rgba(255,255,255,0.15)" style={styles.offerIcon} />
                  </LinearGradient>
                </Animated.View>
              )}
            />
          </View>
        )}

        {/* Categories Pills */}
        <View style={styles.section}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categories}
            keyExtractor={item => item.slug}
            contentContainerStyle={styles.horizontalList}
            renderItem={({ item, index }) => (
              <Animated.View entering={FadeInRight.delay(index * 100)}>
                <Pressable style={styles.catPill} onPress={() => router.push('/(tabs)/menu')}>
                  <Image source={{ uri: item.image }} style={styles.catPillImg} />
                  <Text style={styles.catPillName}>{item.name}</Text>
                </Pressable>
              </Animated.View>
            )}
          />
        </View>

        {/* Exclusive Bundles */}
        {bundles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Exclusive Bundles</Text>
              <Pressable onPress={() => router.push('/(tabs)/menu')}>
                <Text style={styles.viewAll}>See All</Text>
              </Pressable>
            </View>
            {bundles.slice(0, 2).map((bundle, index) => (
              <Animated.View key={bundle.id} entering={FadeInUp.delay(index * 200)}>
                <Pressable style={styles.bundleCard} onPress={() => router.push('/(tabs)/menu')}>
                  <View style={styles.bundleInfo}>
                    <Text style={styles.bundleName}>{bundle.name}</Text>
                    <Text style={styles.bundleDesc} numberOfLines={2}>{bundle.description}</Text>
                    <View style={styles.discountBadge}>
                      <Ionicons name="pricetag" size={12} color="#fff" />
                      <Text style={styles.discountText}>SAVE {bundle.discount}%</Text>
                    </View>
                  </View>
                  <View style={styles.bundleImages}>
                    {bundle.categories[0]?.items.slice(0, 3).map((item, idx) => (
                      <View key={item.id} style={[styles.bundleImgWrap, { marginLeft: idx === 0 ? 0 : -25, zIndex: 3 - idx }]}>
                        <Image
                          source={{ uri: item.image }}
                          style={styles.bundleImg}
                        />
                      </View>
                    ))}
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}

        {/* Popular Items */}
        {allItems.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular Items</Text>
            </View>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={allItems.slice(0, 6)}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.horizontalList}
              renderItem={({ item, index }) => (
                <Animated.View entering={FadeInRight.delay(index * 100)}>
                  <Pressable style={styles.popularCard} onPress={() => router.push('/(tabs)/menu')}>
                    <Image source={{ uri: item.image }} style={styles.popularImg} />
                    <View style={styles.popularInfo}>
                      <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                      <Text style={styles.popularCat}>{item.category || 'Special'}</Text>
                      <View style={styles.popularMeta}>
                        <Text style={styles.popularPrice}>${item.price.toFixed(2)}</Text>
                        <Pressable 
                          style={styles.popularAddBtn}
                          onPress={() => addToCart({
                            id: item.id,
                            name: item.name,
                            desc: item.desc,
                            image: item.image,
                            price: item.price,
                          })}
                        >
                          <Ionicons name="add" size={16} color="#fff" />
                        </Pressable>
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              )}
            />
          </View>
        )}

        {/* Featured Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <Animated.View entering={FadeInUp.delay(400)}>
            <Pressable style={styles.trendingCard} onPress={() => router.push('/(tabs)/menu')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80' }}
                style={styles.trendingImg}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.trendingOverlay}
              >
                <View>
                  <Text style={styles.trendingName}>Gourmet Steak House</Text>
                  <View style={styles.trendingMeta}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.ratingText}>4.9</Text>
                    </View>
                    <Text style={styles.trendingTime}>• 20-30 min</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        {/* Fast Delivery Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fastest Delivery ⚡</Text>
          </View>
          <Animated.View entering={FadeInUp.delay(500)}>
            <Pressable style={styles.trendingCard} onPress={() => router.push('/(tabs)/menu')}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80' }}
                style={styles.trendingImg}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.trendingOverlay}
              >
                <View>
                  <Text style={styles.trendingName}>Luigi's Pizza Oven</Text>
                  <View style={styles.trendingMeta}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#fff" />
                      <Text style={styles.ratingText}>4.8</Text>
                    </View>
                    <Text style={styles.trendingTime}>• 10-15 min</Text>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <Pressable onPress={() => setShowLocationModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </Pressable>
            </View>

            <Pressable style={styles.currentLocBtn} onPress={handleGetCurrentLocation}>
              <Ionicons name="locate" size={20} color={Theme.colors.primary} />
              <Text style={styles.currentLocText}>Use Current Location</Text>
              {isLocating && <ActivityIndicator size="small" color={Theme.colors.primary} style={{ marginLeft: 'auto' }} />}
            </Pressable>

            <Text style={styles.savedLocTitle}>Saved Locations</Text>
            
            {savedAddresses.length > 0 ? savedAddresses.map((addr, index) => (
              <Pressable key={index} style={styles.savedLocItem} onPress={() => handleSelectAddress(addr.address)}>
                <View style={styles.locIconBox}>
                  <Ionicons name={addr.label.toLowerCase() === 'home' ? 'home' : (addr.label.toLowerCase() === 'work' ? 'briefcase' : 'location')} size={20} color={Theme.colors.text} />
                </View>
                <View>
                  <Text style={styles.locLabel}>{addr.label}</Text>
                  <Text style={styles.locDesc}>{addr.address}</Text>
                </View>
              </Pressable>
            )) : (
              <Text style={{ fontFamily: 'DMSans_400Regular', color: Theme.colors.textLight, marginBottom: 20 }}>
                No saved locations yet. Add them in your Profile.
              </Text>
            )}

            <Pressable style={styles.savedLocItem} onPress={() => { setShowLocationModal(false); router.push('/(tabs)/profile'); }}>
              <View style={styles.locIconBox}><Ionicons name="settings" size={20} color={Theme.colors.text} /></View>
              <Text style={styles.locLabel}>Manage Addresses in Profile</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background },
  headerGradient: { paddingBottom: 40, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 },
  headerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 },
  greetingText: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Theme.colors.textLight, marginBottom: 4 },
  locationSelector: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2, maxWidth: width * 0.6 },
  locationText: { fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: Theme.colors.text },
  profileBtn: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', ...Theme.shadows.premium,
    alignItems: 'center', justifyContent: 'center'
  },
  
  searchBarContainer: { marginTop: -28, paddingHorizontal: 20, zIndex: 10, marginBottom: 10 },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: Theme.colors.surface, borderRadius: 20,
    paddingHorizontal: 18, height: 60,
    borderWidth: 1, borderColor: Theme.colors.border,
    ...Theme.shadows.premium,
  },
  searchInput: { flex: 1, fontFamily: 'DMSans_500Medium', fontSize: 15, color: Theme.colors.text },
  filterBtn: { padding: 8, backgroundColor: 'rgba(249, 115, 22, 0.1)', borderRadius: 14 },

  scrollContent: { paddingTop: 10 },
  section: { marginBottom: 36 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, marginBottom: 20
  },
  sectionTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 22, color: Theme.colors.text, letterSpacing: -0.5 },
  viewAll: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Theme.colors.primary },

  horizontalList: { paddingHorizontal: 20, gap: 16 },

  // Offers
  offerCard: {
    width: width * 0.85, borderRadius: 24, padding: 24,
    flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden',
    ...Theme.shadows.premium
  },
  offerInfo: { flex: 1, zIndex: 1 },
  offerBadgeBox: { 
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 8, alignSelf: 'flex-start', marginBottom: 12
  },
  offerBadge: { fontFamily: 'Syne_800ExtraBold', fontSize: 10, color: '#fff', letterSpacing: 1 },
  offerTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 26, color: Theme.colors.white, lineHeight: 30, letterSpacing: -0.5 },
  offerDesc: { fontFamily: 'DMSans_500Medium', fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 8, marginBottom: 20 },
  claimBtn: {
    backgroundColor: Theme.colors.white, paddingVertical: 10, paddingHorizontal: 20,
    borderRadius: 20, alignSelf: 'flex-start'
  },
  claimBtnText: { fontFamily: 'Syne_800ExtraBold', fontSize: 13, color: Theme.colors.primary },
  offerIcon: { position: 'absolute', right: -20, bottom: -20 },

  // Categories Pills
  catPill: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surface,
    borderRadius: 30, paddingRight: 20, paddingLeft: 6, paddingVertical: 6,
    borderWidth: 1, borderColor: Theme.colors.border, gap: 10,
    ...Theme.shadows.soft
  },
  catPillImg: { width: 40, height: 40, borderRadius: 20 },
  catPillName: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Theme.colors.text },

  // Bundles
  bundleCard: {
    marginHorizontal: 20, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl,
    padding: 20, marginBottom: 16, flexDirection: 'row', alignItems: 'center',
    ...Theme.shadows.medium, borderWidth: 1, borderColor: Theme.colors.border
  },
  bundleInfo: { flex: 1 },
  bundleName: { fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: Theme.colors.text, letterSpacing: -0.5 },
  bundleDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Theme.colors.textLight, marginTop: 6, marginBottom: 12, lineHeight: 18 },
  discountBadge: {
    backgroundColor: Theme.colors.primary, paddingVertical: 6, paddingHorizontal: 12,
    borderRadius: 20, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4
  },
  discountText: { fontFamily: 'Syne_700Bold', fontSize: 10, color: '#fff' },
  bundleImages: { flexDirection: 'row', alignItems: 'center', paddingRight: 5 },
  bundleImgWrap: { 
    width: 60, height: 60, borderRadius: 30, borderWidth: 3, borderColor: Theme.colors.surface,
    ...Theme.shadows.medium, overflow: 'hidden'
  },
  bundleImg: { width: '100%', height: '100%' },

  // Trending
  trendingCard: { marginHorizontal: 20, borderRadius: Theme.borderRadius.xl, overflow: 'hidden', height: 200, ...Theme.shadows.medium },
  trendingImg: { width: '100%', height: '100%' },
  trendingOverlay: {
    position: 'absolute', inset: 0, justifyContent: 'flex-end', padding: 20
  },
  trendingName: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: '#fff' },
  trendingMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  ratingBadge: { 
    flexDirection: 'row', alignItems: 'center', gap: 4, 
    backgroundColor: 'rgba(255, 215, 0, 0.9)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12
  },
  ratingText: { fontFamily: 'DMSans_700Bold', fontSize: 12, color: '#000' },
  trendingTime: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.9)' },

  // Popular
  popularCard: {
    width: 150, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden', borderWidth: 1, borderColor: Theme.colors.border, ...Theme.shadows.soft
  },
  popularImg: { width: '100%', height: 110 },
  popularInfo: { padding: 12 },
  popularName: { fontFamily: 'Syne_700Bold', fontSize: 14, color: Theme.colors.text },
  popularCat: { fontFamily: 'DMSans_400Regular', fontSize: 11, color: Theme.colors.textLight, marginTop: 2, marginBottom: 8 },
  popularMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  popularPrice: { fontFamily: 'Syne_800ExtraBold', fontSize: 15, color: Theme.colors.primary },
  popularAddBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: Theme.colors.primary,
    alignItems: 'center', justifyContent: 'center'
  },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.overlay, justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: Theme.colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: Theme.colors.border
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.text },
  closeBtn: { padding: 4 },
  currentLocBtn: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Theme.colors.primaryLight,
    padding: 16, borderRadius: Theme.borderRadius.lg, marginBottom: 24
  },
  currentLocText: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Theme.colors.primary },
  savedLocTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Theme.colors.textLight, marginBottom: 16 },
  savedLocItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  locIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  locLabel: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Theme.colors.text },
  locDesc: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Theme.colors.textLight, marginTop: 2 },
});

