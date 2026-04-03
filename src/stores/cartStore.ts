import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product } from "@/types/product";

/**
 * Интерфейс состояния корзины
 */
interface CartState {
  items: CartItem[];
  delivery: boolean;

  // Методы
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleDelivery: (enabled: boolean) => void;

  // Вычисляемые значения (геттеры)
  totalItems: number;
  subtotal: number;
  deliveryCost: number;
  total: number;
}

/**
 * Store корзины с персистентностью в localStorage
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Начальное состояние
      items: [],
      delivery: false,

      // Добавить товар в корзину
      addItem: (product: Product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Товар уже есть — увеличиваем количество
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }

          // Новый товар
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },

      // Удалить товар из корзины
      removeItem: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      // Изменить количество товара
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      // Очистить корзину
      clearCart: () => {
        set({ items: [], delivery: false });
      },

      // Переключить доставку
      toggleDelivery: (enabled: boolean) => {
        set({ delivery: enabled });
      },

      // Геттер: общее количество товаров
      get totalItems() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Геттер: сумма товаров без доставки
      get subtotal() {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },

      // Геттер: стоимость доставки
      get deliveryCost() {
        return get().delivery ? 5 : 0;
      },

      // Геттер: итоговая сумма
      get total() {
        return get().subtotal + get().deliveryCost;
      },
    }),
    {
      name: "pineapple-cart",
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        // Миграция с версии 0 на 1: добавляем поле delivery
        if (version === 0 && persistedState && typeof persistedState === "object") {
          const state = persistedState as Record<string, unknown>;
          if (!("delivery" in state)) {
            state.delivery = false;
          }
        }
        return persistedState;
      },
    }
  )
);
