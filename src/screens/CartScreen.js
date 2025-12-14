import { Ionicons } from '@expo/vector-icons';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';
import { formatCurrency } from '../utils/format';

const MAX_WIDTH = 1100;

export default function CartScreen({ navigation }) {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  const { theme } = useTheme();

  const renderItem = ({ item }) => {
    const price = item.price * 5.5;

    return (
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Image source={{ uri: item.thumbnail }} style={styles.image} />

        <View style={styles.info}>
          <Text style={[styles.title, { color: theme.text }]}>
            {item.title}
          </Text>

          <Text style={[styles.price, { color: theme.primary }]}>
            {formatCurrency(price)}
          </Text>

          <View style={styles.qtyContainer}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => decreaseQuantity(item.id)}
            >
              <Ionicons name="remove" size={16} color={theme.text} />
            </TouchableOpacity>

            <Text style={[styles.qtyText, { color: theme.text }]}>
              {item.quantity}
            </Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => increaseQuantity(item.id)}
            >
              <Ionicons name="add" size={16} color={theme.text} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity onPress={() => removeFromCart(item.id)}>
          <Ionicons name="trash-bin" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inner}>
        <Text style={[styles.header, { color: theme.text }]}>
          Meu Carrinho
        </Text>

        {cart.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="cart-outline"
              size={64}
              color={theme.textSecondary}
            />
            <Text style={{ color: theme.textSecondary }}>
              Seu carrinho está vazio
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cart}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 160 }}
            />

            <View
              style={[
                styles.summary,
                { backgroundColor: theme.surface, borderColor: theme.border },
              ]}
            >
              <View style={styles.summaryRow}>
                <Text style={{ color: theme.textSecondary }}>
                  Subtotal
                </Text>
                <Text style={{ color: theme.text, fontWeight: 'bold' }}>
                  {formatCurrency(cartTotal)}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.checkoutBtn,
                  { backgroundColor: theme.primary },
                ]}
                onPress={() => navigation.navigate('Checkout')}
              >
                <Text style={styles.checkoutText}>
                  Finalizar Compra
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },

  inner: {
    width: '100%',
    maxWidth: MAX_WIDTH,
    padding: 15,
  },

  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },

  empty: {
    marginTop: 80,
    alignItems: 'center',
  },

  card: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 16,
    marginBottom: 12,
    alignItems: 'center',
  },

  image: { width: 80, height: 80, marginRight: 15 },

  info: { flex: 1 },

  title: { fontSize: 16, fontWeight: '600' },

  price: { fontSize: 18, fontWeight: 'bold', marginVertical: 6 },

  qtyContainer: { flexDirection: 'row', alignItems: 'center' },

  qtyBtn: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 6,
  },

  qtyText: { marginHorizontal: 12, fontWeight: 'bold' },

  summary: {
    borderTopWidth: 1,
    padding: 20,
    borderRadius: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  checkoutBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
