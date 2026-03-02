import { Plugin } from 'obsidian';
import { PaletteVaultData, PaletteCard, Group, ColorBlock, DEFAULT_SETTINGS } from './types';

/**
 * PaletteStore manages all plugin data using Obsidian's data API
 *
 * This class provides a centralized way to manage palette cards, groups, and settings.
 * It handles loading and saving data to Obsidian's persistent storage, and provides
 * CRUD operations for all data entities.
 */
export class PaletteStore {
  private plugin: Plugin;
  private data: PaletteVaultData;

  /**
   * Creates a new PaletteStore instance
   * @param plugin The Obsidian plugin instance
   */
  constructor(plugin: Plugin) {
    this.plugin = plugin;
    this.data = {
      version: '1.0.0',
      settings: DEFAULT_SETTINGS,
      groups: [],
      cards: []
    };
  }

  /**
   * Load data from Obsidian's storage
   * This should be called when the plugin is loaded
   */
  async loadData(): Promise<void> {
    this.data = Object.assign({}, this.data, await this.plugin.loadData());
  }

  /**
   * Save data to Obsidian's storage
   * This should be called after any data modification
   */
  async saveData(): Promise<void> {
    await this.plugin.saveData(this.data);
  }

  /**
   * Get all data
   * @returns The complete PaletteVaultData object
   */
  getAll(): PaletteVaultData {
    return this.data;
  }

  /**
   * Get settings
   * @returns The current plugin settings
   */
  getSettings() {
    return this.data.settings;
  }

  /**
   * Update settings
   * @param settings Partial settings object with updated values
   */
  async updateSettings(settings: Partial<PaletteVaultData['settings']>) {
    this.data.settings = { ...this.data.settings, ...settings };
    await this.saveData();
  }

  /**
   * Get all cards
   * @returns Array of all palette cards
   */
  getCards(): PaletteCard[] {
    return this.data.cards;
  }

  /**
   * Add a new card
   * @param card The card data (without id, createdAt, updatedAt)
   * @returns The created card with generated id and timestamps
   * @throws Error if card has less than 2 or more than 4 blocks
   */
  async addCard(card: Omit<PaletteCard, 'id' | 'createdAt' | 'updatedAt'>): Promise<PaletteCard> {
    // Validate card has 2-4 blocks
    if (card.blocks.length < 2 || card.blocks.length > 4) {
      throw new Error('Cards must have between 2 and 4 color blocks');
    }

    const newCard: PaletteCard = {
      id: this.generateId(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...card
    };

    this.data.cards.push(newCard);
    await this.saveData();
    return newCard;
  }

  /**
   * Update a card
   * @param id The id of the card to update
   * @param updates Partial card object with updated values
   * @throws Error if card with given id is not found
   */
  async updateCard(id: string, updates: Partial<PaletteCard>): Promise<void> {
    const cardIndex = this.data.cards.findIndex(card => card.id === id);
    if (cardIndex === -1) {
      throw new Error(`Card with id ${id} not found`);
    }

    this.data.cards[cardIndex] = {
      ...this.data.cards[cardIndex],
      ...updates,
      updatedAt: Date.now()
    };

    await this.saveData();
  }

  /**
   * Delete a card
   * @param id The id of the card to delete
   */
  async deleteCard(id: string): Promise<void> {
    this.data.cards = this.data.cards.filter(card => card.id !== id);
    await this.saveData();
  }

  /**
   * Get all groups
   * @returns Array of all groups
   */
  getGroups(): Group[] {
    return this.data.groups;
  }

  /**
   * Add a new group
   * @param group The group data (without id)
   * @returns The created group with generated id
   */
  async addGroup(group: Omit<Group, 'id'>): Promise<Group> {
    const newGroup: Group = {
      id: this.generateId(),
      ...group
    };

    this.data.groups.push(newGroup);
    await this.saveData();
    return newGroup;
  }

  /**
   * Update a group
   * @param id The id of the group to update
   * @param updates Partial group object with updated values
   * @throws Error if group with given id is not found
   */
  async updateGroup(id: string, updates: Partial<Group>): Promise<void> {
    const groupIndex = this.data.groups.findIndex(group => group.id === id);
    if (groupIndex === -1) {
      throw new Error(`Group with id ${id} not found`);
    }

    this.data.groups[groupIndex] = {
      ...this.data.groups[groupIndex],
      ...updates
    };

    await this.saveData();
  }

  /**
   * Delete a group
   * @param id The id of the group to delete
   */
  async deleteGroup(id: string): Promise<void> {
    // Remove group
    this.data.groups = this.data.groups.filter(group => group.id !== id);

    // Move cards in this group to ungrouped
    this.data.cards = this.data.cards.map(card => {
      if (card.groupId === id) {
        return { ...card, groupId: null };
      }
      return card;
    });

    await this.saveData();
  }

  /**
   * Generate a unique ID
   * @returns A unique string ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}