# Реализация Pineapple Pi 2.0

## 📋 Описание

Многостраничный сайт на Next.js 16 с каталогом товаров, корзиной, избранным и оформлением заказа.

**Ссылки на архитектурные планы:**
- [Архитектура](../docs/plans/001-architecture.md)
- [Компоненты](../docs/plans/001-components.md)
- [Потоки данных](../docs/plans/001-data-flow.md)

**Required Skills:**
- nextjs-app-router
- chakra-ui-v3
- zustand
- typescript
- markdown-parsing
- nextjs-image
- localstorage-patterns
- jest

---

## 🎯 Критерии готовности

- [ ] Все страницы работают (/, /about, /contact, /cart, /favorites, /product/[id])
- [ ] SSG генерация страниц товаров из Markdown файлов
- [ ] Корзина работает с Zustand (добавление, удаление, количество, доставка)
- [ ] Избранное работает с Zustand (toggle, синхронизация между страницами)
- [ ] Персистентность в localStorage (корзина, избранное, cookie)
- [ ] Моковые API работают (/api/feedback, /api/order)
- [ ] Адаптивность (mobile-first, 1-4 колонки)
- [ ] Темизация работает (light/dark, teal акцент)
- [ ] Cookie баннер работает
- [ ] 404 страница есть
- [ ] Lighthouse score > 90

---

## 📦 Этап 1: Настройка проекта и зависимостей

**Цель:** Подготовить проект к разработке

### Задачи

- [ ] 1.1 Установить зависимости: gray-matter, marked, lucide-react
- [ ] 1.2 Настроить Chakra UI провайдер в app/layout.tsx
  - Добавить ChakraProvider
  - Настроить ColorModeScript
  - Подключить кастомную тему (teal акцент)
- [ ] 1.3 Создать файл темы (src/app/theme.ts)
  - Расширить дефолтную тему Chakra UI v3
  - Установить teal как акцентный цвет
  - Настроить шрифты (Geist Sans, Geist Mono)
- [ ] 1.4 Обновить app/globals.css
  - Импортировать стили Chakra
  - Настроить CSS переменные для тем
- [ ] 1.5 Создать базовую структуру layout.tsx
  - Обёртка с ChakraProvider
  - Metadata (title, description)
  - lang="ru"

**Проверка:**
- `npm run dev` запускается без ошибок
- Chakra UI компоненты рендерятся
- Темизация применяется (teal кнопки)

---

## 📝 Этап 2: Парсинг Markdown и типы данных

**Цель:** Создать утилиты для работы с товарами

### Задачи

- [ ] 2.1 Создать типы TypeScript (src/types/product.ts)
  - Product (id, title, specifications, price, priceFormatted, imagePath, shortDescription, slug)
  - CartItem (product, quantity)
  - OrderData (items, delivery, subtotal, deliveryCost, total)
- [ ] 2.2 Создать lib/markdown.ts
  - Функция parseMarkdownFile(filePath): Product | null
  - Использовать gray-matter для H1
  - Использовать marked для парсинга
  - Извлечь Specification (маркированный список)
  - Извлечь Price (регулярное выражение /\$(\d+)/)
  - Обработка ошибок (логирование, возврат null)
- [ ] 2.3 Создать lib/products.ts
  - Функция getAllProducts(): Product[]
  - Функция getProductById(id): Product | null
  - Чтение файлов из /public/products/specification/
  - Генерация slug из имени файла (без .md)
  - Формирование imagePath из /public/products/images/
- [ ] 2.4 Протестировать парсинг
  - Проверить все .md файлы
  - Убедиться что цена извлекается
  - Убедиться что спецификации парсятся

**Проверка:**
- getAllProducts() возвращает массив из 8 товаров
- Каждый Product имеет все поля
- Ошибки логируются корректно

---

## 🗄️ Этап 3: Zustand Stores

**Цель:** Создать stores для корзины и избранного

### Задачи

- [ ] 3.1 Создать stores/cartStore.ts
  - Определить интерфейс CartState
  - items: CartItem[]
  - delivery: boolean
  - Методы: addItem, removeItem, updateQuantity, clearCart, toggleDelivery
  - Геттеры: totalItems, subtotal, deliveryCost, total
  - Настроить persist middleware (localStorage, ключ "pineapple-cart", version 1)
- [ ] 3.2 Создать stores/favoriteStore.ts
  - Определить интерфейс FavoriteState
  - items: string[] (массив slug)
  - Методы: toggleFavorite, removeFavorite, isFavorite, clearFavorites
  - Геттер: count
  - Настроить persist middleware (localStorage, ключ "pineapple-favorites", version 1)
