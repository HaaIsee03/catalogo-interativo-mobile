import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

// MUDANÇA: Exportação Nomeada (export function)
export function WebFooter() {
    const { theme } = useTheme();

    const linkStyle = {
        color: theme.textSecondary,
        fontSize: 12,
        marginRight: 15,
        textDecorationLine: 'none',
        cursor: 'pointer', // Adiciona cursor de link
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.surface, borderTopColor: theme.border, borderTopWidth: 1, marginTop: 20 }]}>
            <View style={styles.linksRow}>
                <Text style={linkStyle}>Trabalhe conosco</Text>
                <Text style={linkStyle}>Termos e condições</Text>
                <Text style={linkStyle}>Promoções</Text>
                <Text style={linkStyle}>Como cuidamos da sua privacidade</Text>
                <View style={styles.accessibilityIcon}>
                    <Ionicons name="search" size={12} color={theme.textSecondary} style={{marginRight: 5}}/>
                    <Text style={linkStyle}>Acessibilidade</Text>
                </View>
                <Text style={linkStyle}>Contato</Text>
                <Text style={linkStyle}>Informações sobre seguros</Text>
                <Text style={linkStyle}>Programa de Afiliados</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={[styles.copyText, { color: theme.textSecondary }]}>
                    Copyright © 1999-2025 UniShop Ltda.
                </Text>
                <Text style={[styles.copyText, { color: theme.textSecondary, marginTop: 5 }]}>
                    CNPJ n° 10.007.331/0001-41 | Av. das Nações Unidas, n° 3.003, Osasco/SP - CEP 06233-903
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 30,
        paddingHorizontal: 50,
        alignItems: 'center',
        width: '100%',
    },
    linksRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginBottom: 20,
    },
    accessibilityIcon: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoRow: {
        alignItems: 'center',
        textAlign: 'center',
    },
    copyText: {
        fontSize: 10,
    },
});