# ⚡ TypeForge Pro — JSON to Multi-Language Schema & Type Synthesizer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Pure Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%2F%20CSS3%20%2F%20Vanilla%20JS-F7DF1E.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero External Dependencies](https://img.shields.io/badge/Dependencies-Zero-10B981.svg)](package.json)
[![Status: Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success.svg)]()

> **Instant, zero-dependency schema inspector and multi-language type generator.** Convert raw JSON payloads into production-grade type definitions for **TypeScript**, **Go (Golang)**, **Rust (Serde)**, **Python (Pydantic v2)**, **C# (.NET)**, and **JSON Schema (draft-07)**.

---

## 🌐 English Description

### 🎯 The Problem
Software engineers spend countless hours manually typing API responses, writing boilerplate struct tags (`json:"..."`, `#[serde(rename = "...")]`), and debugging schema mismatches across frontend and backend services. Online converters are often bloated with ads, require server uploads (leaking sensitive data), or lack nested type hoisting.

### 💡 The Solution
**TypeForge Pro** is a 100% offline, privacy-first developer utility. Your data never leaves your browser. It automatically analyzes nested structures, handles heterogeneous arrays, resolves optional fields, and outputs clean, idiomatic code for 5 major programming languages simultaneously.

---

### ✨ Features
- 🚀 **5 Target Languages + Schema Standards**:
  - **TypeScript**: `export interface` with hoisted nested types, optional properties (`?`), and clean naming.
  - **Go (Golang)**: `type Struct struct` with PascalCase field names and `json:"...,omitempty"` struct tags.
  - **Rust**: `#[derive(Default, Debug, Clone, PartialEq, Serialize, Deserialize)]` with `#[serde(rename = "...")]` and `Vec<T>` / `Option<T>`.
  - **Python (Pydantic v2)**: `class Model(BaseModel)` with `Optional[T] = None`, `List[T]`, and `Field(alias="...")`.
  - **C# (.NET)**: `[JsonPropertyName("...")]` with nullable reference types (`string?`, `long?`).
  - **JSON Schema**: Full Draft-07 declarative validation schema.
- 🧪 **Mock Data Generator**:
  - Automatically synthesizes randomized, realistic mock JSON records matching your schema.
- 🌳 **Interactive Collapsible AST Tree**:
  - Visual hierarchical key inspector with color-coded type badges (`string`, `number`, `boolean`, `object`, `array`, `null`).
- 📊 **Payload Health Metrics**:
  - Displays total properties, maximum nesting depth, and calculated byte payload size.
- 🛠️ **Developer Convenience Toolbar**:
  - Format (Beautify), Minify, and Clear controls.
  - One-click Copy to clipboard.
  - Direct file download with appropriate extensions (`.ts`, `.go`, `.rs`, `.py`, `.cs`, `.json`).
- 📁 **Pre-loaded Industry API Payloads**:
  - *E-Commerce Order API*
  - *GitHub Repository API*
  - *Stripe Payment Intent*

---

### 🚀 Quickstart (Run in 2 Clicks)

#### Option 1: Open Directly
Double-click `index.html` in your file browser, or run:
```bash
# Windows PowerShell
Start-Process index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

#### Option 2: Local Server
```bash
npx serve .
# Or Python
python -m http.server 3000
```

#### Run Automated Test Suite
```bash
node test/converter.test.js
```

---

## 🇷🇺 Русское описание

### 🎯 Какую проблему решает?
Разработчики тратят часы на ручной перевод JSON-ответов от сторонних API в типизированные структуры кода на TypeScript, Go, Rust или Python, постоянно допуская ошибки в camelCase/snake_case или забывая расставить теги сериализации. Большинство существующих сервисов отправляют ваши конфиденциальные данные на свои серверы.

### 💡 Решение
**TypeForge Pro** — автономный, приватный инструмент на чистом JavaScript. Все вычисления производятся исключительно в вашем браузере. Вы вставляете любой JSON (или выбираете готовый пресет) и моментально получаете чистый, идиоматичный код для 5 популярных языков программирования, а также визуальное дерево схемы и генератор моковых данных.

---

### ✨ Главные возможности
1. **Генерация типов под 5 языков**:
   - **TypeScript**: Чистые интерфейсы с вынесением вложенных структур в отдельные типы.
   - **Go**: Структуры с тегами `json:"field_name,omitempty"`.
   - **Rust**: Структуры с serde-макросами `#[derive(...)]` и атрибутами `#[serde(rename = "...")]`.
   - **Python**: Модели Pydantic v2 с поддержкой аннотаций типов `Field(alias="...")`.
   - **C#**: Классы с атрибутами `[JsonPropertyName("...")]`.
   - **JSON Schema**: Официальный формат валидации draft-07.
2. **Интерактивное дерево структуры (AST)**:
   - Сворачиваемые узлы с цветовой индикацией типов данных.
3. **Генератор тестовых данных (Mock Generator)**:
   - Создание пачки фейковых данных на основе структуры вашего JSON.
4. **Анализ полезной нагрузки**:
   - Подсчет общего числа ключей, глубины вложенности и размера в байтах.
5. **Экспорт**:
   - Копирование в буфер и скачивание готового файла (`.ts`, `.go`, `.rs`, `.py`, `.cs`, `.json`).

---

### 🚀 Запуск в 2 клика

Просто откройте файл `index.html` в любом браузере. Работает 100% автономно без интернета.

Запуск авто-тестов:
```powershell
node test/converter.test.js
```

---

## 📄 License
MIT License. Free for commercial and personal projects.
