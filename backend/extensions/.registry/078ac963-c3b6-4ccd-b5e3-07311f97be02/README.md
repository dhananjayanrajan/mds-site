# Country Selector Extension

A Directus interface extension that provides a comprehensive country selection dropdown with support for country codes, names, and descriptions.

## Features

- **Comprehensive Country List**: Includes all countries with ISO codes and names
- **Search Functionality**: Easy search through countries by name
- **Configurable Selection Modes**: Single or multiple country selection
- **Drag & Drop Reordering**: Reorder selected countries by dragging chips
- **Custom Labels**: Configurable field labels and descriptions
- **Required Field Support**: Optional required field validation
- **JSON Storage**: Stores country data in a structured JSON format
- **Description Support**: Additional description field for each country selection
- **Visual Feedback**: Grab/grabbing cursors and hover effects
- **Directus UI Integration**: Uses Directus theme variables for consistent styling
- **TypeScript Support**: Full TypeScript support with type definitions

## Installation

### From NPM (Recommended)

```bash
npm install directus-extension-country-selector
```

### Manual Installation

1. Download or clone this repository
2. Install dependencies with `npm install`
3. Build the extension with `npm run build`
4. Move the built extension to your Directus extensions folder

## Configuration

The interface has the following configuration options:

### Field Label
Customize the label that appears above the country selector field.

### Description
Add helper text that appears below the field to guide users.

### Required
Mark the field as required for validation purposes.

### Multiple Selection
Enable multiple country selection with drag & drop reordering functionality.

## Usage

1. **Field Setup**:
   - Create a field with type `JSON` (recommended) or `string`
   - Select "Country Selector" as the interface
   - Configure the field label, description, required status, and multiple selection mode

2. **Selection Modes**:
   - **Single Selection**: Traditional dropdown for selecting one country
   - **Multiple Selection**: Dropdown + draggable chips for multiple countries with reordering

3. **Data Storage**:
   The extension stores data in the following JSON format:
   ```json
   {
     "countryCodes": ["US", "GB", "CA"],
     "defaultLocale": "us",
     "description": "Selected countries description"
   }
   ```

4. **Display Options**:
   - **Raw**: Shows the JSON data as stored
   - **Formatted**: Shows the country names in a readable format

## Example Configuration

```javascript
// Single selection configuration
{
  label: "Select Country",
  description: "Choose the country for this record",
  required: true,
  multiple: false
}

// Multiple selection configuration
{
  label: "Select Countries",
  description: "Choose multiple countries and drag to reorder",
  required: false,
  multiple: true
}
```

## Data Format

### Input Format
The extension accepts various input formats:

- **JSON Object**: `{"countryCodes": ["US", "GB"], "defaultLocale": "us", "description": "Selected countries"}`
- **Legacy Single**: `{"countryCode": "US", "defaultLocale": "us", "description": "United States"}`
- **Country Code**: `"US"` (converted to array format)

### Output Format
The extension always outputs data in this structured format:

```json
{
  "countryCodes": ["US", "GB", "CA"],
  "defaultLocale": "us",
  "description": "Selected countries description"
}
```

### Drag & Drop Functionality
- **Reorder**: Drag chips to change the order of selected countries
- **Visual Feedback**: Cursor changes to grab/grabbing during drag operations
- **Order Preservation**: The order in the `countryCodes` array reflects the user's arrangement
- **Default Locale**: Always uses the first country in the array for the `defaultLocale` field

## Country Data

The extension uses the `countries-list` package which provides:

- **250+ Countries**: Complete list of world countries
- **ISO Codes**: Standard ISO 3166-1 alpha-2 country codes
- **Country Names**: Official country names in English
- **Consistent Format**: Standardized data structure

### Example Countries
- 🇺🇸 United States (US)
- 🇬🇧 United Kingdom (GB)
- 🇩🇪 Germany (DE)
- 🇫🇷 France (FR)
- 🇯🇵 Japan (JP)
- 🇨🇦 Canada (CA)
- 🇦🇺 Australia (AU)

## Integration Examples

### Basic Usage
```javascript
// Single country selection
const countryData = {
  countryCodes: ["US"],
  defaultLocale: "us",
  description: "United States of America"
};

// Multiple country selection
const countriesData = {
  countryCodes: ["US", "GB", "CA"],
  defaultLocale: "us",
  description: "Selected countries"
};
```

### With Validation
```javascript
// Required field validation
if (!countryData.countryCodes || countryData.countryCodes.length === 0) {
  throw new Error("At least one country is required");
}
```

### Display Integration
```javascript
// Display all country names
const countryNames = countryData.countryCodes.map(code => 
  countriesList[code]?.name || code
);

// Display primary country name
const primaryCountry = countriesList[countryData.defaultLocale]?.name || countryData.defaultLocale;
```

## Customization

### Styling
The extension uses Directus theme variables for consistent styling:

```css
.country-selector {
  color: var(--theme-foreground);
  font-size: var(--theme-font-size-base);
}

.country-dropdown {
  background: var(--theme-background-subdued);
  border: var(--theme-border-width) solid var(--theme-border-color);
}
```

### Custom Country List
You can extend the country list by modifying the component:

```javascript
// Add custom countries
const customCountries = [
  { text: "Custom Country", value: "CC" },
  ...countries.value
];
```

## Compatibility

- Directus 11.x and later
- Field types: JSON (recommended) or string
- Node.js >= 16.0.0

## Development

### Project Setup

The project requires `@directus/extensions-sdk` to be installed as a development dependency:

```bash
npm install --save-dev @directus/extensions-sdk
```

### Build Commands

```bash
# Build for production
npm run build

# Build for development (watch mode)
npm run dev

# Prepare for publishing
npm run prepublishOnly
```

### Project Structure

```
src/
├── interface.vue        # Main interface component
└── index.ts            # Extension entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

