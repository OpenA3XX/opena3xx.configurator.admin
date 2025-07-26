# Image Dark Mode Support

The OpenA3XX Flight Deck includes comprehensive support for dark mode images and logos, ensuring optimal visibility and contrast in both light and dark themes.

## Features

### 🎨 Logo Management
- **Separate Logo Files** - Uses different logo files for light and dark themes
- **Automatic Switching** - Logo automatically changes based on current theme
- **No CSS Filters** - Clean, optimized logos without filter manipulations
- **Theme Responsive** - Seamless transitions between themes

### 🎯 Smart Detection
- **Automatic Enhancement** - Images with "logo" in alt text get automatic enhancement
- **Class-based Control** - Utility classes for precise control
- **Theme Responsive** - Effects only apply in dark mode

## Logo Implementation

### File Structure
```
assets/
├── logo.png              # Light theme logo
└── logo-dark-theme.png   # Dark theme logo
```

### Usage in Components
```html
<img 
  class="opena3xx-logo"
  [src]="getLogoPath()"
  alt="OpenA3XX Flight Deck Logo"
  width="100px">
```

### Theme Service Integration
```typescript
// In your component
constructor(private themeService: ThemeService) {}

getLogoPath(): string {
  return this.themeService.getLogoPath();
}
```

### Theme Service Method
```typescript
// In ThemeService
getLogoPath(): string {
  return this.isDarkMode() ? 'assets/logo-dark-theme.png' : 'assets/logo.png';
}
```

## CSS Utility Classes

### Basic Enhancement
```css
.image-dark-enhance
```
- Brightness: +30%
- Contrast: +20%
- Saturation: +10%

### Strong Enhancement
```css
.image-dark-enhance-strong
```
- Brightness: +50%
- Contrast: +30%
- Saturation: +20%
- White drop-shadow glow

### Glow Effect
```css
.image-dark-glow
```
- Brightness: +40%
- Contrast: +25%
- Saturation: +15%
- Dual drop-shadow glow
- Enhanced hover effects

## Usage Examples

### Basic Logo Enhancement
```html
<img src="logo.png" alt="Company Logo" class="image-dark-enhance">
```

### Strong Enhancement with Glow
```html
<img src="brand.png" alt="Brand Logo" class="image-dark-enhance-strong">
```

### Full Glow Effect
```html
<img src="logo.png" alt="Brand Logo" class="image-dark-glow">
```

## Automatic Enhancement
Images are automatically enhanced in dark mode if they have:
- `class="logo"`
- `class="brand"`
- `alt` attribute containing "logo" or "Logo"

```html
<!-- These get automatic enhancement -->
<img src="logo.png" alt="Company Logo">
<img src="brand.png" class="logo">
```

## OpenA3XX Logo Implementation

The main navigation logo now uses:
- **Separate logo files** for light and dark themes
- **Automatic theme switching** via ThemeService
- **Clean styling** without CSS filter manipulations
- **Smooth transitions** between themes
- **Accessibility focus states**

### Logo Styling
```scss
.opena3xx-logo {
  transition: all var(--transition-normal) ease;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  position: relative;

  &:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-md);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: 2px solid var(--mat-sys-primary, #1976d2);
    outline-offset: 2px;
  }
}
```

### Benefits of Separate Logo Files
- **Better Quality** - No filter artifacts or quality loss
- **Performance** - No CSS filter processing overhead
- **Flexibility** - Can optimize each logo for its specific theme
- **Maintainability** - Easier to update and manage
- **Accessibility** - Better contrast and visibility

## Customization

### CSS Custom Properties
```css
:root {
  --image-brightness-light: 1.2;
  --image-brightness-strong: 1.5;
  --image-contrast-boost: 1.25;
  --image-glow-color: rgba(255, 255, 255, 0.4);
}
```

### Filter Values
- **brightness(1.2-1.6)** - 20% to 60% brighter
- **contrast(1.1-1.4)** - 10% to 40% more contrast
- **saturate(1.1-1.3)** - 10% to 30% more saturation
- **drop-shadow()** - White glow effects

## Browser Support
- ✅ Chrome 90+ (Full CSS filter support)
- ✅ Firefox 88+ (Full support)
- ✅ Safari 14+ (Full support)
- ✅ Edge 90+ (Full support)

## Performance
- **Hardware accelerated** - Uses GPU for filter effects
- **Smooth transitions** - 300ms ease animations
- **Optimized rendering** - Minimal impact on performance
- **Progressive enhancement** - Graceful fallback in older browsers

---

**The OpenA3XX logo now uses separate files for optimal dark mode support!** 🌙✨ 
