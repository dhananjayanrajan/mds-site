# Directus Extension - Masked Interface

> This is a fork of [directus-extension-masked-interface](https://github.com/dimitrov-adrian/directus-extension-masked-interface) by [Adrian Dimitrov](https://github.com/dimitrov-adrian), updated to support Directus 10 and 11.
>
> Original work copyright (C) 2020 Adrian Dimitrov. Modifications copyright (C) 2026 Ribertec. Licensed under GPL-3.0.

---

![](https://raw.githubusercontent.com/IgorGRibeiro/directus-extension-masked-interface/main/screenshot.gif)

Input text string by template.

## Features

- Masked text input using template patterns, RegEx, or built-in presets
- Compatible with Directus 10 and 11
- Supports string and numeric field types
- Optional masked or unmasked value storage
- Case transformation (uppercase, lowercase, title case)
- Configurable placeholder, icons, and font

## Installation

**Via Directus Marketplace** (recommended): search for "Masked Interface" in the Marketplace.

**Via npm:**

```bash
npm install @ribertec/directus-extension-masked-interface
```

Restart Directus after installation.

## Setup

1. Create a standard field with `string` (or numeric) type
2. For interface select **Masked Input** and configure the options below

### Options

| Option            | Description                                                                |
| ----------------- | -------------------------------------------------------------------------- |
| Placeholder       | Placeholder text shown inside the input                                    |
| Font              | Font family: Sans-serif, Monospace, or Serif                               |
| Icon Left         | Material Design icon displayed on the left                                 |
| Icon Right        | Material Design icon displayed on the right                                |
| Save masked value | When enabled, stores the formatted (masked) value instead of the raw input |
| Format value      | Apply case transformation: none, uppercase, lowercase, or title case       |
| Type              | Masking type — see below                                                   |
| Template          | Pattern string (only for Template and RegEx types)                         |

### Masking types

- **Template** — simplified templating pattern (see legend below)
- **RegEx** — uses a regular expression to define the pattern
- **Presets:**
  - URL
  - Email
  - IP Address (IPv4)
  - MAC Address (`:` separators)
  - VIN
  - SSN

### Template pattern legend

| Character | Meaning               |
| --------- | --------------------- |
| `9`       | Number                |
| `a`       | Lowercase letter      |
| `A`       | Uppercase letter      |
| `*`       | Alphanumeric          |
| `\`       | Escape next character |
| `\|`      | Alternator            |
| `[]`      | Optional group        |
| `()`      | Grouping              |
| `{n,[m]}` | Repeater              |

## How it works

The extension uses [InputMask by @RobinHerbots](https://github.com/RobinHerbots/Inputmask) as the masking library.

## Requirements

- Directus 10 or 11

## License

GPL-3.0 — see [LICENSE](LICENSE) for details.
