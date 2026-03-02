import { Modal, Setting, App } from 'obsidian';
import { PaletteStore } from '../store';
import { PaletteCard } from '../types';

export class RenameCardModal extends Modal {
  private store: PaletteStore;
  private card: PaletteCard;
  private newName: string;
  private onRename: () => void;

  constructor(app: App, store: PaletteStore, card: PaletteCard, onRename: () => void) {
    super(app);
    this.store = store;
    this.card = card;
    this.newName = card.name;
    this.onRename = onRename;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Rename Palette Card' });

    new Setting(contentEl)
      .setName('Card Name')
      .addText(text => text
        .setPlaceholder('Enter card name')
        .setValue(this.newName)
        .onChange(value => {
          this.newName = value;
        }));

    new Setting(contentEl)
      .addButton(button => button
        .setButtonText('Cancel')
        .onClick(() => {
          this.close();
        }))
      .addButton(button => button
        .setButtonText('Rename')
        .setCta()
        .onClick(async () => {
          if (!this.newName.trim()) {
            alert('Card name cannot be empty');
            return;
          }

          try {
            await this.store.updateCard(this.card.id, { name: this.newName.trim() });
            this.onRename();
            this.close();
          } catch (error) {
            console.error('Error renaming card:', error);
            alert('Error renaming card: ' + (error as Error).message);
          }
        }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}