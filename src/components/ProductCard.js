import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';

import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { CartProvider, useCart } from '../contexts/CartContext';
import { FavoritesProvider } from '../contexts/FavoritesContext';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';

import Header from '../components/Header';

import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import CheckoutSuccessScreen from '../screens/CheckoutSuccessScreen';
import LoginScreen from '../screens/LoginScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import ProductListScreen from '../screens/ProductListScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/* ÍCONE DO CARRINHO COM BADGE */
function CartIcon({ color, size }) {
  const { cart } = useCart();

  return (
    <View>
      <Ionicons name="cart" size={size} color={color} />
      {cart.length > 0 && (
        <View
          style={{
            position: 'absolute',
            right: -6,
            top: -3,
            backgroundColor: 'red',
            borderRadius: 10,
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: 'white',
              fontSize: 10,
              fontWeight: 'bold',
            }}
          >
            {cart.length}
          </Text>
        </View>
      )}
    </View>
  );
}

/* TABS PRINCIPAIS */
function MainTabs() {
  const { theme } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 5,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarShowLabel: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Masculino')
            iconName = focused ? 'man' : 'man-outline';
          else if (route.name === 'Feminino')
            iconName = focused ? 'woman' : 'woman-outline';
          else if (route.name === 'Carrinho')
            return <CartIcon color={color} size={size} />;
          else if (route.name === 'Perfil')
            iconName = focused ? 'person' : 'person-outline';

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

      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

/* STACK PRINCIPAL */
function RootNavigator() {
  const { signed } = useAuth();
  const { theme } = useTheme();

  const MyNavigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: theme.background,
    },
  };

  return (
    <NavigationContainer theme={MyNavigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!signed ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            {/* TABS */}
            <Stack.Screen name="Home" component={MainTabs} />

            {/* DETALHES DO PRODUTO */}
            <Stack.Screen name="Details" component={ProductDetailsScreen} />

            {/* CHECKOUT */}
            <Stack.Screen name="Checkout" component={CheckoutScreen} />

            {/* SUCESSO DA COMPRA */}
            <Stack.Screen
              name="CheckoutSuccess"
              component={CheckoutSuccessScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/* APP (ROOT) */
export default function AppNavigator() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <CartProvider>
          <FavoritesProvider>
            <RootNavigator />
          </FavoritesProvider>
        </CartProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
