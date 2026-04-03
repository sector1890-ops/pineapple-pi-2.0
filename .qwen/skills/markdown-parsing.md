# 📘 SKILL: Markdown Parsing & Processing
## 🎯 Метаданные
- **Экосистема:** `unified` (v11+), `remark`, `rehype`, `mdast`/`hast` AST
- **Совместимость:** Node.js 20+, Bun, Next.js 14/15 (RSC), React 18/19
- **Цель:** Безопасная, типизированная и расширяемая обработка Markdown/MDX в AST → HTML/React без XSS-уязвимостей и потери производительности.

## ⚙️ Директивы для агента
1. **Unified-пайплайн:** Избегай монолитных парсеров (`marked`, `markdown-it`) в пользу `unified()` → `remark` (mdast) → `rehype` (hast) → вывод. Это дает контроль над каждым этапом трансформации.
2. **Безопасность:** Всегда пропускай пользовательский контент через `rehype-sanitize`. Никогда не используй `allowDangerousHtml: true` без кастомной схемы фильтрации.
3. **Frontmatter:** Извлекай метаданные через `remark-frontmatter` + `gray-matter` или `vfile-matter`. Не парси YAML вручную.
4. **Типизация:** Строго типируй ноды через `@types/mdast` и `@types/hast`. Используй `visit`/`visitParents` из `unist-util-visit` для модификации дерева.
5. **Синхронность vs Асинхронность:** Предпочитай `.process()` (Promise) вместо `.processSync()`. Синхронная обработка допустима только в статических генераторах или CLI.
6. **MDX vs Markdown:** Используй `@mdx-js/mdx` только когда нужны интерактивные React-компоненты внутри разметки. Для статики достаточно `remark`/`rehype`.

## 📦 Установка и базовая настройка
```bash
# Ядро пайплайна
npm i unified remark remark-parse remark-rehype rehype rehype-stringify
# Плагины
npm i remark-gfm remark-frontmatter rehype-sanitize rehype-pretty-code
# Утилиты и типы
npm i gray-matter vfile unist-util-visit @types/mdast @types/hast
```

### Минимальный пайплайн
```ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

export const processor = unified()
.use(remarkParse)
.use(remarkGfm)
.use(remarkRehype, { allowDangerousHtml: false })
.use(rehypeSanitize)
.use(rehypeStringify)
```

## 🧱 Архитектура и Паттерны
| Задача | Плагин / Подход | Примечание |
|--------|----------------|------------|
| GFM (таблицы, зачеркивания) | `remark-gfm` | Стандарт для современных парсеров |
| Frontmatter | `remark-frontmatter` + `gray-matter` | Извлекай до/после парсинга |
| Подсветка кода | `rehype-pretty-code` или `shiki` | Асинхронная, требует `@shikijs/rehype` |
| TOC | `remark-toc` | Генерирует `mdast`-дерево оглавления |
| Санитизация | `rehype-sanitize` | Всегда кастомизируй схему под нужды |
| Оптимизация изображений | `rehype-img-size` / кастомный `visit` | Подменяй `src` на `next/image` или CDN |

```ts
// ✅ Модификация дерева (unist-util-visit)
import { visit } from 'unist-util-visit'
import type { Root } from 'hast'

export function addExternalLinkTarget() {
return (tree: Root) => {
visit(tree, 'element', (node) => {
if (node.tagName === 'a' && node.properties?.href?.startsWith('http')) {
node.properties.target = '_blank'
node.properties.rel = 'noopener noreferrer'
}
})
}
}
```

## ⚡ Производительность и Безопасность
- **Кэширование:** Компиляция MD/MDX дорогая. Кэшируй результат по хешу содержимого (`crypto.createHash('sha256').update(content).digest('hex')`).
- **Streaming:** В Next.js RSC используй `@vercel/mdx` или динамический `import()` для ленивой загрузки тяжелых компонентов.
- **XSS-защита:** `rehype-sanitize` по умолчанию разрешает только безопасные теги. Для кастомных атрибутов расширяй `defaultSchema`. Никогда не рендерь `dangerouslySetInnerHTML` без предварительной санитизации.
- **Tree Shaking:** Импортируй только нужные плагины. Избегай `import * as allPlugins from '...'`.
- **Асинхронные трансформеры:** Используй `async function plugin()` внутри `unified().use()`, если нужно фетчить изображения или генерировать OG-данные.

## 📝 Чек-лист перед коммитом
- [ ] Используется `unified()` пайплайн вместо legacy-парсеров
- [ ] `rehype-sanitize` подключен всегда, даже для доверенного контента
- [ ] Frontmatter извлекается строго типизированно (`gray-matter<T>`)
- [ ] Нет `allowDangerousHtml: true` без валидации схемы
- [ ] Асинхронные плагины обрабатывают ошибки через `try/catch`
- [ ] Результат кэшируется на основе хеша входной строки
- [ ] Типы `mdast`/`hast` строго указаны, `any` отсутствует
- [ ] Внешние ссылки имеют `rel="noopener noreferrer"`
- [ ] В RSC используется `<MDXRemote />` или RSC-совместимый рендерер

## 💡 Шаблон генерации (Agent Template)
```ts
// lib/markdown.ts
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import matter from 'gray-matter'
import type { VFileCompatible } from 'vfile'

export interface ParsedContent<TMeta = Record<string, unknown>> {
content: string
metadata: TMeta
toc: { title: string; url: string; depth: number }[]
}

// Кастомная схема санитизации (разрешаем iframe с YouTube)
const customSchema = {
...rehypeSanitize.defaultSchema,
tagNames: [...(rehypeSanitize.defaultSchema.tagNames ?? []), 'iframe'],
attributes: {
...rehypeSanitize.defaultSchema.attributes,
iframe: ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen']
}
}

export async function parseMarkdown<TMeta = Record<string, unknown>>(
source: VFileCompatible
): Promise<ParsedContent<TMeta>> {
const raw = typeof source === 'string' ? source : source.toString()
const { content, data } = matter(raw) as { content: string; TMeta }

const file = await unified()
.use(remarkParse)
.use(remarkGfm)
.use(remarkFrontmatter)
.use(remarkRehype, { allowDangerousHtml: false })
.use(rehypeSanitize, customSchema)
.use(rehypeStringify)
.process(content)

return {
content: String(file),
metadata: data as TMeta,
toc: extractToc(content) // Упрощенный TOC-генератор (заменить на remark-toc в проде)
}
}

function extractToc(content: string): ParsedContent['toc'] {
const headings = content.match(/^#{1,6}\s+(.+)$/gm) || []
return headings.map(h => {
const depth = (h.match(/^#/g)?.length ?? 1) - 1
const title = h.replace(/^#+\s+/, '')
return { title, url: `#${title.toLowerCase().replace(/\s+/g, '-')}`, depth }
})
}

// Usage
// const { content, metadata, toc } = await parseMarkdown<{ title: string }>(markdownString)
```