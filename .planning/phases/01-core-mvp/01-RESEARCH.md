# Phase 1: Core MVP - Research

**Researched:** 2026-03-02
**Researcher:** Claude
**Status:** Complete

<domain>
## Plugin Architecture

Obsidian plugins follow a standard structure with a main.ts file that extends the Plugin class. The plugin lifecycle includes onload() for initialization and onunload() for cleanup. Views are implemented using ItemView and registered with the workspace.

Key architectural considerations:
- Use vanilla DOM manipulation rather than frameworks for compatibility
- Leverage Obsidian's built-in Modal class for dialogs
- Store data using plugin.loadData() and plugin.saveData()
- Use CSS variables for theme integration
- Follow Obsidian's established patterns for ribbon icons, commands, and settings
</domain>

<implementation>
## Implementation Approach

### Data Model
Following the TypeScript interfaces defined in the PRD:
```typescript
interface PaletteVaultData {
  version: string;
  settings: PluginSettings;
  groups: Group[];
  cards: PaletteCard[];
}

interface PaletteCard {
  id: string;               // UUID
  name: string;
  groupId: string | null;
  order: number;
  createdAt: number;
  updatedAt: number;
  blocks: ColorBlock[];     // Length: 2-4
}

interface ColorBlock {
  id: string;
  color: string;            // Full hex, e.g. "#F4A261"
  label: string | null;
  labelColor: string | null;
  order: number;
}
```

### Component Structure
```
PaletteVaultView (ItemView)
├── Toolbar
├── CardGrid
    ├── PaletteCard
    │   ├── ColorBlock
    │   └── ColorBlock
    └── PaletteCard
        ├── ColorBlock
        ├── ColorBlock
        ├── ColorBlock
        └── ColorBlock
```

### Storage Strategy
- Use plugin.loadData() to load all data at startup
- Use plugin.saveData() to persist changes
- Implement a PaletteStore class with CRUD operations
- Include data migration support for version changes
- Handle data corruption gracefully with fallbacks

### Event System
- Use EventEmitter for state change notifications
- Views subscribe to store changes for re-rendering
- Minimize full re-renders through targeted updates
</implementation>

<prior_art>
## Obsidian Plugin Patterns

Reviewing several popular Obsidian plugins reveals common patterns:

1. **View Registration**: Most plugins register custom views using ItemView
2. **Data Storage**: Universal use of loadData()/saveData() with JSON serialization
3. **Settings**: Standard settings tabs extending PluginSettingTab
4. **Modals**: Extension of Modal class for consistent theming
5. **Commands**: Registration through addCommand() with unique IDs
6. **Event Handling**: Use of registerEvent() for proper cleanup
7. **DOM Manipulation**: Direct createElement() usage rather than frameworks
8. **Styling**: CSS variables for theme integration, minimal hardcoded colors
</prior_art>

<validation_architecture>
## Validation Architecture

### Functional Testing
- Card creation with 2-4 color blocks enforced
- Click-to-copy functionality works correctly
- Data persistence across plugin reloads
- Settings changes take effect immediately
- Edge cases handled (empty names, duplicate names, etc.)

### UI Testing
- Cards display correctly in grid layout
- Color blocks render with proper dimensions
- Hover states provide visual feedback
- Theme integration adapts to light/dark modes
- Responsive design works at various panel widths

### Data Integrity
- UUID generation for all entities
- Timestamps for creation/update tracking
- Proper JSON serialization/deserialization
- Migration path for schema changes
- Graceful degradation for corrupted data
</validation_architecture>

<tradeoffs>
## Tradeoffs and Considerations

### Framework vs Vanilla
**Vanilla DOM**: Pros - No dependencies, smaller bundle, better performance. Cons - More boilerplate code.
**Svelte**: Pros - Less code, reactive updates. Cons - Additional dependency, potential compatibility issues.

CHOSEN: Vanilla DOM to align with Obsidian plugin conventions and minimize dependencies.

### State Management
**Simple Store**: Pros - Lightweight, easy to understand. Cons - Manual re-rendering required.
**Complex State Library**: Pros - Automatic updates, sophisticated patterns. Cons - Overkill for this scope.

CHOSEN: Simple PaletteStore with EventEmitter for change notifications.

### Storage Strategy
**Single Object**: Pros - Simple implementation, atomic saves. Cons - Potential race conditions with frequent updates.
**Granular Storage**: Pros - Better performance for large datasets. Cons - Complexity in implementation.

CHOSEN: Single object storage with debounced saves for performance balance.
</tradeoffs>

<risks>
## Implementation Risks

1. **Performance**: Large numbers of cards could impact rendering performance
   - Mitigation: Consider virtualization if needed in later phases

2. **Data Corruption**: Malformed JSON could break the plugin
   - Mitigation: Implement graceful fallbacks and error handling

3. **Theme Compatibility**: CSS might not work well with all themes
   - Mitigation: Extensive use of Obsidian CSS variables and testing

4. **Mobile Compatibility**: Touch interactions differ from desktop
   - Mitigation: Use native HTML elements where possible

5. **Clipboard Permissions**: Copy functionality might fail in some environments
   - Mitigation: Provide clear error messages and fallbacks
</risks>

<recommendations>
## Recommendations

1. **Start Simple**: Begin with basic card creation/deletion and copy functionality
2. **Iterate Quickly**: Focus on core functionality before adding enhancements
3. **Test Early**: Validate with different themes and on mobile devices
4. **Follow Conventions**: Adhere to Obsidian's established patterns for consistency
5. **Plan for Growth**: Structure code to accommodate future features
6. **Document Well**: Include clear comments for future maintenance
7. **Handle Errors**: Provide graceful degradation for edge cases
</recommendations>