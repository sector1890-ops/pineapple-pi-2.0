# Архитектура Pineapple Pi 2.0

## 📋 Общее описание

Многостраничный сайт (MPA) на Next.js 16 (App Router) с каталогом микрокомпьютеров. Данные товаров парсятся из Markdown файлов на этапе сборки (SSG). Состояние корзины и избранного управляется через Zustand с персистентностью в localStorage. UI построен на Chakra UI 3 с кастомной темой (акцентный цвет teal).

### Ключевые решения

| Аспект | Решение | Обоснование |
|--------|---------|-------------|
| Роутинг | Next.js App Router | Нативная поддержка SSG, серверных компонентов |
| Парсинг Markdown | gray-matter + marked | gray-matter для frontmatter, marked для HTML-рендеринга |
| Состояние | Zustand (2 отдельных стора) | Простота API, персистентность через middleware |
| UI | Chakra UI 3 | Встроенная темизация, адаптивные компоненты |
| Изображения | next/image | Автоматическая оптимизация, lazy loading |
| Темизация | Chakra ColorMode | Системная тема + ручной выбор, сохранение в localStorage |

---

## 🏗️ Структура проекта

```
pineapple-pi-2.0/
├── src/
│   ├── app/                          # App Router (Next.js 16)
│   │   ├── layout.tsx                # Root layout с Chakra Provider
│   │   ├── page.tsx                  # Главная страница (каталог)
│   │   ├── globals.css               # Глобальные стили + тема Chakra
│   │   ├── about/
│   │   │   └── page.tsx              # Страница "О компании"
│   │   ├── contact/
│   │   │   └── page.tsx              # Форма обратной связи
│   │   ├── favorites/
│   │   │   └── page.tsx              # Страница избранного
│   │   ├── cart/
│   │   │   └── page.tsx              # Страница корзины
│   │   ├── product/
│   │   │   └── [id]/
│   │   │       └── page.tsx          # SSG страница товара
│   │   ├── api/
│   │   │   ├── feedback/
│   │   │   │   └── route.ts          # Моковый API для формы
│   │   │   └── order/
│   │   │       └── route.ts          # Моковый API для заказа
│   │   └── not-found.tsx             # Кастомная 404 страница
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx            # Шапка с навигацией
│   │   │   ├── Footer.tsx            # Подвал сайта
│   │   │   └── CookieBanner.tsx      # Баннер cookie
│   │   ├── product/
│   │   │   ├── ProductCard.tsx       # Карточка товара
│   │   │   ├── ProductGrid.tsx       # Сетка товаров
│   │   │   ├── FavoriteIcon.tsx      # Иконка избранного (сердечко)
│   │   │   └── ProductDetails.tsx    # Детальное описание товара
│   │   ├── cart/
│   │   │   ├── CartItem.tsx          # Элемент корзины
│   │   │   ├── DeliveryOption.tsx    # Выбор доставки
│   │   │   └── CartSummary.tsx       # Сводка корзины
│   │   └── ui/
│   │       ├── ContactForm.tsx       # Форма обратной связи
│   │       └── EmptyState.tsx        # Пустое состояние
│   │
│   ├── lib/
│   │   ├── markdown.ts               # Утилиты парсинга Markdown
│   │   └── products.ts               # Функции получения товаров
│   │
│   ├── stores/
│   │   ├── cartStore.ts              # Zustand store корзины
│   │   └── favoriteStore.ts          # Zustand store избранного
│   │
│   ├── types/
│   │   └── product.ts                # TypeScript типы/интерфейсы
│   │
│   └── data/
│       └── about-company.ts          # Данные для страницы "О компании"
│
├── public/
│   └── products/
│       ├── specification/            # Markdown файлы товаров
│       │   └── *.md
│       └── images/                   # Изображения товаров
│           └── *.jpg/png
│
└── docs/plans/
    ├── 001-architecture.md           # Этот файл
    ├── 001-components.md             # Спецификация компонентов
    └── 001-data-flow.md              # Потоки данных
```

---

## 📦 Модели данных

### Product (Товар)

| Поле | Тип | Описание |
|------|-----|----------|
| id | string | Slug из имени файла (например, "PineapplePi-M4Berry") |
| title | string | Название товара (из H1 в Markdown) |
| specifications | string[] | Массив характеристик (из секции Specification) |
| price | number | Числовая цена (например, 40) |
| priceFormatted | string | Форматированная цена (например, "$40") |
| imagePath | string | Путь к изображению (например, "/products/images/PineapplePi-M4Berry.jpg") |
| shortDescription | string | Краткое описание (первые 3 пункта спецификации) |
| slug | string | URL-friendly идентификатор |

### CartItem (Элемент корзины)

| Поле | Тип | Описание |
|------|-----|----------|
| product | Product | Объект товара |
| quantity | number | Количество единиц |

### CartState (Состояние корзины)

| Поле | Тип | Описание |
|------|-----|----------|
| items | CartItem[] | Список товаров в корзине |
| delivery | boolean | Флаг выбора доставки |

