import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native'; // <--- IMPORTAR DefaultTheme
import { createStackNavigator } from '@react-navigation/stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { CartProvider, useCart } from '../contexts/CartContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

// Importação das Telas
import Header from '../components/Header';
import CartScreen from '../screens/CartScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Ícone do Carrinho com Badge
function CartIcon({ color, size }) {
  const { cart } = useCart();
  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {cart.length > 0 && (
        <View style={{ position: 'absolute', right: -6, top: -3, backgroundColor: 'red', borderRadius: 10, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>{cart.length}</Text>
        </View>
      )}
    </View>
  );
}

// Abas Principais (Home)
function MainTabs({ handleLogout }) {
  const { theme } = useTheme(); 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 5
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Masculino') iconName = focused ? 'man' : 'man-outline';
          else if (route.name === 'Feminino') iconName = focused ? 'woman' : 'woman-outline';
          else if (route.name === 'Carrinho') return <CartIcon color={color} size={size} />;
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Masculino">
        {(props) => <ProductListScreen {...props} gender="male" />}
      </Tab.Screen>
      <Tab.Screen name="Feminino">
        {(props) => <ProductListScreen {...props} gender="female" />}
      </Tab.Screen>
      <Tab.Screen name="Carrinho" component={CartScreen} />
      <Tab.Screen name="Perfil">
        {(props) => <ProfileScreen {...props} handleLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Navegador Raiz (Lógica de Login)
function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { theme } = useTheme();

  // MUDANÇA AQUI: Criamos um tema completo baseando-se no DefaultTheme
  const MyNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background, // Só alteramos o background
    },
  };

  return (
    <NavigationContainer theme={MyNavigationTheme}>
      <Stack.Navigator>
        {!isLoggedIn ? (
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => <LoginScreen {...props} onLogin={() => setIsLoggedIn(true)} />}
          </Stack.Screen>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ headerShown: false }}>
              {(props) => <MainTabs {...props} handleLogout={() => setIsLoggedIn(false)} />}
            </Stack.Screen>
            <Stack.Screen 
              name="Details" 
              component={ProductDetailsScreen} 
              options={{ 
                title: 'Detalhes',
                headerStyle: { backgroundColor: theme.surface },
                headerTintColor: theme.text,
                headerTitleStyle: { color: theme.text }
              }} 
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Exportação Principal
export default function AppNavigator() {
  return (
    <ThemeProvider>
      <CartProvider>
        <RootNavigator />
      </CartProvider>
    </ThemeProvider>
  );
}