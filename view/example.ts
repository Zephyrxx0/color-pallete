import { ItemView, WorkspaceLeaf } from 'obsidian';

//ui
import createCard from './ui/createCard';

export const VIEW_TYPE_EXAMPLE = 'example-view';

export class ExampleView extends ItemView {
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return VIEW_TYPE_EXAMPLE;
  }

  getDisplayText() {
    return 'example view';
  }

  async onOpen() {
    const container = this.contentEl;
    // container.style.padding = "2rem";
    // container.style.marginTop = "2rem"
    // container.style.marginBottom = "2rem"
    // container.style.marginLeft = "2rem"
    // container.style.marginRight = "2rem"

    container.appendChild(createCard());

  }

  async onClose() {
    // Nothing to clean up.
  }
}