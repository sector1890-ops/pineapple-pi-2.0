/*
 * Отчёт:
 * - Добавлено 4 тестов
 * - Покрыто:
 *   - Happy path (2): рендер страницы с товарами, передача данных в FavoritesPageClient
 *   - Граничные случаи (1): пустой массив товаров
 *   - Интеграция (1): вызов getAllProducts
 * - Использованы моки:
 *   - @/lib/products
 *   - ./FavoritesPageClient
 */

import { render, screen } from "@testing-library/react";
import * as productsLib from "@/lib/products";
import FavoritesPage from "./page";
import type { Product } from "@/types/product";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/app/theme";

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
};

// Мок для getAllProducts
jest.mock("@/lib/products", () => ({
  getAllProducts: jest.fn(),
}));

// Мок для FavoritesPageClient
jest.mock("./FavoritesPageClient", () => ({
  FavoritesPageClient: jest.fn(({ allProducts }) => (
    <div data-testid="favorites-client">
      <div data-testid="products-count">{allProducts.length}</div>
    </div>
  )),
}));

describe("FavoritesPage (Server Component)", () => {
  const mockProduct: Product = {
    id: "product-1",
    title: "Тестовый товар",
    specifications: ["Spec 1"],
    price: 40,
    priceFormatted: "$40",
    imagePath: "/products/images/test.jpg",
    shortDescription: "Краткое описание",
    slug: "product-1",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Рендер страницы", () => {
    it("должен рендерить заголовок и описание страницы", () => {
      (productsLib.getAllProducts as jest.Mock).mockReturnValue([mockProduct]);

      renderWithProviders(<FavoritesPage />);

      expect(screen.getByText("Избранное")).toBeInTheDocument();
      expect(
        screen.getByText("Здесь будут ваши избранные товары")
      ).toBeInTheDocument();
    });

    it("должен передавать все товары в FavoritesPageClient", () => {
      const mockProducts = [mockProduct];
      (productsLib.getAllProducts as jest.Mock).mockReturnValue(mockProducts);

      renderWithProviders(<FavoritesPage />);

      expect(screen.getByTestId("favorites-client")).toBeInTheDocument();
      expect(screen.getByTestId("products-count")).toHaveTextContent("1");
    });
  });

  describe("Граничные случаи", () => {
    it("должен работать с пустым массивом товаров", () => {
      (productsLib.getAllProducts as jest.Mock).mockReturnValue([]);

      renderWithProviders(<FavoritesPage />);

      expect(screen.getByTestId("products-count")).toHaveTextContent("0");
    });
  });

  describe("Интеграция", () => {
    it("должен вызывать getAllProducts при рендере", () => {
      (productsLib.getAllProducts as jest.Mock).mockReturnValue([]);

      renderWithProviders(<FavoritesPage />);

      expect(productsLib.getAllProducts).toHaveBeenCalledTimes(1);
    });
  });
});
