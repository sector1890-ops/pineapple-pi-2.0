# Спецификация компонентов Pineapple Pi 2.0

## 📦 Компоненты Layout

### Header

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/layout/Header.tsx |
| **Ответственность** | Горизонтальная навигация, логотип, иконки корзины/избранного со счётчиками |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| cartCount | number | Да | Количество уникальных товаров в корзине |
| favoritesCount | number | Да | Количество избранных товаров |

**Chakra UI компоненты:**
- Box/Flex для контейнера
- Link (из next/link) для навигации
- Badge для счётчиков
- Icon (CartIcon, HeartIcon) для иконок
- HStack для выравнивания

**Поведение:**
- На мобильных (base, md): гамбургер-меню через Drawer
- На десктопе (lg+): горизонтальная навигация
- Счётчики обновляются реактивно при изменении Zustand stores

---

### Footer

| Параметр | Значение |
|----------|----------|
| **Тип** | Server Component |
| **Расположение** | components/layout/Footer.tsx |
| **Ответственность** | Подвал сайта с навигацией, контактами, копирайтом |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| — | — | — | Нет props (статичный контент) |

**Chakra UI компоненты:**
- SimpleGrid (3 колонки на lg+, 1 на base)
- VStack для вертикальных списков
- Link для ссылок
- Text, Heading для текста
- Divider для разделителей

**Содержимое колонок:**
1. Навигация (Главная, О компании, Контакты, Избранное, Корзина)
2. Контакты (email, телефон, адрес — фейковые)
3. Копирайт (текущий год, название компании)

---

### CookieBanner

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/layout/CookieBanner.tsx |
| **Ответственность** | Показ баннера cookie при первом визите |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| — | — | — | Нет props |

**Chakra UI компоненты:**
- Box (фиксированная позиция внизу экрана)
- Text для сообщения
- Button для принятия
- Flex для расположения элементов

**Состояние:**
- useState: isVisible (boolean)
- useEffect: проверка localStorage при монтировании
- localStorage ключ: `pineapple-cookie-consent`

**Поведение:**
- При монтировании: проверка флага в localStorage
- Если флаг есть — не показывать
- При клике "Принять": сохранение флага, скрытие баннера

---

## 🛍️ Компоненты Product

### ProductCard

| Параметр | Значение |
|----------|----------|
| **Тип** | Server Component (по умолчанию) |
| **Расположение** | components/product/ProductCard.tsx |
| **Ответственность** | Отображение карточки товара в сетке |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| product | Product | Да | Объект товара |
| isFavorite | boolean | Да | Статус избранного |
| onToggleFavorite | (id: string) => void | Да | Обработчик избранного |
| onAddToCart | (id: string) => void | Да | Обработчик корзиины |

**Chakra UI компоненты:**
- Card (контейнер)
- Image (next/image обёртка)
- Heading (название)
- Text (описание, цена)
- IconButton (сердечко, корзина)
- Flex/Stack для расположения

**Поведение:**
- Клик на карточку (кроме иконок): переход на `/product/[id]`
- Клик на сердечко: вызов onToggleFavorite (не переходить)
- Клик на корзину: вызов onAddToCart (не переходить)
- Остановка всплытия событий на иконках (e.stopPropagation)

---

### ProductGrid

| Параметр | Значение |
|----------|----------|
| **Тип** | Server Component |
| **Расположение** | components/product/ProductGrid.tsx |
| **Ответственность** | Адаптивная сетка товаров |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| products | Product[] | Да | Массив всех товаров |
| favorites | string[] | Да | Массив ID избранных |
| onToggleFavorite | (id: string) => void | Да | Обработчик избранного |
| onAddToCart | (id: string) => void | Да | Обработчик корзиины |

**Chakra UI компоненты:**
- SimpleGrid (cols: base=1, md=2, lg=3, xl=4)
- ProductCard (для каждого товара)

**Поведение:**
- Передача props в каждый ProductCard
- Пустой массив — показать EmptyState

---

### FavoriteIcon

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/product/FavoriteIcon.tsx |
| **Ответственность** | Интерактивная иконка сердечка с анимацией |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| isFavorite | boolean | Да | Текущий статус |
| onToggle | () => void | Да | Обработчик клика |
| size | "sm" \| "md" \| "lg" | Нет | Размер (по умолчанию "md") |

