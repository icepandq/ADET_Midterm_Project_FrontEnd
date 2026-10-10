import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { api } from '../api/api';

interface Order {
  id: number;
  item: string;
  quantity: number;
  total: number;
  status: string;
}

const statusStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === 'ready') {
    return { backgroundColor: '#E7F0E6', color: '#4D7754', icon: 'checkmark-circle-outline' as const };
  }
  if (normalized === 'preparing' || normalized === 'pending') {
    return { backgroundColor: '#F5EBDD', color: '#966A3D', icon: 'time-outline' as const };
  }
  if (normalized === 'completed') {
    return { backgroundColor: '#E5ECE7', color: '#567260', icon: 'checkmark-done-outline' as const };
  }
  return { backgroundColor: '#ECE7E2', color: '#76685C', icon: 'receipt-outline' as const };
};

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(() => {
    setLoading(true);
    setError('');
    api
      .get('/orders')
      .then((res) => {
        if (!Array.isArray(res.data)) {
          throw new Error('The orders API returned an invalid response.');
        }
        setOrders(res.data);
      })
      .catch((err) => {
        console.error('Failed to load orders:', err);
        setError('We couldn’t load your orders. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const activeOrders = orders.filter((order) => {
    const status = order.status.toLowerCase();
    return status === 'preparing' || status === 'pending' || status === 'ready';
  }).length;

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View>
            <Text style={styles.kicker}>YOUR BREW & CO. VISITS</Text>
            <Text style={styles.title}>Orders, made memorable.</Text>
            <Text style={styles.subtitle}>
              Your recent coffee moments, all in one place.
            </Text>

            <View style={styles.summaryCard}>
              <View style={styles.summaryIcon}>
                <Ionicons name="receipt-outline" size={21} color="#F8EBDD" />
              </View>
              <View style={styles.summaryCopy}>
                <Text style={styles.summaryLabel}>YOUR ORDER HISTORY</Text>
                <Text style={styles.summaryValue}>
                  {orders.length} {orders.length === 1 ? 'order' : 'orders'}
                </Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.activeCopy}>
                <Text style={styles.summaryLabel}>IN PROGRESS</Text>
                <Text style={styles.activeValue}>{activeOrders}</Text>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionKicker}>A LITTLE SOMETHING GOOD</Text>
                <Text style={styles.sectionTitle}>Recent orders</Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Refresh orders"
                style={styles.refreshButton}
                onPress={loadOrders}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#654733" />
                ) : (
                  <Ionicons name="refresh-outline" size={18} color="#654733" />
                )}
              </TouchableOpacity>
            </View>
            {error ? (
              <View style={styles.errorBox}>
                <Ionicons name="cloud-offline-outline" size={18} color="#A44F43" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state}>
              <ActivityIndicator size="large" color="#6F4E37" />
              <Text style={styles.stateText}>Gathering your order history...</Text>
            </View>
          ) : error ? (
            <TouchableOpacity style={styles.retryButton} onPress={loadOrders}>
              <Text style={styles.retryText}>Try again</Text>
              <Ionicons name="arrow-forward" size={15} color="#FFF8EF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIcon}>
                <Ionicons name="cafe-outline" size={30} color="#76543B" />
              </View>
              <Text style={styles.emptyTitle}>Your next favorite is waiting.</Text>
              <Text style={styles.emptyText}>
                Place an order from the coffee menu and it will show up here.
              </Text>
            </View>
          )
        }
        renderItem={({ item, index }) => {
          const status = statusStyle(item.status);
          return (
            <Animated.View
              entering={FadeInDown.delay(Math.min(index, 8) * 65).springify()}
              layout={Layout.springify()}
              style={styles.orderCard}
            >
              <View style={styles.orderTop}>
                <View style={styles.orderIcon}>
                  <Ionicons name="cafe-outline" size={21} color="#63462F" />
                </View>
                <View style={styles.orderIdentity}>
                  <Text style={styles.orderEyebrow}>ORDER #{item.id}</Text>
                  <Text style={styles.itemText} numberOfLines={2}>{item.item}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: status.backgroundColor }]}>
                  <Ionicons name={status.icon} size={13} color={status.color} />
                  <Text style={[styles.badgeText, { color: status.color }]}>{item.status}</Text>
                </View>
              </View>
              <View style={styles.orderDivider} />
              <View style={styles.orderBottom}>
                <View style={styles.quantityLabel}>
                  <Ionicons name="basket-outline" size={15} color="#9B806B" />
                  <Text style={styles.quantityText}>
                    {item.quantity} {item.quantity === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <View style={styles.totalGroup}>
                  <Text style={styles.totalLabel}>TOTAL</Text>
                  <Text style={styles.price}>₱{Number(item.total).toFixed(2)}</Text>
                </View>
              </View>
            </Animated.View>
          );
        }}
        ListFooterComponent={
          orders.length > 0 ? (
            <View style={styles.footer}>
              <View style={styles.footerLine} />
              <Ionicons name="heart-outline" size={14} color="#A08063" />
              <Text style={styles.footerText}>THANK YOU FOR BREWING WITH US</Text>
              <View style={styles.footerLine} />
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F3ED' },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 30, maxWidth: 850, width: '100%', alignSelf: 'center' },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: '#A08063' },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '900', letterSpacing: -0.7, color: '#35251C', marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#8F7B6A', marginTop: 6 },
  summaryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#493326', borderRadius: 18, padding: 16, marginTop: 20 },
  summaryIcon: { width: 43, height: 43, borderRadius: 14, backgroundColor: '#76573F', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  summaryCopy: { flex: 1 },
  summaryLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.1, color: '#D9C4AF' },
  summaryValue: { fontSize: 17, fontWeight: '900', color: '#FFF8EF', marginTop: 3 },
  summaryDivider: { width: 1, height: 34, backgroundColor: '#765D4C', marginHorizontal: 14 },
  activeCopy: { minWidth: 62, alignItems: 'flex-start' },
  activeValue: { fontSize: 17, fontWeight: '900', color: '#F2D2A8', marginTop: 3 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 27, marginBottom: 13 },
  sectionKicker: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#A08063', marginBottom: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: '#34251D' },
  refreshButton: { width: 38, height: 38, borderRadius: 13, backgroundColor: '#EFE4D5', alignItems: 'center', justifyContent: 'center' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F7E7E3', borderRadius: 12, padding: 12, marginBottom: 12 },
  errorText: { flex: 1, fontSize: 12, lineHeight: 17, color: '#9E4A3F' },
  state: { minHeight: 190, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontSize: 13, color: '#8F7B6A' },
  retryButton: { alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#493326', borderRadius: 12, paddingHorizontal: 18, paddingVertical: 11, marginTop: 8 },
  retryText: { fontSize: 12, fontWeight: '800', color: '#FFF8EF' },
  orderCard: { backgroundColor: '#FFFDFC', borderRadius: 18, borderWidth: 1, borderColor: '#EFE6DC', padding: 15, marginBottom: 11, shadowColor: '#422B1C', shadowOpacity: 0.035, shadowRadius: 9, shadowOffset: { width: 0, height: 3 }, elevation: 1 },
  orderTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  orderIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#EFE4D5', alignItems: 'center', justifyContent: 'center' },
  orderIdentity: { flex: 1 },
  orderEyebrow: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2, color: '#A08063' },
  itemText: { fontSize: 14, fontWeight: '800', lineHeight: 19, color: '#39291F', marginTop: 3 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 6 },
  badgeText: { fontSize: 9, fontWeight: '800' },
  orderDivider: { height: 1, backgroundColor: '#F0E7DE', marginVertical: 13 },
  orderBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  quantityLabel: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  quantityText: { fontSize: 11, fontWeight: '600', color: '#8F7B6A' },
  totalGroup: { alignItems: 'flex-end' },
  totalLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: '#A08A78' },
  price: { fontSize: 16, fontWeight: '900', color: '#5E3E2A', marginTop: 2 },
  emptyState: { alignItems: 'center', paddingHorizontal: 30, paddingTop: 35, paddingBottom: 50 },
  emptyIcon: { width: 68, height: 68, borderRadius: 23, backgroundColor: '#EFE4D5', alignItems: 'center', justifyContent: 'center', marginBottom: 15 },
  emptyTitle: { fontSize: 16, fontWeight: '800', color: '#39291F', textAlign: 'center' },
  emptyText: { fontSize: 12, lineHeight: 18, color: '#8F7B6A', textAlign: 'center', marginTop: 6 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  footerLine: { flex: 1, height: 1, backgroundColor: '#E5D9CD' },
  footerText: { fontSize: 8, fontWeight: '800', letterSpacing: 1, color: '#A08063' },
});
