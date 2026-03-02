import { ItemView, WorkspaceLeaf, Menu } from 'obsidian';
import { PaletteStore } from './store';
import { CreateCardModal } from './modals/CreateCardModal';
import { ConfirmDeleteModal } from './modals/ConfirmDeleteModal';
import { RenameCardModal } from './modals/RenameCardModal';
import { PaletteCard } from './types';

/**
 * View type identifier for the Palette Vault view
 */
export const VIEW_TYPE_PALETTE_VAULT = 'palette-vault-view';

/**
 * The main view for the Palette Vault plugin
 *
 * This view displays a grid of color palette cards that users can interact with.
 * Users can create new cards, copy colors, rename cards, and delete cards.
 */
export class PaletteVaultView extends ItemView {
  private store: PaletteStore;

  /**
   * Creates a new PaletteVaultView instance
   * @param leaf The workspace leaf to attach the view to
   * @param store The PaletteStore instance for data management
   */
  constructor(leaf: WorkspaceLeaf, store: PaletteStore) {
    super(leaf);
    this.store = store;
  }

  /**
   * Gets the view type identifier
   * @returns The view type string
   */
  getViewType() {
    return VIEW_TYPE_PALETTE_VAULT;
  }

  /**
   * Gets the display text for the view tab
   * @returns The display text
   */
  getDisplayText() {
    return 'Palette Vault';
  }

  /**
   * Called when the view is opened
   * Renders the main UI including the card grid and toolbar
   */
  async onOpen() {
    const container = this.contentEl;
    container.empty();

    // Create main container
    const mainContainer = container.createDiv({
      cls: 'palette-vault-container'
    });

    // Add header
    const header = mainContainer.createDiv({
      cls: 'palette-vault-header'
    });

    header.createEl('h2', { text: 'Palette Vault' });

    // Add toolbar
    const toolbar = mainContainer.createDiv({
      cls: 'palette-vault-toolbar'
    });

    const addButton = toolbar.createEl('button', {
      text: '+ New Palette',
      cls: 'mod-cta'
    });

    addButton.onclick = () => {
      new CreateCardModal(this.app, this.store).open();
    };

    // Add card grid
    const grid = mainContainer.createDiv({
      cls: 'palette-vault-grid'
    });

    // Load cards from store
    const cards = this.store.getCards();

    if (cards.length === 0) {
      const emptyState = grid.createDiv({
        cls: 'palette-vault-empty'
      });

      emptyState.createEl('p', {
        text: 'No palettes yet. Create your first palette to get started!'
      });
    } else {
      // Render cards
      cards.forEach(card => {
        const cardEl = grid.createDiv({
          cls: 'palette-card'
        });

        // Add card header with overflow menu
        const cardHeader = cardEl.createDiv({
          cls: 'palette-card-header'
        });

        cardHeader.createEl('h3', { text: card.name });

        // Add overflow menu button
        const menuButton = cardHeader.createEl('div', {
          cls: 'palette-card-menu',
          text: '⋮'
        });

        menuButton.onclick = (event) => {
          event.stopPropagation();
          const menu = new Menu();

          menu.addItem(item => {
            item.setTitle('Rename')
              .setIcon('pencil')
              .onClick(() => {
                new RenameCardModal(this.app, this.store, card, () => {
                  // Refresh the view after renaming
                  this.onOpen();
                }).open();
              });
          });

          menu.addItem(item => {
            item.setTitle('Delete')
              .setIcon('trash')
              .onClick(() => {
                if (this.store.getSettings().confirmDelete) {
                  new ConfirmDeleteModal(this.app, this.store, card, () => {
                    // Refresh the view after deletion
                    this.onOpen();
                  }).open();
                } else {
                  // Delete without confirmation
                  this.store.deleteCard(card.id).then(() => {
                    this.onOpen();
                  });
                }
              });
          });

          menu.showAtMouseEvent(event);
        };

        // Add shift+click handler for multi-color copy
        cardEl.addEventListener('click', (event) => {
          if (event.shiftKey) {
            event.preventDefault();
            event.stopPropagation();

            // Get all color values from the card
            const colors = card.blocks.map(block => block.color);
            const separator = this.store.getSettings().multiCopySeparator || ', ';
            const formattedColors = colors.join(separator);

            navigator.clipboard.writeText(formattedColors).then(() => {
              // TODO: Show toast notification
              console.log(`Copied ${colors.length} colors from ${card.name}`);
            });
          }
        });

        const blocksContainer = cardEl.createDiv({
          cls: 'color-blocks'
        });

        card.blocks.forEach(block => {
          const blockEl = blocksContainer.createDiv({
            cls: 'color-block',
            attr: {
              style: `background-color: ${block.color}`
            }
          });

          blockEl.createEl('span', {
            text: block.color,
            cls: 'color-value'
          });

          blockEl.onclick = (event) => {
            event.stopPropagation();
            navigator.clipboard.writeText(block.color);
            // TODO: Show toast notification
            console.log(`Copied ${block.color} to clipboard`);
          };
        });
      });
    }
  }

  /**
   * Called when the view is closed
   * Currently just a placeholder for future cleanup
   */
  async onClose() {
    // Nothing to clean up.
  }
}