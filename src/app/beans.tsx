import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
import { api } from '../api/api';

interface Bean {
  id: number;
  origin: string;
  name: string;
  roast: string;
  notes: string;
}

const roastColor = (roast: string) => {
  const value = roast.toLowerCase();
  if (value.includes('light')) return '#7C9B77';
  if (value.includes('dark')) return '#6A4730';
  return '#A8774F';
};

export default function BeansScreen() {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/beans')
      .then((res) => setBeans(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={beans}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>THOUGHTFULLY SOURCED</Text>
            <Text style={styles.title}>Coffee, from the ground up.</Text>
            <Text style={styles.subtitle}>
              Discover the origins and tasting notes behind every memorable cup.
            </Text>
            <View style={styles.originBanner}>
              <View style={styles.bannerIcon}>
                <Ionicons name="earth-outline" size={21} color="#F8EBDD" />
              </View>
              <View style={styles.bannerCopy}>
                <Text style={styles.bannerTitle}>Every origin tells a story</Text>
                <Text style={styles.bannerText}>Explore our current selection of single-origin beans.</Text>
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionKicker}>THE COLLECTION</Text>
                <Text style={styles.sectionTitle}>Our coffee beans</Text>
              </View>
              <Text style={styles.count}>{beans.length} ORIGINS</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state}>
              <ActivityIndicator color="#6F4E37" />
              <Text style={styles.stateText}>Finding the latest origins...</Text>
            </View>
          ) : (
            <View style={styles.state}>
              <Ionicons name="leaf-outline" size={28} color="#A58B76" />
              <Text style={styles.stateText}>No coffee origins are available right now.</Text>
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
            layout={Layout.springify()}
            style={styles.card}
          >
            <View style={[styles.beanIcon, { backgroundColor: index % 2 ? '#E5EADF' : '#EFE2D3' }]}>
              <Ionicons name="cafe-outline" size={26} color="#4A3324" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.origin}>{item.origin.toUpperCase()} ORIGIN</Text>
              <Text style={styles.beanName}>{item.name}</Text>
              <View style={styles.roastRow}>
                <View style={[styles.roastDot, { backgroundColor: roastColor(item.roast) }]} />
                <Text style={styles.roast}> {item.roast} roast</Text>
              </View>
              <View style={styles.notesBox}>
                <Ionicons name="sparkles-outline" size={13} color="#98734F" />
                <Text style={styles.notes}>{item.notes}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#B39A84" />
          </Animated.View>
        )}
        ListFooterComponent={
          beans.length ? (
            <View style={styles.footer}>
              <Ionicons name="heart-outline" size={15} color="#A08063" />
              <Text style={styles.footerText}>Carefully selected. Lovingly brewed.</Text>
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
  header: {},
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 2, color: '#A08063' },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '900', letterSpacing: -0.7, color: '#35251C', marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#8F7B6A', marginTop: 6 },
  originBanner: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#493326', borderRadius: 18, padding: 16, marginTop: 20 },
  bannerIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#76573F', alignItems: 'center', justifyContent: 'center' },
  bannerCopy: { flex: 1 },
  bannerTitle: { fontSize: 14, fontWeight: '800', color: '#FFF8EF' },
  bannerText: { fontSize: 11, lineHeight: 16, color: '#E0CCB8', marginTop: 4 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 27, marginBottom: 13 },
  sectionKicker: { fontSize: 9, fontWeight: '800', letterSpacing: 1.7, color: '#A08063', marginBottom: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: '#34251D' },
  count: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: '#A08A78', marginBottom: 3 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, padding: 14, backgroundColor: '#FFFDFC', borderRadius: 17, borderWidth: 1, borderColor: '#EFE6DC', marginBottom: 11 },
  beanIcon: { width: 57, height: 62, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  cardBody: { flex: 1 },
  origin: { fontSize: 9, fontWeight: '800', letterSpacing: 1.3, color: '#A08063' },
  beanName: { fontSize: 15, fontWeight: '800', color: '#39291F', marginTop: 4 },
  roastRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  roastDot: { width: 7, height: 7, borderRadius: 4 },
  roast: { fontSize: 11, fontWeight: '600', color: '#8F7B6A' },
  notesBox: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  notes: { fontSize: 11, color: '#766354' },
  state: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontSize: 13, color: '#8F7B6A', textAlign: 'center' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 7, marginTop: 8, paddingVertical: 12 },
  footerText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4, color: '#A08063' },
});
