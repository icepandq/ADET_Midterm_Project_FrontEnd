import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { api } from '../api/api';

interface Order {
  id: number;
  item: string;
  quantity: number;
  total: number;
  status: string;
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#6F4E37" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Orders History</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.orderId}>Order #{item.id}</Text>
              <Text style={styles.itemText}>{item.quantity}x {item.item}</Text>
              <Text style={styles.price}>Total: ₱{item.total}</Text>
            </View>
            <View style={[styles.badge, item.status === 'Ready' ? styles.badgeReady : styles.badgeDone]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF8F5', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2B1704', marginBottom: 16 },
  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: { fontSize: 12, color: '#888' },
  itemText: { fontSize: 16, fontWeight: 'bold', color: '#333', marginVertical: 2 },
  price: { fontSize: 14, color: '#6F4E37', fontWeight: '600' },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeReady: { backgroundColor: '#E0F2FE' },
  badgeDone: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#333' },
});