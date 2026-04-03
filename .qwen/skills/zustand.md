# 📘 SKILL: Zustand
## 🎯 Метаданные
- **Библиотека:** Zustand 4.x / 5.x
- **Экосистема:** React 18/19, TypeScript, Vite/Next.js
- **Цель:** Создать легковесное, типизированное, производительное глобальное состояние без Provider-hell.

## ⚙️ Директивы для агента
1. **Селекторы обязательны:** Никогда не возвращай весь стор в `useStore()`. Используй `useStore(state => state.field)` для предотвращения лишних ререндеров.
2. **Сравнение:** Для объектов/массивов всегда используй `useShallow` или кастомную `equalityFn`.
3. **Архитектура:** Один стор на домен (например, `authStore`, `cartStore`). Избегай монолитных сторов.
4. **SSR/Hydration:** Zustand клиентский по умолчанию. Для SSR инициализируй стор дефолтными значениями, гидрируй через `persist` или ручную синхронизацию в `useEffect`.
5. **Мутации:** Обновляй состояние иммутабельно. Используй `immer` middleware для сложной вложенной логики.
6. **Мидлвары:** Порядок важен: `devtools` → `persist` → `immer` → основной `create`. Типизируй каждый слой.

## 📦 Установка и Базовая настройка
```bash
npm i zustand
# Опционально
npm i @types/node # для SSR-safe types
```

### Базовый паттерн (Slice + TypeScript)
```ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'

type UserState = { id: string; name: string; role: 'admin' | 'user' }
type UserActions = { login: (id: string) => void; logout: () => void; setName: (name: string) => void }

export const useUserStore = create<UserState & UserActions>()(
devtools(
persist(
immer((set) => ({
id: '', name: '', role: 'user',
login: (id) => set((state) => { state.id = id }),
logout: () => set((state) => { state.id = ''; state.name = ''; state.role = 'user' }),
setName: (name) => set((state) => { state.name = name }),
})),
{ name: 'user-storage', storage: createJSONStorage(() => sessionStorage) }
)
)
)
```

## 🧱 Паттерны и Архитектура
| Задача | Решение |
|--------|---------|
| Разделение логики | Slice Pattern: выноси куски состояния/экшенов в отдельные файлы |
| Derived State | Вычисляй в селекторе: `useStore(s => s.items.length > 0)` |
| Асинхронность | Экшены могут быть `async`. Не храни промисы в стейте без `isPending` флагов |
| Подписка вне React | `useUserStore.subscribe((state) => track(state.id))` |
| Оптимистичные обновления | `set((state) => ({ ...state, isSaving: true }))` → API → `set` с результатом |

```ts
// ✅ Правильный селектор с shallow сравнением
import { useShallow } from 'zustand/react/shallow'

export function useCartSummary() {
return useCartStore(useShallow(s => ({
total: s.items.reduce((a, i) => a + i.price, 0),
count: s.items.length,
currency: s.currency
})))
}
```

## ⚡ Производительность
- **useShallow:** Обязательно для объектов/массивов. `useStore(s => s.items)` будет ререндерить при любом изменении ссылки на массив.
- **Избегай inline-объектов:** `useStore(state => ({ x: state.a, y: state.b }))` ломает memoization.
- **Batch Updates:** Zustand автоматически батчит синхронные обновления внутри одного тика. Для async используй `set((state) => { ... }, true)` (v4) или полагайся на React 18 auto-batching.
- **Селекторы не должны иметь сайд-эффектов:** Только чтение и вычисления.

## 📝 Чек-лист перед коммитом
- [ ] Все `useStore` используют селекторы (`state => state.x`)
- [ ] Объекты/массивы обернуты в `useShallow` или имеют кастомную `===` проверку
- [ ] Стор типизирован через `State & Actions` интерфейс
- [ ] `persist` используется осознанно, указан `storage` и `name`
- [ ] Нет мутаций состояния напрямую (используется `immer` или spread)
- [ ] SSR-безопасность: стор инициализируется пустыми/дефолтными значениями
- [ ] `devtools` включен только в `process.env.NODE_ENV !== 'production'` (опционально)

## 💡 Шаблон генерации (Agent Template)
```tsx
// store.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
import { useShallow } from 'zustand/react/shallow'

interface Todo { id: string; text: string; done: boolean }
interface TodoState {
items: Todo[]
filter: 'all' | 'active' | 'done'
addTodo: (text: string) => void
toggleTodo: (id: string) => void
clearCompleted: () => void
}

export const useTodoStore = create<TodoState>()(
devtools(
persist(
immer((set) => ({
items: [],
filter: 'all',
addTodo: (text) => set((state) => {
state.items.push({ id: crypto.randomUUID(), text, done: false })
}),
toggleTodo: (id) => set((state) => {
const item = state.items.find(i => i.id === id)
if (item) item.done = !item.done
}),
clearCompleted: () => set((state) => {
state.items = state.items.filter(i => !i.done)
})
})),
{ name: 'todos-storage', storage: createJSONStorage(() => localStorage) }
)
)
)

// Селекторы
export const useFilteredTodos = () =>
useTodoStore(useShallow(s => s.items.filter(i =>
s.filter === 'all' ? true : s.filter === 'active' ? !i.done : i.done
)))

export const useTodoFilter = () => useTodoStore(s => s.filter)

// Component.tsx
'use client'
import { useFilteredTodos, useTodoFilter } from './store'

export function TodoList() {
const todos = useFilteredTodos()
const filter = useTodoFilter()

return (
<ul className="space-y-2">
{todos.map(todo => (
<li key={todo.id} className="flex gap-2">
<span className={todo.done ? 'line-through opacity-50' : ''}>{todo.text}</span>
</li>
))}
{todos.length === 0 && <p className="text-gray-500">No tasks ({filter})</p>}
</ul>
)
}
```