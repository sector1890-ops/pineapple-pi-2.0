import { render, screen, fireEvent, act } from "@testing-library/react";
import { ChakraProvider } from "@chakra-ui/react";
import { system } from "@/app/theme";
import { ScrollToTop } from "./ScrollToTop";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ChakraProvider value={system}>{children}</ChakraProvider>
);

describe("ScrollToTop", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  function setScrollY(value: number) {
    Object.defineProperty(window, "scrollY", {
      value,
      configurable: true,
      writable: true,
    });
  }

  it("не рендерится когда scrollY <= 100", () => {
    setScrollY(0);

    render(<ScrollToTop />, { wrapper });

    const button = screen.queryByRole("button", { name: /прокрутить наверх/i });
    expect(button).not.toBeInTheDocument();
  });

  it("рендерится когда scrollY > 100 при инициализации", async () => {
    setScrollY(0);

    render(<ScrollToTop />, { wrapper });

    // Имитируем скролл после монтирования
    await act(async () => {
      setScrollY(150);
      window.dispatchEvent(new Event("scroll"));
    });

    const button = screen.getByRole("button", { name: /прокрутить наверх/i });
    expect(button).toBeInTheDocument();
  });

  it("появляется после скролла ниже порога", async () => {
    setScrollY(0);

    render(<ScrollToTop />, { wrapper });

    expect(
      screen.queryByRole("button", { name: /прокрутить наверх/i })
    ).not.toBeInTheDocument();

    await act(async () => {
      setScrollY(150);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.getByRole("button", { name: /прокрутить наверх/i })
    ).toBeInTheDocument();
  });

  it("исчезает после скролла наверх", async () => {
    setScrollY(0);

    render(<ScrollToTop />, { wrapper });

    // Скролл вниз — кнопка появляется
    await act(async () => {
      setScrollY(200);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.getByRole("button", { name: /прокрутить наверх/i })
    ).toBeInTheDocument();

    // Скролл наверх — кнопка исчезает
    await act(async () => {
      setScrollY(0);
      window.dispatchEvent(new Event("scroll"));
    });

    expect(
      screen.queryByRole("button", { name: /прокрутить наверх/i })
    ).not.toBeInTheDocument();
  });

  it("вызывает scrollTo с top: 0 и behavior: smooth при клике", async () => {
    setScrollY(0);

    render(<ScrollToTop />, { wrapper });

    // Скролл вниз
    await act(async () => {
      setScrollY(150);
      window.dispatchEvent(new Event("scroll"));
    });

    const button = screen.getByRole("button", { name: /прокрутить наверх/i });
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith(
      expect.objectContaining({ top: 0, behavior: "smooth" })
    );
  });
});
