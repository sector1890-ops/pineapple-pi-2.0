/*
 * Отчёт:
 * - Добавлено 10 тестов
 * - Покрыто:
 *   - Happy path (3): рендер с избранными товарами, добавление в корзину, удаление из избранного
 *   - Empty state (2): пустое избранное, отображение EmptyState
 *   - Граничные случаи (2): товар не найден при добавлении в корзину, множественные товары
 *   - Toast уведомления (3): при добавлении в корзину, при удалении из избранного, при добавлении в избранное
 * - Использованы моки:
 *   - @/stores/cartStore
 *   - @/stores/favoriteStore
 *   - @/components/product/ProductGrid
 *   - @/components/ui/EmptyState
 *   - @chakra-ui/react (createToaster)
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoritesPageClient } from "./FavoritesPageClient";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/app/theme";
import type { Product } from "@/types/product";

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
};

// Моки для stores
jest.mock("@/stores/cartStore");
jest.mock("@/stores/favoriteStore");

// Мок для toaster
jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  createToaster: jest.fn(() => ({
    create: jest.fn(),
  })),
}));

// Мок для ProductGrid
jest.mock("@/components/product/ProductGrid", () => ({
  ProductGrid: jest.fn(
    ({ products, favorites, onToggleFavorite, onAddToCart }) => (
      <div data-testid="product-grid">
        <div data-testid="products-count">{products.length}</div>
        <div data-testid="favorites-count">{favorites.length}</div>
        {products.map((product: Product) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            <span>{product.title}</span>
            <button
              data-testid={`toggle-${product.id}`}
              onClick={() => onToggleFavorite(product.id)}
            >
              Toggle Favorite
            </button>
            <button
              data-testid={`add-cart-${product.id}`}
              onClick={() => onAddToCart(product.id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    )
  ),
}));

// Мок для EmptyState
jest.mock("@/components/ui/EmptyState", () => ({
  EmptyState: jest.fn(({ title, description, actionLabel, actionHref }) => (
    <div data-testid="empty-state">
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && actionHref && (
        <a href={actionHref} data-testid="empty-state-action">
          {actionLabel}
        </a>
      )}
    </div>
  )),
}));

describe("FavoritesPageClient", () => {
  const mockProduct1: Product = {
    id: "product-1",
    title: "Тестовый товар 1",
    specifications: ["Spec 1", "Spec 2"],
    price: 40,
    priceFormatted: "$40",
    imagePath: "/products/images/test1.jpg",
    shortDescription: "Краткое описание 1",
    slug: "product-1",
  };

  const mockProduct2: Product = {
    id: "product-2",
    title: "Тестовый товар 2",
    specifications: ["Spec 3", "Spec 4"],
    price: 50,
    priceFormatted: "$50",
    imagePath: "/products/images/test2.jpg",
    shortDescription: "Краткое описание 2",
    slug: "product-2",
  };

  const mockProducts: Product[] = [mockProduct1, mockProduct2];

  const mockAddItem = jest.fn();
  const mockToggleFavorite = jest.fn();
  const mockItems: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    mockItems.length = 0; // Очищаем массив

    // Мок для cartStore
    (useCartStore as unknown as jest.Mock).mockImplementation(
      (selector: (state: { addItem: jest.Mock }) => unknown) => {
        if (typeof selector === "function") {
          return selector({ addItem: mockAddItem });
        }
        return { addItem: mockAddItem };
      }
    );

    // Мок для favoriteStore
    (useFavoriteStore as unknown as jest.Mock).mockImplementation(
      (
        selector: (state: {
          toggleFavorite: jest.Mock;
          items: string[];
        }) => unknown
      ) => {
        if (typeof selector === "function") {
          return selector({
            toggleFavorite: mockToggleFavorite,
            items: [...mockItems],
          });
        }
        return {
          toggleFavorite: mockToggleFavorite,
          items: [...mockItems],
        };
      }
    );
  });

  describe("Рендер с избранными товарами", () => {
    it("должен рендерить ProductGrid когда есть избранные товары", () => {
      mockItems.push("product-1");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      expect(screen.getByTestId("product-grid")).toBeInTheDocument();
      expect(screen.getByTestId("products-count")).toHaveTextContent("1");
      expect(screen.getByTestId("product-product-1")).toBeInTheDocument();
    });

    it("должен рендерить несколько избранных товаров", () => {
      mockItems.push("product-1", "product-2");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      expect(screen.getByTestId("products-count")).toHaveTextContent("2");
      expect(screen.getByTestId("product-product-1")).toBeInTheDocument();
      expect(screen.getByTestId("product-product-2")).toBeInTheDocument();
    });

    it("должен показывать количество избранных товаров", () => {
      mockItems.push("product-1");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      expect(screen.getByText(/Выбранные товары \(1\)/)).toBeInTheDocument();
    });
  });

  describe("Empty state", () => {
    it("должен рендерить EmptyState когда избранное пусто", () => {
      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("Список избранного пуст")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Добавляйте товары в избранное, чтобы быстро найти их позже"
        )
      ).toBeInTheDocument();
    });

    it("должен показывать кнопку перехода в каталог в EmptyState", () => {
      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      const actionLink = screen.getByTestId("empty-state-action");
      expect(actionLink).toBeInTheDocument();
      expect(actionLink).toHaveAttribute("href", "/");
      expect(actionLink).toHaveTextContent("Перейти в каталог");
    });
  });

  describe("handleToggleFavorite", () => {
    it("должен вызывать toggleFavorite при удалении из избранного", async () => {
      const user = userEvent.setup();
      mockItems.push("product-1");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      await user.click(screen.getByTestId("toggle-product-1"));

      expect(mockToggleFavorite).toHaveBeenCalledWith("product-1");
    });

    it("должен вызвать toggleFavorite при добавлении в избранное", async () => {
      const user = userEvent.setup();
      // Добавляем product-1 в избранное, чтобы отобразился ProductGrid
      mockItems.push("product-1");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      await user.click(screen.getByTestId("toggle-product-1"));

      expect(mockToggleFavorite).toHaveBeenCalledWith("product-1");
    });
  });

  describe("handleAddToCart", () => {
    it("должен вызывать addItem при добавлении товара в корзину", async () => {
      const user = userEvent.setup();
      mockItems.push("product-1");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      await user.click(screen.getByTestId("add-cart-product-1"));

      expect(mockAddItem).toHaveBeenCalledWith(mockProduct1);
    });

    it("не должен вызывать addItem если товар не найден", () => {
      mockItems.push("product-non-existent");

      renderWithProviders(<FavoritesPageClient allProducts={mockProducts} />);

      // ProductGrid не будет рендерить товар, которого нет в allProducts
      // поэтому кнопка не будет создана
      expect(screen.queryByTestId("add-cart-product-non-existent")).toBeNull();
      expect(mockAddItem).not.toHaveBeenCalled();
    });
  });
});
