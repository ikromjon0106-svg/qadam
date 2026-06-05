# 🏃‍♂️ Qadam (Antigravity) 

![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.1.0-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.17-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Base44](https://img.shields.io/badge/Base44-SDK_Integrated-black?style=for-the-badge)

**Qadam** — это инновационная мобильная Move-to-Earn (M2E) Web-платформа с элементами геймификации. Приложение мотивирует пользователей больше двигаться, конвертируя пройденные шаги в цифровые монеты. Проект сочетает фитнес-трекинг с уникальными тактическими игровыми механиками: установкой виртуальных бомб на карте, использованием щитов для защиты баланса, выполнением миссий и торговлей на внутреннем маркетплейсе.

---

## 🛠 Технологический Стек

### Фронтенд
*   **Core:** React 18, Vite (с `@base44/vite-plugin`)
*   **Роутинг:** React Router DOM v6
*   **Управление состоянием и кэш:** TanStack React Query v5, React Context API
*   **Стилизация & UI:** Tailwind CSS, Radix UI (Headless UI), Framer Motion (анимации)
*   **Карты и Геолокация:** React-Leaflet v4 (интеграция интерактивных карт для механик с бомбами и маршрутами)
*   **Формы и Валидация:** React Hook Form + Zod
*   **Графики:** Recharts

### Бэкенд Инфраструктура
*   **База Данных:** Supabase (PostgreSQL)
*   **BaaS / SDK:** Base44 SDK (`@base44/sdk`) — управление аутентификацией, сессиями и серверными функциями
*   **Аутентификация:** Изолированный `AuthContext`, проксирующий запросы к `/api/apps/public` через настройки Vite

---

## 🏗 Архитектура и Логика работы

Приложение построено по модульной архитектуре с четким разделением логики (Hooks/API) и представления (Components/Pages). Маршрутизация защищена компонентом `ProtectedRoute`, который бесшовно интегрирован с `base44.auth.me()` для проверки сессий.

### Основные Сущности и Схемы Данных (Data Schemas)

1.  **`UserProfile` (Профиль пользователя)**
    *   Хранит статистику пользователя, текущий баланс монет (Q-Coins), уровень и активные экипированные предметы (например, щиты).
    *   Связан с аутентификацией Base44 SDK.
2.  **`Activity` (Активность / Маршрут)**
    *   Записывает сессии ходьбы или бега.
    *   **Данные:** Координаты маршрута хранятся в формате `JSONB` (GeoJSON LineString) для отрисовки трека на карте с помощью `React-Leaflet`. Также включает метрики: время, дистанция, средняя скорость и заработанные монеты.
3.  **`Bomb` & `Shield` (Тактические элементы)**
    *   `Bomb`: Объекты на карте (MapTracking), имеющие `lat/lng` координаты, радиус поражения и таймер. Если другой пользователь попадает в радиус взрыва без щита, он теряет часть заработанных монет.
    *   `Shield`: Инвентарный предмет, дающий временную или одноразовую неуязвимость от бомб.
4.  **`Mission` (Миссии)**
    *   Ежедневные и еженедельные задания (например, "Пройти 10 000 шагов", "Заложить 2 бомбы").
    *   Имеют статусы: `locked`, `in_progress`, `completed`, `claimed`.
5.  **`Achievement` (Достижения)**
    *   Глобальные награды за долгосрочные цели. Связаны с таблицей профиля (Relation 1-to-Many).

---

## 🚀 Локальное Развертывание

### 1. Предварительные требования
*   Node.js (v18 или выше)
*   npm (v9 или выше)

### 2. Клонирование и установка зависимостей
```bash
git clone <ваш-репозиторий>
cd qadam
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` в корневой директории проекта и добавьте следующие ключи, необходимые для корректной работы Base44 SDK и проксирования запросов:

```env
VITE_BASE44_APP_BASE_URL=https://api.base44.io
VITE_BASE44_APP_ID=6a2270f9b1e691bc8ab87bf6
VITE_BASE44_API_KEY=e61be199655e4b4082a21d46745b077d
# Если используете специфичную версию функций
VITE_BASE44_FUNCTIONS_VERSION=v1 
```

> **Важно:** `vite.config.js` настроен на проксирование локального `/api` на `VITE_BASE44_APP_BASE_URL` для обхода ограничений CORS во время разработки.

### 4. Запуск сервера разработки
```bash
npm run dev
```
Приложение будет доступно по адресу `http://localhost:5173`.

---

## 📦 Скрипты (NPM Scripts)

В `package.json` настроены следующие команды:

*   `npm run dev` — Запуск локального сервера с HMR (Hot Module Replacement).
*   `npm run build` — Оптимизированная сборка проекта для продакшена в папку `dist`.
*   `npm run preview` — Локальный запуск собранной production-версии.
*   `npm run lint` — Проверка кода с помощью ESLint.
*   `npm run lint:fix` — Автоматическое исправление ошибок код-стайла.
*   `npm run typecheck` — Проверка типов TypeScript (через `jsconfig.json`).

---

## 📂 Структура Проекта

```text
qadam/
├── public/                 # Статические ассеты
├── src/
│   ├── api/                # Инициализация и клиенты API (base44Client.js)
│   ├── components/         # Переиспользуемые UI компоненты (Radix UI + Tailwind)
│   │   ├── layout/         # Лейауты страниц (MobileLayout)
│   │   └── ui/             # Базовые атомарные элементы
│   ├── hooks/              # Кастомные React Hooks
│   ├── lib/                # Утилиты, Контексты (AuthContext) и настройки (app-params)
│   ├── pages/              # Основные экраны приложения (MapTracking, Dashboard, etc.)
│   ├── utils/              # Вспомогательные функции форматирования
│   ├── App.jsx             # Корневой компонент с роутингом
│   ├── index.css           # Глобальные стили и переменные темы Tailwind
│   └── main.jsx            # Точка входа React
├── .env                    # Переменные окружения
├── package.json            # Зависимости и скрипты
├── tailwind.config.js      # Конфигурация дизайн-системы Tailwind
└── vite.config.js          # Настройки бандлера и прокси
```

---

## 👨‍💻 Разработчик

*   **Икромжон Косимжонов** — Front-end Developer & UI/UX Designer
*   *Проект "Qadam" (Antigravity)*

---
*Developed with modern web standards and passion for healthy lifestyle.*
