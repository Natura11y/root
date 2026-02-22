# Natura11y React Navigation Components

This directory contains React components that provide navigation functionality for the Natura11y framework, mirroring the vanilla JavaScript implementation while leveraging React's component system.

## Components

### Brand
A simple component that renders the brand logo/name. Currently displays a placeholder SVG logo.

### Dropdown
A dropdown component that supports two patterns:

- **Standard Dropdown**: Shows a button that opens a dropdown menu
- **Dropdown with Page Link**: Uses the `.nav-link-dropdown` pattern from vanilla Natura11y to combine a page link with dropdown functionality

#### Props
- `title` (string): The text displayed on the dropdown button/link
- `to` (string, optional): Route path for the main navigation link
- `items` (array): Array of dropdown items with `to` and `label` properties
- `hover` (boolean): Enable hover-based dropdown opening

#### Usage Examples

```jsx
// Standard dropdown
<Dropdown 
    title="Components"
    items={componentItems}
    hover={true}
/>

// Dropdown with page link (uses nav-link-dropdown pattern)
<Dropdown 
    title="Company"
    to="/company"
    items={companyItems}
    hover={true}
/>
```

### MegaMenu
A mega menu component for complex navigation structures with multiple columns and sections.

#### Props
- `breakpoint` (string): CSS breakpoint for responsive behavior
- `children`: The mega menu content

#### Usage Example

```jsx
<MegaMenu breakpoint="lg">
    <div className="container">
        <div className="grid grid--column-3--lg gap-4">
            {/* Mega menu content */}
        </div>
    </div>
</MegaMenu>
```

### MainMenu
The main navigation component that orchestrates all navigation elements.

#### Props
- `navType` (string): Navigation layout type ('inline' or 'below')
- `breakpoint` (string): CSS breakpoint for responsive behavior
- `includeSearch` (boolean): Show search functionality
- `includeMegaMenu` (boolean): Show mega menu functionality
- `utilities` (string): Natura11y utility classes

### NavigationExample
A demonstration component showing the key navigation patterns.

## Key Features

### Accessibility
- ARIA attributes for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure

### Responsive Design
- Mobile-first approach
- Breakpoint-based behavior
- Touch-friendly interactions

### Framework Integration
- Uses exact same CSS classes as vanilla Natura11y
- Leverages existing Natura11y JavaScript utilities
- Maintains consistent behavior and styling

## CSS Classes Used

The components use these exact Natura11y CSS classes:

- `.nav-link-dropdown` - Wrapper for link + dropdown pattern
- `.nav__dropdown` - Dropdown menu container
- `.mega-menu` - Mega menu container
- `.main-menu--*` - Primary navigation layout classes
- `.shown` - State class for visible dropdowns/menus

## Integration with Natura11y

These components use the same CSS classes and JavaScript utilities as the vanilla Natura11y framework, ensuring consistent styling and behavior while providing React-specific enhancements.

## Browser Support

Compatible with all browsers supported by Natura11y v4.2.0+ and React 18+.
