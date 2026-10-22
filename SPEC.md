# SPEC: TypeForge Pro (`json-to-types-converter`)

## 1. Product Overview & Value Proposition
`TypeForge Pro` is an offline-first, client-side developer utility for converting arbitrary JSON payloads into strongly-typed models for TypeScript, Go, Rust, Python Pydantic v2, C#, and JSON Schema Draft-07.

It addresses API integration friction, eliminates manual model typing, handles nested object hoisting, and guarantees data privacy by running 100% locally in the browser with zero external network requests.

## 2. Technical Architecture & File Structure
```
json-to-types-converter/
├── assets/
│   └── favicon.svg           # Scalable SVG brand icon
├── css/
│   └── style.css             # High-density IDE-like dark theme layout
├── js/
│   ├── app.js                # Editor binding, DOM updates, copy/download
│   ├── samples.js            # Preloaded API schemas (Stripe, GitHub, E-commerce)
│   └── type-generator.js     # Pure functional AST parser & 6-language code emitter
├── test/
│   └── converter.test.js     # Automated test suite (9 test suites covering all targets)
├── index.html                # Responsive split-pane code editor
├── Dockerfile                # Production Nginx alpine image
├── docker-compose.yml        # Instant container deployment
└── package.json              # NPM metadata & test script
```

## 3. Target Languages & Standards
1. **TypeScript**: Strict interfaces with recursive nested type hoisting and optional property flags (`?`).
2. **Go (Golang)**: Idiomatic structs with PascalCase names and field tags (`json:"...,omitempty"`).
3. **Rust (Serde)**: Full serde attributes (`#[serde(rename = "...")]`), `#[derive(Serialize, Deserialize)]`, and `Option<T>` / `Vec<T>`.
4. **Python (Pydantic v2)**: Pydantic `BaseModel` classes with `Field(alias="...")` and `Optional[T] = None`.
5. **C# (.NET 8)**: Modern record/class definitions with `[JsonPropertyName("...")]`.
6. **JSON Schema Draft-07**: Complete validation specification.
7. **Mock Data Synthesizer**: Generates valid mock JSON matching incoming schema.

## 4. Monetization & Commercial Potential
- **SaaS / Web Tool Organic Traffic**: Free developer tool driving developer mindshare, backlinks, and high SEO search volume ("json to pydantic", "json to serde", "json to go struct").
- **Pro VS Code Extension ($19 - $39 one-time)**: Packaging as a native VS Code extension with right-click "Paste JSON as Types" in the editor.
- **Enterprise Team CLI / NPM Package**: Commercial CLI tool for CI/CD API schema synchronization and contract testing.
- **GitHub Sponsors & Developer Sponsorship**: Monetization through developer community patrons.
