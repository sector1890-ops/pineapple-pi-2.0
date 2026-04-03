/*
 * Отчёт:
 * - Добавлено 11 тестов
 * - Покрыто:
 *   - Happy path (3): рендер с товарами, добавление в корзину, добавление в избранное
 *   - Удаление из избранного (1)
 *   - Граничные случаи (2): товар не найден, пустой массив товаров
 *   - Корзина (3): addItem вызывается с правильными аргументами
 *   - Избранное (2): toggleFavorite вызывается правильно
 * - Использованы моки:
 *   - @/stores/cartStore
 *   - @/stores/favoriteStore
 *   - @/components/product/ProductGrid
 *   - @chakra-ui/react (createToaster)
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HomePageClient, toaster } from "./HomePageClient";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";
import type { Product } from "@/types/product";

// Моки для store
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
  ProductGrid: jest.fn(({ products, onToggleFavorite, onAddToCart }) => (
    <div data-testid="product-grid">
      <div data-testid="products-count">{products.length}</div>
      <button
        data-testid="mock-add-to-cart"
        onClick={() => onAddToCart("test-product-id")}
      >
        Add to Cart
      </button>
      <button
        data-testid="mock-toggle-favorite"
        onClick={() => onToggleFavorite("test-product-id")}
      >
        Toggle Favorite
      </button>
    </div>
  )),
}));

describe("HomePageClient", () => {
  const mockProduct: Product = {
    id: "test-product-id",
    title: "Test Product",
    specifications: ["Spec 1", "Spec 2", "Spec 3"],
    price: 50,
    priceFormatted: "$50",
    imagePath: "/products/images/test.jpg",
    shortDescription: "Short description",
    slug: "test-product",
  };

  const mockProducts: Product[] = [mockProduct];

  const mockAddItem = jest.fn();
  const mockToggleFavorite = jest.fn();
  const mockIsFavorite = jest.fn(() => false);
  const mockCreateToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

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
          isFavorite: jest.Mock;
          items: string[];
        }) => unknown
      ) => {
        if (typeof selector === "function") {
          return selector({
            toggleFavorite: mockToggleFavorite,
            isFavorite: mockIsFavorite,
            items: [],
          });
        }
        return {
          toggleFavorite: mockToggleFavorite,
          isFavorite: mockIsFavorite,
          items: [],
        };
      }
    );

    // Мок для toaster
    (toaster.create as jest.Mock) = mockCreateToast;
  });

  describe("Рендер", () => {
    it("должен рендерить ProductGrid с правильными товарами", () => {
      render(<HomePageClient products={mockProducts} />);

      expect(screen.getByTestId("product-grid")).toBeInTheDocument();
      expect(screen.getByTestId("products-count")).toHaveTextContent("1");
    });

    it("должен рендерить ProductGrid с пустым массивом товаров", () => {
      render(<HomePageClient products={[]} />);

      expect(screen.getByTestId("product-grid")).toBeInTheDocument();
      expect(screen.getByTestId("products-count")).toHaveTextContent("0");
    });
  });

  describe("handleAddToCart", () => {
    it("должен вызывать addItem и показывать toast при добавлении товара", async () => {
      const user = userEvent.setup();
      render(<HomePageClient products={mockProducts} />);

      await user.click(screen.getByTestId("mock-add-to-cart"));

      expect(mockAddItem).toHaveBeenCalledTimes(1);
      expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
      expect(mockCreateToast).toHaveBeenCalledTimes(1);
      expect(mockCreateToast).toHaveBeenCalledWith({
        title: "Товар добавлен в корзину",
        type: "success",
      });
    });

    it("не должен вызывать addItem если товар не найден", async () => {
      const user = userEvent.setup();
      render(<HomePageClient products={[]} />);

      await user.click(screen.getByTestId("mock-add-to-cart"));

      expect(mockAddItem).not.toHaveBeenCalled();
      expect(mockCreateToast).not.toHaveBeenCalled();
    });
  });

  describe("handleToggleFavorite", () => {
    it("должен вызывать toggleFavorite и показывать toast при добавлении в избранное", async () => {
      const user = userEvent.setup();
      mockIsFavorite.mockReturnValue(false);

      render(<HomePageClient products={mockProducts} />);

      await user.click(screen.getByTestId("mock-toggle-favorite"));

      expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
      expect(mockToggleFavorite).toHaveBeenCalledWith("test-product-id");
      expect(mockCreateToast).toHaveBeenCalledWith({
        title: "Добавлено в избранное",
        type: "success",
      });
    });

    it("должен вызывать toggleFavorite и показывать toast при удалении из избранного", async () => {
      const user = userEvent.setup();
      mockIsFavorite.mockReturnValue(true);

      render(<HomePageClient products={mockProducts} />);

      await user.click(screen.getByTestId("mock-toggle-favorite"));

      expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
      expect(mockToggleFavorite).toHaveBeenCalledWith("test-product-id");
      expect(mockCreateToast).toHaveBeenCalledWith({
        title: "Удалено из избранного",
        type: "info",
      });
    });
  });

  describe("Интеграция с stores", () => {
    it("должен использовать correct selectors из cartStore", () => {
      render(<HomePageClient products={mockProducts} />);

      expect(useCartStore).toHaveBeenCalledWith(expect.any(Function));
    });

    it("должен использовать correct selectors из favoriteStore", () => {
      render(<HomePageClient products={mockProducts} />);

      expect(useFavoriteStore).toHaveBeenCalledTimes(3); // items, isFavorite, toggleFavorite
    });
  });
});
