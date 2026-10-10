import React from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, Layout } from 'react-native-reanimated';

const destinations = [
  {
    title: 'Find your next favorite',
    subtitle: 'Handcrafted drinks for every kind of day.',
    label: 'THE MENU',
    icon: 'cafe-outline' as const,
    color: '#EFE2D3',
    route: '/menu' as const,
  },
  {
    title: 'Meet the coffee',
    subtitle: 'Get to know our origins and tasting notes.',
    label: 'OUR BEANS',
    icon: 'leaf-outline' as const,
    color: '#E5EADF',
    route: '/beans' as const,
  },
  {
    title: 'The hands behind the cup',
    subtitle: 'Meet the people who make every visit special.',
    label: 'OUR TEAM',
    icon: 'people-outline' as const,
    color: '#F1DFD5',
    route: '/baristas' as const,
  },
  {
    title: 'Your coffee moments',
    subtitle: 'Keep track of your recent orders.',
    label: 'ORDER HISTORY',
    icon: 'receipt-outline' as const,
    color: '#DDE5EF',
    route: '/orders' as const,
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.kicker}>A WORLD OF GOOD COFFEE</Text>
        <Text style={styles.title}>Take a little look around.</Text>
        <Text style={styles.subtitle}>
          Good coffee is more than what’s in your cup. Explore the people, beans, and little rituals that make it special.
        </Text>

        <Animated.View entering={FadeInDown.springify()} style={styles.feature}>
          <View style={styles.featureMark}>
            <Ionicons name="cafe" size={25} color="#FFF8EF" />
          </View>
          <Text style={styles.featureEyebrow}>YOUR DAILY RITUAL</Text>
          <Text style={styles.featureTitle}>A little coffee. A lot of comfort.</Text>
          <Text style={styles.featureText}>Find your new favorite and make today a little warmer.</Text>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => router.push('/menu')}
            activeOpacity={0.85}
          >
            <Text style={styles.featureButtonText}>Explore the menu</Text>
            <Ionicons name="arrow-forward" size={16} color="#3B261B" />
          </TouchableOpacity>
          <View style={styles.decorCircle} />
          <View style={styles.decorCircleSmall} />
        </Animated.View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>MAKE YOURSELF AT HOME</Text>
            <Text style={styles.sectionTitle}>Explore Brew & Co.</Text>
          </View>
          <Ionicons name="sparkles-outline" size={20} color="#A08063" />
        </View>

        {destinations.map((item, index) => (
          <Animated.View
            key={item.label}
            entering={FadeInDown.delay(index * 65).springify()}
            layout={Layout.springify()}
          >
            <TouchableOpacity
              style={styles.destination}
              onPress={() => router.push(item.route)}
              activeOpacity={0.78}
            >
              <View style={[styles.destinationIcon, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={23} color="#4A3324" />
              </View>
              <View style={styles.destinationCopy}>
                <Text style={styles.destinationLabel}>{item.label}</Text>
                <Text style={styles.destinationTitle}>{item.title}</Text>
                <Text style={styles.destinationSubtitle}>{item.subtitle}</Text>
              </View>
              <Ionicons name="arrow-forward-circle-outline" size={23} color="#A58B76" />
            </TouchableOpacity>
          </Animated.View>
        ))}

        <View style={styles.footer}>
          <View style={styles.footerLine} />
          <Text style={styles.footerText}>GOOD COFFEE. GOOD COMPANY.</Text>
          <View style={styles.footerLine} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F3ED' },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 30, maxWidth: 850, width: '100%', alignSelf: 'center' },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.8, color: '#A08063' },
  title: { fontSize: 30, lineHeight: 36, fontWeight: '900', letterSpacing: -0.8, color: '#35251C', marginTop: 6 },
  subtitle: { fontSize: 13, lineHeight: 20, color: '#8F7B6A', marginTop: 6 },
  feature: { position: 'relative', overflow: 'hidden', backgroundColor: '#493326', borderRadius: 22, padding: 21, marginTop: 21 },
  featureMark: { width: 46, height: 46, borderRadius: 15, backgroundColor: '#76573F', alignItems: 'center', justifyContent: 'center', marginBottom: 17 },
  featureEyebrow: { fontSize: 9, fontWeight: '800', letterSpacing: 1.7, color: '#DAB68C' },
  featureTitle: { maxWidth: 280, fontSize: 24, lineHeight: 29, fontWeight: '800', color: '#FFF8EF', marginTop: 7 },
  featureText: { maxWidth: 290, fontSize: 12, lineHeight: 18, color: '#E0CCB8', marginTop: 8 },
  featureButton: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 11, backgroundColor: '#F4E7D6', borderRadius: 11, paddingHorizontal: 14, paddingVertical: 11, marginTop: 17 },
  featureButtonText: { color: '#3B261B', fontSize: 12, fontWeight: '800' },
  decorCircle: { position: 'absolute', width: 150, height: 150, borderRadius: 80, borderWidth: 1, borderColor: 'rgba(255,248,239,0.12)', right: -46, top: 11 },
  decorCircleSmall: { position: 'absolute', width: 95, height: 95, borderRadius: 50, borderWidth: 1, borderColor: 'rgba(255,248,239,0.12)', right: -18, top: 39 },
  sectionHeader: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 28, marginBottom: 13 },
  sectionKicker: { fontSize: 9, fontWeight: '800', letterSpacing: 1.5, color: '#A08063', marginBottom: 4 },
  sectionTitle: { fontSize: 21, fontWeight: '800', color: '#34251D' },
  destination: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: '#FFFDFC', borderRadius: 17, borderWidth: 1, borderColor: '#EFE6DC', padding: 13, marginBottom: 10 },
  destinationIcon: { width: 52, height: 55, borderRadius: 15, alignItems: 'center', justifyContent: 'center' },
  destinationCopy: { flex: 1 },
  destinationLabel: { fontSize: 8, fontWeight: '800', letterSpacing: 1.4, color: '#A08063' },
  destinationTitle: { fontSize: 13, fontWeight: '800', color: '#39291F', marginTop: 3 },
  destinationSubtitle: { fontSize: 10, color: '#8F7B6A', marginTop: 3 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 13 },
  footerLine: { flex: 1, height: 1, backgroundColor: '#E5D9CD' },
  footerText: { fontSize: 8, fontWeight: '800', letterSpacing: 1.2, color: '#A08063' },
});
