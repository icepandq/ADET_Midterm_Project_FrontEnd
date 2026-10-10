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

interface Barista {
  id: number;
  name: string;
  role: string;
  specialty: string;
}

const avatarColors = ['#76573F', '#78816A', '#A16D59', '#677A88'];

export default function BaristasScreen() {
  const [baristas, setBaristas] = useState<Barista[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/baristas')
      .then((res) => setBaristas(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={baristas}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>THE PEOPLE BEHIND YOUR CUP</Text>
            <Text style={styles.title}>Meet your coffee people.</Text>
            <Text style={styles.subtitle}>
              Passionate makers, curious tasters, and friendly faces—ready to make your day a little better.
            </Text>
            <View style={styles.teamBadge}>
              <Ionicons name="people-outline" size={17} color="#8D633E" />
              <Text style={styles.teamBadgeText}>YOUR BREW & CO. BARISTA TEAM</Text>
            </View>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionKicker}>MEET THE TEAM</Text>
                <Text style={styles.sectionTitle}>Crafted with care</Text>
              </View>
              <Text style={styles.count}>{baristas.length} BARISTAS</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.state}>
              <ActivityIndicator color="#6F4E37" />
              <Text style={styles.stateText}>Getting to know the team...</Text>
            </View>
          ) : (
            <View style={styles.state}>
              <Ionicons name="people-outline" size={28} color="#A58B76" />
              <Text style={styles.stateText}>Our baristas will be here soon.</Text>
            </View>
          )
        }
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(Math.min(index, 8) * 70).springify()}
            layout={Layout.springify()}
            style={styles.card}
          >
            <View style={[styles.avatar, { backgroundColor: avatarColors[index % avatarColors.length] }]}>
              <Text style={styles.avatarText}>{item.name.charAt(0).toUpperCase()}</Text>
              <View style={styles.onlineDot} />
            </View>
            <View style={styles.info}>
              <Text style={styles.role}>{item.role.toUpperCase()}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <View style={styles.specialtyRow}>
                <Ionicons name="sparkles-outline" size={13} color="#9A6C3E" />
                <Text style={styles.specialty}>{item.specialty}</Text>
              </View>
            </View>
            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={16} color="#967B65" />
            </View>
          </Animated.View>
        )}
        ListFooterComponent={
          baristas.length ? (
            <View style={styles.footerCard}>
              <Ionicons name="cafe-outline" size={19} color="#8D633E" />
              <Text style={styles.footerText}>Say hello next time you stop by.</Text>
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
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.7, color: '#A08063' },
  title: { fontSize: 29, lineHeight: 35, fontWeight: '900', letterSpacing: -0.7, color: '#35251C', marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#8F7B6A', marginTop: 6 },
  teamBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 7, backgroundColor: '#EFE4D5', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginTop: 16 },
  teamBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.9, color: '#805B3C' },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 27, marginBottom: 13 },
  sectionKicker: { fontSize: 9, fontWeight: '800', letterSpacing: 1.7, color: '#A08063', marginBottom: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: '#34251D' },
  count: { fontSize: 9, fontWeight: '800', letterSpacing: 1, color: '#A08A78', marginBottom: 3 },
  card: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 15, backgroundColor: '#FFFDFC', borderRadius: 18, borderWidth: 1, borderColor: '#EFE6DC', marginBottom: 11 },
  avatar: { width: 59, height: 59, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 24, fontWeight: '800', color: '#FFF8EF' },
  onlineDot: { position: 'absolute', right: -2, bottom: -2, width: 15, height: 15, borderRadius: 8, backgroundColor: '#78A17D', borderWidth: 3, borderColor: '#FFFDFC' },
  info: { flex: 1 },
  role: { fontSize: 9, fontWeight: '800', letterSpacing: 1.2, color: '#A08063' },
  name: { fontSize: 16, fontWeight: '800', color: '#39291F', marginTop: 4 },
  specialtyRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 7 },
  specialty: { fontSize: 11, fontWeight: '600', color: '#766354' },
  arrow: { width: 34, height: 34, borderRadius: 12, backgroundColor: '#F4ECE3', alignItems: 'center', justifyContent: 'center' },
  state: { minHeight: 180, alignItems: 'center', justifyContent: 'center', gap: 12 },
  stateText: { fontSize: 13, color: '#8F7B6A', textAlign: 'center' },
  footerCard: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, backgroundColor: '#EFE4D5', borderRadius: 15, padding: 14, marginTop: 4 },
  footerText: { fontSize: 12, fontWeight: '700', color: '#6F5239' },
});
