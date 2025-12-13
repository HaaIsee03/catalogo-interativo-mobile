import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function ProfileScreen({ handleLogout }) {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      
      {/* Cabeçalho do Perfil */}
      <View style={[styles.profileCard, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color={theme.textSecondary} />
        </View>
        <Text style={[styles.name, { color: theme.text }]}>Usuário Convidado</Text>
        <Text style={[styles.email, { color: theme.textSecondary }]}>aluno@unifecaf.edu.br</Text>
      </View>

      {/* Configurações */}
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Configurações</Text>
        
        <View style={[styles.row, { borderBottomColor: theme.border }]}>
          <View style={styles.rowLeft}>
            <Ionicons name={isDark ? "moon" : "sunny"} size={24} color={theme.text} />
            <Text style={[styles.rowText, { color: theme.text }]}>Modo Escuro</Text>
          </View>
          <Switch 
            value={isDark} 
            onValueChange={toggleTheme}
            trackColor={{ false: "#767577", true: "#4A90E2" }}
            thumbColor={isDark ? "#fff" : "#f4f3f4"}
          />
        </View>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
             <Ionicons name="notifications-outline" size={24} color={theme.text} />
             <Text style={[styles.rowText, { color: theme.text }]}>Notificações</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Botão Sair */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair do Aplicativo</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  profileCard: {
    padding: 20, borderRadius: 16, alignItems: 'center', marginBottom: 20,
    elevation: 2, shadowColor: '#000', shadowOffset: {width:0, height:2}, shadowOpacity:0.1, shadowRadius:4
  },
  name: { fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  email: { fontSize: 14, marginBottom: 5 },
  section: {
    borderRadius: 16, overflow: 'hidden', marginBottom: 20
  },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', padding: 15, paddingBottom: 5 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 15, borderBottomWidth: 1, borderBottomColor: 'transparent' // Será sobrescrito pelo estilo inline
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  rowText: { fontSize: 16 },
  logoutButton: {
    backgroundColor: '#FF3B30', padding: 15, borderRadius: 12, alignItems: 'center'
  },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});