import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

const MAX_CONTENT_WIDTH = 1200;

export default function ProductListScreen({ navigation, gender }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { theme } = useTheme();

  const { width } = useWindowDimensions();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const numColumns = width > 1200 ? 5 : (width > 900 ? 4 : (width > 600 ? 3 : 2));

  const maleCategories = ['mens-shirts', 'mens-shoes', 'mens-watches'];
  const femaleCategories = ['womens-bags', 'womens-dresses', 'womens-jewellery', 'womens-shoes', 'womens-watches'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const categories = gender === 'male' ? maleCategories : femaleCategories;
        const promises = categories.map(cat => api.get(`/products/category/${cat}`));
        const responses = await Promise.all(promises);
        const allProducts = responses.flatMap(r => r.data.products);
        const translatedProducts = allProducts.map(item => translateProduct(item));
        setProducts(translatedProducts);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [gender]);

  const renderItem = ({ item }) => {
    const cardWidth = (contentWidth / numColumns) - 20;

    return (
      <TouchableOpacity 
        style={[styles.card, { width: cardWidth, backgroundColor: theme.surface }]} 
        onPress={() => navigation.navigate('Details', { productId: item.id })}
        activeOpacity={0.9}
      >
        <View style={[styles.imageContainer, { backgroundColor: theme.surface }]}> 
           <Image 
             source={{ uri: item.thumbnail }} 
             style={styles.image} 
             resizeMode="contain"
           />
        </View>
        
        <View style={styles.cardContent}>
          <Text style={[styles.brand, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.brand || 'Genérico'}
          </Text>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.price, { color: theme.primary }]}>
            {formatCurrency(item.price * 5.5)}
          </Text> 
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      
      <View style={styles.sectionHeader}>
         <View style={{ maxWidth: MAX_CONTENT_WIDTH, width: '100%', alignSelf: 'center' }}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
                {gender === 'male' ? 'Moda Masculina' : 'Moda Feminina'}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                Destaques da coleção
            </Text>
         </View>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlatList
          key={numColumns}
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={numColumns}
          columnWrapperStyle={styles.row} 
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  sectionHeader: { padding: 20, paddingBottom: 10 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  headerSubtitle: { fontSize: 14, marginTop: 4 },
  listContent: { padding: 15, maxWidth: MAX_CONTENT_WIDTH, width: '100%', alignSelf: 'center' },
  row: { justifyContent: 'flex-start', gap: 20, marginBottom: 20 },
  card: { borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  imageContainer: { width: '100%', aspectRatio: 1, justifyContent: 'center', alignItems: 'center', padding: 15 },
  image: { width: '100%', height: '100%' },
  cardContent: { padding: 12 },
  brand: { fontSize: 11, textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5 },
  name: { fontSize: 14, fontWeight: '600', marginVertical: 6, height: 40 },
  price: { fontSize: 17, fontWeight: '800' },
});