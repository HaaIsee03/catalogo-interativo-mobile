import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

import { WebFooter } from '../components/WebFooter';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import api from '../services/api';
import { formatCurrency } from '../utils/format';
import { translateProduct } from '../utils/translator';

const MAX_DETAIL_WIDTH = 1100;

const fakeReviews = [
  { id: 1, user: 'Maria C.', rating: 5, comment: 'Camisa linda e o tecido é ótimo!' },
  { id: 2, user: 'João S.', rating: 4, comment: 'Boa qualidade, recomendo.' },
];

export default function ProductDetailsScreen({ route, navigation }) {
  const { productId } = route.params;
  const { addToCart } = useCart();
  const { theme } = useTheme();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [commentText, setCommentText] = useState('');
  const [commentError, setCommentError] = useState('');

  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);

  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  useEffect(() => {
    async function fetchDetails() {
      try {
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

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ color: theme.text }}>Produto não encontrado</Text>
      </View>
    );
  }

  const priceInReal = product.price * 5.5;
  const originalPrice = priceInReal / (1 - product.discountPercentage / 100);

  const renderStars = rating => (
    <View style={{ flexDirection: 'row' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={18}
          color="#FFD700"
        />
      ))}
    </View>
  );

  const handleAdd = () => {
    addToCart(product, quantity);
    setCartModalVisible(true);
  };

  /** 🔥 NAVEGAÇÃO CORRETA PARA TAB */
  const goCart = () => {
    setCartModalVisible(false);
    navigation.navigate('Home', { screen: 'Carrinho' });
  };

  const handlePostComment = () => {
    if (!commentText) {
      setCommentError('Escreva um comentário.');
      return;
    }
    setCommentError('');
    setCommentText('');
    setCommentModalVisible(true);
  };

  const Content = (
    <>
      {/* BOTÃO VOLTAR */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* IMAGEM */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.thumbnail }} style={styles.image} resizeMode="contain" />
      </View>

      {/* DETALHES */}
      <View style={styles.detailsContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{product.title}</Text>
        {renderStars(Math.round(product.rating))}

        <Text style={styles.originalPrice}>{formatCurrency(originalPrice)}</Text>
        <Text style={[styles.price, { color: theme.text }]}>{formatCurrency(priceInReal)}</Text>
        <Text style={styles.discountText}>{Math.round(product.discountPercentage)}% OFF</Text>

        {/* QUANTIDADE */}
        <View style={styles.qtyContainer}>
          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: theme.border }]}
            onPress={() => setQuantity(q => Math.max(1, q - 1))}
          >
            <Ionicons name="remove" size={18} color={theme.text} />
          </TouchableOpacity>

          <Text style={[styles.qtyText, { color: theme.text }]}>{quantity}</Text>

          <TouchableOpacity
            style={[styles.qtyBtn, { borderColor: theme.border }]}
            onPress={() => setQuantity(q => q + 1)}
          >
            <Ionicons name="add" size={18} color={theme.text} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={handleAdd}>
          <Text style={styles.buyButtonText}>Adicionar ao Carrinho</Text>
        </TouchableOpacity>
      </View>

      {/* DESCRIÇÃO */}
      <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Descrição</Text>
        <Text style={{ color: theme.textSecondary }}>{product.description}</Text>
      </View>

      {/* AVALIAÇÕES */}
      <View style={[styles.sectionContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Avaliações</Text>

        <TextInput
          placeholder="Escreva um comentário"
          placeholderTextColor={theme.textSecondary}
          value={commentText}
          onChangeText={setCommentText}
          style={[
            styles.commentInput,
            {
              backgroundColor: theme.background,
              borderColor: theme.border,
              color: theme.text,
            },
          ]}
          multiline
        />

        <TouchableOpacity style={styles.commentButton} onPress={handlePostComment}>
          <Text style={styles.commentButtonText}>Enviar Comentário</Text>
        </TouchableOpacity>

        {commentError !== '' && (
          <Text style={{ color: '#D32F2F', marginTop: 6 }}>{commentError}</Text>
        )}

        {fakeReviews.map(r => (
          <View key={r.id} style={{ marginTop: 12 }}>
            <Text style={{ color: theme.text }}>{r.user}</Text>
            {renderStars(r.rating)}
            <Text style={{ color: theme.textSecondary }}>{r.comment}</Text>
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
          <View style={styles.webInner}>{Content}</View>
        </View>
      ) : (
        <ScrollView>{Content}</ScrollView>
      )}

      {/* MODAL CARRINHO */}
      <Modal transparent visible={cartModalVisible} animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={[styles.popupCard, { backgroundColor: theme.surface }]}>
            {/* X */}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCartModalVisible(false)}
            >
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>

            <Ionicons name="cart" size={56} color={theme.primary} />
            <Text style={[styles.popupTitle, { color: theme.text }]}>
              Produto adicionado!
            </Text>

            <TouchableOpacity style={styles.popupPrimaryBtn} onPress={goCart}>
              <Text style={styles.popupPrimaryText}>Ir para o Carrinho</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setCartModalVisible(false)}>
              <Text style={styles.popupSecondaryText}>Continuar Comprando</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL COMENTÁRIO */}
      <Modal transparent visible={commentModalVisible} animationType="fade">
        <View style={styles.popupOverlay}>
          <View style={[styles.popupCard, { backgroundColor: theme.surface }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCommentModalVisible(false)}
            >
              <Ionicons name="close" size={22} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.popupTitle, { color: theme.text }]}>
              Comentário enviado!
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  webScroll: { height: '100vh', overflowY: 'auto' },
  webInner: { maxWidth: MAX_DETAIL_WIDTH, marginHorizontal: 'auto' },

  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
    backgroundColor: '#0008',
    padding: 8,
    borderRadius: 20,
  },

  imageContainer: { height: 300 },
  image: { width: '100%', height: '100%' },

  detailsContainer: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold' },
  price: { fontSize: 26, fontWeight: 'bold' },
  originalPrice: { textDecorationLine: 'line-through', color: '#999' },
  discountText: { color: '#D32F2F' },

  qtyContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  qtyBtn: { borderWidth: 1, padding: 6, borderRadius: 6 },
  qtyText: { marginHorizontal: 15, fontSize: 18 },

  buyButton: {
    backgroundColor: '#4A90E2',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buyButtonText: { color: '#fff', fontWeight: 'bold' },

  sectionContainer: {
    padding: 20,
    margin: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6 },

  commentInput: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentButton: {
    backgroundColor: '#4A90E2',
    padding: 10,
    borderRadius: 8,
  },
  commentButtonText: { color: '#fff', textAlign: 'center' },

  popupOverlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupCard: {
    padding: 25,
    borderRadius: 20,
    width: 300,
    position: 'relative',
  },
  popupTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },

  popupPrimaryBtn: {
    backgroundColor: '#4A90E2',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  popupPrimaryText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },

  popupSecondaryText: {
    textAlign: 'center',
    marginTop: 10,
    color: '#4A90E2',
    fontWeight: '600',
  },

  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
});
