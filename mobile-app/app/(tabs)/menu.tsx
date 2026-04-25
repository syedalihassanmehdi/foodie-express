import React, { useState, useRef } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
  Image, ActivityIndicator, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  FadeInUp, 
  FadeOutUp, 
  Layout, 
  FadeInRight,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  useSharedValue
} from 'react-native-reanimated';
import { Theme } from '@/constants/theme';
import { useMenuData } from '@/lib/menuData';
import { useCart } from '@/context/CartContext';
import { type MenuItem } from '@/lib/firestore';

const { width } = Dimensions.get('window');

export default function MenuScreen() {
  const { categories, loading } = useMenuData();
  const { addToCart } = useCart();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [lastAdded, setLastAdded] = useState('');

  // Default to first category if none selected
  const activeSlug = selectedSlug || (categories.length > 0 ? categories[0].slug : null);
  const currentCategory = categories.find(c => c.slug === activeSlug);

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      desc: item.desc,
      image: item.image,
      price: item.price,
    });
    setLastAdded(item.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  if (loading && categories.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Explore Menu</Text>
          <View style={styles.searchIcon}>
            <Ionicons name="search" size={20} color={Theme.colors.text} />
          </View>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {categories.map((cat, index) => (
            <Animated.View key={cat.slug} entering={FadeInRight.delay(index * 100)}>
              <Pressable
                onPress={() => setSelectedSlug(cat.slug)}
                style={[
                  styles.catChip,
                  activeSlug === cat.slug && styles.catChipActive
                ]}
              >
                <Text style={[
                  styles.catChipText,
                  activeSlug === cat.slug && styles.catChipTextActive
                ]}>{cat.name}</Text>
              </Pressable>
            </Animated.View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Toast Notification */}
      {showToast && (
        <Animated.View 
          entering={FadeInUp} 
          exiting={FadeOutUp}
          style={styles.toastContainer}
        >
          <View style={styles.toast}>
            <Ionicons name="checkmark-circle" size={20} color={Theme.colors.success} />
            <Text style={styles.toastText}>{lastAdded} added to cart</Text>
          </View>
        </Animated.View>
      )}

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {currentCategory && (
          <View style={styles.content}>
            <View style={styles.heroSection}>
              <Image source={{ uri: currentCategory.image }} style={styles.heroImg} />
              <View style={styles.heroOverlay}>
                 <Animated.Text entering={FadeInUp} style={styles.heroTitle}>{currentCategory.name}</Animated.Text>
                 <Animated.Text entering={FadeInUp.delay(200)} style={styles.heroDesc}>{currentCategory.desc}</Animated.Text>
              </View>
            </View>

            <View style={styles.itemsGrid}>
              {currentCategory.items.map((item, index) => (
                <Animated.View 
                  key={item.id} 
                  style={styles.itemCard}
                >
                  <Image source={{ uri: item.image }} style={styles.itemImg} />
                  <View style={styles.itemInfo}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                      <View style={[styles.vegDot, { backgroundColor: item.veg ? '#34C759' : '#FF3B30' }]} />
                    </View>
                    <Text style={styles.itemDesc} numberOfLines={2}>{item.desc}</Text>
                    <View style={styles.itemFooter}>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                      <Pressable 
                        style={styles.addBtn} 
                        onPress={() => handleAddToCart(item)}
                      >
                        <Ionicons name="add" size={22} color="#fff" />
                      </Pressable>
                    </View>
                  </View>
                </Animated.View>
              ))}
            </View>
          </View>
        )}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.surface },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    backgroundColor: Theme.colors.surface,
    paddingBottom: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    ...Theme.shadows.soft,
    zIndex: 10,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
  },
  headerTop: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 12
  },
  headerTitle: {
    fontFamily: 'Syne_800ExtraBold', fontSize: 24, color: Theme.colors.text,
    letterSpacing: -0.5
  },
  searchIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.surface,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border
  },
  categoryScroll: { paddingHorizontal: 20, gap: 10 },
  catChip: {
    paddingHorizontal: 18, paddingVertical: 10, borderRadius: 25,
    backgroundColor: Theme.colors.surface, borderWidth: 1, borderColor: Theme.colors.border
  },
  catChipActive: { 
    backgroundColor: Theme.colors.primary, 
    borderColor: Theme.colors.primary,
    ...Theme.shadows.medium
  },
  catChipText: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Theme.colors.textLight },
  catChipTextActive: { color: '#fff' },

  scrollContent: { paddingTop: 0 },
  content: { gap: 0 },

  toastContainer: {
    position: 'absolute', top: 20, left: 0, right: 0,
    alignItems: 'center', zIndex: 100,
  },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: Theme.colors.surface, paddingVertical: 12, paddingHorizontal: 20,
    borderRadius: 30, ...Theme.shadows.medium, borderWidth: 1, borderColor: Theme.colors.border
  },
  toastText: { color: '#fff', fontFamily: 'DMSans_600SemiBold', fontSize: 14 },

  heroSection: { height: 220, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end', padding: 25
  },
  heroTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 32, color: '#fff', letterSpacing: -1 },
  heroDesc: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 4 },

  itemsGrid: { padding: 20, gap: 16 },
  itemCard: {
    flexDirection: 'row', backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden', ...Theme.shadows.soft, borderWidth: 1, borderColor: Theme.colors.border,
    height: 140
  },
  itemImg: { width: 130, height: '100%' },
  itemInfo: { flex: 1, padding: 15, justifyContent: 'space-between' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontFamily: 'Syne_700Bold', fontSize: 17, color: Theme.colors.text, flex: 1 },
  vegDot: { width: 10, height: 10, borderRadius: 5, marginLeft: 8 },
  itemDesc: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Theme.colors.textLight, lineHeight: 18 },
  itemFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemPrice: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.primary },
  addBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: Theme.colors.primary,
    alignItems: 'center', justifyContent: 'center', ...Theme.shadows.premium
  },
});