### FavoriteState (Состояние избранного)

| Поле | Тип | Описание |
|------|-----|----------|
| items | string[] | Массив slug'ов избранных товаров |

---

## 🗂️ Zustand Stores

### cartStore

**Ответственность:** Управление корзиной товаров

**Состояние:**
- items: CartItem[]
- delivery: boolean

**Методы:**
- addItem(product, quantity) — добавить товар (если уже есть — увеличить количество)
- removeItem(productId) — удалить товар из корзины
- updateQuantity(productId, quantity) — изменить количество
- clearCart() — очистить корзину
- toggleDelivery(enabled) — переключить доставку

**Вычисляемые значения (геттеры):**
- totalItems — общее количество товаров (сумма quantity)
- subtotal — сумма товаров без доставки (price * quantity для каждого)
- deliveryCost — 5 если delivery=true, иначе 0
- total — subtotal + deliveryCost

**Персистентность:**
- Использовать middleware persist из Zustand
- Сохранять в localStorage под ключом "pineapple-cart"
- Версионирование (version: 1)

---

### favoriteStore

**Ответственность:** Управление списком избранного

**Состояние:**
- items: string[] (массив slug'ов)

**Методы:**
- toggleFavorite(productId) — добавить/удалить из избранного (toggle)
- removeFavorite(productId) — удалить из избранного
- isFavorite(productId) — проверить наличие в избранном (boolean)
- clearFavorites() — очистить избранное

**Вычисляемые значения:**
- count — количество избранных товаров (items.length)

**Персистентность:**
- Использовать middleware persist из Zustand
- Сохранять в localStorage под ключом "pineapple-favorites"
- Версионирование (version: 1)

---

## 🔌 API Routes (Моковые)

### POST /api/feedback

**Назначение:** Обработка формы обратной связи

**Request Body:**
| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| name | string | Да | Имя отправителя |
| email | string | Да | Email отправителя |
| message | string | Да | Текст сообщения |

**Response (200):**
```json
{
  "success": true,
  "message": "Сообщение успешно отправлено"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Ошибка валидации",
  "errors": ["name: обязательное поле", "email: неверный формат"]
}
```

**Логика:**
- Валидация входных данных (проверка на пустоту, формат email)
- Имитация задержки (setTimeout 1-2 секунды)
- Возврат успешного ответа (реальная отправка не требуется)

---

### POST /api/order

**Назначение:** Оформление заказа

**Request Body:**
| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| items | Array<{id, title, price, quantity}> | Да | Список товаров |
| delivery | boolean | Да | Флаг доставки |
| subtotal | number | Да | Сумма товаров |
| deliveryCost | number | Да | Стоимость доставки |
| total | number | Да | Итоговая сумма |

**Response (200):**
```json
{
  "success": true,
  "orderId": "ORD-1234567890",
  "message": "Заказ успешно оформлен"
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Корзина пуста или некорректные данные"
}
```

**Логика:**
- Валидация (корзина не пуста, все поля заполнены)
- Имитация задержки (setTimeout 1-2 секунды)
- Генерация фейкового orderId
- Возврат успешного ответа

---

## 🎨 Стратегия темизации

### Chakra UI Theme Configuration

**Подход:** Расширение дефолтной темы через `createSystem` (Chakra UI v3)

**Ключевые настройки:**

| Параметр | Значение | Описание |
|----------|----------|----------|
| accentColor | teal | Акцентный цвет для кнопок, ссылок |
| colorMode | system | Системная тема по умолчанию |
| colorModeStorage | localStorage | Хранение выбора пользователя |
| fontFamily | Geist Sans | Основной шрифт (из next/font) |
| fontMono | Geist Mono | Моноширинный шрифт для кода |

**Семантические цвета:**

| Роль | Light Mode | Dark Mode |
|------|------------|-----------|
| background | white | gray.900 |
| surface | gray.50 | gray.800 |
| text | gray.900 | white |
| textMuted | gray.600 | gray.400 |
| accent | teal.500 | teal.400 |
| accentHover | teal.600 | teal.500 |
| favorite | red.500 | red.400 |

**Настройка компонентов:**

- **Button:** variant="solid" с цветом teal, скруглённые углы
- **Card:** фон surface, тень, padding
- **Input:** border с фокусом на accent
- **Badge:** для счётчиков в корзине/избранном

---

## 📱 Стратегия адаптивности

### Mobile-First подход

**Breakpoints (Chakra UI по умолчанию):**

| Breakpoint | Ширина | Использование |
|------------|--------|---------------|
| base | < 768px | Мобильные устройства |
| md | ≥ 768px | Планшеты |
| lg | ≥ 992px | Десктоп |
| xl | ≥ 1280px | Большие экраны |

**Сетка товаров:**

| Breakpoint | Колонки | Gap |
|------------|---------|-----|
| base | 1 | 4 |
| md | 2 | 6 |
| lg | 3 | 8 |
| xl | 4 | 8 |

**Навигация:**

- **base/md:** Гамбургер-меню (Drawer)
- **lg+:** Горизонтальное меню (Flex)

**Компоненты Chakra для адаптивности:**
- SimpleGrid для сетки товаров
- Flex/Stack для расположения элементов
- show/hide для условного рендеринга по breakpoint

---

## 🔄 Server vs Client Components

### Server Components (по умолчанию)

| Компонент | Причина |
|-----------|---------|
| layout.tsx | Корневой layout с метаданными |
| page.tsx (главная) | SSG с парсингом Markdown |
| product/[id]/page.tsx | SSG с динамическим маршрутом |
| about/page.tsx | Статический контент |
| ProductGrid | Рендеринг списка на сервере |
| ProductCard | Карточка товара (без интерактива) |

### Client Components ("use client")

| Компонент | Причина |
|-----------|---------|
| Header | Интерактивная навигация, счётчики |
| Footer | Статичный, но может содержать интерактив |
| CookieBanner | localStorage, состояние |
| FavoriteIcon | Zustand store, анимация |
| CartItem | Изменение количества |
| DeliveryOption | Состояние доставки |
| CartSummary | Вычисления на клиенте |
| ContactForm | Форма с валидацией |
| ProductDetails | Кнопки, количество, избранное |

**Правило:** Все компоненты, использующие Zustand stores, хуки React (useState, useEffect), или обработчики событий — должны быть клиентскими.

---

## 🖼️ Стратегия работы с изображениями

### Связь спецификаций и изображений

**Правило именования:**
- Файл спецификации: `PineapplePi-M4Berry.md`
- Соответствующее изображение: `PineapplePi-M4Berry.jpg`
- ID товара: `PineapplePi-M4Berry` (без расширения)

**Путь к изображению:**
- Изображения хранятся в `/public/products/images/`
- Путь в объекте Product: `/products/images/PineapplePi-M4Berry.jpg`

**Оптимизация:**
- Использовать компонент `next/image`
- Props: width, height (фиксированные размеры для карточек)
- loading="lazy" для карточек (по умолчанию в next/image)
- priority для главного изображения на странице товара
- Форматы: автоматическая конвертация в WebP/AVIF (Next.js 16)

**Fallback:**
- Если изображение не найдено — показать placeholder (серый фон с иконкой)

---

## 🍪 Cookie Banner

### Логика работы

**Условия показа:**
- При первом визите пользователя (нет флага в localStorage)
- Ключ localStorage: `pineapple-cookie-consent`
- Значение: `"accepted"`

**Поведение:**
- Показывается один раз при загрузке сайта
- После нажатия "Принять" — скрывается и сохраняется флаг
- Баннер не блокирует взаимодействие с сайтом (не modal, а banner)

**Хранение:**
- localStorage (через useEffect в клиентском компоненте)
- Не используется Zustand (простой флаг)

---

## 📄 Генерация статических страниц (SSG)

### Стратегия

**На этапе сборки (build time):**

1. Чтение всех `.md` файлов из `/public/products/specification/`
2. Парсинг каждого файла через gray-matter + marked
3. Создание массива объектов Product
4. Генерация статических путей для `/product/[id]`
5. Экспорт `generateStaticParams()` для预渲染 всех страниц

**Функции:**

| Функция | Файл | Назначение |
|---------|------|------------|
| parseMarkdownFile() | lib/markdown.ts | Парсинг одного .md файла |
| getAllProducts() | lib/products.ts | Получение всех товаров |
| getProductById(id) | lib/products.ts | Получение одного товара |
| generateStaticParams() | product/[id]/page.tsx | Генерация путей для SSG |

**Обработка ошибок:**
- Если файл не найден — вернуть null
- Если парсинг не удался — логировать и пропустить товар
- Валидация структуры (наличие H1, Specification, Price)

---

## 🧩 Required Skills для Кодера

| Навык | Применение |
|-------|------------|
| nextjs-app-router | Роутинг, SSG, серверные компоненты |
| chakra-ui-v3 | Компоненты, темизация, адаптивность |
| zustand | Stores корзины и избранного |
| typescript | Типизация всех данных |
| markdown-parsing | gray-matter + marked |
| nextjs-image | next/image оптимизация |
| localstorage-patterns | Персистентность Zustand |

---

## ✅ Чек-лист архитектуры

- [x] Определена стратегия парсинга Markdown файлов
- [x] Описана структура данных товара
- [x] Определена структура папок app/
- [x] Разработан дизайн Zustand stores
- [x] Описана логика расчёта суммы
- [x] Указана логика моковых API
- [x] Предложена стратегия работы с изображениями
- [x] Определена логика Cookie-баннера
- [x] Описана конфигурация темы Chakra UI
- [x] Учтено разделение Server/Client Components
- [x] Описан механизм генерации slug
- [x] Спроектирован UI выбора доставки
- [x] Спроектированы компоненты избранного
- [x] Описана синхронизация состояния избранного
