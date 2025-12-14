import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutSuccessScreen({ navigation }) {
  const { theme } = useTheme();

  const goToStore = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'Home',
          state: {
            routes: [{ name: 'Masculino' }],
          },
        },
      ],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Ionicons
        name="checkmark-circle"
        size={96}
        color={theme.primary}
      />

      <Text style={[styles.title, { color: theme.text }]}>
        Compra realizada!
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Seu pedido foi finalizado com sucesso.
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: theme.primary }]}
        onPress={goToStore}
      >
        <Text style={styles.buttonText}>
          Voltar para a loja
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 12,
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
