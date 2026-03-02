import { Plugin } from 'obsidian';
import { PaletteStore } from './store';
import { PaletteVaultSettingTab } from './settings';
import { DEFAULT_SETTINGS } from './types';
import { PaletteVaultView, VIEW_TYPE_PALETTE_VAULT } from './view';

/**
 * Palette Vault Plugin for Obsidian
 *
 * This plugin provides a dedicated workspace for saving, organizing, and interacting
 * with color palettes directly within Obsidian. Users can create palette cards with
 * 2-4 color blocks, copy colors with a click, and organize palettes into groups.
 */
export default class PaletteVaultPlugin extends Plugin {
  /**
   * The data store for the plugin
   */
  store: PaletteStore;

  /**
   * Called when the plugin is loaded
   * Initializes the store, registers views and commands, and sets up settings
   */
  async onload() {
    // Initialize store
    this.store = new PaletteStore(this);
    await this.store.loadData();

    // Register view
    this.registerView(
      VIEW_TYPE_PALETTE_VAULT,
      (leaf) => new PaletteVaultView(leaf, this.store)
    );

    // Add ribbon icon
    this.addRibbonIcon("dice", 'Open Palette Vault', () => {
      this.activateView();
    });

    // Add commands
    this.addCommand({
      id: 'pv:open-view',
      name: 'Open Palette Vault',
      callback: () => {
        this.activateView();
      }
    });

    this.addCommand({
      id: 'pv:new-card',
      name: 'Create New Palette Card',
      callback: () => {
        // TODO: Implement create new card command
      }
    });

    this.addCommand({
      id: 'pv:copy-last',
      name: 'Copy Last Copied Color',
      callback: () => {
        // TODO: Implement copy last color command
      }
    });

    // Add settings tab
    this.addSettingTab(new PaletteVaultSettingTab(this.app, this));
  }

  /**
   * Called when the plugin is unloaded
   * Currently just a placeholder for future cleanup
   */
  async onunload() {
    // Clean up
  }

  /**
   * Activate the Palette Vault view
   * Either reveals an existing view or creates a new one
   */
  async activateView() {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(VIEW_TYPE_PALETTE_VAULT);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      const leaf = leaves[0];
      workspace.revealLeaf(leaf);
      return;
    }

    // Our view could not be found in the workspace, create a new leaf
    // in the right sidebar for it
    let newLeaf = workspace.getRightLeaf(false);
    if (!newLeaf) {
      // Ensure a leaf exists by creating one if necessary
      newLeaf = workspace.getRightLeaf(true);
    }
    if (!newLeaf) {
      // Could not obtain a leaf, abort activation
      return;
    }
    await newLeaf.setViewState({ type: VIEW_TYPE_PALETTE_VAULT, active: true });

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(newLeaf);
  }
}