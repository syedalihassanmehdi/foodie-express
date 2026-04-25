import React, { useState } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
  Image, Alert, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import * as Location from 'expo-location';
import { Theme } from '@/constants/theme';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { addOrder, subscribeToOffers, type Offer } from '@/lib/firestore';
import { useRouter } from 'expo-router';

export default function CartScreen() {
  const { cart, increase, decrease, remove, clearCart, cartTotal, cartCount } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<Offer | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  // Delivery Details state
  const [customerName, setCustomerName] = useState(user?.displayName || '');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isLocating, setIsLocating] = useState(false);

  React.useEffect(() => {
    const unsub = subscribeToOffers(setOffers);
    return () => unsub();
  }, []);

  React.useEffect(() => {
    if (user?.displayName && !customerName) {
      setCustomerName(user.displayName);
    }
  }, [user]);

  const getCurrentLocation = async () => {
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
        const addressParts = [
          geoCode.name,
          geoCode.street,
          geoCode.city,
          geoCode.region,
          geoCode.country,
        ].filter(Boolean);
        setCustomerAddress(addressParts.join(', '));
      }
    } catch (err) {
      console.log('Location error:', err);
    } finally {
      setIsLocating(false);
    }
  };

  React.useEffect(() => {
    // Auto-fetch location if no address is set when screen loads
    if (!customerAddress) {
      getCurrentLocation();
    }
  }, []);

  const deliveryFee = cartTotal > 0 ? 3.99 : 0;
  const subtotal = cartTotal;

  let discountAmount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percent') {
      discountAmount = subtotal * (appliedPromo.value / 100);
    } else if (appliedPromo.type === 'flat') {
      discountAmount = appliedPromo.value;
    } else if (appliedPromo.type === 'free_delivery') {
      discountAmount = deliveryFee;
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discountAmount);

  const handleApplyPromo = () => {
    if (!promoCode.trim()) return;
    const found = offers.find(o => o.code.toUpperCase() === promoCode.trim().toUpperCase() && o.active);
    if (found) {
      setAppliedPromo(found);
      Alert.alert('Success', `${found.title} applied!`);
    } else {
      Alert.alert('Invalid Code', 'This promo code does not exist or has expired.');
      setAppliedPromo(null);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to place your order.', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => router.push('/(tabs)/profile') },
      ]);
      return;
    }

    if (cart.length === 0) return;

    if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
      Alert.alert('Missing Details', 'Please fill in your name, phone, and delivery address before placing the order.');
      return;
    }

    try {
      await addOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: cart.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        total: total,
        status: 'pending',
        userId: user.uid,
        notes: '',
        discount: discountAmount > 0 ? discountAmount : undefined,
        promoCode: appliedPromo ? appliedPromo.code : undefined,
      });
      clearCart();
      Alert.alert('Order Successful! 🎉', 'Your delicious meal is being prepared.', [
        { text: 'View Orders', onPress: () => router.push('/(tabs)/profile') }
      ]);
    } catch (err) {
      Alert.alert('Error', 'We couldn\'t place your order. Please try again.');
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Animated.Image
            entering={FadeInDown}
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/11329/11329073.png' }}
            style={styles.emptyImg}
          />
          <Animated.Text entering={FadeInUp.delay(200)} style={styles.emptyTitle}>Your cart is empty</Animated.Text>
          <Animated.Text entering={FadeInUp.delay(300)} style={styles.emptyDesc}>Add some delicious meals to get started!</Animated.Text>
          <Animated.View entering={FadeInUp.delay(400)}>
            <Pressable style={styles.browseBtn} onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.browseBtnText}>Explore Menu</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Cart</Text>
          <Pressable onPress={() => clearCart()}>
            <Text style={styles.clearAll}>Clear All</Text>
          </Pressable>
        </View>
        <Text style={styles.headerSub}>{cartCount} Items selected</Text>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Cart Items */}
        <View style={styles.itemsSection}>
          {cart.map((item, index) => (
            <Animated.View 
              key={item.id} 
              layout={Layout.springify()} 
              entering={FadeInDown.delay(index * 100)}
              style={styles.itemCard}
            >
              <Image source={{ uri: item.image }} style={styles.itemImg} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                <View style={styles.qtyControls}>
                  <Pressable onPress={() => decrease(item.id)} style={styles.qtyBtn}>
                    <Ionicons name="remove" size={16} color={Theme.colors.text} />
                  </Pressable>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <Pressable onPress={() => increase(item.id)} style={styles.qtyBtn}>
                    <Ionicons name="add" size={16} color={Theme.colors.text} />
                  </Pressable>
                </View>
              </View>
              <Pressable style={styles.removeBtn} onPress={() => remove(item.id)}>
                <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
              </Pressable>
            </Animated.View>
          ))}
        </View>

        {/* Promo Code */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionTitle}>Promo Code</Text>
          <View style={styles.promoInputRow}>
            <TextInput
              placeholder="Enter code"
              style={styles.promoInput}
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
              placeholderTextColor={Theme.colors.textLight}
            />
            <Pressable style={styles.applyBtn} onPress={handleApplyPromo}>
              <Text style={styles.applyBtnText}>Apply</Text>
            </Pressable>
          </View>
        </View>

        {/* Delivery Details */}
        <View style={styles.deliverySection}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.deliveryForm}>
            <TextInput
              placeholder="Full Name"
              style={styles.deliveryInput}
              value={customerName}
              onChangeText={setCustomerName}
              placeholderTextColor={Theme.colors.textLight}
            />
            <TextInput
              placeholder="Phone Number"
              style={styles.deliveryInput}
              value={customerPhone}
              onChangeText={setCustomerPhone}
              keyboardType="phone-pad"
              placeholderTextColor={Theme.colors.textLight}
            />
            <View style={styles.addressWrapper}>
              <TextInput
                placeholder="Delivery Address"
                style={[styles.deliveryInput, { height: 80, textAlignVertical: 'top', paddingRight: 40 }]}
                value={customerAddress}
                onChangeText={setCustomerAddress}
                multiline
                placeholderTextColor={Theme.colors.textLight}
              />
              <Pressable style={styles.locateBtn} onPress={getCurrentLocation}>
                <Ionicons name="location" size={20} color={isLocating ? Theme.colors.textLight : Theme.colors.primary} />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>${deliveryFee.toFixed(2)}</Text>
            </View>
            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: Theme.colors.success }]}>
                  Discount {appliedPromo?.type === 'percent' ? `(${appliedPromo.value}%)` : ''}
                </Text>
                <Text style={[styles.summaryValue, { color: Theme.colors.success }]}>-${discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Footer Checkout Button */}
      <View style={styles.footer}>
        <Pressable style={styles.checkoutBtn} onPress={handlePlaceOrder}>
          <View style={styles.checkoutBtnLeft}>
            <Text style={styles.checkoutTotal}>${total.toFixed(2)}</Text>
            <Text style={styles.checkoutItems}>{cartCount} Items</Text>
          </View>
          <View style={styles.checkoutBtnRight}>
            <Text style={styles.checkoutBtnText}>Checkout Now</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.surface },
  header: {
    backgroundColor: Theme.colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    ...Theme.shadows.soft,
    borderBottomWidth: 1,
    borderColor: Theme.colors.border,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  headerTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 24, color: Theme.colors.text, letterSpacing: -0.5 },
  headerSub: { fontFamily: 'DMSans_500Medium', fontSize: 13, color: Theme.colors.textLight, marginTop: 4 },
  clearAll: { fontFamily: 'DMSans_700Bold', fontSize: 13, color: Theme.colors.error },

  scrollContent: { paddingTop: 20 },

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, marginTop: 100 },
  emptyImg: { width: 140, height: 140, marginBottom: 24, opacity: 0.8 },
  emptyTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 24, color: Theme.colors.text, textAlign: 'center' },
  emptyDesc: { fontFamily: 'DMSans_400Regular', fontSize: 15, color: Theme.colors.textLight, textAlign: 'center', marginTop: 10, lineHeight: 22 },
  browseBtn: {
    backgroundColor: Theme.colors.primary, paddingVertical: 16, paddingHorizontal: 36,
    borderRadius: Theme.borderRadius.lg, marginTop: 32, ...Theme.shadows.medium
  },
  browseBtnText: { fontFamily: 'Syne_700Bold', fontSize: 16, color: '#fff' },

  itemsSection: { paddingHorizontal: 20, gap: 16 },
  itemCard: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.xl, padding: 12, ...Theme.shadows.soft,
    borderWidth: 1, borderColor: Theme.colors.border
  },
  itemImg: { width: 90, height: 90, borderRadius: Theme.borderRadius.lg },
  itemInfo: { flex: 1, marginLeft: 16, justifyContent: 'center' },
  itemName: { fontFamily: 'Syne_700Bold', fontSize: 16, color: Theme.colors.text },
  itemPrice: { fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: Theme.colors.primary, marginTop: 4 },
  qtyControls: { 
    flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10,
    backgroundColor: Theme.colors.surface, borderRadius: 20, padding: 4, alignSelf: 'flex-start'
  },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: Theme.colors.background, alignItems: 'center', justifyContent: 'center', ...Theme.shadows.soft },
  qtyText: { fontFamily: 'Syne_700Bold', fontSize: 14, color: Theme.colors.text, minWidth: 18, textAlign: 'center' },
  removeBtn: { padding: 8 },

  promoSection: { padding: 20, marginTop: 10 },
  sectionTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: Theme.colors.text, marginBottom: 16 },
  promoInputRow: { flexDirection: 'row', gap: 12 },
  promoInput: {
    flex: 1, height: 54, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 20, fontFamily: 'DMSans_500Medium', fontSize: 15, borderWidth: 1, borderColor: Theme.colors.border, color: Theme.colors.text
  },
  applyBtn: { backgroundColor: Theme.colors.primary, paddingHorizontal: 24, borderRadius: Theme.borderRadius.lg, justifyContent: 'center' },
  applyBtnText: { fontFamily: 'Syne_700Bold', fontSize: 14, color: '#fff' },

  deliverySection: { paddingHorizontal: 20, marginTop: 10 },
  deliveryForm: { gap: 12 },
  deliveryInput: {
    height: 54, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 20, fontFamily: 'DMSans_500Medium', fontSize: 15, borderWidth: 1, borderColor: Theme.colors.border, color: Theme.colors.text
  },
  addressWrapper: { position: 'relative' },
  locateBtn: { position: 'absolute', right: 12, top: 12, padding: 4 },

  summarySection: { padding: 20, marginTop: 10 },
  summaryCard: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl,
    padding: 20, ...Theme.shadows.soft, borderWidth: 1, borderColor: Theme.colors.border
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontFamily: 'DMSans_500Medium', fontSize: 15, color: Theme.colors.textLight },
  summaryValue: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Theme.colors.text },
  divider: { height: 1, backgroundColor: Theme.colors.border, marginVertical: 12, borderStyle: 'dashed' },
  totalLabel: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.text },
  totalValue: { fontFamily: 'Syne_800ExtraBold', fontSize: 24, color: Theme.colors.primary },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'transparent', padding: 20, paddingBottom: 40
  },
  checkoutBtn: {
    backgroundColor: Theme.colors.primary, height: 70, borderRadius: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, ...Theme.shadows.premium
  },
  checkoutBtnLeft: { gap: 2 },
  checkoutTotal: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: '#fff' },
  checkoutItems: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  checkoutBtnRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  checkoutBtnText: { fontFamily: 'Syne_700Bold', fontSize: 16, color: '#fff' },
});

