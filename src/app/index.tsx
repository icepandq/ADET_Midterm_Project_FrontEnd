import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';

interface FeaturedItem { id: number; name: string; description: string; price: number; category: string; available: boolean; }
const coffeePhoto = 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=85';
const quickLinks = [
  { title: 'Coffee menu', subtitle: 'Find your next favorite', icon: 'cafe-outline' as const, route: '/menu' as const, color: '#E8D7C3' },
  { title: 'Our beans', subtitle: 'Explore the origins', icon: 'leaf-outline' as const, route: '/beans' as const, color: '#DDE6D5' },
  { title: 'Meet the team', subtitle: 'The people behind the cup', icon: 'people-outline' as const, route: '/baristas' as const, color: '#F1DFD5' },
  { title: 'Your orders', subtitle: 'See your coffee history', icon: 'receipt-outline' as const, route: '/orders' as const, color: '#DDE5EF' },
];

export default function HomeScreen() {
  const router = useRouter();
  const [featured, setFeatured] = useState<FeaturedItem | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/featured').then(res => setFeatured(res.data)).catch(err => console.error(err)).finally(() => setLoading(false)); }, []);

  return <SafeAreaView style={s.safe}>
    <ScrollView contentContainerStyle={s.page} showsVerticalScrollIndicator={false}>
      <View style={s.topbar}>
        <View style={s.brandMark}><Ionicons name="cafe" size={23} color="#FFF8EE" /></View>
        <View style={{ flex: 1 }}><Text style={s.brand}>BREW & CO.</Text><Text style={s.brandSub}>YOUR DAILY RITUAL</Text></View>
        <TouchableOpacity style={s.avatar} onPress={() => router.push('/orders')}><Ionicons name="person-outline" size={21} color="#493326" /></TouchableOpacity>
      </View>
      <ImageBackground source={{ uri: coffeePhoto }} imageStyle={s.heroImage} style={s.hero}>
        <View style={s.heroShade} />
        <View style={s.heroContent}>
          <View style={s.eyebrow}><View style={s.eyebrowDot} /><Text style={s.eyebrowText}>FRESHLY BREWED, EVERY DAY</Text></View>
          <Text style={s.heroTitle}>A little coffee.{ '\n' }A lot of comfort.</Text>
          <Text style={s.heroDesc}>Thoughtfully sourced beans, crafted into your perfect cup.</Text>
          <TouchableOpacity style={s.heroButton} onPress={() => router.push('/menu')} activeOpacity={0.85}>
            <Text style={s.heroButtonText}>Explore our menu</Text><Ionicons name="arrow-forward" size={17} color="#3B261B" />
          </TouchableOpacity>
        </View>
      </ImageBackground>

      <View style={s.sectionHeader}><View><Text style={s.kicker}>MADE FOR YOU</Text><Text style={s.sectionTitle}>Today’s special</Text></View><View style={s.starBadge}><Ionicons name="sparkles" size={15} color="#9A6C3E" /><Text style={s.starText}>BARISTA PICK</Text></View></View>
      {loading ? <View style={s.loadingCard}><ActivityIndicator color="#865B3D" /><Text style={s.muted}>Finding today's favorite…</Text></View> : featured ? <View style={s.specialCard}>
        <View style={s.specialIcon}><Ionicons name="cafe" size={30} color="#F8EBDD" /></View>
        <View style={s.specialInfo}><Text style={s.specialCategory}>{featured.category || 'HOUSE FAVORITE'}</Text><Text style={s.specialName}>{featured.name}</Text><Text style={s.specialDesc} numberOfLines={2}>{featured.description}</Text><View style={s.specialBottom}><Text style={s.price}>₱{Number(featured.price).toFixed(2)}</Text><View style={s.available}><View style={[s.statusDot, { backgroundColor: featured.available ? '#6BA27C' : '#C96C5D' }]} /><Text style={s.availableText}>{featured.available ? 'Available now' : 'Currently unavailable'}</Text></View></View></View>
      </View> : <View style={s.emptyCard}><Ionicons name="cafe-outline" size={24} color="#9A806B" /><Text style={s.muted}>Today's special will appear here soon.</Text></View>}

      <View style={s.sectionHeader}><View><Text style={s.kicker}>TAKE A LOOK AROUND</Text><Text style={s.sectionTitle}>Explore Brew & Co.</Text></View><Text style={s.count}>04 COLLECTIONS</Text></View>
      <View style={s.grid}>{quickLinks.map((item, i) => <TouchableOpacity key={item.title} style={s.linkCard} onPress={() => router.push(item.route)} activeOpacity={0.78}>
        <View style={[s.linkIcon, { backgroundColor: item.color }]}><Ionicons name={item.icon} size={24} color="#4A3324" /></View><View style={s.linkText}><Text style={s.linkTitle}>{item.title}</Text><Text style={s.linkSubtitle}>{item.subtitle}</Text></View><Ionicons name="arrow-forward-circle-outline" size={23} color="#A58B76" />
      </TouchableOpacity>)}</View>
      <View style={s.footer}><View style={s.footerLine} /><Text style={s.footerText}>GOOD COFFEE. GOOD COMPANY.</Text><View style={s.footerLine} /></View>
    </ScrollView>
  </SafeAreaView>;
}
const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#F7F3ED'}, page:{paddingHorizontal:22,paddingTop:14,paddingBottom:30,maxWidth:850,width:'100%',alignSelf:'center'},
  topbar:{flexDirection:'row',alignItems:'center',marginBottom:22,gap:12},brandMark:{width:45,height:45,borderRadius:15,backgroundColor:'#493326',alignItems:'center',justifyContent:'center'},brand:{fontSize:16,fontWeight:'900',letterSpacing:2.2,color:'#35251C'},brandSub:{fontSize:9,letterSpacing:2,color:'#9B806B',marginTop:3,fontWeight:'700'},avatar:{height:42,width:42,borderRadius:21,backgroundColor:'#EDE2D5',alignItems:'center',justifyContent:'center'},
  hero:{height:320,borderRadius:24,overflow:'hidden',justifyContent:'flex-end',backgroundColor:'#4A3326'},heroImage:{borderRadius:24},heroShade:{...StyleSheet.absoluteFill,backgroundColor:'rgba(28,17,11,0.54)'},heroContent:{padding:25},eyebrow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:15},eyebrowDot:{width:7,height:7,borderRadius:4,backgroundColor:'#DAB68C'},eyebrowText:{color:'#F0D8BD',fontSize:10,fontWeight:'800',letterSpacing:1.7},heroTitle:{color:'#FFF9F1',fontSize:35,lineHeight:39,fontWeight:'800',letterSpacing:-0.7},heroDesc:{color:'#F0E4D8',fontSize:13,lineHeight:20,marginTop:10,maxWidth:330},heroButton:{alignSelf:'flex-start',marginTop:18,backgroundColor:'#F4E7D6',borderRadius:12,paddingHorizontal:16,paddingVertical:12,flexDirection:'row',alignItems:'center',gap:12},heroButtonText:{color:'#3B261B',fontWeight:'800',fontSize:13},
  sectionHeader:{flexDirection:'row',alignItems:'flex-end',justifyContent:'space-between',marginTop:28,marginBottom:14},kicker:{fontSize:9,fontWeight:'800',letterSpacing:1.8,color:'#A08063',marginBottom:5},sectionTitle:{fontSize:22,fontWeight:'800',letterSpacing:-0.4,color:'#34251D'},starBadge:{flexDirection:'row',alignItems:'center',gap:5,paddingHorizontal:10,paddingVertical:7,borderRadius:20,backgroundColor:'#EFE4D5'},starText:{fontSize:9,fontWeight:'800',letterSpacing:0.8,color:'#8C6037'},
  specialCard:{flexDirection:'row',gap:15,backgroundColor:'#FFFDFC',borderRadius:19,padding:16,borderWidth:1,borderColor:'#EFE6DC',shadowColor:'#422B1C',shadowOpacity:0.04,shadowRadius:12,elevation:2},specialIcon:{width:66,height:66,borderRadius:17,backgroundColor:'#75543C',alignItems:'center',justifyContent:'center'},specialInfo:{flex:1},specialCategory:{fontSize:9,letterSpacing:1.4,fontWeight:'800',color:'#A07A56'},specialName:{fontSize:17,fontWeight:'800',color:'#35251C',marginTop:4},specialDesc:{fontSize:12,color:'#8C7A6B',lineHeight:18,marginTop:4},specialBottom:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:8,marginTop:10},price:{fontSize:17,fontWeight:'900',color:'#5E3E2A'},available:{flexDirection:'row',alignItems:'center',gap:5},statusDot:{width:6,height:6,borderRadius:3},availableText:{fontSize:10,fontWeight:'600',color:'#6C806E'},loadingCard:{padding:24,backgroundColor:'#FFFDFC',borderRadius:18,alignItems:'center',gap:10},emptyCard:{padding:20,backgroundColor:'#FFFDFC',borderRadius:18,flexDirection:'row',alignItems:'center',gap:10},muted:{fontSize:12,color:'#958273'},
  count:{fontSize:9,fontWeight:'800',letterSpacing:1,color:'#A08A78',paddingBottom:4},grid:{gap:10},linkCard:{flexDirection:'row',alignItems:'center',gap:13,padding:14,backgroundColor:'#FFFDFC',borderRadius:16,borderWidth:1,borderColor:'#EFE6DC'},linkIcon:{width:48,height:48,borderRadius:14,alignItems:'center',justifyContent:'center'},linkText:{flex:1},linkTitle:{fontSize:14,fontWeight:'800',color:'#3D2B20'},linkSubtitle:{fontSize:11,color:'#998677',marginTop:4},footer:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:12,marginTop:30},footerLine:{height:1,backgroundColor:'#E4D8CB',width:35},footerText:{fontSize:9,letterSpacing:2,fontWeight:'800',color:'#AD9580'}
});
