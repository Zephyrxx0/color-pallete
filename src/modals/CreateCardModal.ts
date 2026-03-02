import { Modal, Setting, App } from 'obsidian';
import { PaletteStore } from '../store';
import { PaletteCard, ColorBlock } from '../types';

export class CreateCardModal extends Modal {
  private store: PaletteStore;
  private cardName: string;
  private colorBlocks: { color: string; label: string | null }[] = [];

  constructor(app: App, store: PaletteStore) {
    super(app);
    this.store = store;
    this.cardName = '';
    // Initialize with 2 color blocks
    this.colorBlocks = [
      { color: '#FF5733', label: null },
      { color: '#33FF57', label: null }
    ];
  }

  onOpen() {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Create New Palette Card' });

    new Setting(contentEl)
      .setName('Card Name')
      .addText(text => text
        .setPlaceholder('Enter card name')
        .setValue(this.cardName)
        .onChange(value => {
          this.cardName = value;
        }));

    // Color blocks container
    const blocksContainer = contentEl.createDiv({ cls: 'color-blocks-container' });

    this.colorBlocks.forEach((block, index) => {
      const blockSetting = new Setting(blocksContainer)
        .setName(`Color ${index + 1}`)
        .addColorPicker(color => color
          .setValue(block.color)
          .onChange(value => {
            this.colorBlocks[index].color = value;
          }))
        .addText(text => text
          .setPlaceholder('Label (optional)')
          .setValue(block.label || '')
          .onChange(value => {
            this.colorBlocks[index].label = value || null;
          }));

      // Add remove button for blocks beyond the first two
      if (index >= 2) {
        blockSetting.addButton(button => button
          .setButtonText('Remove')
          .onClick(() => {
            this.colorBlocks.splice(index, 1);
            this.onOpen(); // Refresh the modal
          }));
      }
    });

    // Add color button (max 4)
    if (this.colorBlocks.length < 4) {
      new Setting(contentEl)
        .addButton(button => button
          .setButtonText('Add Color')
          .onClick(() => {
            this.colorBlocks.push({ color: '#000000', label: null });
            this.onOpen(); // Refresh the modal
          }));
    }

    // Buttons
    new Setting(contentEl)
      .addButton(button => button
        .setButtonText('Cancel')
        .onClick(() => {
          this.close();
        }))
      .addButton(button => button
        .setButtonText('Create')
        .setCta()
        .onClick(async () => {
          // Validate minimum 2 blocks
          if (this.colorBlocks.length < 2) {
            alert('Cards must have at least 2 color blocks');
            return;
          }

          // Create color blocks with proper structure
          const blocks: ColorBlock[] = this.colorBlocks.map((block, index) => ({
            id: Date.now().toString(36) + Math.random().toString(36).substr(2),
            color: block.color,
            label: block.label,
            labelColor: null,
            order: index
          }));

          // Auto-generate name if none provided
          let name = this.cardName;
          if (!name) {
            name = blocks.map(b => b.color).join(' · ');
          }

          try {
            await this.store.addCard({
              name,
              groupId: null,
              order: this.store.getCards().length,
              blocks
            });

            this.close();
          } catch (error) {
            console.error('Error creating card:', error);
            alert('Error creating card: ' + (error as Error).message);
          }
        }));
  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}