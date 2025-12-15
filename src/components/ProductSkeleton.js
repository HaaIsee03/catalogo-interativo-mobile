import { StyleSheet, View } from 'react-native';

export default function ProductSkeleton() {
  return (
    <View style={styles.card}>
      <View style={styles.image} />

      <View style={styles.line} />
      <View style={[styles.line, { width: '60%' }]} />
      <View style={styles.price} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#222',
    borderRadius: 16,
    padding: 10,
    margin: 10,
    flex: 1,
  },

  image: {
    height: 140,
    backgroundColor: '#333',
    borderRadius: 10,
    marginBottom: 12,
  },

  line: {
    height: 12,
    backgroundColor: '#333',
    borderRadius: 6,
    marginBottom: 8,
  },

  price: {
    height: 16,
    backgroundColor: '#333',
    borderRadius: 6,
    marginTop: 6,
    width: '40%',
  },
});
