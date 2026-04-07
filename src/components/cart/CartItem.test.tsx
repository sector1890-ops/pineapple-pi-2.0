/*
 * Отчёт:
 * - Добавлено 6 тестов
 * - Покрыто:
 *   - Рендер товара в корзине (1)
 *   - Увеличение количества (1)
 *   - Уменьшение количества (1)
 *   - Удаление из корзины (1)
 *   - Граничные случаи: quantity=1, quantity=99 (2)
 * - Использованы моки:
 *   - @chakra-ui/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { CartItem } from "@/components/cart/CartItem";
import type { CartItem as CartItemType, Product } from "@/types/product";

import type { ComponentProps } from "react";

// Мок Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  Flex: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: ComponentProps<"span">) => <span {...props}>{children}</span>,
  IconButton: ({ children, ...props }: ComponentProps<"button">) => (
    <button {...props}>{children}</button>
  ),
  HStack: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
}));

const mockProduct: Product = {
  id: "test-product",
  title: "Test Product",
  specifications: ["Spec 1", "Spec 2"],
  price: 50,
  priceFormatted: "$50",
  imagePath: "/products/images/test.jpg",
  shortDescription: "Short description",
  slug: "test-product",
};

const mockCartItem: CartItemType = {
  product: mockProduct,
  quantity: 2,
};

describe("CartItem", () => {
  it("должен отображать товар в корзине", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("должен вызывать onUpdateQuantity при увеличении количества", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    const incrementButton = screen.getByLabelText("Увеличить количество");
    fireEvent.click(incrementButton);

    expect(mockUpdateQuantity).toHaveBeenCalledWith("test-product", 3);
  });

  it("должен вызывать onUpdateQuantity при уменьшении количества", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    const decrementButton = screen.getByLabelText("Уменьшить количество");
    fireEvent.click(decrementButton);

    expect(mockUpdateQuantity).toHaveBeenCalledWith("test-product", 1);
  });

  it("должен вызывать onRemove при клике на кнопку удаления", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    render(
      <CartItem
        item={mockCartItem}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    const removeButton = screen.getByLabelText("Удалить из корзины");
    fireEvent.click(removeButton);

    expect(mockRemove).toHaveBeenCalledWith("test-product");
  });

  it("должен отключать кнопку уменьшения при quantity = 1", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    const itemWithQuantity1: CartItemType = {
      ...mockCartItem,
      quantity: 1,
    };

    render(
      <CartItem
        item={itemWithQuantity1}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    const decrementButton = screen.getByLabelText("Уменьшить количество");
    expect(decrementButton).toBeDisabled();
  });

  it("должен отключать кнопку увеличения при quantity = 99", () => {
    const mockUpdateQuantity = jest.fn();
    const mockRemove = jest.fn();

    const itemWithQuantity99: CartItemType = {
      ...mockCartItem,
      quantity: 99,
    };

    render(
      <CartItem
        item={itemWithQuantity99}
        onUpdateQuantity={mockUpdateQuantity}
        onRemove={mockRemove}
      />
    );

    const incrementButton = screen.getByLabelText("Увеличить количество");
    expect(incrementButton).toBeDisabled();
  });
});
