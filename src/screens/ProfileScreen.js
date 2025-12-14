import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();

  const Row = ({ icon, label, onPress, right }) => (
    <TouchableOpacity
      style={[styles.row, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowLeft}>
        <Ionicons name={icon} size={22} color={theme.text} />
        <Text style={[styles.rowText, { color: theme.text }]}>{label}</Text>
      </View>

      {right || (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={theme.textSecondary}
        />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      {/* PERFIL */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
        <Ionicons
          name="person-circle"
          size={96}
          color={theme.textSecondary}
        />

        <Text style={[styles.name, { color: theme.text }]}>
          {user?.name || 'Usuário'}
        </Text>

        <Text style={[styles.email, { color: theme.textSecondary }]}>
          {user?.email || 'email@exemplo.com'}
        </Text>
      </View>

      {/* CONTA */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Conta
        </Text>

        <Row
          icon="bag-outline"
          label="Meus pedidos"
          onPress={() => alert('Pedidos em breve')}
        />

        <Row
          icon="location-outline"
          label="Endereços"
          onPress={() => alert('Endereços em breve')}
        />

        <Row
          icon="card-outline"
          label="Pagamentos"
          onPress={() => alert('Pagamentos em breve')}
        />
      </View>

      {/* PREFERÊNCIAS */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Preferências
        </Text>

        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={22}
              color={theme.text}
            />
            <Text style={[styles.rowText, { color: theme.text }]}>
              Modo escuro
            </Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#767577', true: '#4A90E2' }}
            thumbColor={isDark ? '#fff' : '#f4f3f4'}
          />
        </View>

        <Row
          icon="notifications-outline"
          label="Notificações"
          onPress={() => alert('Configurações em breve')}
        />
      </View>

      {/* SUPORTE */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          Suporte
        </Text>

        <Row
          icon="help-circle-outline"
          label="Central de ajuda"
          onPress={() => alert('Ajuda em breve')}
        />

        <Row
          icon="document-text-outline"
          label="Termos e privacidade"
          onPress={() => alert('Termos em breve')}
        />
      </View>

      {/* SAIR */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={signOut}
        activeOpacity={0.8}
      >
        <Ionicons name="log-out-outline" size={20} color="#fff" />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  profileCard: {
    borderRadius: 18,
    paddingVertical: 30,
    alignItems: 'center',
    marginBottom: 20,
  },

  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
  },

  email: {
    fontSize: 14,
    marginTop: 4,
  },

  section: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: 15,
    paddingBottom: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  rowText: {
    fontSize: 16,
  },

  logoutButton: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
