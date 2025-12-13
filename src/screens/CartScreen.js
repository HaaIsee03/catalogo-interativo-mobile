import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext'; // <--- IMPORTAR TEMA
import { formatCurrency } from '../utils/format';

export default function CartScreen() {
  const { cart, removeFromCart, clearCart, cartTotal } = useCart();
  const { theme } = useTheme(); // <--- USAR TEMA
  const [modalVisible, setModalVisible] = useState(false);

  const handleFinish = () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    setModalVisible(true);
  };

  const closeAndClear = () => {
    setModalVisible(false);
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="cart-outline" size={64} color={theme.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Seu carrinho está vazio.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => item.id.toString() + index}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={[styles.item, { backgroundColor: theme.surface }]}>
            <Image source={{ uri: item.thumbnail }} style={styles.image} />
            <View style={styles.info}>
              <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>{item.title}</Text>
              <View style={styles.priceRow}>
                 <Text style={[styles.price, { color: theme.primary }]}>{formatCurrency(item.price * 5.5)}</Text>
                 <Text style={[styles.qtyBadge, { color: theme.textSecondary, backgroundColor: theme.background }]}>x {item.quantity}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => removeFromCart(item.id)}>
              <Ionicons name="trash-outline" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
      />
      
      <View style={[styles.footer, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, { color: theme.text }]}>Total:</Text>
          <Text style={styles.totalValue}>{formatCurrency(cartTotal)}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton} onPress={handleFinish}>
          <Text style={styles.checkoutText}>FINALIZAR COMPRA</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeAndClear}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Ionicons name="gift" size={64} color={theme.primary} />
            <Text style={[styles.modalTitle, { color: theme.text }]}>Pedido Realizado!</Text>
            <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>Obrigado pela preferência.{"\n"}Seus itens chegarão em breve.</Text>
            
            <TouchableOpacity 
              style={[styles.modalButton, { backgroundColor: theme.primary }]} 
              onPress={closeAndClear}
            >
              <Text style={styles.modalButtonText}>Fechar e Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { marginTop: 10, fontSize: 16 },
  item: { flexDirection: 'row', padding: 15, marginHorizontal: 15, marginTop: 15, borderRadius: 10, alignItems: 'center', elevation: 2 },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 15 },
  info: { flex: 1 },
  title: { fontSize: 16, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  price: { fontSize: 14, fontWeight: 'bold', marginRight: 10 },
  qtyBadge: { fontSize: 12, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, borderTopWidth: 1, elevation: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#4CAF50' },
  checkoutButton: { backgroundColor: '#27ae60', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: 320, borderRadius: 20, padding: 30, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginTop: 15, marginBottom: 10 },
  modalMessage: { fontSize: 16, textAlign: 'center', marginBottom: 25, lineHeight: 22 },
  modalButton: { borderRadius: 10, paddingVertical: 12, paddingHorizontal: 40, elevation: 2 },
  modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});