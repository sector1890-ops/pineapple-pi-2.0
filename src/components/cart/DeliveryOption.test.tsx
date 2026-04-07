/*
 * Отчёт:
 * - Добавлено 4 теста
 * - Покрыто:
 *   - Рендер опции доставки (1)
 *   - Включение доставки (1)
 *   - Выключение доставки (1)
 *   - Визуальное выделение при enabled (1)
 * - Использованы моки:
 *   - @chakra-ui/react
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { DeliveryOption } from "@/components/cart/DeliveryOption";

// Мок Chakra UI компонентов
jest.mock("@chakra-ui/react", () => ({
  Box: ({ children, bg, borderColor, onClick, ...props }: React.HTMLAttributes<HTMLDivElement> & { bg?: string; borderColor?: string }) => (
    <div {...props} data-bg={bg} data-border-color={borderColor} onClick={onClick}>
      {children}
    </div>
  ),
  Flex: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  HStack: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  Text: ({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) => <span {...props}>{children}</span>,
  Icon: (props: React.SVGAttributes<SVGSVGElement>) => <svg {...props} />,
}));

describe("DeliveryOption", () => {
  it("должен отображать опцию доставки с ценой", () => {
    const mockToggle = jest.fn();

    render(<DeliveryOption enabled={false} onToggle={mockToggle} price={5} />);

    expect(screen.getByText("Добавить доставку")).toBeInTheDocument();
    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it("должен вызывать onToggle при клике для включения доставки", () => {
    const mockToggle = jest.fn();

    render(<DeliveryOption enabled={false} onToggle={mockToggle} price={5} />);

    const box = screen.getByTestId("delivery-option-box");
    fireEvent.click(box);

    expect(mockToggle).toHaveBeenCalledWith(true);
  });

  it("должен вызывать onToggle при клике для выключения доставки", () => {
    const mockToggle = jest.fn();

    render(<DeliveryOption enabled={true} onToggle={mockToggle} price={5} />);

    const box = screen.getByTestId("delivery-option-box");
    fireEvent.click(box);

    expect(mockToggle).toHaveBeenCalledWith(false);
  });

  it("должен применять визуальное выделение когда доставка включена", () => {
    const mockToggle = jest.fn();

    render(
      <DeliveryOption enabled={true} onToggle={mockToggle} price={5} />
    );

    const box = screen.getByTestId("delivery-option-box");
    expect(box).toHaveAttribute("data-bg", "teal.50");
    expect(box).toHaveAttribute("data-border-color", "teal.500");
  });
});
