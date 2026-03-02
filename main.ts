import { Plugin} from 'obsidian';
import { ExampleView, VIEW_TYPE_EXAMPLE } from './view/example';

export default class ExamplePlugin extends Plugin {
  async onload() {
    this.registerView(
      VIEW_TYPE_EXAMPLE,
      (leaf) => new ExampleView(leaf)
    );

    this.addRibbonIcon("dice", 'Activate view', () => {
      this.activateView();
    });
  }

  async onunload() {
  }

  async activateView() {
    const { workspace } = this.app;

    const leaves = workspace.getLeavesOfType(VIEW_TYPE_EXAMPLE);

    if (leaves.length > 0) {
      // A leaf with our view already exists, use that
      const leaf = leaves[0];
      // "Reveal" the leaf in case it is in a collapsed sidebar
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
    await newLeaf.setViewState({ type: VIEW_TYPE_EXAMPLE, active: true });

    // "Reveal" the leaf in case it is in a collapsed sidebar
    workspace.revealLeaf(newLeaf);
  }
}