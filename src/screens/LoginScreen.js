import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext'; // <--- IMPORTAR TEMA

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { theme } = useTheme(); // <--- USAR TEMA
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const handleLogin = () => {
    if (email.length > 0 && password.length > 0) {
      onLogin();
    } else {
      Alert.alert('Atenção', 'Preencha seus dados para continuar.');
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={[
          styles.container, 
          { backgroundColor: theme.surface }, // Fundo do cartão muda
          isDesktop && { width: 400, maxHeight: 600, borderRadius: 20, elevation: 10 } 
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="bag-handle" size={64} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>UniShop</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sua loja favorita em qualquer lugar</Text>
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.icon} />
          <TextInput
            placeholder="E-mail"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={[styles.inputContainer, { backgroundColor: theme.background }]}>
          <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.icon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor={theme.textSecondary}
            style={[styles.input, { color: theme.text }]}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
          <Text style={styles.buttonText}>ACESSAR</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, width: '100%', justifyContent: 'center', padding: 24 },
  logoContainer: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', marginTop: 10 },
  subtitle: { fontSize: 16, marginTop: 5 },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, height: 50
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16, outlineStyle: 'none' },
  button: {
    height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});