import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

const MAX_CONTENT_WIDTH = 1200;

export default function ProductListScreen({ navigation, gender }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [filter, setFilter] = useState('all');

  const numColumns =
    width > 1200 ? 5 : width > 900 ? 4 : width > 600 ? 3 : 2;

  const maleCategories = ['mens-shirts', 'mens-shoes', 'mens-watches'];
  const femaleCategories = [
    'womens-dresses',
    'womens-bags',
    'womens-jewellery',
    'womens-shoes',
    'womens-watches',
  ];

  useEffect(() => {
    async function load() {
      setLoading(true);

      const categories = gender === 'male' ? maleCategories : femaleCategories;

      const responses = await Promise.all(
        categories.map((c) => api.get(`/products/category/${c}`))
      );

      const allProducts = responses
        .flatMap((r) => r.data.products)
        .map((p) => ({
          ...translateProduct(p),
          freeShipping: Math.random() > 0.6,
        }));

      setProducts(allProducts);
      setLoading(false);
    }

    load();
  }, [gender]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (search) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          (p.brand || '').toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === 'favorites') {
      list = list.filter((p) => favorites.includes(p.id));
    }

    if (filter === 'shipping') {
      list = list.filter((p) => p.freeShipping);
    }

    if (filter === 'watch') {
      list = list.filter((p) => p.category.includes('watch'));
    }

    if (filter === 'clothes') {
      list = list.filter(
        (p) =>
          p.category.includes('shirt') || p.category.includes('dress')
      );
    }

    if (filter === 'shoes') {
      list = list.filter((p) => p.category.includes('shoe'));
    }

    if (sort === 'priceLow') {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === 'priceHigh') {
      list.sort((a, b) => b.price - a.price);
    }

    if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, search, sort, filter, favorites]);

  const renderItem = ({ item }) => {
    const price = item.price * 5.5;
    const isFav = favorites.includes(item.id);

    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: theme.surface }]}
        onPress={() =>
          navigation.navigate('Details', { productId: item.id })
        }
        activeOpacity={0.9}
      >
        <TouchableOpacity
          style={styles.favorite}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons
            name={isFav ? 'heart' : 'heart-outline'}
            size={20}
            color={isFav ? '#E53935' : theme.textSecondary}
          />
        </TouchableOpacity>

        {item.freeShipping && (
          <View style={styles.shipping}>
            <Text style={styles.shippingText}>Frete Grátis</Text>
          </View>
        )}

        <Image source={{ uri: item.thumbnail }} style={styles.image} />

        <View style={styles.info}>
          <Text
            style={[styles.title, { color: theme.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <Text style={[styles.price, { color: theme.primary }]}>
            {formatCurrency(price)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      {/* BUSCA */}
      <View
        style={[
          styles.searchBox,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <Ionicons
          name="search"
          size={18}
          color={theme.textSecondary}
          style={{ marginRight: 8 }}
        />

        <TextInput
          placeholder="Buscar produtos"
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: theme.text }]}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>

      {/* FILTROS */}
      <View style={styles.filters}>
        <Filter label="Todos" active={filter === 'all'} onPress={() => setFilter('all')} />
        <Filter label="Relógios" active={filter === 'watch'} onPress={() => setFilter('watch')} />
        <Filter label="Roupas" active={filter === 'clothes'} onPress={() => setFilter('clothes')} />
        <Filter label="Calçados" active={filter === 'shoes'} onPress={() => setFilter('shoes')} />
        <Filter label="Frete Grátis" active={filter === 'shipping'} onPress={() => setFilter('shipping')} />
        <Filter label="Favoritos" active={filter === 'favorites'} onPress={() => setFilter('favorites')} />
      </View>

      {/* ORDENAÇÃO */}
      <View style={styles.filters}>
        <Filter label="Preço ↑" active={sort === 'priceLow'} onPress={() => setSort('priceLow')} />
        <Filter label="Preço ↓" active={sort === 'priceHigh'} onPress={() => setSort('priceHigh')} />
        <Filter label="Avaliação" active={sort === 'rating'} onPress={() => setSort('rating')} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={[
          styles.list,
          { maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

function Filter({ label, active, onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.filterBtn,
        active && styles.filterActive,
      ]}
    >
      <Text
        style={[
          styles.filterText,
          active && styles.filterTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  /* BUSCA */
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    marginHorizontal: 15,
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 14,
    paddingVertical: 0,
    outlineStyle: 'none',
  },

  /* FILTROS */
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 15,
    marginBottom: 8,
  },

  filterBtn: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: '#444',
  },
  filterActive: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  filterText: { color: '#aaa', fontSize: 13 },
  filterTextActive: { color: '#fff', fontWeight: '600' },

  /* LISTA */
  list: { padding: 15 },

  card: {
    flex: 1,
    margin: 10,
    borderRadius: 16,
    padding: 10,
  },

  image: {
    height: 140,
    resizeMode: 'contain',
  },

  info: { marginTop: 10 },
  title: { fontSize: 14, fontWeight: '600' },
  price: { fontSize: 16, fontWeight: 'bold' },

  favorite: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 2,
  },

  shipping: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#2E7D32',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  shippingText: { color: '#fff', fontSize: 11 },
});
