import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
};

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/menu')
      .then(response => {
        setMenuItems(response.data);
        setError('');
      })
      .catch(error => {
        console.error('Failed to load menu:', error);
        setError('Unable to load menu. Please check your API connection.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const CATEGORIES = useMemo(
    () => ['All', ...new Set(menuItems.map(item => item.category))],
    [menuItems]
  );

  const filtered = useMemo(
    () =>
      menuItems.filter(
        item =>
          (selectedCategory === 'All' ||
            item.category === selectedCategory) &&
          `${item.name} ${item.category}`
            .toLowerCase()
            .includes(search.toLowerCase())
      ),
    [menuItems, selectedCategory, search]
  );

  const renderCategory = ({ item }: { item: string }) => {
    const active = selectedCategory === item;

    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item)}
        style={[s.pill, active && s.pillActive]}
      >
        <Text style={[s.pillText, active && s.pillTextActive]}>
          {item}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => {
    const isAdded = cart.includes(item.id);

    return (
      <View style={s.itemCard}>
        <View style={[s.itemIcon, { backgroundColor: '#E9D9C8' }]}>
          <Ionicons
            name="cafe-outline"
            size={27}
            color="#573D2A"
          />
        </View>

        <View style={s.itemInfo}>
          <Text style={s.category}>
            {item.category.toUpperCase()}
          </Text>

          <Text style={s.itemName}>
            {item.name}
          </Text>

          <Text style={s.notes}>
            Freshly brewed and handcrafted.
          </Text>

          <Text style={s.price}>
            ₱{Number(item.price).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          accessibilityLabel={`Add ${item.name}`}
          onPress={() =>
            setCart(old =>
              old.includes(item.id)
                ? old
                : [...old, item.id]
            )
          }
          style={[
            s.addButton,
            isAdded && s.addedButton,
          ]}
        >
          <Ionicons
            name={isAdded ? 'checkmark' : 'add'}
            size={20}
            color="#FFF8EF"
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>

        {/* Header */}
        <View style={s.heading}>
          <Text style={s.kicker}>
            COFFEE HOUSE
          </Text>

          <Text style={s.title}>
            Freshly brewed favorites
          </Text>

          <Text style={s.subtitle}>
            Handcrafted drinks, small bites, and warm essentials to start your day.
          </Text>
        </View>

        {/* Search */}
        <View style={s.search}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#8A6F5A"
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search menu"
            placeholderTextColor="#A38A74"
            style={s.searchInput}
          />
        </View>

        {/* Loading */}
        {loading && (
          <Text style={s.statusText}>
            Loading menu...
          </Text>
        )}

        {/* Error */}
        {error !== '' && (
          <Text style={s.errorText}>
            {error}
          </Text>
        )}

        {/* Categories */}
        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={{
            flexGrow: 0,
            flexShrink: 0,
            height: 54,
            marginBottom: 20,
          }}
          contentContainerStyle={s.categories}
          renderItem={renderCategory}
        />

        {/* Results Header */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsTitle}>
            {selectedCategory === 'All'
              ? 'Customer favorites'
              : selectedCategory}
          </Text>

          <Text style={s.resultsCount}>
            {filtered.length} ITEMS
          </Text>
        </View>

        {/* Menu List */}
        <FlatList
          data={filtered}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 28,
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={s.empty}>
                <Ionicons
                  name="search-outline"
                  size={28}
                  color="#A58B76"
                />

                <Text style={s.emptyText}>
                  No menu items match your search.
                </Text>
              </View>
            ) : null
          }
          renderItem={renderMenuItem}
        />

        {/* Cart */}
        {cart.length > 0 && (
          <View style={s.cartBar}>
            <View>
              <Text style={s.cartTitle}>
                Your selection
              </Text>

              <Text style={s.cartSub}>
                {cart.length}{' '}
                {cart.length === 1 ? 'item' : 'items'} added
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCart([])}
              style={s.cartAction}
            >
              <Text style={s.cartActionText}>
                Clear selection
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F3ED',
  },

  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    maxWidth: 950,
    width: '100%',
    alignSelf: 'center',
  },

  heading: {
    marginBottom: 19,
  },

  kicker: {
    fontSize: 10,
    letterSpacing: 2,
    fontWeight: '800',
    color: '#A08063',
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.8,
    color: '#35251C',
    marginTop: 4,
  },

  subtitle: {
    fontSize: 13,
    color: '#8F7B6A',
    marginTop: 5,
    lineHeight: 19,
  },

  search: {
    height: 48,
    backgroundColor: '#FFFDFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE3D9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 15,
  },

  searchInput: {
    flex: 1,
    color: '#3C2B20',
    fontSize: 13,
  },

  statusText: {
    textAlign: 'center',
    color: '#8F7B6A',
    marginBottom: 10,
  },

  errorText: {
    textAlign: 'center',
    color: '#B04A3A',
    marginBottom: 10,
  },

  categories: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingRight: 4,
  },

  pill: {
    height: 42,
    minHeight: 42,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#EFE6DC',
    borderWidth: 1,
    borderColor: '#EFE6DC',
  },

  pillActive: {
    backgroundColor: '#493326',
    borderColor: '#493326',
  },

  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#826C5B',
  },

  pillTextActive: {
    color: '#FFF8F0',
  },

  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  resultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#3B2A20',
  },

  resultsCount: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.3,
    color: '#A08A78',
  },

  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 13,
    backgroundColor: '#FFFDFC',
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#EFE6DC',
    marginBottom: 11,
  },

  itemIcon: {
    width: 60,
    height: 65,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemInfo: {
    flex: 1,
  },

  category: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#A08063',
  },

  itemName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#39291F',
    marginTop: 4,
  },

  notes: {
    fontSize: 11,
    color: '#958273',
    marginTop: 4,
    lineHeight: 16,
  },

  price: {
    fontSize: 15,
    fontWeight: '900',
    color: '#6A4730',
    marginTop: 7,
  },

  addButton: {
    width: 37,
    height: 37,
    borderRadius: 12,
    backgroundColor: '#493326',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addedButton: {
    backgroundColor: '#60856A',
  },

  empty: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },

  emptyText: {
    color: '#958273',
    fontSize: 13,
  },

  cartBar: {
    backgroundColor: '#493326',
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cartTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF8EF',
  },

  cartSub: {
    fontSize: 11,
    color: '#D8C4B1',
    marginTop: 3,
  },

  cartAction: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: '#F0E1D0',
  },

  cartActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#493326',
  },
});