**Chakra UI компоненты:**
- IconButton
- Icon (HeartIcon из lucide-react или chakra icons)
- usePrefersReducedMotion (для доступности)

**Состояние:**
- Локальный useState для анимации (isAnimating)
- CSS transition для плавного заполнения

**Поведение:**
- При клике: запуск анимации, вызов onToggle
- Цвет: red.500 (active), gray.400 (inactive)
- Анимация: scale (1 → 1.2 → 1) при клике

---

### ProductDetails

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/product/ProductDetails.tsx |
| **Ответственность** | Полная информация о товаре с интерактивом |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| product | Product | Да | Объект товара |
| isFavorite | boolean | Да | Статус избранного |
| onToggleFavorite | (id: string) => void | Да | Обработчик избранного |
| onAddToCart | (id: string, qty: number) => void | Да | Обработчик корзиины |

**Chakra UI компоненты:**
- SimpleGrid (2 колонки: изображение + информация)
- Image (next/image, большое изображение)
- Heading (название)
- List (спецификации)
- NumberInput (количество)
- Button (В корзину)
- FavoriteIcon (избранное)
- Text (цена)

**Состояние:**
- useState: quantity (number, по умолчанию 1)

**Поведение:**
- NumberInput: min=1, max=99
- Кнопка "В корзину": передача product.id + quantity
- Валидация количества перед добавлением

---

## 🛒 Компоненты Cart

### CartItem

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/cart/CartItem.tsx |
| **Ответственность** | Элемент корзины с управлением количеством |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| item | CartItem | Да | Элемент корзины |
| onUpdateQuantity | (id: string, qty: number) => void | Да | Изменение количества |
| onRemove | (id: string) => void | Да | Удаление из корзины |

**Chakra UI компоненты:**
- Flex (горизонтальное расположение)
- Image (миниатюра товара)
- NumberInput (количество с +/- кнопками)
- IconButton (удалить, иконка мусорки)
- Text (название, цена)
- Divider (разделитель)

**Поведение:**
- NumberInput: min=1, max=99
- При изменении: вызов onUpdateQuantity
- При удалении: вызов onRemove, подтверждение (confirm)
- Адаптивность: на мобильных — вертикальный layout

---

### DeliveryOption

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/cart/DeliveryOption.tsx |
| **Ответственность** | Чекбокс выбора доставки |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| enabled | boolean | Да | Текущий статус |
| onToggle | (enabled: boolean) => void | Да | Обработчик изменения |
| price | number | Да | Стоимость доставки ($5) |

**Chakra UI компоненты:**
- Checkbox
- Text (описание + цена)
- Box/HStack для контейнера

**Поведение:**
- При изменении: вызов onToggle с новым boolean
- Визуальное выделение при enabled (border, bg)
- Текст: "Добавить доставку (+$5)"

---

### CartSummary

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/cart/CartSummary.tsx |
| **Ответственность** | Сводка корзины с разбивкой суммы |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| subtotal | number | Да | Сумма товаров |
| deliveryCost | number | Да | Стоимость доставки |
| total | number | Да | Итоговая сумма |
| onCheckout | () => void | Да | Обработчик оформления |
| isLoading | boolean | Да | Статус загрузки API |

**Chakra UI компоненты:**
- Box (контейнер с тенью)
- VStack для строк
- Text (подписи, суммы)
- Divider (разделители)
- Button (Оформить заказ)
- Heading (заголовок)

**Поведение:**
- Отображение разбивки:
  - Товары: $X
  - Доставка: $Y (или "Не требуется")
  - **Итого: $Z** (жирным)
- Кнопка "Оформить заказ": disabled если isLoading
- При клике: вызов onCheckout

---

## 📝 Компоненты UI

### ContactForm

| Параметр | Значение |
|----------|----------|
| **Тип** | Client Component |
| **Расположение** | components/ui/ContactForm.tsx |
| **Ответственность** | Форма обратной связи с валидацией |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| onSubmit | (data: FormData) => Promise<void> | Да | Обработчик отправки |

