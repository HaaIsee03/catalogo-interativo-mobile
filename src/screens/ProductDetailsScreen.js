import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { WebFooter } from '../components/WebFooter';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useTheme } from '../contexts/ThemeContext';

const MAX_DETAIL_WIDTH = 1100;

const fakeReviews = [
  { id: 1, user: 'Maria C.', rating: 5, comment: 'Camisa linda e o tecido é ótimo!' },
  { id: 2, user: 'João S.', rating: 4, comment: 'Boa qualidade, recomendo.' },
];

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;

  const { theme } = useTheme();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);

  const [cartModalVisible, setCartModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isDesktop = width > 900;

  useEffect(() => {
    async function fetchDetails() {
      try {
        setLoading(true);
        const response = await api.get(`/products/${productId}`);
        setProduct(translateProduct(response.data));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [productId]);

  const priceInReal = useMemo(() => {
    if (!product) return 0;
    return product.price * 5.5;
  }, [product]);

  const originalPrice = useMemo(() => {
    if (!product) return 0;
    const disc = product.discountPercentage || 0;
    if (disc <= 0) return priceInReal;
    return priceInReal / (1 - disc / 100);
  }, [product, priceInReal]);

  const fav = product ? isFavorite(product.id) : false;

  const renderStars = (rating) => (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
          style={{ marginRight: 2 }}
        />
      ))}
    </View>
  );

  const handleAdd = () => {
    if (!product) return;
    addToCart(product, quantity);
    setCartModalVisible(true);
  };

  const goCart = () => {
    setCartModalVisible(false);
    // Como o Carrinho é TAB dentro de "Home", precisa navegar assim:
    navigation.navigate('Home', { screen: 'Carrinho' });
  };

  const continueShopping = () => {
    setCartModalVisible(false);
    // Fica na tela (ou se quiser voltar, troque por navigation.goBack())
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Produto não encontrado</Text>
      </View>
    );
  }

  const Content = (
    <>
      {/* TOPO (voltar + favorito) */}
      <View style={styles.topActions}>
        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, { backgroundColor: theme.surface, borderColor: theme.border }]}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={fav ? 'heart' : 'heart-outline'}
            size={20}
            color={fav ? '#E53935' : theme.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* CARD PRINCIPAL */}
      <View
        style={[
          styles.mainCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        {/* IMAGEM */}
        <View style={[styles.imageWrap, { backgroundColor: theme.background }]}>
          <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="contain" />
        </View>

        {/* DETALHES */}
        <View style={styles.details}>
          <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
            {product.title}
          </Text>

          <View style={styles.metaRow}>
            {renderStars(Math.round(product.rating || 0))}
            <Text style={[styles.metaText, { color: theme.textSecondary }]}>
              {Number(product.rating || 0).toFixed(1)}
            </Text>
          </View>

          <View style={{ marginTop: 10 }}>
            {product.discountPercentage ? (
              <Text style={[styles.originalPrice, { color: theme.textSecondary }]}>
                {formatCurrency(originalPrice)}
              </Text>
            ) : null}

            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.text }]}>
                {formatCurrency(priceInReal)}
              </Text>

              {product.discountPercentage ? (
                <View style={styles.badgeOff}>
                  <Text style={styles.badgeOffText}>
                    {Math.round(product.discountPercentage)}% OFF
                  </Text>
                </View>
              ) : null}
            </View>
          </View>

          {/* QUANTIDADE + COMPRAR */}
          <View style={styles.buyRow}>
            <View style={[styles.qtyBox, { borderColor: theme.border }]}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                activeOpacity={0.8}
              >
                <Ionicons name="remove" size={18} color={theme.text} />
              </TouchableOpacity>

              <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>

              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity((q) => q + 1)}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={18} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={handleAdd}
              activeOpacity={0.9}
            >
              <Ionicons name="cart-outline" size={18} color="#fff" />
              <Text style={styles.addButtonText}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* DESCRIÇÃO */}
      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição</Text>
        <Text style={{ color: theme.textSecondary, lineHeight: 20 }}>
          {product.description}
        </Text>
      </View>

      {/* AVALIAÇÕES (fake) */}
      <View style={[styles.section, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Avaliações</Text>

        {fakeReviews.map((r) => (
          <View key={r.id} style={[styles.reviewCard, { borderColor: theme.border }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ color: theme.text, fontWeight: '700' }}>{r.user}</Text>
              {renderStars(r.rating)}
            </View>
            <Text style={{ color: theme.textSecondary, marginTop: 6 }}>{r.comment}</Text>
          </View>
        ))}
      </View>

      {Platform.OS === 'web' && <WebFooter />}
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {Platform.OS === 'web' ? (
        <View style={styles.webScroll}>
          <View style={[styles.webInner, { maxWidth: MAX_DETAIL_WIDTH }]}>{Content}</View>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>{Content}</ScrollView>
      )}

      {/* MODAL: Produto adicionado */}
      <Modal transparent visible={cartModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            {/* X */}
            <TouchableOpacity
              style={[styles.modalClose, { borderColor: theme.border }]}
              onPress={() => setCartModalVisible(false)}
              activeOpacity={0.8}
            >
              <Ionicons name="close" size={18} color={theme.text} />
            </TouchableOpacity>

            <Ionicons name="checkmark-circle" size={44} color="#2E7D32" />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Produto adicionado!</Text>
            <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
              Quer finalizar agora ou continuar vendo a loja?
            </Text>

            <TouchableOpacity
              style={[styles.modalPrimaryBtn, { backgroundColor: theme.primary }]}
              onPress={goCart}
              activeOpacity={0.9}
            >
              <Text style={styles.modalPrimaryText}>Ir para o Carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={continueShopping} activeOpacity={0.85}>
              <Text style={[styles.modalSecondaryText, { color: theme.primary }]}>
                Continuar Comprando
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  webScroll: { height: '100vh', overflowY: 'auto' },
  webInner: { width: '100%', alignSelf: 'center', paddingBottom: 24 },

  topActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 6,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainCard: {
    margin: 14,
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
  },

  imageWrap: {
    width: '100%',
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  image: { width: '100%', height: '100%' },

  details: { padding: 16 },

  title: { fontSize: 20, fontWeight: '800' },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  metaText: { fontSize: 13 },

  originalPrice: { textDecorationLine: 'line-through', fontSize: 13 },

  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4 },
  price: { fontSize: 26, fontWeight: '900' },

  badgeOff: {
    backgroundColor: '#D32F2F',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeOffText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  buyRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 14 },

  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    overflow: 'hidden',
  },
  qtyBtn: {
    width: 42,
    height: 42,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: { width: 44, textAlign: 'center', fontSize: 16, fontWeight: '800' },

  addButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  section: {
    marginHorizontal: 14,
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '900', marginBottom: 10 },

  reviewCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  modalCard: {
    width: 340,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: { marginTop: 10, fontSize: 18, fontWeight: '900' },
  modalSubtitle: { marginTop: 6, fontSize: 13, textAlign: 'center' },

  modalPrimaryBtn: {
    marginTop: 14,
    width: '100%',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  modalPrimaryText: { color: '#fff', fontWeight: '900', fontSize: 14 },

  modalSecondaryText: { marginTop: 12, fontWeight: '900' },
});
