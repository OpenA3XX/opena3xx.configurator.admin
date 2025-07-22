# 🎨 Table Hover Styling System

## Overview
All tables in the OpenA3XX Configurator Admin application now have comprehensive hover effects that provide smooth, modern interactions with both light and dark theme support.

## Features

### ✨ Automatic Hover Effects
- **Row Lifting**: Tables rows lift up on hover with subtle shadow
- **Smooth Transitions**: 200ms cubic-bezier animations
- **Theme Aware**: Different colors for light and dark themes
- **Button Enhancement**: Buttons scale and get enhanced shadows on row hover
- **Icon Animation**: Icons scale up on hover

### 🎯 Visual Effects

#### Row Hover
- **Light Theme**: Subtle gray background with shadow
- **Dark Theme**: Subtle white overlay with enhanced shadow
- **Transform**: Rows lift up 2px and scale 1.002x
- **Border Radius**: Rounded corners on hover

#### Header Hover
- **Interactive Headers**: Clickable header cells with hover effects
- **Sort Indicators**: Enhanced arrow scaling on sortable columns

#### Button Interactions
- **Nested Enhancement**: Buttons get additional scaling on row hover
- **Individual Hover**: Even more enhancement when hovering buttons directly

## CSS Classes

### Utility Classes
```css
.table-hover-enabled    /* Force enable hover effects */
.table-striped         /* Alternating row colors */
.table-bordered        /* Add borders around table */
.table-interactive     /* Enhanced click interactions */
.table-compact         /* Smaller row heights */
.table-loading         /* Loading overlay */
```

### Usage Examples

#### Basic Table with Hover
```html
<table mat-table [dataSource]="dataSource" class="table-hover-enabled">
  <!-- Table content -->
</table>
```

#### Striped Table with Borders
```html
<table mat-table [dataSource]="dataSource" class="table-striped table-bordered">
  <!-- Table content -->
</table>
```

#### Interactive Compact Table
```html
<table mat-table [dataSource]="dataSource" class="table-interactive table-compact">
  <!-- Table content -->
</table>
```

## Customization

### CSS Custom Properties
```css
:root {
  --table-hover-transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --table-scale-hover: 1.002;
  --table-lift-hover: -2px;
}
```

### Theme Colors
- Light theme hover: `rgba(0, 0, 0, 0.04)`
- Dark theme hover: `rgba(255, 255, 255, 0.08)`
- Primary container: `rgba(100, 181, 246, 0.12)`

## Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance
- Hardware accelerated transforms
- Optimized transitions
- Minimal repaints
- Smooth 60fps animations

---

**All tables automatically inherit these hover effects. No additional configuration required!** 🎉 
