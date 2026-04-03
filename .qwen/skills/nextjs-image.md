# 📘 SKILL: Next.js Image
## 🎯 Метаданные
- **Компонент:** `next/image` (Next.js 13/14/15)
- **Форматы:** AVIF → WebP → JPEG/PNG (авто-фоллбэк)
- **Цель:** Предотвращение CLS, автоматическое ресайзинг/кэширование, ленивая загрузка, адаптивные `srcset`, безопасная работа с внешними CDN.

## ⚙️ Директивы для агента
1. **Размеры обязательны:** Всегда указывай `width` + `height` или `fill`. Рендер без размеров вызывает Layout Shift (CLS > 0.1).
2. **`fill` требует родителя:** Контейнер должен иметь `position: relative` и явную высоту/аспект. Используй `objectFit`/`objectPosition` для контроля кропа.
3. **`sizes` критичен:** При `fill` или неизвестных размерах всегда задавай `sizes`. Без него браузер загрузит оригинал (100vw), убивая производительность.
4. **`priority` только для LCP:** Максимум 1-2 изображения на страницу. Включает `fetchPriority="high"`, отключает lazy loading. Не злоупотребляй.
5. **Внешние домены:** Строго через `remotePatterns` в `next.config`. Wildcards (`*`) запрещены. Указывай `pathname` и `port` явно.
6. **SVG/Иконки:** Не используй `next/image` для векторной графики. Рендерь `<svg>` или `<img>` напрямую.

## 📦 Конфигурация (`next.config.ts`)
```ts
import type { NextConfig } from 'next'

const config: NextConfig = {
images: {
remotePatterns: [
{ protocol: 'https', hostname: 'cdn.example.com', pathname: '/assets/**' },
{ protocol: 'https', hostname: 'images.unsplash.com' }
],
formats: ['image/avif', 'image/webp'],
minimumCacheTTL: 31536000, // 1 год (в секундах)
deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
}
}
export default config
```

## 🧱 Паттерны и Компоненты
| Задача | Паттерн | Примечание |
|--------|---------|------------|
| Фиксированный размер | `<Image src="/img.jpg" width={400} height={300} />` | Идеально для карточек, аватаров |
| Респонсив/Неизвестный | `<Image fill sizes="(max-width: 768px) 100vw, 50vw" />` | Требует `relative` родитель |
| LCP (Hero/Banner) | `<Image priority fetchPriority="high" />` | Критично для Core Web Vitals |
| Blur-плейсхолдер | `<Image placeholder="blur" blurDataURL="data:image/..." />` | ≤ 2KB base64, генерируй через `sharp` |
| Кастомный лоадер | `<Image loader={({ src, width }) => `${src}?w=${width}`} />` | Только при необходимости внешнего CDN |

```tsx
// ✅ Корректный responsive-контейнер
<div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
<Image
src="https://cdn.example.com/hero.jpg"
alt="Описание для скринридеров"
fill
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
className="object-cover transition-transform duration-300 hover:scale-105"
priority
/>
</div>
```

## ⚡ Производительность и Оптимизация
- **Математика `sizes`:** Браузер выбирает источник из `srcset` на основе `sizes` и viewport. Указывай реалистичные медиа-запросы, совпадающие с CSS-лейаутом.
- **AVIF/WebP:** Генерируются автоматически на лету. `formats` в конфиге определяет порядок генерации.
- **Кэширование:** Next.js кэширует оптимизированные версии на диске сервера/Edge. `minimumCacheTTL` задает минимальное время жизни в секундах.
- **LCP-приоритизация:** `priority` загружает изображение в первом пакете HTML, отключает `loading="lazy"`, добавляет `fetchpriority="high"`.
- **Декоративные элементы:** `alt=""`, `role="presentation"`, `aria-hidden="true"`. Не грузи лишние байты.
- **Избегай:** Устаревших пропсов `layout`, `objectFit` (перенесены в `className`/`style`), inline-оберток без `relative`, хардкода `100vw` без `sizes`.

## 📝 Чек-лист перед коммитом
- [ ] `alt` указан осмысленно (или `""` для декоративных)
- [ ] `width`/`height` или `fill` + `position: relative` родитель
- [ ] `sizes` настроен для всех респонсивных изображений
- [ ] `priority` только у 1-2 критических (LCP) изображений
- [ ] Внешние домены добавлены в `remotePatterns` с точным `pathname`
- [ ] `placeholder="blur"` использует валидный `blurDataURL` (≤ 2KB)
- [ ] Нет устаревших `layout`/`objectFit` пропсов
- [ ] SVG/иконки/спрайты рендерятся напрямую, а не через `next/image`
- [ ] `className`/`style` не конфликтуют с внутренней стилизацией компонента
- [ ] `next/image` не используется внутри `useEffect`/`document` без проверки `typeof window`

## 💡 Шаблон генерации (Agent Template)
```tsx
import Image from 'next/image'
import type { ImageProps } from 'next/image'

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
src: string | { src: string; width: number; height: number }
caption?: string
aspectRatio?: 'auto' | 'square' | 'video' | 'portrait'
}

const aspectClasses: Record<string, string> = {
auto: 'h-auto',
square: 'aspect-square',
video: 'aspect-video',
portrait: 'aspect-[3/4]'
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
src,
alt,
caption,
aspectRatio = 'video',
sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
className,
...rest
}) => {
const isFixed = typeof src === 'object'
const wrapperClass = `relative w-full overflow-hidden rounded-xl bg-gray-50 ${aspectClasses[aspectRatio] ?? aspectClasses.video}`

return (
<figure className={className}>
<div className={wrapperClass}>
<Image
src={src}
alt={alt}
sizes={sizes}
loading={rest.priority ? 'eager' : 'lazy'}
fetchPriority={rest.priority ? 'high' : undefined}
className="object-cover w-full h-full"
{...(isFixed ? {} : { fill })}
{...rest}
/>
</div>
{caption && (
<figcaption className="mt-2 text-sm text-gray-500 text-center italic">
{caption}
</figcaption>
)}
</figure>
)
}

// Пример использования:
// <OptimizedImage
// src="https://cdn.example.com/photo.jpg"
// alt="Пейзаж"
// aspectRatio="video"
// placeholder="blur"
// blurDataURL="data:image/jpeg;base64,/9j/4AAQSk..."
// priority
// />