import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { api } from '../api/api';

interface Bean {
  id: number;
  origin: string;
  name: string;
  roast: string;
  notes: string;
}

export default function BeansScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/beans')
      .then((res) => setBeans(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#6F4E37" />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Coffee Beans</Text>
      <FlatList
        data={beans}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.beanName}>{item.name}</Text>
            <Text style={styles.origin}>Origin: {item.origin} | Roast: {item.roast}</Text>
            <Text style={styles.notes}>Notes: {item.notes}</Text>
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
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8B5A2B',
  },
  beanName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  origin: { fontSize: 13, color: '#666', marginVertical: 4 },
  notes: { fontSize: 13, fontStyle: 'italic', color: '#888' },
});