/*
 * Отчёт:
 * - Добавлено 5 тестов
 * - Покрыто:
 *   - Happy path (2): рендер с товарами, отображение заголовка
 *   - Граничные случаи (2): пустой массив товаров, отображение empty state
 *   - Интеграция (1): вызов getAllProducts
 * - Использованы моки:
 *   - @/lib/products (getAllProducts)
 *   - ./HomePageClient
 */

import { render, screen } from "@testing-library/react";
import Home from "./page";
import { getAllProducts } from "@/lib/products";

// Мок для getAllProducts
jest.mock("@/lib/products", () => ({
  getAllProducts: jest.fn(),
}));

// Мок для HomePageClient
jest.mock("./HomePageClient", () => ({
  HomePageClient: jest.fn(({ products }) => (
    <div data-testid="home-page-client">
      <div data-testid="products-length">{products.length}</div>
    </div>
  )),
}));

// Мок для Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  Box: jest.fn(({ children, ...props }) => (
    <div data-testid="box" {...props}>
      {children}
    </div>
  )),
  Container: jest.fn(({ children, ...props }) => (
    <div data-testid="container" {...props}>
      {children}
    </div>
  )),
  Heading: jest.fn(({ children, ...props }) => (
    <h1 data-testid="heading" {...props}>
      {children}
    </h1>
  )),
  Text: jest.fn(({ children, ...props }) => (
    <p data-testid="text" {...props}>
      {children}
    </p>
  )),
}));

describe("Home page (app/page.tsx)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Рендер с товарами", () => {
    it("должен отображать заголовок и описание каталога", () => {
      (getAllProducts as jest.Mock).mockReturnValue([
        {
          id: "test-product",
          title: "Test Product",
          specifications: ["Spec 1"],
          price: 50,
          priceFormatted: "$50",
          imagePath: "/test.jpg",
          shortDescription: "Test",
          slug: "test-product",
        },
      ]);

      render(<Home />);

      expect(screen.getByTestId("heading")).toHaveTextContent(
        "Каталог микрокомпьютеров"
      );
      expect(screen.getByTestId("text")).toHaveTextContent(
        "Компактные решения для встраиваемых систем, IoT и прототипирования"
      );
    });

    it("должен передавать товары в HomePageClient", () => {
      const mockProducts = [
        {
          id: "product-1",
          title: "Product 1",
          specifications: ["Spec 1"],
          price: 40,
          priceFormatted: "$40",
          imagePath: "/product1.jpg",
          shortDescription: "Description 1",
          slug: "product-1",
        },
        {
          id: "product-2",
          title: "Product 2",
          specifications: ["Spec 2"],
          price: 60,
          priceFormatted: "$60",
          imagePath: "/product2.jpg",
          shortDescription: "Description 2",
          slug: "product-2",
        },
      ];

      (getAllProducts as jest.Mock).mockReturnValue(mockProducts);

      render(<Home />);

      expect(screen.getByTestId("home-page-client")).toBeInTheDocument();
      expect(screen.getByTestId("products-length")).toHaveTextContent("2");
    });
  });

  describe("Пустой state (нет товаров)", () => {
    it("должен отображать empty state когда товары отсутствуют", () => {
      (getAllProducts as jest.Mock).mockReturnValue([]);

      render(<Home />);

      // Получаем все heading и ищем нужный по тексту
      const headings = screen.getAllByTestId("heading");
      const emptyHeading = headings.find((h) =>
        h.textContent?.includes("Товары пока не добавлены")
      );
      expect(emptyHeading).toBeInTheDocument();
      
      const texts = screen.getAllByTestId("text");
      const emptyText = texts.find((t) =>
        t.textContent?.includes("Мы работаем над наполнением каталога")
      );
      expect(emptyText).toBeInTheDocument();
      
      expect(screen.queryByTestId("home-page-client")).not.toBeInTheDocument();
    });

    it("должен применять правильные стили к empty state", () => {
      (getAllProducts as jest.Mock).mockReturnValue([]);

      render(<Home />);

      // Получаем все container и ищем нужный по атрибуту
      const containers = screen.getAllByTestId("container");
      const emptyContainer = containers.find((c) => c.getAttribute("py") === "16");
      expect(emptyContainer).toBeInTheDocument();
    });
  });

  describe("Интеграция", () => {
    it("должен вызывать getAllProducts при рендере", () => {
      (getAllProducts as jest.Mock).mockReturnValue([]);

      render(<Home />);

      expect(getAllProducts).toHaveBeenCalledTimes(1);
    });
  });
});
