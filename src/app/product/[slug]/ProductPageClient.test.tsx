import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductPageClient } from "./ProductPageClient";
import type { Product } from "@/types/product";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/app/theme";
import { useCartStore } from "@/stores/cartStore";
import { useFavoriteStore } from "@/stores/favoriteStore";

// Мокируем next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img data-testid="product-image" alt={props.alt} {...props} />
  ),
}));

const mockProduct: Product = {
  id: "test-product",
  title: "Тестовый товар",
  specifications: ["Характеристика 1", "Характеристика 2"],
  price: 50,
  priceFormatted: "$50",
  imagePath: "/products/images/test.jpg",
  shortDescription: "Краткое описание",
  slug: "test-product",
};

const renderWithProviders = (ui: React.ReactNode) => {
  return render(<ChakraProvider value={system}>{ui}</ChakraProvider>);
};

describe("ProductPageClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Сбрасываем stores
    useCartStore.setState({ items: [], delivery: false });
    useFavoriteStore.setState({ items: [] });
  });

  it("рендерит данные товара", () => {
    renderWithProviders(<ProductPageClient product={mockProduct} />);

    expect(screen.getByText("Тестовый товар")).toBeInTheDocument();
    expect(screen.getByText("$50")).toBeInTheDocument();
  });

  it("показывает характеристики", () => {
    renderWithProviders(<ProductPageClient product={mockProduct} />);

    expect(screen.getByText("Характеристика 1")).toBeInTheDocument();
    expect(screen.getByText("Характеристика 2")).toBeInTheDocument();
  });

  it("добавляет товар в корзину при клике на кнопку", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductPageClient product={mockProduct} />);

    const button = screen.getByRole("button", { name: /в корзину/i });
    await user.click(button);

    const store = useCartStore.getState();
    expect(store.items.length).toBe(1);
    expect(store.items[0].product.id).toBe("test-product");
  });

  it("переключает избранное при клике на FavoriteIcon", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductPageClient product={mockProduct} />);

    const favoriteButton = screen.getByRole("button", { name: /избранное/i });
    await user.click(favoriteButton);

    const store = useFavoriteStore.getState();
    expect(store.items).toContain("test-product");
  });
});
