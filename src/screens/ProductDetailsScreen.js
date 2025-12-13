import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext'; // <--- TEMA
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

const MAX_DETAIL_WIDTH = 1100;

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { theme } = useTheme(); // <--- USANDO O TEMA
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.get(`/products/${productId}`);
        const translatedItem = translateProduct(response.data);
        setProduct(translatedItem);
        setMyRating(0); 
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [productId]);

  const increaseQty = () => setQuantity(q => q + 1);
  const decreaseQty = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setModalVisible(true);
  };

  const handleContinueShopping = () => {
    setModalVisible(false);
    navigation.navigate('Home');
  };

  if (loading) return <View style={[styles.center, {backgroundColor: theme.background}]}><ActivityIndicator size="large" color={theme.primary} /></View>;
  if (!product) return <View style={[styles.center, {backgroundColor: theme.background}]}><Text style={{color: theme.text}}>Produto não encontrado.</Text></View>;

  const priceInReal = product.price * 5.5;

  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setMyRating(i)}>
          <Ionicons name={i <= myRating ? "star" : "star-outline"} size={32} color="#FFD700" style={{ marginRight: 5 }} />
        </TouchableOpacity>
      );
    }
    return <View style={styles.starContainer}>{stars}</View>;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }, isDesktop && styles.desktopContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={[styles.contentWrapper, isDesktop && styles.contentWrapperDesktop]}>
            {/* Imagem com fundo do tema surface (ex: branco ou cinza escuro) */}
            <View style={[styles.imageContainer, { backgroundColor: theme.surface }, isDesktop && styles.imageContainerDesktop]}>
                <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="contain" />
            </View>

            {/* Detalhes */}
            <View style={[styles.detailsContainer, { backgroundColor: theme.surface }, isDesktop && styles.detailsContainerDesktop]}>
              <Text style={[styles.brand, { color: theme.textSecondary }]}>{product.brand || 'Genérico'}</Text>
              <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>

              <View style={styles.generalRatingContainer}>
                <Ionicons name="star" size={18} color="#FFD700" />
                <Text style={[styles.generalRatingText, { color: theme.textSecondary }]}>
                    Nota Geral: {product.rating.toFixed(1)} / 5.0
                </Text>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <Text style={[styles.label, { color: theme.textSecondary }]}>Dê sua avaliação:</Text>
              {renderStars()}
              
              {/* Linha de Preço e Quantidade */}
              <View style={styles.priceRow}>
                <View>
                    <Text style={[styles.price, { color: theme.primary }]}>{formatCurrency(priceInReal)}</Text>
                    <Text style={styles.discountText}>{Math.round(product.discountPercentage)}% OFF</Text>
                </View>

                <View style={[styles.qtyContainer, { backgroundColor: theme.background }]}>
                    <TouchableOpacity onPress={decreaseQty} style={[styles.qtyButton, { backgroundColor: theme.surface }]}>
                        <Ionicons name="remove" size={20} color={theme.text} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>
                    <TouchableOpacity onPress={increaseQty} style={[styles.qtyButton, { backgroundColor: theme.surface }]}>
                        <Ionicons name="add" size={20} color={theme.text} />
                    </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.divider, { backgroundColor: theme.border }]} />

              <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição</Text>
              <Text style={[styles.description, { color: theme.textSecondary }]}>
                {product.description}
              </Text>

              {/* Botão Desktop */}
              {isDesktop && (
                 <TouchableOpacity style={[styles.buyButton, { marginTop: 30, backgroundColor: theme.primary }]} onPress={handleAddToCart}>
                    <Text style={styles.buyButtonText}>Adicionar ao Carrinho - {formatCurrency(priceInReal * quantity)}</Text>
                    <Ionicons name="cart" size={20} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
        </View>
      </ScrollView>

      {/* Botão Mobile */}
      {!isDesktop && (
        <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
          <TouchableOpacity style={[styles.buyButton, { backgroundColor: theme.primary }]} onPress={handleAddToCart}>
              <Text style={styles.buyButtonText}>Adicionar - {formatCurrency(priceInReal * quantity)}</Text>
              <Ionicons name="cart" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Sucesso */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Sucesso!</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>{quantity} item(ns) adicionado(s) ao carrinho.</Text>
            
            <TouchableOpacity 
              style={styles.modalButton} 
              onPress={handleContinueShopping}
            >
              <Text style={styles.modalButtonText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  desktopContainer: {
    maxWidth: MAX_DETAIL_WIDTH, width: '100%', alignSelf: 'center',
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10,
    marginTop: 20, borderRadius: 20, marginBottom: 20, overflow: 'hidden'
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100 },
  contentWrapper: { flexDirection: 'column' },
  contentWrapperDesktop: { flexDirection: 'row', alignItems: 'flex-start', padding: 20 },
  imageContainer: { width: '100%', height: 300, justifyContent: 'center', padding: 20 },
  imageContainerDesktop: { width: '50%', height: 500, borderRightWidth: 0 }, 
  image: { width: '100%', height: '100%' },
  detailsContainer: { 
    padding: 24, borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -20, 
    shadowColor: "#000", shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.03, shadowRadius: 10 
  },
  detailsContainerDesktop: { width: '50%', marginTop: 0, borderRadius: 0, shadowOpacity: 0, paddingTop: 0, paddingLeft: 40 },
  brand: { fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 5 },
  generalRatingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  generalRatingText: { fontSize: 16, fontWeight: '600', marginLeft: 5 },
  label: { fontSize: 14, marginBottom: 5 },
  starContainer: { flexDirection: 'row', marginBottom: 5 },
  priceRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  price: { fontSize: 28, fontWeight: 'bold' },
  discountText: { color: '#D32F2F', fontWeight: 'bold', fontSize: 14 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 8, padding: 5 },
  qtyButton: { width: 35, height: 35, justifyContent: 'center', alignItems: 'center', borderRadius: 5, elevation: 1 },
  qtyText: { marginHorizontal: 15, fontSize: 18, fontWeight: 'bold' },
  divider: { height: 1, marginVertical: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  description: { fontSize: 16, lineHeight: 24 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, elevation: 10 },
  buyButton: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 16, borderRadius: 16, shadowColor: "#4A90E2", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  buyButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginRight: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 300, borderRadius: 20, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 20 },
  modalButton: { backgroundColor: '#4CAF50', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 30, elevation: 2 },
  modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});