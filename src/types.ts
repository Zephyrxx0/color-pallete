/**
 * Core data interfaces for the Palette Vault plugin
 */

export interface PaletteVaultData {
  version: string;          // Schema version for migration support
  settings: PluginSettings;
  groups: Group[];
  cards: PaletteCard[];
}

export interface PluginSettings {
  copyFormat: 'hex' | 'rgb' | 'rgba' | 'hsl' | 'hsla' | 'cssvar' | 'tailwind';
  hexUppercase: boolean;
  multiCopySeparator: string;
  showHexOnSwatch: boolean;
  swatchHeight: number;
  cardsPerRow: number | 'auto';
  defaultGroup: string | null;
  confirmDelete: boolean;
  showLabelByDefault: boolean;
}

export interface Group {
  id: string;
  name: string;
  collapsed: boolean;
  order: number;
}

export interface PaletteCard {
  id: string;               // UUID
  name: string;
  groupId: string | null;
  order: number;            // Position within group
  createdAt: number;        // Unix timestamp
  updatedAt: number;
  blocks: ColorBlock[];     // Length: 2–4
}

export interface ColorBlock {
  id: string;               // UUID
  color: string;            // Full hex, e.g. "#F4A261"
  label: string | null;     // Optional user label
  labelColor: string | null;// Optional label text color
  order: number;
}

// Default settings
export const DEFAULT_SETTINGS: PluginSettings = {
  copyFormat: 'hex',
  hexUppercase: true,
  multiCopySeparator: ', ',
  showHexOnSwatch: true,
  swatchHeight: 80,
  cardsPerRow: 'auto',
  defaultGroup: null,
  confirmDelete: true,
  showLabelByDefault: false
};