- [ ] 3.3 Протестировать stores
  - Проверить добавление/удаление
  - Проверить геттеры
  - Проверить персистентность (перезагрузка страницы)

**Проверка:**
- Stores создаются без ошибок
- Методы работают корректно
- Данные сохраняются в localStorage
- Геттеры вычисляют правильно

---

## 🧩 Этап 4: Базовые компоненты Layout

**Цель:** Создать Header, Footer, CookieBanner

### Задачи

- [ ] 4.1 Создать components/layout/Header.tsx (Client Component)
  - Горизонтальная навигация (Главная, О компании, Контакты, Избранное, Корзина)
  - Иконка корзины с Badge (cartCount из cartStore)
  - Иконка избранного с Badge (favoritesCount из favoriteStore)
  - Адаптивность: гамбургер-меню на мобильных (Drawer), горизонтальное меню на lg+
  - Использовать lucide-react иконки
- [ ] 4.2 Создать components/layout/Footer.tsx (Server Component)
  - 3 колонки (SimpleGrid)
  - Навигация, контакты, копирайт
  - Адаптивность: 1 колонка на base, 3 на lg+
- [ ] 4.3 Создать components/layout/CookieBanner.tsx (Client Component)
  - Проверка localStorage при монтировании
  - Показ баннера если нет флага
  - Кнопка "Принять" → сохранение флага, скрытие
  - Фиксированная позиция внизу экрана
- [ ] 4.4 Обновить app/layout.tsx
  - Интегрировать Header и Footer
  - Добавить CookieBanner

**Проверка:**
- Header отображается на всех страницах
- Счётчики обновляются при изменении stores
- Footer адаптивен
- Cookie баннер показывается один раз

---

## 🛍️ Этап 5: Компоненты товаров

**Цель:** Создать ProductCard, ProductGrid, FavoriteIcon, ProductDetails

### Задачи

- [ ] 5.1 Создать components/product/FavoriteIcon.tsx (Client Component)
  - Иконка сердечка (lucide-react HeartIcon)
  - Props: isFavorite, onToggle, size
  - Анимация при клике (scale transition)
  - Цвет: red.500 (active), gray.400 (inactive)
- [ ] 5.2 Создать components/product/ProductCard.tsx
  - Server Component (интерактив через props callbacks)
  - Props: product, isFavorite, onToggleFavorite, onAddToCart
  - Изображение (next/image)
  - Название, краткое описание, цена
  - FavoriteIcon (с onToggleFavorite)
  - Кнопка корзины (с onAddToCart)
  - Клик на карточку → переход на /product/[id]
  - e.stopPropagation на иконках
- [ ] 5.3 Создать components/product/ProductGrid.tsx (Server Component)
  - Props: products, favorites, onToggleFavorite, onAddToCart
  - SimpleGrid (cols: base=1, md=2, lg=3, xl=4)
  - ProductCard для каждого товара
  - EmptyState если массив пуст
- [ ] 5.4 Создать components/product/ProductDetails.tsx (Client Component)
  - Props: product, isFavorite, onToggleFavorite, onAddToCart
  - Полное изображение (next/image, priority)
  - Название, все спецификации (List)
  - Цена, NumberInput (количество, min=1, max=99)
  - FavoriteIcon, Button "В корзину"
  - useState для quantity

**Проверка:**
- ProductCard рендерится в сетке
- FavoriteIcon анимируется
- ProductDetails отображает все данные
- next/image оптимизирует изображения

---

## 🏠 Этап 6: Главная страница

**Цель:** Реализовать каталог товаров на /

### Задачи

- [ ] 6.1 Обновить app/page.tsx (Server Component)
  - Вызов getAllProducts()
  - Передача данных в ProductGrid
  - Чтение favoriteStore для isFavorite (нужен Client Component wrapper или передача через props)
  - Обработка onAddToCart (добавление в cartStore с toast)
  - Обработка onToggleFavorite (toggle в favoriteStore с toast)
- [ ] 6.2 Добавить toast уведомления
  - При добавлении в корзину
  - При добавлении в избранное
  - Chakra useToast хук

**Проверка:**
- Главная страница отображает все товары
- Сетка адаптивна (1-4 колонки)
- Клик на сердечко обновляет избранное
- Клик на корзину добавляет товар
- Переход на страницу товара работает

---

## 📄 Этап 7: Страница товара (SSG)

**Цель:** Генерация статических страниц /product/[id]

### Задачи

- [ ] 7.1 Создать app/product/[id]/page.tsx
  - generateStaticParams(): получить все slug из getAllProducts()
  - getProductById(params.id) в компоненте
  - fallback: false (404 если не найден)
  - Server Component обёртка
