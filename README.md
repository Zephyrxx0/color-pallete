# Palette Vault

An Obsidian plugin for saving, organizing, and interacting with color palettes directly within your vault.

## Features

- **Create Palette Cards**: Save color palettes as cards with 2-4 color blocks each
- **One-Click Copy**: Click any color block to instantly copy its value to your clipboard
- **Multi-Color Copy**: Shift-click a card to copy all colors at once
- **Organize with Groups**: Categorize your palettes into custom groups
- **Theme Integration**: Seamlessly matches your Obsidian theme
- **Full Customization**: Configure copy formats, swatch sizes, and more

## Installation

1. Download the latest release files (`main.js`, `manifest.json`, `styles.css`)
2. Create a folder named `palette-vault` in your Obsidian vault's `.obsidian/plugins/` directory
3. Copy the downloaded files into the `palette-vault` folder
4. Reload Obsidian and enable the plugin in Settings → Community Plugins

## Usage

### Creating a Palette Card

1. Open the Palette Vault view (ribbon icon or command palette)
2. Click the "+ New Palette" button
3. Enter a name for your palette (optional - will auto-generate if left blank)
4. Select colors using the color pickers
5. Add labels to colors if desired
6. Click "Create" to save your palette

### Using Colors

- **Single Color**: Click any color block to copy its value
- **Multiple Colors**: Shift-click a card to copy all colors
- **Rename/Delete**: Use the overflow menu (⋮) on any card

### Settings

Customize the plugin behavior in Obsidian's settings:

- **Copy Format**: Choose between HEX, RGB, RGBA, HSL, HSLA, CSS Variables, or Tailwind classes
- **HEX Format**: Toggle between uppercase and lowercase hex values
- **Multi-copy Separator**: Customize the separator used when copying multiple colors
- **Swatch Display**: Control whether hex values show on swatches
- **Swatch Height**: Adjust the size of color swatches
- **Layout**: Control cards per row or use responsive auto-layout
- **Confirmation**: Toggle delete confirmation dialogs

## Development

### Building the Plugin

1. Clone this repository
2. Install dependencies with `npm install`
3. Build with `npm run build` for production or `npm run dev` for development

### Architecture

The plugin follows a modular architecture:

- `main.ts`: Plugin entry point
- `store.ts`: Data management with PaletteStore class
- `view.ts`: Main view implementation
- `settings.ts`: Settings tab implementation
- `modals/`: Modal dialog implementations
- `types.ts`: TypeScript interfaces and type definitions

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

If you encounter any issues or have feature requests, please [open an issue](https://github.com/yourusername/palette-vault/issues) on GitHub.