**Chakra UI компоненты:**
- Form (контейнер)
- FormControl (для каждого поля)
- FormLabel (подписи)
- Input (Имя, Email)
- Textarea (Сообщение)
- FormErrorMessage (ошибки)
- Button (Отправить)
- useToast (уведомления)

**Состояние:**
- useState: name, email, message (строки)
- useState: errors (объект ошибок валидации)
- useState: isSubmitting (boolean)
- useState: isSubmitted (boolean)

**Валидация:**
- name: не пустой, min 2 символа
- email: формат email (regex)
- message: не пустой, min 10 символов

**Поведение:**
- При отправке: валидация, вызов onSubmit
- При успехе: показ toast, очистка формы
- При ошибке: показ ошибок под полями
- Disabled состояние во время отправки

---

### EmptyState

| Параметр | Значение |
|----------|----------|
| **Тип** | Server Component |
| **Расположение** | components/ui/EmptyState.tsx |
| **Ответственность** | Пустое состояние для страниц |

**Props:**
| Prop | Тип | Обязательный | Описание |
|------|-----|--------------|----------|
| title | string | Да | Заголовок |
| description | string | Да | Описание |
| actionLabel | string | Нет | Текст кнопки действия |
| actionHref | string | Нет | Ссылка для кнопки |
| icon | ReactNode | Нет | Иконка (по умолчанию BoxIcon) |

**Chakra UI компоненты:**
- VStack (центрирование)
- Heading (заголовок)
- Text (описание)
- Button (кнопка действия)
- Icon (декоративная иконка)

**Использование:**
- Пустая корзина (/cart)
- Пустое избранное (/favorites)
- Нет товаров в каталоге

---

## 📄 Страницы

### Главная страница (/)

| Параметр | Значение |
|----------|----------|
| **Файл** | app/page.tsx |
| **Тип** | Server Component |
| **Ответственность** | Отображение каталога товаров |

**Данные:**
- Загрузка всех товаров через getAllProducts()
- Передача в ProductGrid

**Компоненты:**
- Header
- ProductGrid (с товарами)
- Footer
- CookieBanner

---

### Страница избранного (/favorites)

| Параметр | Значение |
|----------|----------|
| **Файл** | app/favorites/page.tsx |
| **Тип** | Client Component |
| **Ответственность** | Отображение избранных товаров |

**Данные:**
- Чтение favoriteStore (items — массив ID)
- Фильтрация всех товаров по ID
- Передача в ProductGrid

**Компоненты:**
- Header
- ProductGrid (с избранными) или EmptyState
- Footer

**Поведение:**
- Если избранное пусто — показать EmptyState с кнопкой "Перейти в каталог"
- Синхронизация с favoriteStore (реактивность)

---

### Страница корзины (/cart)

| Параметр | Значение |
|----------|----------|
| **Файл** | app/cart/page.tsx |
| **Тип** | Client Component |
| **Ответственность** | Управление корзиной, оформление заказа |

**Данные:**
- Чтение cartStore (items, delivery)
- Вычисление subtotal, deliveryCost, total

**Компоненты:**
- Header
- CartItem (для каждого элемента)
- DeliveryOption
- CartSummary
- EmptyState (если пусто)
- Footer

**Поведение:**
- Если корзина пуста — показать EmptyState
- Изменение количества через CartItem
- Переключение доставки через DeliveryOption
- Оформление заказа через CartSummary → POST /api/order

---

### Страница товара (/product/[id])

| Параметр | Значение |
|----------|----------|
| **Файл** | app/product/[id]/page.tsx |
| **Тип** | Server Component (обёртка) + Client Component (ProductDetails) |
| **Ответственность** | SSG страница с полной информацией о товаре |

**Данные:**
- generateStaticParams() — все slug'и
- getProductById(id) — загрузка товара
- Передача в ProductDetails (client component)

**Компоненты:**
- Header
- ProductDetails (client)
- Footer

**SSG:**
- generateStaticParams() возвращает все ID товаров
- fallback: false (404 если товар не найден)

---

### Страница "О компании" (/about)

