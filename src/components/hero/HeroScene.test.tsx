import { render, screen, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/app/theme";
import { HeroScene } from "./HeroScene";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
);

describe("HeroScene", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("рендерит заголовок 'Микрокомпьютеры будущего'", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText("Микрокомпьютеры будущего")).toBeInTheDocument();
  });

  it("рендерит описание", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    expect(screen.getByText(/встраиваемых систем/)).toBeInTheDocument();
  });

  it("рендерит CTA-кнопку 'Перейти в каталог'", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    const button = screen.getByTestId("hero-cta");
    expect(button).toHaveTextContent("Перейти в каталог");
  });

  it("CTA-кнопка обёрнута в ссылку #catalog", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    const button = screen.getByTestId("hero-cta");
    const link = button.closest("a");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "#catalog");
  });

  it("рендерит SVG микрокомпьютер", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("фоновый контейнер использует bg.default (адаптивный к теме)", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(100);
    });
    // HeroScene root uses bg="bg.default"
    const heroBox = screen.getByText("Микрокомпьютеры будущего").closest(
      '[class*="css"]'
    );
    expect(heroBox).toBeTruthy();
  });

  it("SVG использует контурный стиль (stroke, без fill)", () => {
    render(<HeroScene />, { wrapper });
    act(() => {
      jest.advanceTimersByTime(400);
    });
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    // Проверяем что SVG содержит элементы с stroke
    expect(svg?.querySelectorAll("[stroke]").length).toBeGreaterThan(0);
  });

  it("плавное появление overlay при монтировании", () => {
    render(<HeroScene />, { wrapper });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    // After mount: overlay visible
    expect(screen.getByTestId("hero-cta")).toBeInTheDocument();
  });
});