- [ ] 7.2 Создать Client Component для интерактива
  - Отдельный компонент (например, ProductPageClient)
  - Передача product из server component
  - Подключение к cartStore и favoriteStore
  - ProductDetails с callbacks
  - Toast уведомления
- [ ] 7.3 Обработать 404
  - Если товар не найден → notFound() из next/navigation

**Проверка:**
- `npm run build` генерирует все страницы товаров
- /product/PineapplePi-M4Berry загружается
- Все данные отображаются
- Можно добавить в корзину и избранное
- Несуществующий ID показывает 404

---

## ❤️ Этап 8: Страница избранного

**Цель:** Реализовать /favorites

### Задачи

- [ ] 8.1 Создать app/favorites/page.tsx (Client Component)
  - Чтение favoriteStore (items — массив ID)
  - Фильтрация товаров: getAllProducts().filter(p => items.includes(p.id))
  - ProductGrid с избранными товарами
  - EmptyState если избранное пусто (кнопка "Перейти в каталог")
  - Callbacks: onToggleFavorite (удаление), onAddToCart
- [ ] 8.2 Синхронизация состояния
  - Убедиться что isFavorite обновляется на всех страницах
  - Проверить реактивность Zustand

**Проверка:**
- /favorites показывает избранные товары
- Удаление из избранного обновляет сетку
- Пустое избранное показывает EmptyState
- Синхронизация с главной страницей работает

---

## 🛒 Этап 9: Страница корзины

**Цель:** Реализовать /cart с управлением количеством и доставкой

### Задачи

- [ ] 9.1 Создать components/cart/CartItem.tsx (Client Component)
  - Props: item, onUpdateQuantity, onRemove
  - Миниатюра изображения (next/image)
  - Название, цена
  - NumberInput (количество, min=1, max=99)
  - Кнопка удаления (иконка мусорки)
  - Адаптивность: вертикально на мобильных, горизонтально на десктопе
- [ ] 9.2 Создать components/cart/DeliveryOption.tsx (Client Component)
  - Props: enabled, onToggle, price
  - Checkbox с текстом "Добавить доставку (+$5)"
  - Визуальное выделение при enabled
- [ ] 9.3 Создать components/cart/CartSummary.tsx (Client Component)
  - Props: subtotal, deliveryCost, total, onCheckout, isLoading
  - Разбивка: Товары, Доставка, Итого
  - Button "Оформить заказ" (disabled если isLoading)
- [ ] 9.4 Создать app/cart/page.tsx (Client Component)
  - Чтение cartStore (items, delivery, геттеры)
  - CartItem для каждого элемента
  - DeliveryOption с toggleDelivery
  - CartSummary с onCheckout
  - EmptyState если корзина пуста
- [ ] 9.5 Реализовать onCheckout
  - POST /api/order с данными заказа
  - При успехе: clearCart(), toast, редирект на "/"
  - При ошибке: toast с ошибкой
  - isLoading состояние

**Проверка:**
- /cart показывает товары в корзине
- Изменение количества обновляет сумму
- DeliveryOption переключает доставку
- CartSummary считает правильно (subtotal + delivery)
- Оформление заказа работает
- Корзина очищается после заказа

---

## 🔌 Этап 10: Моковые API Routes

**Цель:** Создать /api/feedback и /api/order

### Задачи

- [ ] 10.1 Создать app/api/feedback/route.ts
  - POST handler
  - Валидация body (name, email, message)
  - Проверка формата email
  - Имитация задержки (setTimeout 1-2 сек)
  - Response: { success: true, message: "..." }
  - Обработка ошибок (400 при неверных данных)
- [ ] 10.2 Создать app/api/order/route.ts
  - POST handler
  - Валидация body (items, delivery, subtotal, deliveryCost, total)
  - Проверка что items не пустой
  - Имитация задержки (setTimeout 1-2 сек)
  - Генерация orderId (Date.now())
  - Response: { success: true, orderId: "...", message: "..." }
  - Обработка ошибок

**Проверка:**
- POST /api/feedback принимает данные
- Валидация работает (пустые поля, неверный email)
- POST /api/order принимает заказ
- orderId генерируется
- Ошибки возвращают 400

---

## 📞 Этап 11: Страница контактов

**Цель:** Реализовать /contact с формой обратной связи

### Задачи

- [ ] 11.1 Создать components/ui/ContactForm.tsx (Client Component)
  - Props: onSubmit
  - Поля: name (Input), email (Input), message (Textarea)
  - Валидация (name min 2, email формат, message min 10)
  - useState: name, email, message, errors, isSubmitting, isSubmitted
  - При отправке: валидация, вызов onSubmit
  - Toast при успехе/ошибке
  - Disabled состояние во время отправки
