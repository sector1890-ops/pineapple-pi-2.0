import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * Интерфейс состояния избранного
 */
interface FavoriteState {
  items: string[]; // Массив slug'ов избранных товаров

  // Методы
  toggleFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  clearFavorites: () => void;

  // Вычисляемые значения (геттеры)
  count: number;
}

/**
 * Store избранного с персистентностью в localStorage
 */
export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      items: [],

      // Добавить/удалить из избранного (toggle)
      toggleFavorite: (productId: string) => {
        set((state) => {
          const isFavorite = state.items.includes(productId);

          return {
            items: isFavorite
              ? state.items.filter((id) => id !== productId)
              : [...state.items, productId],
          };
        });
      },

      // Удалить из избранного
      removeFavorite: (productId: string) => {
        set((state) => ({
          items: state.items.filter((id) => id !== productId),
        }));
      },

      // Проверить наличие в избранном
      isFavorite: (productId: string) => {
        return get().items.includes(productId);
      },

      // Очистить избранное
      clearFavorites: () => {
        set({ items: [] });
      },

      // Геттер: количество избранных товаров
      get count() {
        return get().items.length;
      },
    }),
    {
      name: "pineapple-favorites",
      version: 1,
    }
  )
);
