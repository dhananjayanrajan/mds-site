# Directus Extension Typograf

A custom interface for Directus CMS that adds a text field with a typography button. Applies language-specific typography rules using the [typograf](https://github.com/typograf/typograf) library.

![Screenshot](https://raw.githubusercontent.com/antonko/directus-extension-typograf/main/screen.png)

## Installation

Search for **"typograf"** in Settings → Extensions → Marketplace.

Or install manually:

```bash
npm install directus-extension-typograf
```

## Features

- **4 Editor Types**: Input, Textarea, WYSIWYG (HTML), Markdown
- **27 Languages**: Full typography support for multiple languages
- **Auto Language Detection**: Automatically detects language from the `languages_code` field in translations
- **Safe Processing**: Preserves HTML and Markdown structure during typographing
- **Smart Constraints**: Only Input is available for `string` fields; all editors for `text` fields

## What It Does

- Replaces straight quotes with language-appropriate quotation marks (e.g., «ёлочки» for Russian, "curly quotes" for English)
- Converts hyphens to proper dashes where needed
- Adds non-breaking spaces after short words
- Fixes multiple consecutive spaces
- And many more language-specific typography rules

## Supported Languages

| Language     | Code    | Language  | Code |
| ------------ | ------- | --------- | ---- |
| Belarusian   | `be`    | Italian   | `it` |
| Bulgarian    | `bg`    | Latvian   | `lv` |
| Catalan      | `ca`    | Dutch     | `nl` |
| Czech        | `cs`    | Norwegian | `no` |
| Danish       | `da`    | Polish    | `pl` |
| German       | `de`    | Romanian  | `ro` |
| Greek        | `el`    | Russian   | `ru` |
| English (UK) | `en-GB` | Serbian   | `sr` |
| English (US) | `en-US` | Slovak    | `sk` |
| Esperanto    | `eo`    | Slovenian | `sl` |
| Spanish      | `es`    | Swedish   | `sv` |
| Estonian     | `et`    | Turkish   | `tr` |
| Finnish      | `fi`    | Ukrainian | `uk` |
| French       | `fr`    |           |      |
| Hungarian    | `hu`    |           |      |
| Irish        | `ga`    |           |      |

## Usage

1. Go to your collection settings in Directus Admin
2. Create or edit a field of type `string` or `text`
3. Select **Typograf Input** as the interface
4. Configure options:
   - **Editor Type**: Input / Textarea / WYSIWYG / Markdown
   - **Locale**: Auto (from translations) or select a specific language
   - **Placeholder**: Optional hint text
5. When editing an item, click the typography button to apply rules

> **Note**: For `string` (VARCHAR) fields, only single-line Input is available. For `text` (TEXT) fields, all editor types are available.

## Development

### Requirements

- Node.js 18+
- Docker + Docker Compose

### Running Locally

1. Start Directus in Docker:

```bash
docker compose up
```

2. In a separate terminal, start extension dev mode:

```bash
cd extensions/directus-extension-typograf
npm run dev
```

3. Open Directus: http://localhost:8055

### Building

```bash
cd extensions/directus-extension-typograf
npm run build
```

## Technologies

- Directus 11.5.1
- Vue 3 (Composition API)
- TypeScript
- [typograf](https://github.com/typograf/typograf) 7.6.0

## License

Apache-2.0