- [ ] 11.2 Создать app/contact/page.tsx (Client Component)
  - ContactForm
  - onSubmit: POST /api/feedback
  - Toast уведомление

**Проверка:**
- /contact отображает форму
- Валидация работает
- Отправка работает
- Toast показывается
- Ошибки отображаются под полями

---

## 🏢 Этап 12: Страница "О компании"

**Цель:** Реализовать /about со статическим контентом

### Задачи

- [ ] 12.1 Создать app/about/page.tsx (Server Component)
  - Импорт data/about-company.ts
  - Секции: Hero, Mission, Values (SimpleGrid), History (List), Statistics (SimpleGrid), Team, Contact
  - Chakra UI компоненты (Container, Heading, Text, Divider)
  - Адаптивность

**Проверка:**
- /about отображает контент
- Секции адаптивны
- Данные из about-company.ts используются

---

## 🚫 Этап 13: Not Found страница

**Цель:** Создать кастомную 404 страницу

### Задачи

- [ ] 13.1 Создать app/not-found.tsx (Server Component)
  - Header, Footer
  - EmptyState (title: "Страница не найдена", description: "...", actionLabel: "На главную", actionHref: "/")
  - Код 404

**Проверка:**
- Несуществующий маршрут показывает 404
- Кнопка "На главную" работает

---

## 🎨 Этап 14: Финальная полировка

**Цель:** Убедиться что всё работает вместе

### Задачи

- [ ] 14.1 Проверить адаптивность
  - Протестировать на разных размерах экрана
  - Мобильное меню (Drawer) работает
  - Сетка товаров адаптивна
  - CartItem адаптивен
- [ ] 14.2 Проверить темизацию
  - Light mode: teal акцент
  - Dark mode: teal.400 акцент
  - Переключение темы работает
  - Все компоненты корректны в обеих темах
- [ ] 14.3 Проверить персистентность
  - Перезагрузка страницы сохраняет корзину
  - Перезагрузка сохраняет избранное
  - Cookie баннер не показывается повторно
- [ ] 14.4 Проверить все маршруты
  - /, /about, /contact, /cart, /favorites
  - /product/[id] для каждого товара
  - 404 для несуществующих
- [ ] 14.5 Lighthouse аудит
  - Запустить Lighthouse в Chrome
  - Проверить Performance, Accessibility, Best Practices, SEO
  - Цель: > 90 по всем метрикам
- [ ] 14.6 Исправить баги
  - Логирование ошибок в консоли
  - Некорректное поведение
  - Проблемы адаптивности

**Проверка:**
- Все критерии готовности выполнены
- Lighthouse score > 90
- Нет ошибок в консоли
- Баги исправлены

---

## 📊 Прогресс выполнения

| Этап | Статус | Примечания |
|------|--------|------------|
| 1. Настройка проекта | ⬜ Не начат | |
| 2. Парсинг Markdown | ⬜ Не начат | |
| 3. Zustand Stores | ⬜ Не начат | |
| 4. Layout компоненты | ⬜ Не начат | |
| 5. Компоненты товаров | ⬜ Не начат | |
| 6. Главная страница | ⬜ Не начат | |
| 7. Страница товара SSG | ⬜ Не начат | |
| 8. Избранное | ⬜ Не начат | |
| 9. Корзина | ⬜ Не начат | |
| 10. API Routes | ⬜ Не начат | |
| 11. Контакты | ⬜ Не начат | |
| 12. О компании | ⬜ Не начат | |
| 13. Not Found | ⬜ Не начат | |
| 14. Полировка | ⬜ Не начат | |

---

## 📝 Примечания

### Важные моменты

1. **Chakra UI v3** имеет отличия от v2 — читать документацию
2. **Next.js 16** может иметь новые API — проверять docs
3. **Zustand persist** требует middleware из zustand/middleware
4. **gray-matter** извлекает frontmatter, но у нас Markdown без frontmatter — использовать для H1
5. **next/image** требует настройки remotePatterns если внешние изображения (у нас локальные)
6. **SSG** с dynamic routes требует generateStaticParams
7. **Client Components** не могут импортировать Server Components напрямую

### Частые ошибки

- Использование window/document без проверки (SSR ошибка)
- Неправильная настройка persist middleware
- Отсутствие e.stopPropagation на иконках в ProductCard
- Неверный путь к изображениям в next/image
- Пропуск generateStaticParams для SSG

### Ресурсы

- [Next.js 16 Docs](node_modules/next/dist/docs/)
- [Chakra UI v3 Docs](https://www.chakra-ui.com/docs/getting-started)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [gray-matter NPM](https://www.npmjs.com/package/gray-matter)
- [marked Docs](https://marked.js.org/)
