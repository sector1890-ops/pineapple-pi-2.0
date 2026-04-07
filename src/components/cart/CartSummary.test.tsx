/*
 * Отчёт:
 * - Добавлено 5 тестов
 * - Покрыто:
 *   - Рендер сводки заказа (1)
 *   - Отображение доставки (1)
 *   - Оформление заказа (1)
 *   - Состояние загрузки (2)
 * - Использованы моки:
 *   - @chakra-ui/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { CartSummary } from "@/components/cart/CartSummary";

import type { ComponentProps } from "react";

// Мок Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
  Button: ({ children, loading, disabled, ...props }: ComponentProps<"button"> & { loading?: boolean }) => (
    <button {...props} disabled={disabled || loading} data-loading={loading ? "true" : undefined}>
      {children}
    </button>
  ),
  Heading: ({ children, ...props }: ComponentProps<"h3">) => <h3 {...props}>{children}</h3>,
  Text: ({ children, ...props }: ComponentProps<"p">) => <p {...props}>{children}</p>,
  VStack: ({ children, ...props }: ComponentProps<"div">) => <div {...props}>{children}</div>,
}));

describe("CartSummary", () => {
  const mockProps = {
    subtotal: 130,
    deliveryCost: 5,
    total: 135,
    onCheckout: jest.fn(),
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("должен отображать сводку заказа с доставкой", () => {
    render(<CartSummary {...mockProps} />);

    expect(screen.getByText("Сводка заказа")).toBeInTheDocument();
    expect(screen.getByText("Товары")).toBeInTheDocument();
    expect(screen.getByText("$130.00")).toBeInTheDocument();
    expect(screen.getByText("Доставка")).toBeInTheDocument();
    expect(screen.getByText("$5.00")).toBeInTheDocument();
    expect(screen.getByText("Итого")).toBeInTheDocument();
    expect(screen.getByText("$135.00")).toBeInTheDocument();
  });

  it("должен отображать 'Не требуется' когда доставка отключена", () => {
    const propsWithoutDelivery = {
      ...mockProps,
      deliveryCost: 0,
      total: 130,
    };

    render(<CartSummary {...propsWithoutDelivery} />);

    expect(screen.getByText("Не требуется")).toBeInTheDocument();
  });

  it("должен вызывать onCheckout при клике на кнопку оформления", () => {
    render(<CartSummary {...mockProps} />);

    const checkoutButton = screen.getByRole("button", { name: /оформить заказ/i });
    fireEvent.click(checkoutButton);

    expect(mockProps.onCheckout).toHaveBeenCalled();
  });

  it("должен отключать кнопку при isLoading", () => {
    render(<CartSummary {...mockProps} isLoading={true} />);

    const checkoutButton = screen.getByRole("button", { name: /оформить заказ/i });
    expect(checkoutButton).toBeDisabled();
  });

  it("должен показывать атрибут data-loading при загрузке", () => {
    render(<CartSummary {...mockProps} isLoading={true} />);

    const checkoutButton = screen.getByRole("button", { name: /оформить заказ/i });
    expect(checkoutButton).toHaveAttribute("data-loading", "true");
  });
});
