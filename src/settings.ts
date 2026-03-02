import { PluginSettingTab, Setting, App } from 'obsidian';
import PaletteVaultPlugin from './main';
import { DEFAULT_SETTINGS } from './types';

export class PaletteVaultSettingTab extends PluginSettingTab {
  plugin: PaletteVaultPlugin;

  constructor(app: App, plugin: PaletteVaultPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    containerEl.createEl('h2', { text: 'Palette Vault Settings' });

    new Setting(containerEl)
      .setName('Copy Format')
      .setDesc('Format for copied color values')
      .addDropdown(dropdown => dropdown
        .addOption('hex', 'HEX')
        .addOption('rgb', 'RGB')
        .addOption('rgba', 'RGBA')
        .addOption('hsl', 'HSL')
        .addOption('hsla', 'HSLA')
        .addOption('cssvar', 'CSS Variable')
        .addOption('tailwind', 'Tailwind Arbitrary')
        .setValue(this.plugin.store.getSettings().copyFormat)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ copyFormat: value as any });
        }));

    new Setting(containerEl)
      .setName('HEX Format')
      .setDesc('Uppercase or lowercase hex values')
      .addToggle(toggle => toggle
        .setValue(this.plugin.store.getSettings().hexUppercase)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ hexUppercase: value });
        }));

    new Setting(containerEl)
      .setName('Multi-copy Separator')
      .setDesc('Separator between colors on Shift+click')
      .addText(text => text
        .setPlaceholder(', ')
        .setValue(this.plugin.store.getSettings().multiCopySeparator)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ multiCopySeparator: value });
        }));

    new Setting(containerEl)
      .setName('Show hex value on swatch')
      .setDesc('Shows hex below each swatch in normal view')
      .addToggle(toggle => toggle
        .setValue(this.plugin.store.getSettings().showHexOnSwatch)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ showHexOnSwatch: value });
        }));

    new Setting(containerEl)
      .setName('Swatch height')
      .setDesc('Height of color swatches (48px-160px)')
      .addSlider(slider => slider
        .setLimits(48, 160, 1)
        .setValue(this.plugin.store.getSettings().swatchHeight)
        .setDynamicTooltip()
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ swatchHeight: value });
        }));

    new Setting(containerEl)
      .setName('Cards per row')
      .setDesc('Fixed column count or responsive auto')
      .addDropdown(dropdown => dropdown
        .addOption('auto', 'Auto')
        .addOption('1', '1')
        .addOption('2', '2')
        .addOption('3', '3')
        .addOption('4', '4')
        .setValue(String(this.plugin.store.getSettings().cardsPerRow))
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({
            cardsPerRow: value === 'auto' ? 'auto' : parseInt(value)
          });
        }));

    new Setting(containerEl)
      .setName('Confirm before deleting cards')
      .setDesc('Show confirmation modal before deletion')
      .addToggle(toggle => toggle
        .setValue(this.plugin.store.getSettings().confirmDelete)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ confirmDelete: value });
        }));

    new Setting(containerEl)
      .setName('Show label by default')
      .setDesc('New blocks include a label field by default')
      .addToggle(toggle => toggle
        .setValue(this.plugin.store.getSettings().showLabelByDefault)
        .onChange(async (value) => {
          await this.plugin.store.updateSettings({ showLabelByDefault: value });
        }));
  }
}