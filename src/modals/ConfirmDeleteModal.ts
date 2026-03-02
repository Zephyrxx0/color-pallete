import { Modal, Setting, App } from 'obsidian';
import { PaletteStore } from '../store';
import { PaletteCard } from '../types';

export class ConfirmDeleteModal extends Modal {
  private store: PaletteStore;
  private card: PaletteCard;
  private onConfirm: () => void;

  constructor(app: App, store: PaletteStore, card: PaletteCard, onConfirm: () => void) {
    super(app);
    this.store = store;
    this.card = card;
    this.onConfirm = onConfirm;
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Delete Palette Card' });

    contentEl.createEl('p', {
      text: `Are you sure you want to delete "${this.card.name}"? This action cannot be undone.`
    });

    new Setting(contentEl)
      .addButton(button => button
        .setButtonText('Cancel')
        .onClick(() => {
          this.close();
        }))
      .addButton(button => button
        .setButtonText('Delete')
        .setWarning()
        .onClick(async () => {
          try {
            await this.store.deleteCard(this.card.id);
            this.onConfirm();
            this.close();
          } catch (error) {
            console.error('Error deleting card:', error);
            alert('Error deleting card: ' + (error as Error).message);
          }
        }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}