# Natura11y React Starter Components Library - Upgrade Plan

## Project Overview
Updating Natura11y React Starter Components Library from outdated versions to current standards.
- **Philosophy**: Complement the Natura11y framework with React integration where it makes sense
- **Shared CSS**: All styles come from the vanilla Natura11y framework
- **Focus**: React components that integrate seamlessly with Natura11y's accessibility-first approach

## Current State Analysis

### Current Versions
- **Natura11y**: `2.2.3` → **Target**: `4.2.0` (major upgrade needed)
- **React**: `18.2.0` (current, good)
- **React Scripts**: `5.0.1` (can be updated)
- **Node Modules**: Standard Create React App setup

### Project Structure
```
src/
├── components/
│   ├── _ui/           # UI utilities (Backdrop, Header, Home, etc.)
│   └── natura11y/     # React components wrapping Natura11y
│       ├── accordion/
│       ├── alert/
│       ├── button/
│       ├── form/
│       ├── icon/
│       ├── lightbox/
│       ├── modal/
│       ├── navigation/
│       ├── tab/
│       └── table/
├── context/           # React contexts (LightboxContext)
└── utilities/         # Helper functions (filter, focus, overlay)
```

### Key Findings
- 2 major versions behind on Natura11y (v2.2.3 → v4.2.0)
- Well-organized component structure
- Using JavaScript (.js) files rather than TypeScript
- Components follow React patterns with proper context usage

## Upgrade Plan

### Phase 1: Core Dependencies Update
**Status**: Pending

#### Tasks:
- [ ] Update Natura11y: `2.2.3` → `4.2.0`
- [ ] Update React Scripts: `5.0.1` → latest
- [ ] Update testing libraries (@testing-library/*)
- [ ] Update build tools (Sass, etc.)
- [ ] Update React Router DOM if needed
- [ ] Check for peer dependency conflicts

#### Commands to run:
```bash
npm update
npm audit fix
```

### Phase 2: Breaking Changes Analysis
**Status**: Pending

#### Tasks:
- [ ] Review Natura11y v4 CSS changes
- [ ] Identify JavaScript API changes
- [ ] Check CDN links and resource paths
- [ ] Review accessibility improvements in v4
- [ ] Document component-specific changes needed

#### Research Areas:
- CSS class naming conventions
- JavaScript module imports/exports
- Icon system changes
- Theme/customization changes

### Phase 3: Component Migration
**Status**: Pending

#### Components to Review & Update:
- [ ] **Accordion** (`/accordion/Accordion.js`, `/accordion/AccordionItem.js`)
- [ ] **Alert** (`/alert/Alert.js`, `/alert/AlertParent.js`)
- [ ] **Button** (`/button/ButtonIconOnly.js`, `/button/ButtonIconOverText.js`)
- [ ] **Form** (`/form/Form.js`, `/form/FormEntry.js`, `/form/FormValidation.js`)
- [ ] **Icon** (`/icon/Icon.js`)
- [ ] **Lightbox** (`/lightbox/Lightbox.js`, `/lightbox/LightboxButton.js`)
- [ ] **Modal** (`/modal/Modal.js`, `/modal/ModalParent.js`)
- [ ] **Navigation** (`/navigation/Brand.js`, `/navigation/Dropdown.js`, `/navigation/PrimaryNavigation.js`)
- [ ] **Tab** (`/tab/TabPanel.js`, `/tab/Tabs.js`, `/tab/TabsNav.js`)
- [ ] **Table** (`/table/Table.js`, `/table/TableScroll.js`)

#### Migration Strategy:
1. Create backup branch
2. Update one component family at a time
3. Test each component individually
4. Maintain React patterns and accessibility features

### Phase 4: Testing & Validation
**Status**: Pending

#### Tasks:
- [ ] Visual regression testing
- [ ] Functional testing of interactive components
- [ ] Accessibility testing (WCAG compliance)
- [ ] Cross-browser testing
- [ ] Mobile responsiveness testing
- [ ] Performance testing

#### Test Commands:
```bash
npm test
npm run build
# Add any accessibility testing commands
```

### Phase 5: Documentation & Cleanup
**Status**: Pending

#### Tasks:
- [ ] Update README.md with new version info
- [ ] Update package.json description and keywords
- [ ] Clean up deprecated patterns
- [ ] Optimize build process
- [ ] Update examples and demos
- [ ] Document migration notes for other developers

## Implementation Notes

### CDN References (Natura11y v4)
- Icons: `https://cdn.jsdelivr.net/npm/natura11y-icons@v2/dist/natura11y-icons.min.css`
- Stylesheet: `https://cdn.jsdelivr.net/gh/cavidano/natura11y@4.0/dist/css/natura11y.min.css`
- JavaScript: `https://cdn.jsdelivr.net/gh/cavidano/natura11y@4.0/dist/js/natura11y.min.js`

### Development Approach
1. **Incremental Updates**: Update dependencies one at a time
2. **Component Isolation**: Test each component individually
3. **Backward Compatibility**: Maintain existing API where possible
4. **Accessibility First**: Ensure all a11y features are preserved/enhanced

### Risk Mitigation
- Create feature branch for all changes
- Maintain comprehensive testing
- Document all breaking changes
- Keep rollback plan ready

## Resources
- [Natura11y Documentation](https://gonatura11y.com/)
- [Natura11y React Docs](https://gonatura11y.com/docs/react)
- [Natura11y GitHub Repository](https://github.com/cavidano/natura11y)
- [React 18 Documentation](https://react.dev/)

## Next Steps
1. Begin Phase 1: Core Dependencies Update
2. Research Natura11y v4 breaking changes
3. Set up testing environment
4. Create migration timeline

---
*Last Updated: August 14, 2025*
*Project: Natura11y React Starter Components Library*