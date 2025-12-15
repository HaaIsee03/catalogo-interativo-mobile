import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const FavoritesContext = createContext();

/* ===============================
   HOOK
================================ */
export function useFavorites() {
  return useContext(FavoritesContext);
}

/* ===============================
   PROVIDER
================================ */
export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===============================
     LOAD FAVORITES
  ================================ */
  useEffect(() => {
    async function loadFavorites() {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Erro ao carregar favoritos:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  /* ===============================
     SAVE FAVORITES
  ================================ */
  useEffect(() => {
    if (loading) return;

    async function saveFavorites() {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (err) {
        console.error('Erro ao salvar favoritos:', err);
      }
    }

    saveFavorites();
  }, [favorites, loading]);

  /* ===============================
     ACTIONS
  ================================ */
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
