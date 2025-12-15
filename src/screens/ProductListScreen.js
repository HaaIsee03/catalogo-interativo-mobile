import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

import ProductSkeleton from '../components/ProductSkeleton';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';

import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

const MAX_CONTENT_WIDTH = 1200;

const FILTERS = [
  { key: 'all', label: 'Todos' },
  { key: 'favorites', label: 'Favoritos' },
  { key: 'shipping', label: 'Frete grátis' },
  { key: 'watch', label: 'Relógios' },
  { key: 'clothes', label: 'Roupas' },
  { key: 'shoes', label: 'Calçados' },
];

export default function ProductListScreen({ navigation, gender }) {
  const { theme } = useTheme();
  const { favorites, toggleFavorite } = useFavorites();
  const { addToCart } = useCart();
  const { width } = useWindowDimensions();

  const scrollY = useRef(new Animated.Value(0)).current;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);

  const numColumns =
    width > 1200 ? 5 : width > 900 ? 4 : width > 600 ? 3 : 2;

  // 🔽 fecha filtros ao rolar
  useEffect(() => {
    const id = scrollY.addListener(({ value }) => {
      if (value > 20 && showFilters) setShowFilters(false);
    });
    return () => scrollY.removeListener(id);
  }, [showFilters]);

  // 🔽 carrega produtos
  useEffect(() => {
    async function load() {
      setLoading(true);

      const categories =
        gender === 'male'
          ? ['mens-shirts', 'mens-shoes', 'mens-watches']
          : [
              'womens-dresses',
              'womens-bags',
              'womens-jewellery',
              'womens-shoes',
              'womens-watches',
            ];

      const responses = await Promise.all(
        categories.map((c) => api.get(`/products/category/${c}`))
      );

      const all = responses.flatMap((r) =>
        r.data.products.map((p) => ({
          ...translateProduct(p),
          freeShipping: Math.random() > 0.6,
        }))
      );

      setProducts(all);
      setLoading(false);
    }

    load();
  }, [gender]);

  // 🔽 filtros
  const filtered = useMemo(() => {
    let list = [...products];

    if (search) {
      const s = search.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(s));
    }

    if (filter === 'favorites') list = list.filter((p) => favorites.includes(p.id));
    if (filter === 'shipping') list = list.filter((p) => p.freeShipping);
    if (filter === 'watch') list = list.filter((p) => p.category.includes('watch'));
    if (filter === 'clothes')
      list = list.filter(
        (p) => p.category.includes('shirt') || p.category.includes('dress')
      );
    if (filter === 'shoes') list = list.filter((p) => p.category.includes('shoe'));

    list = list.filter((p) => {
      const price = p.price * 5.5;
      return price >= minPrice && price <= maxPrice;
    });

    return list;
  }, [products, search, filter, favorites, minPrice, maxPrice]);

  const handleAddToCart = (item) => {
    addToCart(item, 1);
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const renderItem = ({ item }) => {
    const isFav = favorites.includes(item.id);
    const added = addedId === item.id;

    return (
      <Pressable
        style={[styles.card, { backgroundColor: theme.surface }]}
        onPress={() => navigation.navigate('Details', { productId: item.id })}
      >
        {/* ❤️ Favorito */}
        <Pressable
          style={styles.favorite}
          onPress={(e) => {
            e.stopPropagation();
            toggleFavorite(item.id);
          }}
          hitSlop={10}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={20}
            color={isFav ? '#E53935' : theme.textSecondary}
          />
        </Pressable>

        {item.freeShipping && (
          <View style={styles.shipping}>
            <Text style={styles.shippingText}>Frete grátis</Text>
          </View>
        )}

        <Image source={{ uri: item.thumbnail }} style={styles.image} />

        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {item.title}
        </Text>

        <Text style={[styles.price, { color: theme.primary }]}>
          {formatCurrency(item.price * 5.5)}
        </Text>

        <TouchableOpacity
          style={[
            styles.cartButton,
            { backgroundColor: added ? '#2E7D32' : theme.primary },
          ]}
          onPress={(e) => {
            e.stopPropagation();
            handleAddToCart(item);
          }}
          disabled={added}
        >
          <Text style={styles.cartButtonText}>
            {added ? 'Adicionado ✓' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* 🔍 Busca */}
      <View
        style={[
          styles.searchBox,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search" size={18} color={theme.textSecondary} />
        <TextInput
          placeholder="Buscar produtos"
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: theme.text }]}
        />
        <TouchableOpacity onPress={() => setShowFilters((v) => !v)}>
          <Ionicons name="options-outline" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* 🎛 Filtros */}
      {showFilters && (
        <View
          style={[
            styles.filtersPanel,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.priceLabel, { color: theme.text }]}>
            Preço: {formatCurrency(minPrice)} – {formatCurrency(maxPrice)}
          </Text>

          <Slider
            minimumValue={0}
            maximumValue={2000}
            step={50}
            value={minPrice}
            onValueChange={(v) => {
              setMinPrice(v);
              if (v > maxPrice) setMaxPrice(v);
            }}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />

          <Slider
            minimumValue={0}
            maximumValue={2000}
            step={50}
            value={maxPrice}
            onValueChange={(v) => {
              setMaxPrice(v);
              if (v < minPrice) setMinPrice(v);
            }}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />

          <View style={styles.chipsRow}>
            {FILTERS.map((f) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setFilter(f.key)}
                style={[
                  styles.chip,
                  { borderColor: theme.border },
                  filter === f.key && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: filter === f.key ? '#fff' : theme.text },
                  ]}
                >
                  {f.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* 🧾 Lista */}
      {loading ? (
        <Animated.FlatList
          key={`skeleton-${numColumns}`}
          data={Array.from({ length: numColumns * 2 })}
          renderItem={() => <ProductSkeleton />}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Animated.FlatList
          key={`products-${numColumns}`}
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          numColumns={numColumns}
          contentContainerStyle={styles.list}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    paddingHorizontal: 12,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },

  searchInput: { flex: 1 },

  filtersPanel: {
    marginHorizontal: 15,
    marginBottom: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
  },

  priceLabel: { fontWeight: '700', marginBottom: 6 },

  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  chipText: { fontWeight: '600', fontSize: 13 },

  list: { padding: 15, maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },

  card: { flex: 1, margin: 10, padding: 10, borderRadius: 16 },

  image: { height: 140, resizeMode: 'contain' },

  title: { fontWeight: '700', fontSize: 14 },
  price: { fontWeight: '800', fontSize: 16, marginVertical: 6 },

  cartButton: { paddingVertical: 9, borderRadius: 12, alignItems: 'center' },
  cartButtonText: { color: '#fff', fontWeight: '800' },

  favorite: { position: 'absolute', top: 10, right: 10, zIndex: 10 },

  shipping: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#2E7D32',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  shippingText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
