import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { useCart } from '../contexts/CartContext';
import { useTheme } from '../contexts/ThemeContext';

export default function CheckoutScreen({ navigation }) {
  const { clearCart } = useCart();
  const { theme } = useTheme();

  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  /* VALIDAÇÃO */
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = 'Informe seu nome completo';
    if (!cpf.trim() || cpf.length < 11) newErrors.cpf = 'CPF inválido';
    if (!address.trim()) newErrors.address = 'Endereço obrigatório';
    if (!city.trim()) newErrors.city = 'Cidade obrigatória';
    if (!zip.trim() || zip.length < 8) newErrors.zip = 'CEP inválido';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* FINALIZAR COMPRA */
  const handleFinish = () => {
    if (!validate()) return;

    setLoading(true);

    setTimeout(() => {
      clearCart();
      setLoading(false);

      // 👉 VAI PARA A TELA DE SUCESSO
      navigation.navigate('CheckoutSuccess');
    }, 1500);
  };

  const Input = ({ label, value, onChange, error, placeholder }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <TextInput
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        value={value}
        onChangeText={onChange}
        style={[
          styles.input,
          {
            borderColor: error ? '#D32F2F' : theme.border,
            color: theme.text,
            backgroundColor: theme.surface,
          },
        ]}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>
        Finalizar Compra
      </Text>

      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Preencha os dados para concluir seu pedido
      </Text>

      <Input
        label="Nome Completo"
        placeholder="Ex: João da Silva"
        value={name}
        onChange={setName}
        error={errors.name}
      />

      <Input
        label="CPF"
        placeholder="Somente números"
        value={cpf}
        onChange={setCpf}
        error={errors.cpf}
      />

      <Input
        label="Endereço"
        placeholder="Rua, número e bairro"
        value={address}
        onChange={setAddress}
        error={errors.address}
      />

      <Input
        label="Cidade"
        placeholder="Ex: São Paulo"
        value={city}
        onChange={setCity}
        error={errors.city}
      />

      <Input
        label="CEP"
        placeholder="Ex: 00000000"
        value={zip}
        onChange={setZip}
        error={errors.zip}
      />

      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: loading
              ? theme.border
              : theme.primary,
          },
        ]}
        onPress={handleFinish}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processando pedido...' : 'Confirmar Compra'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 15,
    marginBottom: 25,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
  },

  errorText: {
    color: '#D32F2F',
    fontSize: 13,
    marginTop: 4,
  },

  button: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },

  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
