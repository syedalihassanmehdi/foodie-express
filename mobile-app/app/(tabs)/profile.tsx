import React, { useState, useEffect } from 'react';
import {
  StyleSheet, View, Text, ScrollView, Pressable,
  TextInput, ActivityIndicator, Image, Modal, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Theme } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { subscribeToUserOrders, type Order, subscribeToUserAddresses, addAddress, deleteAddress, type Address } from '@/lib/firestore';

export default function ProfileScreen() {
  const { user, loading, login, signup, logout, error } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  // Addresses
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  useEffect(() => {
    if (!user) return;
    const unsubOrders = subscribeToUserOrders(user.uid, setOrders);
    const unsubAddresses = subscribeToUserAddresses(user.uid, setSavedAddresses);

    return () => {
      unsubOrders();
      unsubAddresses();
    };
  }, [user]);

  const handleAddAddress = async () => {
    if (!newLabel.trim() || !newAddress.trim()) {
      Alert.alert('Error', 'Please enter both label and address.');
      return;
    }
    if (savedAddresses.length >= 3) {
      Alert.alert('Limit Reached', 'You can only save up to 3 addresses.');
      return;
    }
    
    try {
      await addAddress({
        label: newLabel.trim(),
        address: newAddress.trim(),
        city: '',
        notes: '',
        isDefault: savedAddresses.length === 0,
        userId: user!.uid
      });
      setNewLabel('');
      setNewAddress('');
    } catch (e) {
      console.log('Error adding address:', e);
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      await deleteAddress(id);
    } catch (e) {
      console.log('Error deleting address:', e);
    }
  };

  const handleAuth = async () => {
    if (!email || !password) return;
    setSubmitting(true);
    try {
      if (isLogin) await login(email, password);
      else await signup(email, password, name);
    } catch {}
    setSubmitting(false);
  };

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color={Theme.colors.primary} /></View>
  );

  if (!user) return (
    <SafeAreaView style={styles.authContainer}>
      <ScrollView contentContainerStyle={styles.authScroll}>
        <Animated.View entering={FadeInDown} style={styles.authHeader}>
          <View style={styles.authLogoBox}>
            <Ionicons name="fast-food" size={40} color={Theme.colors.primary} />
          </View>
          <Text style={styles.authTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.authSubtitle}>{isLogin ? 'Sign in to continue ordering' : 'Join the community of food lovers'}</Text>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.authForm}>
          {error && <Text style={styles.errorText}>{error}</Text>}
          {!isLogin && (
            <TextInput placeholder="Full Name" style={styles.input} value={name} onChangeText={setName} placeholderTextColor={Theme.colors.textLight} />
          )}
          <TextInput placeholder="Email Address" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor={Theme.colors.textLight} />
          <TextInput placeholder="Password" style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor={Theme.colors.textLight} />

          <Pressable style={styles.mainBtn} onPress={handleAuth} disabled={submitting}>
            <Text style={styles.mainBtnText}>{submitting ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}</Text>
          </Pressable>

          <Pressable onPress={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={{ color: Theme.colors.primary, fontWeight: '700' }}>{isLogin ? 'Sign Up' : 'Login'}</Text>
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#1a1a1a', Theme.colors.background]} style={styles.profileHeader}>
        <SafeAreaView edges={['top']}>
           <Animated.View entering={FadeInDown} style={styles.profileInfoCentered}>
              <View style={styles.avatarLarge}>
                 <Text style={styles.avatarTextLarge}>{user.displayName?.[0] || user.email?.[0].toUpperCase()}</Text>
                 <View style={styles.onlineDotLarge} />
              </View>
              <Text style={styles.userNameLarge}>{user.displayName || 'Foodie Customer'}</Text>
              <Text style={styles.userEmailLarge}>{user.email}</Text>
              <Pressable style={styles.editProfileBtn}>
                 <Text style={styles.editProfileText}>Edit Profile</Text>
              </Pressable>
           </Animated.View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.delay(200)} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statVal}>{orders.length}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Elite</Text>
            </View>
            <Text style={styles.statLabel}>Membership</Text>
          </View>
        </Animated.View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Account Settings</Text>
          <Pressable style={styles.menuRow} onPress={() => setShowAddressModal(true)}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
              <Ionicons name="location" size={20} color="#007AFF" />
            </View>
            <Text style={styles.menuLabel}>Saved Addresses</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textLight} />
          </Pressable>
          <Pressable style={styles.menuRow} onPress={() => setShowNotificationsModal(true)}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
              <Ionicons name="notifications" size={20} color="#34C759" />
            </View>
            <Text style={styles.menuLabel}>Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textLight} />
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Promos & Rewards</Text>
          <Pressable style={styles.menuRow}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(217, 119, 6, 0.1)' }]}>
              <Ionicons name="gift" size={20} color="#D97706" />
            </View>
            <Text style={styles.menuLabel}>Invite Friends</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textLight} />
          </Pressable>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuTitle}>Support</Text>
          <Pressable style={styles.menuRow}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}>
              <Ionicons name="help-buoy" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.menuLabel}>Help Center</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textLight} />
          </Pressable>
          <Pressable style={styles.menuRow}>
            <View style={[styles.menuIconBox, { backgroundColor: 'rgba(156, 163, 175, 0.1)' }]}>
              <Ionicons name="chatbubbles" size={20} color="#9CA3AF" />
            </View>
            <Text style={styles.menuLabel}>Live Chat Support</Text>
            <Ionicons name="chevron-forward" size={18} color={Theme.colors.textLight} />
          </Pressable>
        </View>

        {/* Recent Orders */}
        {orders.length > 0 && (
          <View style={styles.menuSection}>
            <Text style={styles.menuTitle}>Recent Activity</Text>
            {orders.slice(0, 3).map(order => (
              <Animated.View key={order.id} layout={Layout} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderIdText}>Order #{order.id.slice(-6).toUpperCase()}</Text>
                    <Text style={styles.orderDateText}>Placed on 24 Apr, 2026</Text>
                  </View>
                  <View style={[styles.statusBadgeSmall, { backgroundColor: order.status === 'delivered' ? '#D1FAE5' : '#FEF3C7' }]}>
                    <Text style={[styles.statusTextSmall, { color: order.status === 'delivered' ? '#059669' : '#D97706' }]}>{order.status.toUpperCase()}</Text>
                  </View>
                </View>
                <View style={styles.orderDivider} />
                <Text style={styles.orderItemsText} numberOfLines={1}>
                  {order.items.map(i => i.name).join(', ')}
                </Text>
                <View style={styles.orderFooter}>
                   <Text style={styles.orderTotalText}>${order.total.toFixed(2)}</Text>
                   <Pressable style={styles.reorderBtn}>
                      <Text style={styles.reorderText}>Reorder</Text>
                   </Pressable>
                </View>
              </Animated.View>
            ))}
          </View>
        )}

        <View style={styles.logoutSection}>
          <Pressable style={styles.logoutBtn} onPress={logout}>
            <Ionicons name="log-out-outline" size={20} color={Theme.colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Address Modal */}
      <Modal
        visible={showAddressModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddressModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Saved Addresses</Text>
              <Pressable onPress={() => setShowAddressModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </Pressable>
            </View>

            {savedAddresses.map((addr) => (
              <View key={addr.id} style={styles.addressItem}>
                <View style={styles.locIconBox}>
                  <Ionicons name={addr.label.toLowerCase() === 'home' ? 'home' : (addr.label.toLowerCase() === 'work' ? 'briefcase' : 'location')} size={20} color={Theme.colors.text} />
                </View>
                <View style={styles.addressInfo}>
                  <Text style={styles.locLabel}>{addr.label}</Text>
                  <Text style={styles.locDesc}>{addr.address}</Text>
                </View>
                <Pressable onPress={() => handleRemoveAddress(addr.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={20} color={Theme.colors.error} />
                </Pressable>
              </View>
            ))}

            {savedAddresses.length === 0 && (
              <Text style={styles.emptyText}>No saved addresses yet.</Text>
            )}

            {savedAddresses.length < 3 && (
              <View style={styles.addAddressForm}>
                <Text style={styles.addTitle}>Add New Address ({3 - savedAddresses.length} remaining)</Text>
                <TextInput
                  placeholder="Label (e.g., Home, Work, Gym)"
                  style={styles.modalInput}
                  value={newLabel}
                  onChangeText={setNewLabel}
                  placeholderTextColor={Theme.colors.textLight}
                />
                <TextInput
                  placeholder="Full Address"
                  style={styles.modalInput}
                  value={newAddress}
                  onChangeText={setNewAddress}
                  placeholderTextColor={Theme.colors.textLight}
                />
                <Pressable style={styles.saveBtn} onPress={handleAddAddress}>
                  <Text style={styles.saveBtnText}>Save Address</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={showNotificationsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNotificationsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notifications</Text>
              <Pressable onPress={() => setShowNotificationsModal(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color={Theme.colors.text} />
              </Pressable>
            </View>
            
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
               <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(52, 199, 89, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                 <Ionicons name="notifications-off" size={40} color="#34C759" />
               </View>
               <Text style={{ fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.text, marginBottom: 8 }}>You're all caught up!</Text>
               <Text style={{ fontFamily: 'DMSans_400Regular', fontSize: 14, color: Theme.colors.textLight, textAlign: 'center' }}>
                 You don't have any new notifications right now. We'll let you know when there's an update on your order.
               </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.surface },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  authContainer: { flex: 1, backgroundColor: Theme.colors.background },
  authScroll: { padding: 30, flexGrow: 1, justifyContent: 'center' },
  authHeader: { alignItems: 'center', marginBottom: 40 },
  authLogoBox: { width: 80, height: 80, borderRadius: 20, backgroundColor: Theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: 20, borderWidth: 1, borderColor: Theme.colors.border },
  authTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 28, color: Theme.colors.text, letterSpacing: -0.5 },
  authSubtitle: { fontFamily: 'DMSans_400Regular', fontSize: 15, color: Theme.colors.textLight, marginTop: 8, textAlign: 'center' },
  authForm: { gap: 16 },
  input: {
    height: 56, backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 20, fontFamily: 'DMSans_500Medium', fontSize: 15, borderWidth: 1, borderColor: Theme.colors.border
  },
  mainBtn: { backgroundColor: Theme.colors.primary, height: 56, borderRadius: Theme.borderRadius.lg, alignItems: 'center', justifyContent: 'center', ...Theme.shadows.medium },
  mainBtnText: { fontFamily: 'Syne_700Bold', fontSize: 16, color: '#fff' },
  toggleBtn: { marginTop: 10, alignItems: 'center' },
  toggleText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Theme.colors.textLight },
  errorText: { color: Theme.colors.error, fontFamily: 'DMSans_500Medium', fontSize: 13, textAlign: 'center' },

  profileHeader: { paddingBottom: 20 },
  profileInfoCentered: { alignItems: 'center', marginTop: 10 },
  avatarLarge: { 
    width: 96, height: 96, borderRadius: 48, 
    backgroundColor: 'rgba(249, 115, 22, 0.1)', 
    alignItems: 'center', justifyContent: 'center', 
    borderWidth: 2, borderColor: Theme.colors.primary, 
    position: 'relative', marginBottom: 16 
  },
  avatarTextLarge: { fontFamily: 'Syne_800ExtraBold', fontSize: 38, color: Theme.colors.primary },
  onlineDotLarge: { position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: Theme.colors.success, borderWidth: 3, borderColor: Theme.colors.background },
  userNameLarge: { fontFamily: 'Syne_800ExtraBold', fontSize: 24, color: Theme.colors.text, letterSpacing: -0.5 },
  userEmailLarge: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Theme.colors.textLight, marginTop: 4 },
  editProfileBtn: { marginTop: 16, paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  editProfileText: { fontFamily: 'DMSans_600SemiBold', fontSize: 13, color: Theme.colors.text },

  statsRow: {
    flexDirection: 'row', backgroundColor: Theme.colors.surface, marginHorizontal: 20, marginTop: 10,
    padding: 20, borderRadius: Theme.borderRadius.xl, ...Theme.shadows.premium,
    borderWidth: 1, borderColor: Theme.colors.border
  },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.text },
  statLabel: { fontFamily: 'DMSans_500Medium', fontSize: 12, color: Theme.colors.textLight, marginTop: 6 },
  statDivider: { width: 1, height: '100%', backgroundColor: Theme.colors.border },
  statusBadge: { backgroundColor: Theme.colors.accent, paddingHorizontal: 10, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontFamily: 'Syne_700Bold', fontSize: 12, color: '#000' },

  menuSection: { paddingHorizontal: 20, marginTop: 16 },
  menuTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 16, color: Theme.colors.text, marginBottom: 16, marginTop: 10, letterSpacing: -0.5 },
  menuRow: { 
    flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, 
    backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: Theme.borderRadius.xl,
    marginBottom: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)'
  },
  menuIconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: Theme.colors.background },
  menuLabel: { flex: 1, fontFamily: 'DMSans_600SemiBold', fontSize: 15, color: Theme.colors.text },
  newBadge: { backgroundColor: Theme.colors.error, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8 },
  newBadgeText: { fontFamily: 'Syne_700Bold', fontSize: 10, color: '#fff' },

  orderCard: {
    backgroundColor: Theme.colors.surface, borderRadius: Theme.borderRadius.xl,
    padding: 16, marginBottom: 16, borderWidth: 1, borderColor: Theme.colors.border, ...Theme.shadows.soft
  },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderIdText: { fontFamily: 'Syne_700Bold', fontSize: 15, color: Theme.colors.text },
  orderDateText: { fontFamily: 'DMSans_400Regular', fontSize: 12, color: Theme.colors.textLight, marginTop: 2 },
  statusBadgeSmall: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  statusTextSmall: { fontFamily: 'Syne_700Bold', fontSize: 10 },
  orderDivider: { height: 1, backgroundColor: Theme.colors.border, marginVertical: 12 },
  orderItemsText: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Theme.colors.textLight },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  orderTotalText: { fontFamily: 'Syne_800ExtraBold', fontSize: 18, color: Theme.colors.text },
  reorderBtn: { backgroundColor: Theme.colors.surface, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: Theme.colors.border },
  reorderText: { fontFamily: 'Syne_700Bold', fontSize: 12, color: Theme.colors.text },

  logoutSection: { padding: 20, marginTop: 10 },
  logoutBtn: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    padding: 18, borderRadius: Theme.borderRadius.lg, backgroundColor: 'rgba(255, 75, 75, 0.1)',
    borderWidth: 1, borderColor: 'rgba(255, 75, 75, 0.3)'
  },
  logoutText: { fontFamily: 'Syne_700Bold', fontSize: 15, color: Theme.colors.error },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: Theme.colors.overlay, justifyContent: 'flex-end' },
  modalContent: { 
    backgroundColor: Theme.colors.surface, borderTopLeftRadius: 32, borderTopRightRadius: 32,
    padding: 24, paddingBottom: 40, borderWidth: 1, borderColor: Theme.colors.border, minHeight: '50%'
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontFamily: 'Syne_800ExtraBold', fontSize: 20, color: Theme.colors.text },
  closeBtn: { padding: 4 },
  addressItem: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  addressInfo: { flex: 1 },
  locIconBox: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Theme.colors.border },
  locLabel: { fontFamily: 'DMSans_700Bold', fontSize: 15, color: Theme.colors.text },
  locDesc: { fontFamily: 'DMSans_400Regular', fontSize: 13, color: Theme.colors.textLight, marginTop: 2 },
  deleteBtn: { padding: 8 },
  emptyText: { fontFamily: 'DMSans_400Regular', fontSize: 14, color: Theme.colors.textLight, textAlign: 'center', marginVertical: 20 },
  
  addAddressForm: { marginTop: 10, paddingTop: 20, borderTopWidth: 1, borderColor: Theme.colors.border },
  addTitle: { fontFamily: 'DMSans_700Bold', fontSize: 14, color: Theme.colors.textLight, marginBottom: 12 },
  modalInput: {
    height: 50, backgroundColor: Theme.colors.background, borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: 16, fontFamily: 'DMSans_500Medium', fontSize: 14, borderWidth: 1, borderColor: Theme.colors.border,
    color: Theme.colors.text, marginBottom: 12
  },
  saveBtn: { backgroundColor: Theme.colors.primary, paddingVertical: 14, borderRadius: Theme.borderRadius.lg, alignItems: 'center', marginTop: 4 },
  saveBtnText: { fontFamily: 'Syne_700Bold', fontSize: 15, color: '#fff' },
});


