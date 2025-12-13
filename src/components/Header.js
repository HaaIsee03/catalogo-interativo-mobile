import { Ionicons } from '@expo/vector-icons';
import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export default function Header() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
      <View style={styles.logoRow}>
        <Ionicons name="bag-handle" size={28} color={theme.primary} />
        <Text style={[styles.logoText, { color: theme.text }]}>UniShop</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 50,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  logoText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  }
});