| Параметр | Значение |
|----------|----------|
| **Файл** | app/about/page.tsx |
| **Тип** | Server Component |
| **Ответственность** | Статический контент о компании |

**Данные:**
- Импорт из data/about-company.ts

**Компоненты:**
- Header
- VStack с секциями (Hero, Mission, Values, History, Statistics, Team, Contact)
- Footer

**Chakra UI компоненты:**
- Container (ограничение ширины)
- Heading, Text
- SimpleGrid (для values, statistics)
- List (для истории)
- Divider

---

### Страница контактов (/contact)

| Параметр | Значение |
|----------|----------|
| **Файл** | app/contact/page.tsx |
| **Тип** | Client Component |
| **Ответственность** | Форма обратной связи |

**Компоненты:**
- Header
- ContactForm
- Footer

**Поведение:**
- При отправке: POST /api/feedback
- Toast уведомление при успехе/ошибке

---

### Not Found страница

| Параметр | Ззначение |
|----------|----------|
| **Файл** | app/not-found.tsx |
| **Тип** | Server Component |
| **Ответственность** | Кастомная 404 страница |

**Компоненты:**
- Header
- EmptyState (с сообщением 404)
- Footer

**Содержимое:**
- Заголовок: "Страница не найдена"
- Описание: "Запрашиваемая страница не существует"
- Кнопка: "Вернуться на главную" (href="/")

---

## 🎨 Настройка темы Chakra UI

### Файл темы

**Расположение:** src/app/theme.ts (или в globals.css через CSS variables)

**Подход в Chakra UI v3:**
- Использование `createSystem` для кастомизации
- Расширение дефолтной темы через tokens

**Ключевые токены:**

| Токен | Значение | Описание |
|-------|----------|----------|
| colors.accent | teal.500 | Основной акцент |
| colors.accentHover | teal.600 | Hover состояние |
| colors.favorite | red.500 | Цвет избранного |
| fonts.heading | Geist Sans | Шрифт заголовков |
| fonts.body | Geist Sans | Шрифт текста |
| radii.button | md | Скругление кнопок |
| shadows.card | 0 2px 8px rgba(0,0,0,0.1) | Тень карточек |

### Глобальные стили

**Файл:** app/globals.css

**Содержимое:**
- Импорт Chakra UI стилей
- CSS переменные для цветов (если нужно)
- Кастомные утилиты (если нужно)

---

## 📋 Сводная таблица компонентов

| Компонент | Тип | Props | Store | Skill |
|-----------|-----|-------|-------|-------|
| Header | Client | cartCount, favoritesCount | cartStore, favoriteStore | chakra-ui-v3 |
| Footer | Server | — | — | chakra-ui-v3 |
| CookieBanner | Client | — | localStorage | zustand |
| ProductCard | Server | product, isFavorite, onToggleFavorite, onAddToCart | — | chakra-ui-v3, nextjs-image |
| ProductGrid | Server | products, favorites, callbacks | — | chakra-ui-v3 |
| FavoriteIcon | Client | isFavorite, onToggle, size | favoriteStore | chakra-ui-v3 |
| ProductDetails | Client | product, isFavorite, callbacks | cartStore, favoriteStore | chakra-ui-v3 |
| CartItem | Client | item, onUpdateQuantity, onRemove | cartStore | chakra-ui-v3 |
| DeliveryOption | Client | enabled, onToggle, price | cartStore | chakra-ui-v3 |
| CartSummary | Client | subtotal, deliveryCost, total, onCheckout, isLoading | cartStore | chakra-ui-v3 |
| ContactForm | Client | onSubmit | — | chakra-ui-v3, form-validation |
| EmptyState | Server | title, description, actionLabel, actionHref, icon | — | chakra-ui-v3 |

---

## ✅ Чек-лист компонентов

- [x] Декомпозиция на компоненты с Chakra UI
- [x] Спецификация ProductCard
- [x] Спецификация FavoriteIcon
- [x] Спецификация ProductDetails
- [x] Спецификация DeliveryOption
- [x] Спецификация CartSummary
- [x] Спецификация страницы избранного
- [x] Props для каждого компонента
- [x] Ответственность компонентов (Client/Server)
- [x] Настройка кастомной темы Chakra UI
