import { Ionicons } from '@expo/vector-icons';
import { useRef, useState } from 'react'; // 1. Importar useRef
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  
  const { theme } = useTheme();
  const { signIn } = useAuth();

  // 2. Criar a referência para o Input da Senha
  const passwordRef = useRef(null); 
  
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;

  const validate = () => {
    let newErrors = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = 'E-mail inválido. Verifique o formato.';
      isValid = false;
    }

    if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = () => {
    if (validate()) {
      const userPart = email.split('@')[0];
      const fakeName = userPart.charAt(0).toUpperCase() + userPart.slice(1);

      signIn({
        name: fakeName,
        email: email,
      });
    } else {
      Alert.alert('Atenção', 'Corrija os campos em destaque para continuar.');
    }
  };

  return (
    <View style={[styles.background, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={[
          styles.container, 
          { backgroundColor: theme.surface }, 
          isDesktop && { width: 400, maxHeight: 600, borderRadius: 20, elevation: 10 } 
        ]}
      >
        <View style={styles.logoContainer}>
          <Ionicons name="bag-handle" size={64} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>UniShop</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Sua loja favorita em qualquer lugar</Text>
        </View>

        {/* Input Email: Ao enviar, foca na Senha */}
        <View style={styles.fieldWrapper}>
          <View style={[styles.inputContainer, { backgroundColor: theme.background }, errors.email && styles.inputError]}>
            <Ionicons name="mail-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            <TextInput
              placeholder="E-mail"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({...prev, email: null}));
              }}
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next" 
              onSubmitEditing={() => passwordRef.current.focus()} // 3. Foca na Senha
              blurOnSubmit={false}
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
        </View>

        {/* Input Senha: Ao enviar, dispara o Login */}
        <View style={styles.fieldWrapper}>
          <View style={[styles.inputContainer, { backgroundColor: theme.background }, errors.password && styles.inputError]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.textSecondary} style={styles.icon} />
            <TextInput
              ref={passwordRef} // 4. Anexa a Ref
              placeholder="Senha"
              placeholderTextColor={theme.textSecondary}
              style={[styles.input, { color: theme.text }]}
              secureTextEntry
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({...prev, password: null}));
              }}
              returnKeyType="go"
              onSubmitEditing={handleLogin} // 5. Dispara o login
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleLogin}>
          <Text style={styles.buttonText}>ACESSAR</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => navigation.navigate('Register')} 
          style={{ marginTop: 20, alignItems: 'center' }}
        >
          <Text style={{ color: theme.textSecondary }}>
            Não tem uma conta? <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Cadastre-se</Text>
          </Text>
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
  
  fieldWrapper: {
    marginBottom: 15,
  },
  inputContainer: { 
    flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 15, height: 50,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF0F0',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  
  icon: { marginRight: 10 },
  input: { flex: 1, height: '100%', fontSize: 16, outlineStyle: 'none' },
  button: {
    height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});