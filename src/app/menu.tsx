import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeInUp, Layout } from 'react-native-reanimated';
import { api } from '../api/api';

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
};

type CartMap = Record<number, number>;

const categoryIcon = (category: string) => {
  const normalized = category.toLowerCase();

  if (normalized.includes('latte')) return 'cafe-outline';
  if (normalized.includes('mocha')) return 'flame-outline';
  if (normalized.includes('cold') || normalized.includes('iced')) return 'snow-outline';
  if (normalized.includes('espresso')) return 'sparkles-outline';
  if (normalized.includes('signature')) return 'star-outline';

  return 'cafe';
};

export default function MenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get('/menu')
      .then(response => {
        if (!active) return;
        setMenuItems(response.data);
        setError('');
      })
      .catch(error => {
        console.error('Failed to load menu:', error);
        if (!active) return;

        setMenuItems([]);
        setError('Unable to load menu. Please check your API connection.');
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const categories = useMemo(
    () => ['All', ...new Set(menuItems.map(item => item.category))],
    [menuItems]
  );

  const filteredItems = useMemo(
    () =>
      menuItems.filter(item => {
        const matchesCategory =
          selectedCategory === 'All' || item.category === selectedCategory;
        const query = search.trim().toLowerCase();
        const matchesSearch =
          query.length === 0 ||
          `${item.name} ${item.category}`.toLowerCase().includes(query);

        return matchesCategory && matchesSearch;
      }),
    [menuItems, selectedCategory, search]
  );

  const totalItems = Object.values(cart).reduce((sum, count) => sum + count, 0);
  const subtotal = menuItems.reduce((sum, item) => {
    const qty = cart[item.id] ?? 0;
    return sum + item.price * qty;
  }, 0);

  const selectedItems = menuItems
    .filter(item => (cart[item.id] ?? 0) > 0)
    .map(item => ({
      id: item.id,
      name: item.name,
      quantity: cart[item.id] ?? 0,
      price: item.price,
    }));

  const addItem = (item: MenuItem) => {
    setCart(prev => ({
      ...prev,
      [item.id]: (prev[item.id] ?? 0) + 1,
    }));
  };

  const removeItem = (item: MenuItem) => {
    setCart(prev => {
      const currentQty = prev[item.id] ?? 0;
      if (currentQty <= 1) {
        const { [item.id]: _removed, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [item.id]: currentQty - 1,
      };
    });
  };

  const renderCategory = ({ item }: { item: string }) => {
    const active = selectedCategory === item;

    return (
      <TouchableOpacity
        onPress={() => setSelectedCategory(item)}
        style={[s.pill, active && s.pillActive]}
        activeOpacity={0.85}
      >
        <Text style={[s.pillText, active && s.pillTextActive]}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderMenuItem = ({ item, index }: { item: MenuItem; index: number }) => {
    const quantity = cart[item.id] ?? 0;
    const backgroundColor =
      item.category === 'Latte'
        ? '#E8DCCB'
        : item.category === 'Signature'
          ? '#E9DDD5'
          : item.category === 'Cold Coffee'
            ? '#DDE7EF'
            : item.category === 'Mocha'
              ? '#E9D8D3'
              : '#F0E7DC';

    return (
      <Animated.View
        entering={FadeInDown.delay(Math.min(index, 8) * 55).springify()}
        layout={Layout.springify()}
        style={s.itemCard}
      >
        <View style={[s.itemIcon, { backgroundColor }]}>
          <Ionicons name={categoryIcon(item.category)} size={24} color="#473126" />
        </View>

        <View style={s.itemInfo}>
          <Text style={s.category}>{item.category.toUpperCase()}</Text>
          <Text style={s.itemName}>{item.name}</Text>
          <Text style={s.notes}>{item.description ?? 'Freshly brewed and handcrafted.'}</Text>
          <Text style={s.price}>₱{Number(item.price).toFixed(2)}</Text>
        </View>

        <View style={s.actionStack}>
          {quantity > 0 ? (
            <View style={s.quantityBox}>
              <TouchableOpacity
                style={s.quantityButton}
                onPress={() => removeItem(item)}
                accessibilityLabel={`Decrease ${item.name}`}
              >
                <Ionicons name="remove" size={15} color="#473126" />
              </TouchableOpacity>

              <Text style={s.quantityText}>{quantity}</Text>

              <TouchableOpacity
                style={s.quantityButton}
                onPress={() => addItem(item)}
                accessibilityLabel={`Increase ${item.name}`}
              >
                <Ionicons name="add" size={15} color="#473126" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              accessibilityLabel={`Add ${item.name}`}
              onPress={() => addItem(item)}
              style={s.addButton}
            >
              <Ionicons name="add" size={18} color="#FFF8EF" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={s.safe}>
      <FlatList
        data={filteredItems}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={
          <View style={s.container}>
            <View style={s.heading}>
              <Text style={s.kicker}>COFFEE HOUSE</Text>
              <Text style={s.title}>Freshly brewed favorites</Text>
              <Text style={s.subtitle}>
                Handcrafted drinks, small bites, and warm essentials to start your day.
              </Text>
            </View>

            <View style={s.summaryRow}>
              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Open today</Text>
                <Text style={s.summaryValue}>7:00 AM - 9:00 PM</Text>
              </View>
              <View style={s.summaryCard}>
                <Text style={s.summaryLabel}>Best seller</Text>
                <Text style={s.summaryValue}>Caramel Cloud</Text>
              </View>
            </View>

            <View style={s.search}>
              <Ionicons name="search-outline" size={18} color="#8A6F5A" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search menu"
                placeholderTextColor="#A38A74"
                style={s.searchInput}
                accessibilityLabel="Search menu items"
              />
            </View>

            {loading && (
              <View style={s.loadingBox}>
                <ActivityIndicator size="small" color="#5B3D2F" />
                <Text style={s.statusText}>Loading menu...</Text>
              </View>
            )}

            {error !== '' && <Text style={s.errorText}>{error}</Text>}

            <FlatList
              horizontal
              data={categories}
              keyExtractor={item => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.categories}
              renderItem={renderCategory}
              style={s.categoryBar}
            />

            <View style={s.resultsHeader}>
              <Text style={s.resultsTitle}>
                {selectedCategory === 'All' ? 'Customer favorites' : selectedCategory}
              </Text>
              <Text style={s.resultsCount}>{filteredItems.length} ITEMS</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={s.empty}>
              <Ionicons
                name={error ? 'cloud-offline-outline' : 'search-outline'}
                size={28}
                color="#A58B76"
              />
              <Text style={s.emptyText}>
                {error || (menuItems.length === 0
                  ? 'No menu items are available right now.'
                  : 'No menu items match your search.')}
              </Text>
            </View>
          ) : null
        }
        renderItem={renderMenuItem}
        ListFooterComponent={
          totalItems > 0 ? (
            <Animated.View entering={FadeInUp.springify()} layout={Layout.springify()} style={s.cartBar}>
              <View style={s.cartInfo}>
                <Text style={s.cartTitle}>Your selection</Text>
                <Text style={s.cartSub}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} • ₱
                  {subtotal.toFixed(2)}
                </Text>
              </View>

              <View style={s.cartActions}>
                <TouchableOpacity onPress={() => setCart({})} style={s.cartAction}>
                  <Text style={s.cartActionText}>Clear</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.checkoutButton} onPress={() => setCheckoutOpen(true)}>
                  <Text style={s.checkoutText}>Review</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ) : null
        }
      />

      <Modal visible={checkoutOpen} transparent animationType="slide" onRequestClose={() => setCheckoutOpen(false)}>
        <View style={s.modalBackdrop}>
          <Animated.View entering={FadeInUp.springify()} style={s.checkoutSheet}>
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>Checkout</Text>
              <TouchableOpacity onPress={() => setCheckoutOpen(false)}>
                <Ionicons name="close" size={22} color="#4D3629" />
              </TouchableOpacity>
            </View>

            <Text style={s.sheetSubtitle}>Review your selection</Text>

            {selectedItems.map(item => (
              <View key={item.id} style={s.checkoutRow}>
                <View>
                  <Text style={s.checkoutName}>{item.name}</Text>
                  <Text style={s.checkoutMeta}>{item.quantity} x ₱{Number(item.price).toFixed(2)}</Text>
                </View>
                <Text style={s.checkoutPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}

            <View style={s.totalRow}>
              <Text style={s.totalLabel}>Total</Text>
              <Text style={s.totalValue}>₱{subtotal.toFixed(2)}</Text>
            </View>

            <View style={s.checkoutNotice}>
              <Ionicons name="information-circle-outline" size={17} color="#8A6F5A" />
              <Text style={s.checkoutNoticeText}>
                This screen is a UI preview. Order submission is not connected.
              </Text>
            </View>

            <View style={s.checkoutActions}>
              <TouchableOpacity style={s.closeCheckoutButton} onPress={() => setCheckoutOpen(false)}>
                <Text style={s.closeCheckoutText}>Continue browsing</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F7F3ED',
  },

  listContent: {
    paddingBottom: 24,
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 16,
    maxWidth: 950,
    width: '100%',
    alignSelf: 'center',
  },

  heading: {
    marginBottom: 18,
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

  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },

  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFDFC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EDE3D9',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  summaryLabel: {
    fontSize: 9,
    color: '#A08063',
    fontWeight: '700',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },

  summaryValue: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '800',
    color: '#3E2A20',
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

  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 10,
    marginBottom: 10,
  },

  statusText: {
    textAlign: 'center',
    color: '#8F7B6A',
  },

  errorText: {
    textAlign: 'center',
    color: '#B04A3A',
    marginBottom: 10,
  },

  categoryBar: {
    maxHeight: 54,
    marginBottom: 18,
  },

  categories: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
    paddingRight: 4,
  },

  pill: {
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 24,
    backgroundColor: '#EFE6DC',
    borderWidth: 1,
    borderColor: '#EFE6DC',
    justifyContent: 'center',
    alignItems: 'center',
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
    paddingHorizontal: 4,
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
    marginHorizontal: 20,
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

  actionStack: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#493326',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F1E7DD',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFDFC',
    alignItems: 'center',
    justifyContent: 'center',
  },

  quantityText: {
    minWidth: 18,
    textAlign: 'center',
    fontWeight: '800',
    color: '#493326',
  },

  empty: {
    marginHorizontal: 20,
    alignItems: 'center',
    paddingVertical: 40,
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
    marginHorizontal: 20,
    marginTop: 6,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cartInfo: {
    flex: 1,
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

  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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

  checkoutButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F4E7D6',
  },

  checkoutText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#3D2A1F',
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(29, 18, 12, 0.48)',
    justifyContent: 'flex-end',
  },

  checkoutSheet: {
    backgroundColor: '#FFFDFC',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 26,
  },

  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#35251C',
  },

  sheetSubtitle: {
    fontSize: 13,
    color: '#8A6F5A',
    marginBottom: 18,
  },

  checkoutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0E4DB',
  },

  checkoutName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3D2A1F',
  },

  checkoutMeta: {
    fontSize: 11,
    color: '#8A6F5A',
    marginTop: 4,
  },

  checkoutPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#5C3A2C',
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },

  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4D3629',
  },

  totalValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#3B261B',
  },

  checkoutNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3ECE4',
    borderRadius: 12,
    padding: 11,
    marginBottom: 10,
  },

  checkoutNoticeText: {
    flex: 1,
    color: '#786656',
    fontSize: 11,
    lineHeight: 16,
  },

  checkoutActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },

  closeCheckoutButton: {
    flex: 1,
    backgroundColor: '#493326',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },

  closeCheckoutText: {
    color: '#FFF8EF',
    fontWeight: '800',
  },
});
